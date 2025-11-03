import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Mail, Globe, FileText, Menu, X, Shield, Settings, BarChart3, Puzzle, Sparkles, ChevronDown, User, LogOut, UserCircle, Bell, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DomainsPanel from '../components/DomainsPanel'
import TempEmailsPanel from '../components/TempEmailsPanel'
import NotesPanel from '../components/NotesPanel'
import Overview from '../components/Overview'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen])

  // Close dropdown when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      setProfileDropdownOpen(false)
    }
  }, [sidebarOpen])

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: Mail },
    { path: '/dashboard/domains', label: 'Domains', icon: Globe },
    { path: '/dashboard/temp-emails', label: 'Temp Emails', icon: Mail },
    { path: '/dashboard/notes', label: 'Secure Notes', icon: FileText },
  ]

  const preferenceItems = [
    { path: '/dashboard/ai-shield', label: 'AI Email Shield', icon: Shield },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/integrations', label: 'Integrations', icon: Puzzle },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-30">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center shadow-md">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hidden sm:block">
                Buhumail
              </span>
            </div>
            
            <div className="hidden lg:block w-px h-6 bg-gray-300"></div>
            
            <h1 className="hidden lg:block text-xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center space-x-2">
            {/* Upgrade Button */}
            <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-md hover:shadow-lg">
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">Upgrade Now</span>
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      // Navigate to profile page when implemented
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </button>
                  <button
                    onClick={async () => {
                      setProfileDropdownOpen(false)
                      await logout()
                      window.location.href = '/'
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 transform transition-transform h-full shadow-xl
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto pt-6">
              {/* Main Navigation */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group
                        ${isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Preference Section */}
              <div>
                <div className="px-4 mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preference</p>
                </div>
                <div className="space-y-1">
                  {preferenceItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group
                          ${isActive
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            {/* Upgrade Card */}
            <div className="px-4 pb-4">
              <div className="relative bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-200/50 rounded-2xl p-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-bold text-gray-900">Free Plan</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-3 flex items-center space-x-2">
                    <span className="font-semibold">30</span>
                    <span>days trial remaining</span>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/30">
                    <Sparkles className="w-4 h-4" />
                    <span>Upgrade</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/domains" element={<DomainsPanel />} />
            <Route path="/temp-emails" element={<TempEmailsPanel />} />
            <Route path="/notes" element={<NotesPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
