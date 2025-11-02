import { useEffect, useState } from 'react'
import { Plus, Globe, Check, X, Trash2 } from 'lucide-react'
import { api } from '../utils/api'

interface Domain {
  id: string
  domain: string
  verified: number
  dns_records: string
  created_at: number
}

export default function DomainsPanel() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const response = await api.get('/domains')
      setDomains(response.domains)
    } catch (error) {
      console.error('Failed to load domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/domains', { domain: newDomain })
      setNewDomain('')
      setShowAddModal(false)
      loadDomains()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleVerifyDomain = async (domainId: string) => {
    try {
      await api.post(`/domains/${domainId}/verify`, {})
      loadDomains()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return
    try {
      await api.delete(`/domains/${domainId}`)
      loadDomains()
    } catch (error: any) {
      alert(error.message)
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
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Domains</h1>
          <p className="text-gray-600">Connect and manage your custom domains</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Domain</span>
        </button>
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {domains.length === 0 ? (
          <div className="card text-center py-12">
            <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No domains yet</h3>
            <p className="text-gray-600 mb-6">Add your first custom domain to get started</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add Domain
            </button>
          </div>
        ) : (
          domains.map((domain) => (
            <div key={domain.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{domain.domain}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {domain.verified ? (
                        <span className="flex items-center text-sm text-green-600">
                          <Check className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-orange-600">
                          <X className="w-4 h-4 mr-1" />
                          Not Verified
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Added {new Date(domain.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!domain.verified && (
                    <>
                      <button
                        onClick={() => setSelectedDomain(domain)}
                        className="btn-secondary text-sm"
                      >
                        View DNS Records
                      </button>
                      <button
                        onClick={() => handleVerifyDomain(domain.id)}
                        className="btn-primary text-sm"
                      >
                        Verify
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteDomain(domain.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* DNS Records - shown when selected */}
              {selectedDomain?.id === domain.id && !domain.verified && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">DNS Records to Add:</h4>
                  <div className="space-y-2 text-sm">
                    {JSON.parse(domain.dns_records).map((record: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border">
                        <p><strong>Type:</strong> {record.type}</p>
                        <p><strong>Name:</strong> {record.name}</p>
                        <p><strong>Value:</strong> {record.value}</p>
                        {record.priority && <p><strong>Priority:</strong> {record.priority}</p>}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Custom Domain</h2>
            <form onSubmit={handleAddDomain}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain Name
                </label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="input-field"
                  placeholder="example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter your domain without http:// or www
                </p>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Domain
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
