import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

interface SecurityStats {
  totalEmails: number
  safeEmails: number
  suspiciousEmails: number
  blockedThreats: number
  averageTrustScore: number
}

interface SecurityDashboardProps {
  stats: SecurityStats
}

export default function SecurityDashboard({ stats }: SecurityDashboardProps) {
  const safePercentage = Math.round((stats.safeEmails / stats.totalEmails) * 100) || 0
  const suspiciousPercentage = Math.round((stats.suspiciousEmails / stats.totalEmails) * 100) || 0
  const dangerousPercentage = 100 - safePercentage - suspiciousPercentage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Email Shield</h2>
              <p className="text-primary-100">Your security at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">{stats.totalEmails}</div>
              <div className="text-sm text-primary-100">Emails Analyzed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">{stats.averageTrustScore}</div>
              <div className="text-sm text-primary-100">Avg Trust Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Safe Emails */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.safeEmails}</div>
          <div className="text-sm text-gray-600 mb-2">Safe Emails</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safePercentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-green-500"
              />
            </div>
            <span className="text-sm font-medium text-green-600">{safePercentage}%</span>
          </div>
        </motion.div>

        {/* Suspicious Emails */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border-2 border-yellow-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.suspiciousEmails}</div>
          <div className="text-sm text-gray-600 mb-2">Suspicious</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${suspiciousPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-yellow-500"
              />
            </div>
            <span className="text-sm font-medium text-yellow-600">{suspiciousPercentage}%</span>
          </div>
        </motion.div>

        {/* Blocked Threats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border-2 border-red-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl">🚨</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.blockedThreats}</div>
          <div className="text-sm text-gray-600 mb-2">Threats Blocked</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dangerousPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-red-500"
              />
            </div>
            <span className="text-sm font-medium text-red-600">{dangerousPercentage}%</span>
          </div>
        </motion.div>
      </div>

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Security Insights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your inbox security is {safePercentage >= 80 ? 'excellent' : safePercentage >= 60 ? 'good' : 'needs attention'}</span>
              </li>
              {stats.blockedThreats > 0 && (
                <li className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>AI Shield has protected you from {stats.blockedThreats} potential threats this month</span>
                </li>
              )}
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Always verify sender identity before clicking links or downloading attachments</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Demo data
export const demoSecurityStats: SecurityStats = {
  totalEmails: 127,
  safeEmails: 98,
  suspiciousEmails: 21,
  blockedThreats: 8,
  averageTrustScore: 82
}
