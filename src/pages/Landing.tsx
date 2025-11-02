import { Link } from 'react-router-dom'
import { Mail, Shield, Zap, Globe, Lock, Clock, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

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

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary-50/50 to-purple-50/30 rounded-3xl my-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full border border-primary-200 mb-4 shadow-sm">
            <span className="text-primary-600 font-semibold text-sm">⚡ Simple Process</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to secure, anonymous communication
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            icon={<Users className="w-8 h-8 text-primary-600" />}
            title="Create Your Account"
            description="Sign up in seconds with just your email. No credit card required for free tier."
          />
          <StepCard
            number="2"
            icon={<Globe className="w-8 h-8 text-primary-600" />}
            title="Add Your Domain"
            description="Connect your custom domain or use our temporary email addresses instantly."
          />
          <StepCard
            number="3"
            icon={<Sparkles className="w-8 h-8 text-primary-600" />}
            title="Start Sending"
            description="Create disposable emails and self-destructing notes with complete privacy."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-full mb-4">
              <span className="text-primary-600 font-semibold text-sm">🔒 Privacy First</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Privacy is Our Priority
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Built with security at its core. Every feature is designed to protect your identity and keep your communications private.
            </p>
            <div className="space-y-4">
              <BenefitItem icon={<Lock />} text="End-to-end encryption for all notes" />
              <BenefitItem icon={<Clock />} text="Automatic message expiration" />
              <BenefitItem icon={<Shield />} text="No tracking or data collection" />
              <BenefitItem icon={<CheckCircle />} text="GDPR compliant infrastructure" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform">
              <Mail className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-4xl font-bold mb-2">10K+</h3>
              <p className="text-primary-100">Temporary Emails Created</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform mt-8">
              <Shield className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-4xl font-bold mb-2">100%</h3>
              <p className="text-purple-100">Secure & Private</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform">
              <Clock className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Always Available</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform mt-8">
              <Zap className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-4xl font-bold mb-2">Instant</h3>
              <p className="text-orange-100">Message Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full border border-gray-200 mb-4 shadow-sm">
            <span className="text-primary-600 font-semibold text-sm">💼 Use Cases</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Perfect For Every Need
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <UseCaseCard
            title="Developers & Testers"
            description="Test signup flows, verify email functionality, and avoid spam in your main inbox during development."
            gradient="from-blue-500 to-blue-600"
          />
          <UseCaseCard
            title="Privacy Enthusiasts"
            description="Share sensitive information securely with self-destructing notes. Perfect for passwords and confidential data."
            gradient="from-purple-500 to-purple-600"
          />
          <UseCaseCard
            title="Business Professionals"
            description="Manage multiple domains, create temporary addresses for clients, and keep your communications organized."
            gradient="from-orange-500 to-orange-600"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Take Control of Your Privacy?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Buhumail for secure, anonymous communication.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-primary-100 mt-4 text-sm">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Buhumail</span>
        </div>
        <p className="font-medium mb-2">&copy; 2024 Buhumail. All rights reserved.</p>
        <p className="text-sm text-gray-500">Secure email and note sharing platform</p>
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

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition-all">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {number}
      </div>
      <div className="mb-4 mt-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
        {icon}
      </div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  )
}

function UseCaseCard({ title, description, gradient }: { title: string; description: string; gradient: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition-all group">
      <div className={`w-12 h-1 bg-gradient-to-r ${gradient} rounded-full mb-6 group-hover:w-20 transition-all`}></div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
