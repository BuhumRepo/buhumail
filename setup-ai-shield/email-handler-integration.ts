// Email Handler Integration Example
// Add this to your worker/routes/email.ts or wherever you handle incoming emails

import { analyzeEmail, extractLinks } from '../utils/emailAnalyzer'

// Example: When receiving a new email
async function handleIncomingEmail(env: Env, emailData: any, userId: string) {
  // Extract links from email body
  const links = extractLinks(emailData.body || '')
  
  // Analyze email with AI
  console.log('Analyzing email from:', emailData.from)
  const analysis = await analyzeEmail(env, {
    subject: emailData.subject || '',
    body: emailData.body || '',
    from: emailData.from,
    links: links
  })
  
  console.log('Analysis complete:', {
    trustScore: analysis.trustScore,
    category: analysis.category,
    threats: analysis.threats
  })
  
  // Store email with security analysis
  const result = await env.DB.prepare(`
    INSERT INTO emails (
      user_id,
      from_address,
      subject,
      body,
      trust_score,
      security_category,
      threats,
      analysis_details,
      analyzed_at,
      received_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userId,
    emailData.from,
    emailData.subject,
    emailData.body,
    analysis.trustScore,
    analysis.category,
    JSON.stringify(analysis.threats),
    JSON.stringify(analysis.details),
    new Date().toISOString(),
    new Date().toISOString()
  ).run()
  
  return {
    success: true,
    emailId: result.meta?.last_row_id,
    securityAnalysis: analysis
  }
}

// Example: Get emails with security info for API response
async function getEmailsWithSecurity(env: Env, userId: string) {
  const result = await env.DB.prepare(`
    SELECT 
      id,
      from_address,
      subject,
      body,
      trust_score,
      security_category,
      threats,
      analysis_details,
      received_at,
      is_read
    FROM emails
    WHERE user_id = ?
    ORDER BY received_at DESC
    LIMIT 50
  `).bind(userId).all()
  
  return result.results?.map(email => ({
    id: email.id,
    from: email.from_address,
    subject: email.subject,
    body: email.body,
    trustScore: email.trust_score || 50,
    category: email.security_category || 'suspicious',
    threats: JSON.parse(email.threats || '[]'),
    details: JSON.parse(email.analysis_details || '{}'),
    receivedAt: email.received_at,
    isRead: Boolean(email.is_read)
  })) || []
}

// Example: Get security stats for dashboard
async function getSecurityStats(env: Env, userId: string) {
  const stats = await env.DB.prepare(`
    SELECT 
      COUNT(*) as totalEmails,
      SUM(CASE WHEN trust_score >= 70 THEN 1 ELSE 0 END) as safeEmails,
      SUM(CASE WHEN trust_score >= 40 AND trust_score < 70 THEN 1 ELSE 0 END) as suspiciousEmails,
      SUM(CASE WHEN trust_score < 40 THEN 1 ELSE 0 END) as blockedThreats,
      AVG(trust_score) as averageTrustScore
    FROM emails
    WHERE user_id = ?
  `).bind(userId).first()
  
  return {
    totalEmails: stats?.totalEmails || 0,
    safeEmails: stats?.safeEmails || 0,
    suspiciousEmails: stats?.suspiciousEmails || 0,
    blockedThreats: stats?.blockedThreats || 0,
    averageTrustScore: Math.round(stats?.averageTrustScore || 50)
  }
}

export { handleIncomingEmail, getEmailsWithSecurity, getSecurityStats }
