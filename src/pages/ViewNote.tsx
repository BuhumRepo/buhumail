import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Mail, Lock, AlertTriangle, Send, CheckCircle } from 'lucide-react'

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:8787/api'

interface NoteData {
  id: string
  from_email: string
  to_email: string
  subject: string
  content: string
  created_at: number
  expires_after_read: number
  willDestroy: boolean
}

export default function ViewNote() {
  const { noteId } = useParams()
  const [note, setNote] = useState<NoteData | null>(null)
  const [password, setPassword] = useState('')
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [destroyed, setDestroyed] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyEmail, setReplyEmail] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replySent, setReplySent] = useState(false)

  useEffect(() => {
    loadNote()
  }, [noteId])

  const loadNote = async (pwd?: string) => {
    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd || password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresPassword) {
          setRequiresPassword(true)
          setLoading(false)
          return
        }
        if (response.status === 410) {
          setDestroyed(true)
          setError('This note has been destroyed and is no longer available.')
        } else {
          setError(data.error || 'Failed to load note')
        }
        setLoading(false)
        return
      }

      setNote(data.note)
      setError('')
      setLoading(false)
    } catch (err) {
      setError('Failed to load note')
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    loadNote(password)
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromEmail: replyEmail,
          content: replyContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send reply')
      }

      setReplySent(true)
      setReplyEmail('')
      setReplyContent('')
      setTimeout(() => {
        setShowReplyForm(false)
        setReplySent(false)
      }, 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (destroyed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Mail className="w-10 h-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">Buhumail</span>
          </Link>
          <div className="card">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Destroyed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/" className="btn-primary inline-block">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (requiresPassword && !note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 justify-center">
            <Mail className="w-10 h-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">Buhumail</span>
          </Link>
          <div className="card">
            <div className="text-center mb-6">
              <Lock className="w-16 h-16 mx-auto text-primary-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Password Protected</h2>
              <p className="text-gray-600 mt-2">This note requires a password to view</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Unlock Note
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (error && !note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Mail className="w-10 h-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">Buhumail</span>
          </Link>
          <div className="card">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/" className="btn-primary inline-block">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
          <Mail className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">Buhumail</span>
        </Link>

        {note?.willDestroy && (
          <div className="card mb-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-yellow-900">Self-Destructive Note</p>
                <p className="text-yellow-800 text-sm mt-1">
                  This note will be permanently destroyed after you close this page or navigate away.
                  Make sure to save any important information.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{note?.subject}</h1>
            <div className="flex flex-col space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">From:</span>
                <span>{note?.from_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">To:</span>
                <span>{note?.to_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Sent:</span>
                <span>{note && new Date(note.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">{note?.content}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Reply to this note</span>
              </button>
            ) : replySent ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Reply sent successfully!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={replyEmail}
                    onChange={(e) => setReplyEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Reply
                  </label>
                  <textarea
                    required
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Write your reply..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary">
                    Send Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
