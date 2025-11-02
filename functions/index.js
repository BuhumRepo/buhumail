export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Redirect pages.dev homepage to custom domain
  if (url.hostname.includes('pages.dev')) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `https://buhumail.com${url.pathname}${url.search}`
      }
    });
  }
  
  return context.next();
}
