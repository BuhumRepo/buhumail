import { Env, corsHeaders } from '../types';
import { verifySession, generateId, hashPassword, verifyPassword } from '../utils/auth';

export async function handleNotes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Public routes (no auth required)
  if (path.match(/\/api\/notes\/[\w-]+\/view$/) && request.method === 'POST') {
    const noteId = path.split('/')[3];
    return viewNote(noteId, request, env);
  }

  if (path.match(/\/api\/notes\/[\w-]+\/reply$/) && request.method === 'POST') {
    const noteId = path.split('/')[3];
    return replyToNote(noteId, request, env);
  }

  // Protected routes (auth required)
  const userId = await verifySession(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  if (path === '/api/notes' && request.method === 'GET') {
    return getNotes(userId, env);
  }

  if (path === '/api/notes' && request.method === 'POST') {
    return createNote(request, userId, env);
  }

  if (path.match(/\/api\/notes\/[\w-]+$/) && request.method === 'DELETE') {
    const noteId = path.split('/').pop()!;
    return deleteNote(noteId, userId, env);
  }

  if (path.match(/\/api\/notes\/[\w-]+\/replies$/) && request.method === 'GET') {
    const noteId = path.split('/')[3];
    return getReplies(noteId, userId, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getNotes(userId: string, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT id, from_email, to_email, subject, is_read, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();

  return new Response(JSON.stringify({ notes: results }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function createNote(request: Request, userId: string, env: Env): Promise<Response> {
  const { fromEmail, toEmail, subject, content, expiresAfterRead, password } = await request.json() as any;

  if (!fromEmail || !toEmail || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const noteId = generateId();
  const passwordHash = password ? await hashPassword(password) : null;

  await env.DB.prepare(`
    INSERT INTO notes (id, user_id, from_email, to_email, subject, content, expires_after_read, password_protected, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    noteId,
    userId,
    fromEmail,
    toEmail,
    subject || 'Secure Note',
    content,
    expiresAfterRead ? 1 : 0,
    password ? 1 : 0,
    passwordHash,
    Date.now()
  ).run();

  const noteUrl = `${new URL(request.url).origin}/note/${noteId}`;

  return new Response(JSON.stringify({
    note: {
      id: noteId,
      url: noteUrl,
      from_email: fromEmail,
      to_email: toEmail,
      subject: subject || 'Secure Note'
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function viewNote(noteId: string, request: Request, env: Env): Promise<Response> {
  const { password } = await request.json().catch(() => ({})) as any;

  const note = await env.DB.prepare(
    'SELECT * FROM notes WHERE id = ?'
  ).bind(noteId).first();

  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found or already destroyed' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // Check if already read and should be destroyed
  if (note.is_read && note.expires_after_read) {
    await env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(noteId).run();
    return new Response(JSON.stringify({ error: 'Note has been destroyed' }), {
      status: 410,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // Verify password if protected
  if (note.password_protected) {
    if (!password || !(await verifyPassword(password, note.password_hash as string))) {
      return new Response(JSON.stringify({ error: 'Invalid password', requiresPassword: true }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // Mark as read
  const now = Date.now();
  await env.DB.prepare(
    'UPDATE notes SET is_read = 1, read_at = ? WHERE id = ?'
  ).bind(now, noteId).run();

  return new Response(JSON.stringify({
    note: {
      id: note.id,
      from_email: note.from_email,
      to_email: note.to_email,
      subject: note.subject,
      content: note.content,
      created_at: note.created_at,
      expires_after_read: note.expires_after_read,
      willDestroy: note.expires_after_read === 1
    }
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function replyToNote(noteId: string, request: Request, env: Env): Promise<Response> {
  const { fromEmail, content } = await request.json() as any;

  if (!fromEmail || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const note = await env.DB.prepare(
    'SELECT id FROM notes WHERE id = ?'
  ).bind(noteId).first();

  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const replyId = generateId();
  await env.DB.prepare(
    'INSERT INTO note_replies (id, note_id, from_email, content, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(replyId, noteId, fromEmail, content, Date.now()).run();

  return new Response(JSON.stringify({ success: true, replyId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function getReplies(noteId: string, userId: string, env: Env): Promise<Response> {
  // Verify note belongs to user
  const note = await env.DB.prepare(
    'SELECT id FROM notes WHERE id = ? AND user_id = ?'
  ).bind(noteId, userId).first();

  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT * FROM note_replies WHERE note_id = ? ORDER BY created_at ASC'
  ).bind(noteId).all();

  return new Response(JSON.stringify({ replies: results }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function deleteNote(noteId: string, userId: string, env: Env): Promise<Response> {
  await env.DB.prepare(
    'DELETE FROM notes WHERE id = ? AND user_id = ?'
  ).bind(noteId, userId).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
