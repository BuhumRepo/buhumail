import { useEffect, useState } from 'react'
import { Plus, FileText, Copy, Trash2, CheckCircle, Mail, Eye } from 'lucide-react'
import { api } from '../utils/api'

interface Note {
  id: string
  from_email: string
  to_email: string
  subject: string
  is_read: number
  created_at: number
}

interface NoteReply {
  id: string
  from_email: string
  content: string
  created_at: number
}

export default function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRepliesModal, setShowRepliesModal] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [replies, setReplies] = useState<NoteReply[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fromEmail: '',
    toEmail: '',
    subject: '',
    content: '',
    expiresAfterRead: true,
    password: '',
  })

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const response = await api.get('/notes')
      setNotes(response.notes || [])
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/notes', formData)
      const noteUrl = response.note.url
      
      // Copy URL to clipboard
      navigator.clipboard.writeText(noteUrl)
      
      alert(`Note created! URL copied to clipboard:\n${noteUrl}`)
      
      setFormData({
        fromEmail: '',
        toEmail: '',
        subject: '',
        content: '',
        expiresAfterRead: true,
        password: '',
      })
      setShowCreateModal(false)
      loadNotes()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      await api.delete(`/notes/${noteId}`)
      loadNotes()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleViewReplies = async (noteId: string) => {
    try {
      const response = await api.get(`/notes/${noteId}/replies`)
      setReplies(response.replies || [])
      setSelectedNoteId(noteId)
      setShowRepliesModal(true)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const copyNoteUrl = (noteId: string) => {
    const url = `${window.location.origin}/note/${noteId}`
    navigator.clipboard.writeText(url)
    setCopiedId(noteId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Notes</h1>
          <p className="text-gray-600">Send self-destructive messages like Privnote</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">Create your first secure, self-destructive note</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create Note
            </button>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{note.subject}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                      <span>From: {note.from_email}</span>
                      <span>To: {note.to_email}</span>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      {note.is_read ? (
                        <span className="flex items-center text-green-600">
                          <Eye className="w-4 h-4 mr-1" />
                          Read
                        </span>
                      ) : (
                        <span className="text-gray-500">Unread</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewReplies(note.id)}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Replies</span>
                  </button>
                  <button
                    onClick={() => copyNoteUrl(note.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Copy note URL"
                  >
                    {copiedId === note.id ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Secure Note</h2>
            <form onSubmit={handleCreateNote}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.fromEmail}
                    onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.toEmail}
                    onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                    className="input-field"
                    placeholder="recipient@email.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="Secure Message"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Your secure message here..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Optional password protection"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.expiresAfterRead}
                    onChange={(e) => setFormData({ ...formData, expiresAfterRead: e.target.checked })}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">
                    Self-destruct after reading (like Privnote)
                  </span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Create & Copy Link
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

      {/* Replies Modal */}
      {showRepliesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Replies</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {replies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No replies yet</p>
              ) : (
                replies.map((reply) => (
                  <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{reply.from_email}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowRepliesModal(false)}
              className="mt-4 btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
