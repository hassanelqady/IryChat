'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  // تعريف محتوى النصوص محلياً لضمان العمل مباشرة
  const content = {
    en: {
      signup: "Create an Account",
      signupSubtitle: "Join thousands of businesses automating their growth.",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      loading: "Creating account...",
      signupBtn: "Create Account",
      haveAccount: "Already have an account?",
      login: "Log in",
      passwordMismatch: "Passwords do not match.",
      passwordShort: "Password must be at least 6 characters.",
      alreadyRegistered: "User already registered.",
      genericError: "An error occurred. Please try again.",
    },
    ar: {
      signup: "إنشاء حساب",
      signupSubtitle: "انضم إلى آلاف الشركات التي تقوم بأتمتة نموها.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      loading: "جاري إنشاء الحساب...",
      signupBtn: "إنشاء حساب",
      haveAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      passwordMismatch: "كلمات المرور غير متطابقة.",
      passwordShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
      alreadyRegistered: "المستخدم مسجل مسبقاً.",
      genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError(t.passwordMismatch)
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError(t.passwordShort)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (error) {
      setError(error.message === 'User already registered' ? t.alreadyRegistered : t.genericError)
      setLoading(false)
      return
    }

    router.push('/dashboard')
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
            <Link href="/" className="text-3xl font-black text-cyan-400 tracking-tight">
              IryChat
            </Link>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-2xl font-bold mb-2 text-white text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t.signup}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 mb-8 text-center text-sm">
            {t.signupSubtitle}
          </motion.p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <motion.div variants={fadeUp}>
              <input 
                type="text" 
                placeholder={t.fullName} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
              <input 
                type="email" 
                placeholder={t.email} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={t.password} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={fadeUp}>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={t.confirmPassword} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button 
              variants={fadeUp} 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? t.loading : t.signupBtn}
            </motion.button>
          </form>

          {/* Link to Login */}
          <motion.div variants={fadeUp} className="mt-8 text-center text-sm text-gray-400">
            {t.haveAccount} <Link href="/login" className="text-cyan-400 hover:underline font-medium">{t.login}</Link>
          </motion.div>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}