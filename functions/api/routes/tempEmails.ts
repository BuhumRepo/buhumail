import { Env, corsHeaders } from '../types';
import { verifySession, generateId } from '../utils/auth';

export async function handleTempEmails(request: Request, env: Env): Promise<Response> {
  const userId = await verifySession(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/temp-emails' && request.method === 'GET') {
    return getTempEmails(userId, env);
  }

  if (path === '/api/temp-emails' && request.method === 'POST') {
    return createTempEmail(request, userId, env);
  }

  if (path.match(/\/api\/temp-emails\/[\w-]+$/) && request.method === 'DELETE') {
    const emailId = path.split('/').pop()!;
    return deleteTempEmail(emailId, userId, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getTempEmails(userId: string, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(`
    SELECT te.*, d.domain 
    FROM temp_emails te
    JOIN domains d ON te.domain_id = d.id
    WHERE te.user_id = ?
    ORDER BY te.created_at DESC
  `).bind(userId).all();

  return new Response(JSON.stringify({ tempEmails: results }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function createTempEmail(request: Request, userId: string, env: Env): Promise<Response> {
  const { domainId, username, expiresIn } = await request.json() as any;

  if (!domainId || !username) {
    return new Response(JSON.stringify({ error: 'Domain ID and username are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // Verify domain belongs to user and is verified
  const domain = await env.DB.prepare(
    'SELECT domain, verified FROM domains WHERE id = ? AND user_id = ?'
  ).bind(domainId, userId).first();

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Domain not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  if (!domain.verified) {
    return new Response(JSON.stringify({ error: 'Domain not verified' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const emailAddress = `${username}@${domain.domain}`;
  
  // Check if email already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM temp_emails WHERE email_address = ?'
  ).bind(emailAddress).first();

  if (existing) {
    return new Response(JSON.stringify({ error: 'Email address already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const emailId = generateId();
  const now = Date.now();
  const expiresAt = expiresIn ? now + expiresIn * 60 * 1000 : null;

  await env.DB.prepare(
    'INSERT INTO temp_emails (id, user_id, domain_id, email_address, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(emailId, userId, domainId, emailAddress, expiresAt, now).run();

  return new Response(JSON.stringify({
    tempEmail: {
      id: emailId,
      email_address: emailAddress,
      domain: domain.domain,
      expires_at: expiresAt,
      created_at: now
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function deleteTempEmail(emailId: string, userId: string, env: Env): Promise<Response> {
  await env.DB.prepare(
    'DELETE FROM temp_emails WHERE id = ? AND user_id = ?'
  ).bind(emailId, userId).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
