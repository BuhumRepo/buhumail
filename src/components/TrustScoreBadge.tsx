import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface TrustScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showIcon?: boolean
}

export default function TrustScoreBadge({ 
  score, 
  size = 'md', 
  showLabel = true,
  showIcon = true 
}: TrustScoreBadgeProps) {
  // Determine category based on score
  const getCategory = () => {
    if (score >= 70) return 'safe'
    if (score >= 40) return 'suspicious'
    return 'dangerous'
  }

  const category = getCategory()

  // Styling based on category
  const styles = {
    safe: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      Icon: CheckCircle
    },
    suspicious: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500',
      Icon: AlertTriangle
    },
    dangerous: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600',
      gradient: 'from-red-500 to-rose-500',
      Icon: XCircle
    }
  }

  const style = styles[category]
  const Icon = style.Icon

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      score: 'text-xs font-bold'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      score: 'text-sm font-bold'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      score: 'text-base font-bold'
    }
  }

  const sizeClass = sizeClasses[size]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full border ${style.bg} ${style.border} ${style.text} ${sizeClass.container}`}
    >
      {showIcon && (
        <Icon className={`${sizeClass.icon} ${style.icon}`} />
      )}
      <div className="flex items-center space-x-1">
        <span className={sizeClass.score}>{score}</span>
        {showLabel && (
          <span className="opacity-70">/100</span>
        )}
      </div>
    </motion.div>
  )
}

// Large detailed version with progress bar
export function TrustScoreCard({ 
  score, 
  threats = [],
  category 
}: { 
  score: number
  threats?: string[]
  category?: 'safe' | 'suspicious' | 'dangerous'
}) {
  const cat = category || (score >= 70 ? 'safe' : score >= 40 ? 'suspicious' : 'dangerous')
  
  const styles = {
    safe: {
      bg: 'from-green-500 to-emerald-500',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      label: 'Safe to Open',
      emoji: '✅'
    },
    suspicious: {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800',
      label: 'Be Cautious',
      emoji: '⚠️'
    },
    dangerous: {
      bg: 'from-red-500 to-rose-500',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
      label: 'Potential Threat',
      emoji: '🚨'
    }
  }

  const style = styles[cat]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${style.bg} rounded-xl flex items-center justify-center text-2xl`}>
            {style.emoji}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Email Shield</h3>
            <span className={`text-sm px-2 py-0.5 rounded-full ${style.badge}`}>
              {style.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ 
            background: `linear-gradient(135deg, ${cat === 'safe' ? '#10b981, #059669' : cat === 'suspicious' ? '#f59e0b, #ea580c' : '#ef4444, #dc2626'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {score}
          </div>
          <div className="text-sm text-gray-500">Trust Score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${style.bg} rounded-full`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Threats */}
      {threats.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Detected Threats</span>
          </h4>
          <ul className="space-y-1">
            {threats.map((threat, index) => (
              <motion.li
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-gray-600 flex items-start space-x-2"
              >
                <span className="text-red-500 mt-0.5">•</span>
                <span>{threat}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* No threats message */}
      {threats.length === 0 && cat === 'safe' && (
        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>No security threats detected</span>
        </div>
      )}
    </motion.div>
  )
}
