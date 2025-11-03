import { Env, corsHeaders } from './types';
import { handleAuth } from './routes/auth';
import { handleDomains } from './routes/domains';
import { handleTempEmails } from './routes/tempEmails';
import { handleNotes } from './routes/notes';
import { handleMessages } from './routes/messages';

export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Routes
    if (url.pathname.startsWith('/api/auth')) {
      return handleAuth(request, env as Env);
    }
    
    if (url.pathname.startsWith('/api/domains')) {
      return handleDomains(request, env as Env);
    }
    
    if (url.pathname.startsWith('/api/temp-emails')) {
      return handleTempEmails(request, env as Env);
    }
    
    if (url.pathname.startsWith('/api/notes')) {
      return handleNotes(request, env as Env);
    }
    
    if (url.pathname.startsWith('/api/messages')) {
      return handleMessages(request, env as Env);
    }

    return new Response('Not Found', { 
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
