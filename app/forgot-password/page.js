'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      title: "Reset Password",
      subtitle: "Enter your email and we'll send you a reset link.",
      emailPlaceholder: "Enter your email address",
      submitBtn: "Send Reset Link",
      sending: "Sending...",
      successMsg: "✅ Reset link sent to your email!",
      backToLogin: "Back to Login",
    },
    ar: {
      title: "نسيت كلمة المرور",
      subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      submitBtn: "إرسال رابط إعادة التعيين",
      sending: "جاري الإرسال...",
      successMsg: "✅ تم إرسال رابط إعادة التعيين لبريدك!",
      backToLogin: "العودة لتسجيل الدخول",
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic validation logic (simulated)
    if (!email || !email.includes('@')) return
    
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Logo/Brand */}
          <motion.div variants={fadeUp} className="text-center mb-6">
            <Link href="/" className="text-3xl font-black dark:text-white text-cyan-400 tracking-tight">
              IryChat
            </Link>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-2xl font-bold mb-2 text-white text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t.title}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-gray-400 mb-8 text-center">
            {t.subtitle}
          </motion.p>

          {/* Success Message */}
          {sent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-sm text-green-400 text-center flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              {t.successMsg}
            </motion.div>
          )}

          {/* Form */}
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={fadeUp}>
                <input 
                  type="email" 
                  placeholder={t.emailPlaceholder} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </motion.div>
              
              <motion.button 
                variants={fadeUp} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{t.sending}</span>
                ) : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Back Link */}
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center justify-center gap-1">
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              {t.backToLogin}
            </Link>
          </motion.div>

        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}