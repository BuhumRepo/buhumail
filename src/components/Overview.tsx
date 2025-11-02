import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Globe, FileText, TrendingUp } from 'lucide-react'
import { api } from '../utils/api'

export default function Overview() {
  const [stats, setStats] = useState({
    domains: 0,
    tempEmails: 0,
    notes: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [domains, tempEmails, notes] = await Promise.all([
        api.get('/domains'),
        api.get('/temp-emails'),
        api.get('/notes'),
      ])

      setStats({
        domains: domains.domains?.length || 0,
        tempEmails: tempEmails.tempEmails?.length || 0,
        notes: notes.notes?.length || 0,
        messages: 0,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Active Domains', value: stats.domains, icon: Globe, color: 'text-blue-600', link: '/dashboard/domains' },
    { label: 'Temp Emails', value: stats.tempEmails, icon: Mail, color: 'text-green-600', link: '/dashboard/temp-emails' },
    { label: 'Secure Notes', value: stats.notes, icon: FileText, color: 'text-purple-600', link: '/dashboard/notes' },
    { label: 'Messages Received', value: stats.messages, icon: TrendingUp, color: 'text-orange-600', link: '/dashboard/temp-emails' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Manage your email services and secure communications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} to={stat.link} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/domains"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Globe className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="font-medium text-gray-900">Add Domain</p>
            <p className="text-sm text-gray-600">Connect your custom domain</p>
          </Link>
          <Link
            to="/dashboard/temp-emails"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Mail className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="font-medium text-gray-900">Create Temp Email</p>
            <p className="text-sm text-gray-600">Generate disposable email</p>
          </Link>
          <Link
            to="/dashboard/notes"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="font-medium text-gray-900">Send Secure Note</p>
            <p className="text-sm text-gray-600">Create self-destructive message</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
