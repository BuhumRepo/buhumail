import { useEffect, useState } from 'react'
import { Plus, Mail, Copy, Trash2, CheckCircle, Clock, Inbox, Share2, Sparkles, Info } from 'lucide-react'
import { api } from '../utils/api'

interface TempEmail {
  id: string
  email_address: string
  domain: string
  expires_at: number | null
  created_at: number
}

interface Domain {
  id: string
  domain: string
  verified: number
  is_system_domain?: number
}

interface Message {
  id: string
  from_address: string
  to_address: string
  subject: string
  body_text: string
  body_html: string
  received_at: number
  is_read: number
}

export default function TempEmailsPanel() {
  const [tempEmails, setTempEmails] = useState<TempEmail[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInboxModal, setShowInboxModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<TempEmail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [username, setUsername] = useState('')
  const [selectedDomainId, setSelectedDomainId] = useState('')
  const [expiresIn, setExpiresIn] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [emailsRes, domainsRes] = await Promise.all([
        api.get('/temp-emails'),
        api.get('/domains'),
      ])
      setTempEmails(emailsRes.tempEmails || [])
      const verifiedDomains = domainsRes.domains.filter((d: Domain) => d.verified)
      // Sort system domains first
      const sortedDomains = verifiedDomains.sort((a: Domain, b: Domain) => {
        if (a.is_system_domain && !b.is_system_domain) return -1
        if (!a.is_system_domain && b.is_system_domain) return 1
        return 0
      })
      setDomains(sortedDomains)
      if (sortedDomains.length > 0) {
        // Default to test domain if available
        const testDomain = sortedDomains.find((d: Domain) => d.is_system_domain)
        setSelectedDomainId(testDomain?.id || sortedDomains[0].id)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/temp-emails', {
        domainId: selectedDomainId,
        username,
        expiresIn: expiresIn ? parseInt(expiresIn) : null,
      })
      setUsername('')
      setExpiresIn('')
      setShowCreateModal(false)
      loadData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm('Are you sure you want to delete this temp email?')) return
    try {
      await api.delete(`/temp-emails/${emailId}`)
      loadData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleViewInbox = async (email: TempEmail) => {
    setSelectedEmail(email)
    setLoadingMessages(true)
    setShowInboxModal(true)
    try {
      const response = await api.get(`/messages/email/${email.id}`)
      setMessages(response.messages || [])
    } catch (error: any) {
      console.error('Failed to load messages:', error)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setShowMessageModal(true)
    if (!message.is_read) {
      await api.post(`/messages/${message.id}/read`, {})
    }
  }

  const handleShareAsLink = async (message: Message) => {
    try {
      // Create a note from this email message
      const response = await api.post('/notes', {
        fromEmail: message.from_address,
        toEmail: 'Shared via Link',
        subject: message.subject || 'Shared Email',
        content: message.body_text || message.body_html,
        expiresAfterRead: true,
        password: ''
      }) as any

      const noteUrl = response.note.url
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(noteUrl)
      
      alert(`✅ Shareable link created and copied!\n\n${noteUrl}\n\nThis link will self-destruct after being viewed once.`)
    } catch (error: any) {
      alert('Failed to create shareable link: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Temporary Emails</h1>
          <p className="text-gray-600">Create and manage disposable email addresses with custom domains</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          disabled={domains.length === 0}
        >
          <Plus className="w-5 h-5" />
          <span>New Email</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Emails</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{tempEmails.length}</p>
              <p className="text-green-600 text-xs font-semibold flex items-center">
                <span className="mr-1">●</span> Running
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Mail className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Verified Domains</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{domains.length}</p>
              <p className="text-blue-600 text-xs font-semibold flex items-center">
                <span className="mr-1">●</span> Active
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Messages</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-orange-600 text-xs font-semibold flex items-center">
                <span className="mr-1">●</span> Tracked
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Inbox className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Test Domain Info Banner */}
      {domains.some((d: Domain) => d.is_system_domain) && (
        <div className="bg-gradient-to-r from-primary-50 via-purple-50 to-blue-50 border-2 border-primary-200 rounded-xl p-5 shadow-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-bold text-gray-900">Test Domain Available!</h3>
                <span className="px-2 py-0.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-bold rounded-full">FREE</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Use <strong className="text-primary-700">buhumail.xyz</strong> to test the service instantly without setting up your own domain.
              </p>
              <div className="flex items-start space-x-2 text-xs text-gray-600 bg-white/60 rounded-lg p-3 border border-primary-100">
                <Info className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Note:</strong> This is a shared test domain. All users can create emails here.
                  For production use, add your own custom domain in the Domains tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domain Warning */}
      {domains.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6 shadow-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">Domain Required</h3>
              <p className="text-sm text-yellow-800">
                You need to add and verify a custom domain before creating temp emails.
              </p>
              <a 
                href="/dashboard/domains" 
                className="inline-flex items-center mt-3 text-sm font-semibold text-yellow-900 hover:text-yellow-700 transition-colors"
              >
                Add a domain →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Emails List */}
      <div>
        {tempEmails.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No temporary emails yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first disposable email address to start receiving messages privately
            </p>
            {domains.length > 0 && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary shadow-lg">
                <Plus className="w-5 h-5 mr-2 inline" />
                Create Your First Email
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tempEmails.map((email) => (
              <div 
                key={email.id} 
                className="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{email.email_address}</h3>
                        <button
                          onClick={() => copyToClipboard(email.email_address, email.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
                          title="Copy email"
                        >
                          {copiedId === email.id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </button>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Created {new Date(email.created_at).toLocaleDateString()}
                        </span>
                        {email.expires_at && (
                          <span className="flex items-center text-orange-600 font-medium">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Expires {new Date(email.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewInbox(email)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Inbox className="w-4 h-4" />
                      <span className="font-medium">Inbox</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(email.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete email"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Temp Email</h2>
            <form onSubmit={handleCreateEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="myemail"
                  pattern="[a-zA-Z0-9._-]+"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <select
                  value={selectedDomainId}
                  onChange={(e) => setSelectedDomainId(e.target.value)}
                  className="input-field"
                  required
                >
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.is_system_domain ? '⭐ ' : ''}@{domain.domain}{domain.is_system_domain ? ' (Test Domain)' : ''}
                    </option>
                  ))}
                </select>
                {domains.find((d: Domain) => d.id === selectedDomainId)?.is_system_domain && (
                  <p className="mt-2 text-xs text-primary-600 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Using shared test domain - great for testing!</span>
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In (minutes, optional)
                </label>
                <input
                  type="number"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="input-field"
                  placeholder="60"
                  min="1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty for permanent email
                </p>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Create Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inbox Modal */}
      {showInboxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
                <p className="text-sm text-gray-600">{selectedEmail?.email_address}</p>
              </div>
              <button
                onClick={() => setShowInboxModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Messages sent to this email will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        message.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleViewMessage(message)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900">{message.from_address}</p>
                            {!message.is_read && (
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {message.subject || '(No Subject)'}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.body_text?.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="text-xs text-gray-500">
                            {new Date(message.received_at).toLocaleDateString()}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShareAsLink(message)
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 transition-colors"
                            title="Share as secure link"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button onClick={() => setShowInboxModal(false)} className="btn-secondary w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedMessage.subject || '(No Subject)'}
              </h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 pb-4 border-b">
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-20">From:</span>
                  <span className="text-gray-900">{selectedMessage.from_address}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-20">To:</span>
                  <span className="text-gray-900">{selectedMessage.to_address}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-20">Date:</span>
                  <span className="text-gray-900">
                    {new Date(selectedMessage.received_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedMessage.body_html ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.body_html }}
                />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {selectedMessage.body_text}
                </pre>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex space-x-3">
              <button
                onClick={() => handleShareAsLink(selectedMessage)}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share as Link</span>
              </button>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setShowInboxModal(true)
                }}
                className="btn-secondary flex-1"
              >
                Back to Inbox
              </button>
              <button onClick={() => setShowMessageModal(false)} className="btn-secondary flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
