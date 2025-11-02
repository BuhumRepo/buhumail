import { Mail, Clock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import TrustScoreBadge from './TrustScoreBadge'

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  trustScore: number
  isRead: boolean
  category?: 'safe' | 'suspicious' | 'dangerous'
}

interface SecureEmailListProps {
  emails: Email[]
  onEmailClick: (email: Email) => void
}

export default function SecureEmailList({ emails, onEmailClick }: SecureEmailListProps) {
  return (
    <div className="space-y-2">
      {emails.map((email, index) => (
        <motion.div
          key={email.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onEmailClick(email)}
          className={`
            bg-white rounded-xl border-2 transition-all cursor-pointer
            hover:shadow-lg hover:scale-[1.01]
            ${email.isRead ? 'border-gray-100' : 'border-primary-200 bg-primary-50/30'}
            ${email.category === 'dangerous' ? 'border-red-200' : ''}
            ${email.category === 'suspicious' ? 'border-yellow-200' : ''}
          `}
        >
          <div className="p-4">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${email.isRead ? 'bg-gray-200' : 'bg-primary-100'}
                `}>
                  <Mail className={`w-5 h-5 ${email.isRead ? 'text-gray-500' : 'text-primary-600'}`} />
                </div>
                
                {/* Email Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-semibold truncate ${email.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                      {email.from}
                    </span>
                    {!email.isRead && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <h3 className={`font-medium mb-1 truncate ${email.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {email.subject}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {email.preview}
                  </p>
                </div>
              </div>

              {/* Trust Score Badge */}
              <div className="ml-4 flex-shrink-0">
                <TrustScoreBadge score={email.trustScore} size="sm" showLabel={false} />
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{email.date}</span>
                </span>
                {email.category && (
                  <span className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span className="capitalize">{email.category}</span>
                  </span>
                )}
              </div>
              
              {/* Warning for dangerous emails */}
              {email.category === 'dangerous' && (
                <span className="text-xs text-red-600 font-medium">
                  ⚠️ Potential Threat
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Empty state component
export function EmptyEmailState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Shield className="w-12 h-12 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Your Inbox is Protected
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Every email you receive will be analyzed by our AI Email Shield. 
        Trust scores will appear here automatically.
      </p>
    </motion.div>
  )
}

// Demo data for preview
export const demoEmails: Email[] = [
  {
    id: '1',
    from: 'john@company.com',
    subject: 'Q4 Sales Report Ready for Review',
    preview: 'Hi team, I\'ve completed the Q4 sales analysis. Please review the attached report...',
    date: '2 hours ago',
    trustScore: 95,
    isRead: false,
    category: 'safe'
  },
  {
    id: '2',
    from: 'security@paypal-verify.com',
    subject: 'URGENT: Verify Your Account Now',
    preview: 'Your account will be suspended unless you verify your information immediately...',
    date: '5 hours ago',
    trustScore: 15,
    isRead: false,
    category: 'dangerous'
  },
  {
    id: '3',
    from: 'newsletter@unknown-sender.net',
    subject: 'You won $1,000,000!',
    preview: 'Congratulations! You have been selected as our lucky winner. Click here to claim...',
    date: '1 day ago',
    trustScore: 25,
    isRead: true,
    category: 'dangerous'
  },
  {
    id: '4',
    from: 'support@randomservice.io',
    subject: 'Password Reset Request',
    preview: 'We received a request to reset your password. If this wasn\'t you...',
    date: '2 days ago',
    trustScore: 55,
    isRead: true,
    category: 'suspicious'
  },
  {
    id: '5',
    from: 'sarah@gmail.com',
    subject: 'Meeting Tomorrow at 3 PM',
    preview: 'Just confirming our meeting tomorrow afternoon. Looking forward to discussing...',
    date: '3 days ago',
    trustScore: 92,
    isRead: true,
    category: 'safe'
  }
]
