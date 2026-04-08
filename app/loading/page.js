'use client'

import { motion } from 'framer-motion'
import Link from 'next/link' // تأكد من وجود هذا السطر
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D' // وتأكد من وجود هذا السطر
import { useLanguage } from '@/context/LanguageContext'

export default function Loading() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      text: "Loading...",
      title: "Just a moment",
      subtitle: "We are preparing your experience.",
      backToHome: "Back to Home"
    },
    ar: {
      text: "جاري التحميل...",
      title: "لحظة واحدة",
      subtitle: "نقوم بإعداد تجربتك لك.",
      backToHome: "العودة للرئيسية"
    }
  }

  const t = content[lang]

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          {/* مؤشر التحميل (Spinner) */}
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-800"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>

          <motion.h1 className="text-3xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t.title}
          </motion.h1>
          
          <motion.p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
            {t.subtitle}
          </motion.p>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-cyan-400 font-medium text-xl"
          >
            {t.text}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all">
              {t.backToHome}
            </Link>
          </motion.div>

        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}