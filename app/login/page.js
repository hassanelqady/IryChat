'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      title: "Welcome to IryChat",
      subtitle: "Connect your Meta account to start automating your Instagram & Facebook interactions.",
      continueWithFacebook: "Continue with Facebook",
      loadingText: "Redirecting...",
      errorText: "Something went wrong. Please try again.",
      footer: "By continuing, you agree to our",
      terms: "Terms of Service",
      and: "and",
      privacy: "Privacy Policy",
      whyMeta: "Why Facebook login?",
      whyMetaDesc: "IryChat automates your Instagram & Facebook comments and DMs. A Meta account is required to connect and manage your pages.",
    },
    ar: {
      title: "مرحباً بك في IryChat",
      subtitle: "قم بربط حساب Meta الخاص بك لبدء أتمتة تفاعلاتك على إنستجرام وفيسبوك.",
      continueWithFacebook: "المتابعة عبر فيسبوك",
      loadingText: "جاري التحويل...",
      errorText: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      footer: "بالمتابعة، فإنك توافق على",
      terms: "شروط الخدمة",
      and: "و",
      privacy: "سياسة الخصوصية",
      whyMeta: "لماذا تسجيل الدخول بفيسبوك؟",
      whyMetaDesc: "يقوم IryChat بأتمتة تعليقاتك ورسائلك على إنستجرام وفيسبوك. يلزم وجود حساب Meta لربط صفحاتك وإدارتها.",
    }
  }

  const t = content[lang]

  const handleFacebookLogin = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email,public_profile',
      },
    })
    if (error) {
      setError(t.errorText)
      setLoading(false)
    }
    // إذا نجح، Supabase هيعمل redirect تلقائياً
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-md"
        >
          {/* Card */}
          <motion.div
            variants={fadeUp}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            {/* Logo */}
            <motion.div variants={fadeUp} className="text-center mb-8">
              <Link href="/" className="text-3xl font-black text-cyan-400 tracking-tight">
                IryChat
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-2xl font-bold text-white text-center mb-3"
            >
              {t.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-sm text-center mb-8 leading-relaxed"
            >
              {t.subtitle}
            </motion.p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Facebook Button */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full py-4 rounded-full font-bold text-white transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg"
              style={{
                background: loading
                  ? 'rgba(24,119,242,0.5)'
                  : 'linear-gradient(135deg, #1877F2, #0a5dc2)',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(24,119,242,0.35)',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  {t.loadingText}
                </>
              ) : (
                <>
                  {/* Facebook Icon */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t.continueWithFacebook}
                </>
              )}
            </motion.button>

            {/* Why Meta explanation */}
            <motion.div
              variants={fadeUp}
              className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4"
            >
              <p className="text-blue-400 text-xs font-semibold mb-1">ℹ️ {t.whyMeta}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{t.whyMetaDesc}</p>
            </motion.div>

            {/* Footer links */}
            <motion.p variants={fadeUp} className="text-center text-xs text-gray-600 mt-6">
              {t.footer}{' '}
              <Link href="/terms" className="text-gray-400 hover:text-cyan-400 underline transition-colors">
                {t.terms}
              </Link>
              {' '}{t.and}{' '}
              <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 underline transition-colors">
                {t.privacy}
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}
