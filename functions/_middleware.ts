export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  
  // Redirect from pages.dev to custom domain
  if (url.hostname === 'buhumail.pages.dev') {
    const newUrl = `https://buhumail.com${url.pathname}${url.search}`;
    return Response.redirect(newUrl, 301);
  }
  
  // Continue to next middleware/page
  return context.next();
}
