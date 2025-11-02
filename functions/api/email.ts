import { Env } from './types';
import { generateId } from './utils/auth';

export async function handleEmail(message: any, env: Env): Promise<void> {
  try {
    const to = message.to;
    const from = message.from;
    const subject = message.headers.get('subject') || '';
    
    // Find the temp email this was sent to
    const tempEmail = await env.DB.prepare(
      'SELECT id FROM temp_emails WHERE email_address = ?'
    ).bind(to).first();

    if (!tempEmail) {
      // Email doesn't exist in our system, reject it
      message.setReject('Address not found');
      return;
    }

    // Extract email content
    const bodyText = await message.text?.() || '';
    const bodyHtml = await message.html?.() || '';
    const headers = JSON.stringify(Object.fromEntries(message.headers));

    // Store the message
    await env.DB.prepare(`
      INSERT INTO messages (id, temp_email_id, from_address, to_address, subject, body_text, body_html, headers, received_at, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      generateId(),
      tempEmail.id,
      from,
      to,
      subject,
      bodyText,
      bodyHtml,
      headers,
      Date.now(),
      0
    ).run();

    message.forward(to);
  } catch (error) {
    console.error('Email handling error:', error);
    message.setReject('Internal error');
  }
}
