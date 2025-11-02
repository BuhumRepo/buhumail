import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import SecurityDashboard, { demoSecurityStats } from '../components/SecurityDashboard'
import SecureEmailList, { demoEmails, EmptyEmailState } from '../components/SecureEmailList'
import { TrustScoreCard } from '../components/TrustScoreBadge'

export default function SecurityDemo() {
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [view, setView] = useState<'dashboard' | 'inbox'>('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Buhumail</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full border border-primary-200">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">AI Shield Active</span>
              </div>
              <Link to="/register" className="btn-primary">
                Try It Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Live AI Email Shield Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              See Every Email's Trust Score
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Our AI analyzes every email in real-time, giving you complete transparency about what's safe and what's not.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setView('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  view === 'dashboard'
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Security Dashboard
              </button>
              <button
                onClick={() => setView('inbox')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  view === 'inbox'
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Protected Inbox
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SecurityDashboard stats={demoSecurityStats} />
            </motion.div>
          ) : (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Email List */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Protected Inbox</h2>
                  <SecureEmailList 
                    emails={demoEmails} 
                    onEmailClick={setSelectedEmail}
                  />
                </div>
              </div>

              {/* Email Detail */}
              <div className="md:col-span-1">
                {selectedEmail ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <TrustScoreCard
                      score={selectedEmail.trustScore}
                      category={selectedEmail.category}
                      threats={
                        selectedEmail.category === 'dangerous'
                          ? ['Phishing attempt detected', 'Suspicious links found', 'Urgency tactics used']
                          : selectedEmail.category === 'suspicious'
                          ? ['Unknown sender domain', 'Generic greeting']
                          : []
                      }
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 bg-white rounded-2xl border border-gray-200 p-6"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">Email Preview</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-medium text-gray-900">{selectedEmail.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Subject:</span>
                          <p className="font-medium text-gray-900">{selectedEmail.subject}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Preview:</span>
                          <p className="text-gray-700">{selectedEmail.preview}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Click on an email to see its security analysis
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How AI Email Shield Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Every email is analyzed by Cloudflare AI for phishing, spam, and malicious content
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Trust Score</h3>
                <p className="text-gray-600">
                  Get a clear 0-100 score showing exactly how safe each email is
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Full Transparency</h3>
                <p className="text-gray-600">
                  See exactly what threats were detected and why an email is flagged
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Protect Your Inbox?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who trust Buhumail's AI Email Shield
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl inline-flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
              <Link
                to="/"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
            <p className="text-sm text-primary-100 mt-4">
              No credit card required • Free forever
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
