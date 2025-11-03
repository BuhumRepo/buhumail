// Simple test endpoint to verify Pages Functions are working
export async function onRequestGet(context: any) {
  return new Response(JSON.stringify({
    status: 'OK',
    message: 'Pages Functions are working!',
    timestamp: new Date().toISOString(),
    hasDB: !!context.env.DB,
    dbType: context.env.DB ? typeof context.env.DB : 'undefined'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
