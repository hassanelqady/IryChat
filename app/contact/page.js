'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Clock, Send, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function ContactPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSent(false), 5000)
    }, 1500)
  }

  const content = {
    ar: {
      title: "تواصل معنا",
      subtitle: "لديك سؤال أو استفسار؟ تواصل معنا وسنرد عليك قريباً",
      nameLabel: "الاسم",
      emailLabel: "البريد الإلكتروني",
      messageLabel: "الرسالة",
      submitText: "إرسال الرسالة",
      sendingText: "جاري الإرسال...",
      successMsg: "✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً",
      emailTitle: "البريد الإلكتروني",
      emailVal: "irychatflow@gmail.com",
      hoursTitle: "ساعات العمل",
      hoursVal: "السبت - الخميس 9ص - 6م"
    },
    en: {
      title: "Contact Us",
      subtitle: "Have a question or inquiry? Contact us and we will get back to you soon.",
      nameLabel: "Name",
      emailLabel: "Email Address",
      messageLabel: "Message",
      submitText: "Send Message",
      sendingText: "Sending...",
      successMsg: "✅ Message sent successfully! We will contact you soon.",
      emailTitle: "Email Address",
      emailVal: "irychatflow@gmail.com",
      hoursTitle: "Working Hours",
      hoursVal: "Sat - Thu 9AM - 6PM"
    }
  }

  const t = content[lang] || content.ar

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-12">
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {t.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400">{t.subtitle}</motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-8"
          >
            {sent && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 text-center text-green-400 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {t.successMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={fadeUp}>
                <label className="block mb-2 text-gray-300 font-medium">{t.nameLabel}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder={t.nameLabel}
                />
              </motion.div>
              
              <motion.div variants={fadeUp}>
                <label className="block mb-2 text-gray-300 font-medium">{t.emailLabel}</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder={t.emailLabel}
                />
              </motion.div>
              
              <motion.div variants={fadeUp}>
                <label className="block mb-2 text-gray-300 font-medium">{t.messageLabel}</label>
                <textarea 
                  rows="5" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-vertical"
                  placeholder={t.messageLabel}
                />
              </motion.div>
              
              <motion.button 
                variants={fadeUp} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{t.sendingText}</span>
                ) : (
                  <>
                    <Send size={20} />
                    {t.submitText}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.div variants={fadeUp} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white/10 rounded-full mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <div className="font-bold text-white mb-1">{t.emailTitle}</div>
              <div className="text-sm text-gray-400">{t.emailVal}</div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white/10 rounded-full mb-4">
                <Clock className="text-white" size={24} />
              </div>
              <div className="font-bold text-white mb-1">{t.hoursTitle}</div>
              <div className="text-sm text-gray-400">{t.hoursVal}</div>
            </motion.div>
          </motion.div>

        </div>
      </main>
    </PageLayoutWith3D>
  )
}