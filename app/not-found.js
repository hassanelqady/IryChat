// app/not-found.js
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Zap, ArrowRight, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

const translations = {
  en: {
    badge: "Page Not Found",
    title: "Sorry, the page you're looking for",
    highlight: "is not available",
    description: "The page may have been deleted, renamed, or is temporarily unavailable.",
    btnHome: "Back to Home",
    btnContact: "Contact Support",
    linkLogin: "Login",
    linkSignup: "Sign Up"
  },
  ar: {
    badge: "الصفحة غير موجودة",
    title: "عذراً، الصفحة التي تبحث عنها",
    highlight: "غير متاحة",
    description: "ربما تم حذف الصفحة أو تغيير اسمها أو أنها غير متاحة مؤقتاً.",
    btnHome: "العودة للرئيسية",
    btnContact: "تواصل مع الدعم",
    linkLogin: "تسجيل الدخول",
    linkSignup: "إنشاء حساب"
  }
}

export default function NotFound() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  // انيميشن الطيران المحسن (أكثر وضوحاً)
  const floatAnimation = {
    y: [0, -40, 0],        // يتحرك لفوق 40 بيكسل (مكان واضح)
    rotate: [0, 3, -3, 0], // ميلان يمين وشمال (عشان يبان طبيعي)
    transition: {
      duration: 6,         // أبطأ شوية عشان يكون مريح للعين
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <PageLayoutWith3D>
      <main dir={dir} className="min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-2xl mx-auto relative z-10"
        >
          {/* --- قسم الانيميشن المعدل --- */}
          <motion.div variants={fadeUp} className="relative mb-8 cursor-default">
            
            {/* هذا العنصر الداخلي هو اللي بيحرك فقط */}
            <motion.div
              animate={floatAnimation}
              className="inline-block"
            >
              <div className="text-[150px] md:text-[200px] font-black leading-none select-none">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  404
                </span>
              </div>
            </motion.div>

            {/* الخلفية الضبابية تتحرك معاه */}
            <motion.div 
              animate={floatAnimation}
              className="absolute inset-0 flex items-center justify-center opacity-30 blur-3xl pointer-events-none -z-10"
            >
              <div className="text-[150px] md:text-[200px] font-black text-cyan-500 select-none">404</div>
            </motion.div>
          </motion.div>
          {/* ---------------------------- */}

          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Zap size={16} />
            {t.badge}
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title}{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t.highlight}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeUp} className="text-gray-400 text-lg mb-10 leading-relaxed">
            {t.description}
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-lg shadow-cyan-500/30 text-lg"
            >
              <Home size={20} />
              {t.btnHome}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-bold rounded-full transition-all text-lg"
            >
              <HelpCircle size={20} />
              {t.btnContact}
              <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </motion.div>

          {/* Additional Links */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/login" className="text-gray-500 hover:text-cyan-400 transition">
              {t.linkLogin}
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/signup" className="text-gray-500 hover:text-cyan-400 transition">
              {t.linkSignup}
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}