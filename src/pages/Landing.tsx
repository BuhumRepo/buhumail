import { Link } from 'react-router-dom'
import { Mail, Shield, Zap, Globe } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Buhumail
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started →
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 mb-6 shadow-sm">
          <span className="text-primary-600 font-semibold text-sm">✨ Professional Email Management Platform</span>
        </div>
        <h1 className="text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Email Service
          <br />
          <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Secure temporary emails, self-destructive notes, and custom domain support.
          <br />
          Everything you need in one powerful platform.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 shadow-2xl">
            <span>Start Free Trial</span>
            <span>→</span>
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4 inline-block">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full border border-gray-200 mb-4 shadow-sm">
            <span className="text-primary-600 font-semibold text-sm">🚀 Features</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900">
            Powerful Tools at Your Fingertips
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Mail className="w-10 h-10 text-white" />}
            iconBg="from-primary-500 to-primary-600"
            title="Temp Mail Service"
            description="Create disposable email addresses with your own custom domain"
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-white" />}
            iconBg="from-blue-500 to-blue-600"
            title="Self-Destructive Notes"
            description="Send secure messages that disappear after being read, just like Privnote"
          />
          <FeatureCard
            icon={<Globe className="w-10 h-10 text-white" />}
            iconBg="from-purple-500 to-purple-600"
            title="Custom Domains"
            description="Connect your own domains and manage them effortlessly"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-white" />}
            iconBg="from-orange-500 to-orange-600"
            title="Real-time Replies"
            description="Recipients can reply to your secure notes instantly"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600 border-t border-gray-200">
        <p className="font-medium">&copy; 2024 Buhumail. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, iconBg, title, description }: { icon: React.ReactNode; iconBg: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition-all group hover:-translate-y-1 duration-300">
      <div className={`w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
