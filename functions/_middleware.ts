export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  
  // Don't redirect API calls - they should work on both domains
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // Redirect from pages.dev to custom domain (only for web pages)
  if (url.hostname === 'buhumail.pages.dev') {
    const newUrl = `https://buhumail.com${url.pathname}${url.search}`;
    return Response.redirect(newUrl, 301);
  }
  
  // Continue to next middleware/page
  return context.next();
}
