import { Env, corsHeaders } from '../types';
import { verifySession } from '../utils/auth';

export async function handleMessages(request: Request, env: Env): Promise<Response> {
  const userId = await verifySession(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  if (path.match(/\/api\/messages\/email\/[\w-]+$/) && request.method === 'GET') {
    const emailId = path.split('/').pop()!;
    return getMessages(emailId, userId, env);
  }

  if (path.match(/\/api\/messages\/[\w-]+$/) && request.method === 'GET') {
    const messageId = path.split('/').pop()!;
    return getMessage(messageId, userId, env);
  }

  if (path.match(/\/api\/messages\/[\w-]+\/read$/) && request.method === 'POST') {
    const messageId = path.split('/')[3];
    return markAsRead(messageId, userId, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getMessages(emailId: string, userId: string, env: Env): Promise<Response> {
  // Verify email belongs to user
  const tempEmail = await env.DB.prepare(
    'SELECT id FROM temp_emails WHERE id = ? AND user_id = ?'
  ).bind(emailId, userId).first();

  if (!tempEmail) {
    return new Response(JSON.stringify({ error: 'Email not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, from_address, to_address, subject, received_at, is_read FROM messages WHERE temp_email_id = ? ORDER BY received_at DESC'
  ).bind(emailId).all();

  return new Response(JSON.stringify({ messages: results }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function getMessage(messageId: string, userId: string, env: Env): Promise<Response> {
  const message = await env.DB.prepare(`
    SELECT m.* 
    FROM messages m
    JOIN temp_emails te ON m.temp_email_id = te.id
    WHERE m.id = ? AND te.user_id = ?
  `).bind(messageId, userId).first();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  return new Response(JSON.stringify({ message }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function markAsRead(messageId: string, userId: string, env: Env): Promise<Response> {
  const message = await env.DB.prepare(`
    SELECT m.id 
    FROM messages m
    JOIN temp_emails te ON m.temp_email_id = te.id
    WHERE m.id = ? AND te.user_id = ?
  `).bind(messageId, userId).first();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  await env.DB.prepare(
    'UPDATE messages SET is_read = 1 WHERE id = ?'
  ).bind(messageId).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
