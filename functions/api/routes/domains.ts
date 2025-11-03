import { Env, corsHeaders } from '../types';
import { verifySession, generateId } from '../utils/auth';

export async function handleDomains(request: Request, env: Env): Promise<Response> {
  const userId = await verifySession(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/domains' && request.method === 'GET') {
    return getDomains(userId, env);
  }

  if (path === '/api/domains' && request.method === 'POST') {
    return createDomain(request, userId, env);
  }

  if (path.match(/\/api\/domains\/[\w-]+$/) && request.method === 'DELETE') {
    const domainId = path.split('/').pop()!;
    return deleteDomain(domainId, userId, env);
  }

  if (path.match(/\/api\/domains\/[\w-]+\/verify$/) && request.method === 'POST') {
    const domainId = path.split('/')[3];
    return verifyDomain(domainId, userId, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getDomains(userId: string, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(`
    SELECT id, user_id, domain, verified, is_system_domain, dns_records, created_at
    FROM domains 
    WHERE user_id = ? OR is_system_domain = 1
    ORDER BY is_system_domain DESC, created_at DESC
  `).bind(userId).all();

  return new Response(JSON.stringify({ domains: results }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function createDomain(request: Request, userId: string, env: Env): Promise<Response> {
  const { domain } = await request.json() as any;

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Domain is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // Check if domain already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM domains WHERE domain = ?'
  ).bind(domain).first();

  if (existing) {
    return new Response(JSON.stringify({ error: 'Domain already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const domainId = generateId();
  const dnsRecords = JSON.stringify([
    { type: 'MX', name: '@', value: 'mx.buhumail.com', priority: 10 },
    { type: 'TXT', name: '@', value: `buhumail-verify=${domainId}` }
  ]);

  await env.DB.prepare(
    'INSERT INTO domains (id, user_id, domain, verified, dns_records, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(domainId, userId, domain, 0, dnsRecords, Date.now()).run();

  return new Response(JSON.stringify({
    domain: {
      id: domainId,
      domain,
      verified: 0,
      dns_records: JSON.parse(dnsRecords)
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function deleteDomain(domainId: string, userId: string, env: Env): Promise<Response> {
  // Prevent deletion of system domains
  const domain = await env.DB.prepare(
    'SELECT is_system_domain FROM domains WHERE id = ?'
  ).bind(domainId).first() as any;

  if (domain?.is_system_domain === 1) {
    return new Response(JSON.stringify({ error: 'Cannot delete system domains' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  await env.DB.prepare(
    'DELETE FROM domains WHERE id = ? AND user_id = ?'
  ).bind(domainId, userId).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function verifyDomain(domainId: string, userId: string, env: Env): Promise<Response> {
  // In production, this would check DNS records
  // For now, we'll just mark as verified
  await env.DB.prepare(
    'UPDATE domains SET verified = 1 WHERE id = ? AND user_id = ?'
  ).bind(domainId, userId).run();

  return new Response(JSON.stringify({ success: true, verified: true }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
