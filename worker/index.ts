import { Env, corsHeaders } from './types';
import { handleAuth } from './routes/auth';
import { handleDomains } from './routes/domains';
import { handleTempEmails } from './routes/tempEmails';
import { handleNotes } from './routes/notes';
import { handleMessages } from './routes/messages';
import { handleEmail } from './email';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (url.pathname.startsWith('/api/auth')) {
        return handleAuth(request, env);
      }
      
      if (url.pathname.startsWith('/api/domains')) {
        return handleDomains(request, env);
      }
      
      if (url.pathname.startsWith('/api/temp-emails')) {
        return handleTempEmails(request, env);
      }
      
      if (url.pathname.startsWith('/api/notes')) {
        return handleNotes(request, env);
      }
      
      if (url.pathname.startsWith('/api/messages')) {
        return handleMessages(request, env);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },

  async email(message: any, env: Env): Promise<void> {
    await handleEmail(message, env);
  }
};
