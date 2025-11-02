// AI Email Shield - Email Analyzer
// Copy this file to: worker/utils/emailAnalyzer.ts

interface EmailAnalysis {
  trustScore: number
  threats: string[]
  category: 'safe' | 'suspicious' | 'dangerous'
  details: {
    hasPhishingIndicators: boolean
    hasSuspiciousLinks: boolean
    hasMaliciousAttachments: boolean
    hasSpamPatterns: boolean
    sentiment: string
  }
}

interface Env {
  AI: any
  DB: D1Database
}

export async function analyzeEmail(
  env: Env,
  email: {
    subject: string
    body: string
    from: string
    links?: string[]
  }
): Promise<EmailAnalysis> {
  try {
    // Build analysis prompt for AI
    const prompt = `Analyze this email for security threats and assign a trust score from 0-100.

From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1000)}
${email.links && email.links.length > 0 ? `\nLinks found: ${email.links.join(', ')}` : ''}

Analyze for:
1. Phishing attempts (check for urgent language, impersonation, credential requests)
2. Suspicious or shortened links
3. Spam patterns (excessive caps, urgency, money promises)
4. Social engineering tactics
5. Impersonation of legitimate services
6. Malicious intent

Return your analysis in this JSON format:
{
  "trustScore": <number 0-100>,
  "threats": [<array of specific threats found>],
  "isPhishing": <boolean>,
  "isSuspicious": <boolean>,
  "hasMaliciousLinks": <boolean>,
  "hasSpamPatterns": <boolean>,
  "reasoning": "<brief explanation>"
}

A score of 80-100 means safe, 40-79 means suspicious, 0-39 means dangerous.`

    // Call Cloudflare AI
    const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      prompt: prompt,
      max_tokens: 500
    })

    console.log('AI Response:', aiResponse)

    // Parse AI response
    const analysis = parseAIResponse(aiResponse)
    
    // Calculate trust score with additional heuristics
    const trustScore = calculateTrustScore(analysis, email)
    
    // Determine category based on score
    const category = trustScore >= 70 ? 'safe' : trustScore >= 40 ? 'suspicious' : 'dangerous'
    
    return {
      trustScore,
      threats: analysis.threats || [],
      category,
      details: {
        hasPhishingIndicators: analysis.isPhishing || false,
        hasSuspiciousLinks: analysis.hasMaliciousLinks || false,
        hasMaliciousAttachments: false,
        hasSpamPatterns: analysis.hasSpamPatterns || false,
        sentiment: analysis.sentiment || 'neutral'
      }
    }
  } catch (error) {
    console.error('Email analysis failed:', error)
    
    // Fallback to simple heuristic analysis
    return fallbackAnalysis(email)
  }
}

function parseAIResponse(response: any): any {
  try {
    // Try to extract JSON from response
    const text = typeof response === 'string' ? response : response.response || JSON.stringify(response)
    
    // Look for JSON block
    const jsonMatch = text.match(/\{[\s\S]*?\}/g)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.trustScore !== undefined) {
        return parsed
      }
    }
    
    // Fallback: analyze text for keywords
    return extractFromText(text)
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    return {
      trustScore: 50,
      threats: [],
      isPhishing: false,
      isSuspicious: true,
      hasMaliciousLinks: false,
      hasSpamPatterns: false
    }
  }
}

function extractFromText(text: string): any {
  const lowerText = text.toLowerCase()
  
  const threats: string[] = []
  let score = 70 // Start neutral-positive
  
  // Check for negative indicators
  if (lowerText.includes('phishing')) {
    threats.push('Phishing attempt detected')
    score -= 40
  }
  if (lowerText.includes('suspicious') || lowerText.includes('malicious')) {
    threats.push('Suspicious patterns found')
    score -= 20
  }
  if (lowerText.includes('spam')) {
    threats.push('Spam indicators detected')
    score -= 15
  }
  if (lowerText.includes('dangerous') || lowerText.includes('threat')) {
    threats.push('Potential threat identified')
    score -= 25
  }
  
  // Check for positive indicators
  if (lowerText.includes('safe') || lowerText.includes('legitimate')) {
    score += 15
  }
  
  return {
    trustScore: Math.max(0, Math.min(100, score)),
    threats,
    isPhishing: threats.some(t => t.toLowerCase().includes('phishing')),
    isSuspicious: threats.length > 0,
    hasMaliciousLinks: lowerText.includes('malicious link'),
    hasSpamPatterns: lowerText.includes('spam')
  }
}

function calculateTrustScore(analysis: any, email: any): number {
  let score = analysis.trustScore || 50
  
  // Additional heuristic checks
  const fromDomain = email.from.split('@')[1]?.toLowerCase() || ''
  const subject = email.subject.toLowerCase()
  const body = email.body.toLowerCase()
  
  // Trusted domains get bonus
  const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'protonmail.com']
  if (trustedDomains.includes(fromDomain)) {
    score += 5
  }
  
  // Spam keywords in subject
  const spamKeywords = ['urgent', 'act now', 'click here', 'verify account', 'suspended', 'prize', 'winner', 'free money', 'claim now']
  const spamCount = spamKeywords.filter(keyword => subject.includes(keyword) || body.includes(keyword)).length
  score -= spamCount * 8
  
  // Excessive caps in subject (spam indicator)
  const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length
  if (capsRatio > 0.5 && subject.length > 10) {
    score -= 15
    if (!analysis.threats) analysis.threats = []
    analysis.threats.push('Excessive capitalization detected')
  }
  
  // Multiple exclamation marks (spam indicator)
  const exclamationCount = (subject.match(/!/g) || []).length
  if (exclamationCount >= 2) {
    score -= 10
  }
  
  // Suspicious links
  if (email.links && email.links.length > 0) {
    const suspiciousLinkPatterns = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly']
    const hasSuspiciousLinks = email.links.some(link =>
      suspiciousLinkPatterns.some(pattern => link.includes(pattern))
    )
    if (hasSuspiciousLinks) {
      score -= 15
      if (!analysis.threats) analysis.threats = []
      analysis.threats.push('Shortened/suspicious links detected')
    }
  }
  
  // Ensure score stays within 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

function fallbackAnalysis(email: any): EmailAnalysis {
  // Simple heuristic-based analysis when AI fails
  const threats: string[] = []
  let score = 60
  
  const subject = email.subject.toLowerCase()
  const body = email.body.toLowerCase()
  const from = email.from.toLowerCase()
  
  // Check for common phishing indicators
  const phishingPatterns = [
    'verify your account',
    'confirm your identity',
    'suspended account',
    'unusual activity',
    'click here immediately',
    'urgent action required'
  ]
  
  phishingPatterns.forEach(pattern => {
    if (subject.includes(pattern) || body.includes(pattern)) {
      threats.push(`Phishing indicator: "${pattern}"`)
      score -= 20
    }
  })
  
  // Check for spam patterns
  if (subject.includes('!!!') || body.includes('$$$')) {
    threats.push('Spam patterns detected')
    score -= 15
  }
  
  // Check sender domain
  const domain = from.split('@')[1]
  const suspiciousDomainPatterns = ['-verify', '-secure', '-account', 'confirm-']
  if (suspiciousDomainPatterns.some(pattern => domain?.includes(pattern))) {
    threats.push('Suspicious sender domain')
    score -= 25
  }
  
  score = Math.max(0, Math.min(100, score))
  const category = score >= 70 ? 'safe' : score >= 40 ? 'suspicious' : 'dangerous'
  
  return {
    trustScore: score,
    threats,
    category,
    details: {
      hasPhishingIndicators: threats.some(t => t.toLowerCase().includes('phishing')),
      hasSuspiciousLinks: false,
      hasMaliciousAttachments: false,
      hasSpamPatterns: threats.some(t => t.toLowerCase().includes('spam')),
      sentiment: 'unknown'
    }
  }
}

// Helper function to extract links from email body
export function extractLinks(body: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return body.match(urlRegex) || []
}
