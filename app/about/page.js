'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { Zap, Shield, Bot, Users, TrendingUp, Globe } from 'lucide-react'

export default function AboutPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    ar: {
      hero: 'عن IryChat',
      heroSub: 'نحن نؤمن بأن التواصل مع العملاء يجب أن يكون سلساً وذكياً وبلا حدود',
      storyTitle: 'قصتنا',
      story1: 'تأسست IryChat عام 2023 بهدف بسيط: مساعدة الشركات على التواصل مع عملائها بشكل أذكى وأسرع.',
      story2: 'اليوم، نخدم أكثر من 15,000 عميل حول العالم، ونساعدهم على تحويل كل تفاعل على انستجرام وفيسبوك إلى فرصة بيع حقيقية.',
      stat1: '15K+',
      stat1Label: 'عميل نشط',
      stat2: '98%',
      stat2Label: 'معدل رضا العملاء',
      stat3: '2M+',
      stat3Label: 'رد تلقائي شهرياً',
      valuesTitle: 'قيمنا',
      values: [
        { icon: <Zap size={28} />, title: 'السرعة', desc: 'الرد في أقل من ثانية على كل تعليق ورسالة', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { icon: <Shield size={28} />, title: 'الأمان', desc: 'معتمد 100% من ميتا ومتوافق مع سياساتها', color: 'text-green-400', bg: 'bg-green-500/10' },
        { icon: <Bot size={28} />, title: 'الذكاء', desc: 'ردود تلقائية ذكية تحاكي أسلوب تواصلك', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { icon: <Globe size={28} />, title: 'الشمولية', desc: 'دعم كامل للغة العربية والإنجليزية RTL/LTR', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { icon: <TrendingUp size={28} />, title: 'النمو', desc: 'أدوات تحليل تساعدك على تحسين أداءك', color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { icon: <Users size={28} />, title: 'الدعم', desc: 'فريق دعم متاح 24/7 لمساعدتك في كل خطوة', color: 'text-blue-400', bg: 'bg-blue-500/10' },
      ],
      ctaTitle: 'جاهز تبدأ معنا؟',
      ctaDesc: 'انضم لآلاف العملاء اللي يستخدمون IryChat لتنمية أعمالهم.',
      ctaBtn: 'ابدأ مجاناً',
    },
    en: {
      hero: 'About IryChat',
      heroSub: 'We believe that connecting with customers should be seamless, smart, and limitless',
      storyTitle: 'Our Story',
      story1: 'IryChat was founded in 2023 with a simple goal: help businesses connect with their customers smarter and faster.',
      story2: 'Today, we serve over 15,000 customers worldwide, helping them turn every Instagram and Facebook interaction into a real sales opportunity.',
      stat1: '15K+',
      stat1Label: 'Active Customers',
      stat2: '98%',
      stat2Label: 'Customer Satisfaction',
      stat3: '2M+',
      stat3Label: 'Auto Replies / Month',
      valuesTitle: 'Our Values',
      values: [
        { icon: <Zap size={28} />, title: 'Speed', desc: 'Reply in under a second to every comment and message', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { icon: <Shield size={28} />, title: 'Security', desc: '100% Meta-approved and fully policy-compliant', color: 'text-green-400', bg: 'bg-green-500/10' },
        { icon: <Bot size={28} />, title: 'Intelligence', desc: 'Smart auto-replies that mirror your communication style', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { icon: <Globe size={28} />, title: 'Inclusivity', desc: 'Full Arabic and English support with RTL/LTR layouts', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { icon: <TrendingUp size={28} />, title: 'Growth', desc: 'Analytics tools that help you improve your performance', color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { icon: <Users size={28} />, title: 'Support', desc: '24/7 support team ready to help you at every step', color: 'text-blue-400', bg: 'bg-blue-500/10' },
      ],
      ctaTitle: 'Ready to get started?',
      ctaDesc: 'Join thousands of businesses using IryChat to grow their brand.',
      ctaBtn: 'Get Started Free',
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="text-center mb-20"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Bot size={16} />
            {lang === 'ar' ? 'منصة أتمتة انستجرام وفيسبوك' : 'Instagram & Facebook Automation'}
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">{t.hero.split('IryChat')[0]}</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">IryChat</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.heroSub}
          </motion.p>
        </motion.div>

        {/* Story + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white mb-6">{t.storyTitle}</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-4 text-lg">{t.story1}</motion.p>
            <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed text-lg">{t.story2}</motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 gap-4"
          >
            {[
              { val: t.stat1, label: t.stat1Label, color: 'text-cyan-400' },
              { val: t.stat2, label: t.stat2Label, color: 'text-green-400' },
              { val: t.stat3, label: t.stat3Label, color: 'text-purple-400' },
            ].map((stat, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:border-white/20 transition-all"
              >
                <div className={`text-4xl font-black ${stat.color}`}>{stat.val}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Values */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white text-center mb-12">{t.valuesTitle}</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.values.map((v, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-3xl p-8 text-center transition-all"
              >
                <div className={`inline-flex p-4 rounded-2xl ${v.bg} ${v.color} mb-5`}>
                  {v.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">{t.ctaTitle}</h2>
          <p className="text-gray-400 mb-8 text-lg">{t.ctaDesc}</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-lg shadow-cyan-500/30 text-lg"
          >
            <Zap size={20} />
            {t.ctaBtn}
          </Link>
        </motion.div>

      </main>
    </PageLayoutWith3D>
  )
}