export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  
  // Skip API routes - they have their own handler
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // Redirect pages.dev to custom domain
  if (url.hostname === 'buhumail.pages.dev') {
    const newUrl = `https://buhumail.com${url.pathname}${url.search}`;
    return new Response(null, {
      status: 301,
      headers: {
        'Location': newUrl
      }
    });
  }
  
  // For custom domain, serve the static files normally
  return context.next();
}
