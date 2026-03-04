import { Link } from 'react-router-dom'
import { Mail, Shield, Zap, Globe, Lock, Clock, Users, CheckCircle, ArrowRight, Sparkles, Send } from 'lucide-react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'

// Floating email particle component
function FloatingEmail({ delay = 0, duration = 20, xStart = 0, xEnd = 100 }: { delay?: number; duration?: number; xStart?: number; xEnd?: number }) {
  return (
    <motion.div
      initial={{ x: `${xStart}vw`, y: '100vh', opacity: 0, rotate: 0 }}
      animate={{
        x: [`${xStart}vw`, `${xEnd}vw`],
        y: ['100vh', '-10vh'],
        opacity: [0, 0.6, 0.8, 0.6, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute pointer-events-none"
    >
      <Mail className="w-6 h-6 text-primary-400" />
    </motion.div>
  )
}

// Email sending animation component
function EmailSendingAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto h-64">
      {/* Envelope */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateZ: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="w-48 h-32 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl border-2 border-primary-200 relative overflow-hidden">
            {/* Envelope flap */}
            <motion.div
              animate={{ rotateX: [0, 180, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-primary-500 to-primary-600 origin-top"
              style={{ transformStyle: 'preserve-3d' }}
            />
            {/* Inner content with glow */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-4 bg-gradient-to-r from-primary-100 to-purple-100 rounded flex items-center justify-center"
            >
              <Mail className="w-12 h-12 text-primary-600" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Flying particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (Math.cos((i * Math.PI) / 4) * 150)],
            y: [0, (Math.sin((i * Math.PI) / 4) * 150)],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-primary-400 rounded-full"
        />
      ))}
    </div>
  )
}

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <FloatingEmail
            key={i}
            delay={i * 2}
            duration={20 + Math.random() * 10}
            xStart={Math.random() * 100}
            xEnd={Math.random() * 100}
          />
        ))}
      </div>

      {/* Futuristic grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto px-4 py-6 relative z-10"
      >
        <nav className="flex items-center justify-between backdrop-blur-md bg-white/50 rounded-2xl px-6 py-3 shadow-lg border border-white/20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Buhumail
            </span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary">
                Get Started →
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative z-10">
        <motion.div style={{ y, opacity }} className="space-y-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 mb-6 shadow-sm"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-primary-600 font-semibold text-sm"
            >
              ✨ Professional Email Management Platform
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Email Service
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
            >
              Reimagined
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Secure temporary emails, self-destructive notes, and custom domain support.
            <br />
            Everything you need in one powerful platform.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 shadow-2xl relative overflow-hidden group">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="relative">Start for free</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative"
                >
                  <Send className="w-5 h-5" />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="btn-secondary text-lg px-8 py-4 inline-block">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated email sending illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20"
        >
          <EmailSendingAnimation />
        </motion.div>
      </section>

      {/* AI Email Shield Showcase - NEW */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl" />
        <div className="relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-6 shadow-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-bold text-sm">🤖 NEW: AI-Powered</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Know Every Email's Trust Score
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Buhumail is the <span className="font-bold text-primary-600">only email service</span> that shows you AI-powered trust scores for every email. See exactly why an email is safe or dangerous before you open it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">✅</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95/100</div>
                <h3 className="font-bold text-gray-900 mb-2">Safe Emails</h3>
                <p className="text-gray-600">AI confirms no threats detected</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-yellow-200 hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">55/100</div>
                <h3 className="font-bold text-gray-900 mb-2">Suspicious</h3>
                <p className="text-gray-600">Be cautious with this sender</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-red-200 hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🚨</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">15/100</div>
                <h3 className="font-bold text-gray-900 mb-2">Dangerous</h3>
                <p className="text-gray-600">Phishing attempt detected</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link
              to="/security-demo"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl group"
            >
              <Shield className="w-5 h-5" />
              <span>See AI Email Shield in Action</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 mt-4">Live interactive demo • No signup required</p>
          </motion.div>
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
            icon={<Shield className="w-10 h-10 text-white" />}
            iconBg="from-blue-500 to-blue-600"
            title="AI Email Shield"
            description="See trust scores (0-100) for every email with AI-powered threat detection"
            badge="NEW"
          />
          <FeatureCard
            icon={<Mail className="w-10 h-10 text-white" />}
            iconBg="from-primary-500 to-primary-600"
            title="Temp Mail Service"
            description="Create disposable email addresses with your own custom domain"
          />
          <FeatureCard
            icon={<Lock className="w-10 h-10 text-white" />}
            iconBg="from-purple-500 to-purple-600"
            title="Self-Destructive Notes"
            description="Send secure messages that disappear after being read, just like Privnote"
          />
          <FeatureCard
            icon={<Globe className="w-10 h-10 text-white" />}
            iconBg="from-orange-500 to-orange-600"
            title="Custom Domains"
            description="Connect your own domains and manage them effortlessly"
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
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-primary-50 rounded-full mb-4"
            >
              <span className="text-primary-600 font-semibold text-sm">🔒 Privacy First</span>
            </motion.div>
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
          </motion.div>
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <StatCard
              icon={<Mail className="w-12 h-12 mb-4 opacity-90" />}
              value="10K+"
              label="Temporary Emails Created"
              gradient="from-primary-500 to-primary-600"
              delay={0}
            />
            <StatCard
              icon={<Shield className="w-12 h-12 mb-4 opacity-90" />}
              value="100%"
              label="Secure & Private"
              gradient="from-purple-500 to-purple-600"
              delay={0.2}
              className="mt-8"
            />
            <StatCard
              icon={<Clock className="w-12 h-12 mb-4 opacity-90" />}
              value="24/7"
              label="Always Available"
              gradient="from-blue-500 to-blue-600"
              delay={0.4}
            />
            <StatCard
              icon={<Zap className="w-12 h-12 mb-4 opacity-90" />}
              value="Instant"
              label="Message Delivery"
              gradient="from-orange-500 to-orange-600"
              delay={0.6}
              className="mt-8"
            />
          </motion.div>
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
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Animated background effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
          />

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 relative"
          >
            Ready to Take Control of Your Privacy?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto relative"
          >
            Join thousands of users who trust Buhumail for secure, anonymous communication.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl relative"
              >
                <span>Get Started Free</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-primary-100 mt-4 text-sm relative"
          >
            No credit card required • Free forever
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Buhumail</span>
        </div>
        <p className="font-medium mb-2">&copy; 2026 Buhumail. All rights reserved.</p>
        <p className="text-sm text-gray-500">Secure email and note sharing platform</p>
      </footer>
    </div>
  )
}

function StatCard({ icon, value, label, gradient, delay = 0, className = '' }: { icon: React.ReactNode; value: string; label: string; gradient: string; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Animated shine effect */}
      <motion.div
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {icon}
      </motion.div>
      <motion.h3
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3, type: 'spring' }}
        className="text-4xl font-bold mb-2"
      >
        {value}
      </motion.h3>
      <p className="opacity-90">{label}</p>
    </motion.div>
  )
}

function FeatureCard({ icon, iconBg, title, description, badge }: { icon: React.ReactNode; iconBg: string; title: string; description: string; badge?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-2xl border border-gray-100 p-8 group relative overflow-hidden"
    >
      {/* NEW Badge */}
      {badge && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {badge}
        </div>
      )}
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        whileHover={{ scale: 1.15, rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`relative w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 relative">{title}</h3>
      <p className="text-gray-600 leading-relaxed relative">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: parseInt(number) * 0.2 }}
      whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
      className="relative bg-white rounded-2xl border border-gray-100 p-8 group"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: parseInt(number) * 0.2 + 0.3, type: 'spring' }}
        whileHover={{ scale: 1.2, rotate: 360 }}
        className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
      >
        {number}
      </motion.div>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-4 mt-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>

      {/* Animated connector line */}
      {parseInt(number) < 3 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: parseInt(number) * 0.2 + 0.5 }}
          className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-transparent origin-left"
        />
      )}
    </motion.div>
  )
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ x: -30, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-3"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0"
      >
        {icon}
      </motion.div>
      <p className="text-gray-700 font-medium">{text}</p>
    </motion.div>
  )
}

function UseCaseCard({ title, description, gradient }: { title: string; description: string; gradient: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-2xl border border-gray-100 p-8 group relative overflow-hidden"
    >
      {/* Animated background on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
      />
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 48 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`relative h-1 bg-gradient-to-r ${gradient} rounded-full mb-6`}
      >
        <motion.div
          animate={{ x: [0, 48, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-2 h-2 bg-white rounded-full -top-0.5 -right-1 shadow-lg"
        />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 relative">{title}</h3>
      <p className="text-gray-600 leading-relaxed relative">{description}</p>
    </motion.div>
  )
}
