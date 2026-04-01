'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f', padding: '7rem 5% 5rem' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h1 variants={fadeUp} style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>عن IryChat</motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>نحن نؤمن بأن التواصل مع العملاء يجب أن يكون سلساً وذكياً</motion.p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>قصتنا</motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.8', marginBottom: '1rem' }}>
              تأسست IryChat عام 2023 بهدف بسيط: مساعدة الشركات على التواصل مع عملائها بشكل أذكى وأسرع.
            </motion.p>
            <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.8' }}>
              اليوم، نخدم أكثر من 15,000 عميل حول العالم، ونساعدهم على تحويل كل تفاعل على انستجرام إلى فرصة بيع حقيقية.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '24px', padding: '2rem', textAlign: 'center' }}>
            <motion.div variants={fadeUp} style={{ fontSize: '3rem', fontWeight: 900, color: '#00d4ff', marginBottom: '0.5rem' }}>15K+</motion.div>
            <motion.div variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)' }}>عميل نشط</motion.div>
            <motion.div variants={fadeUp} style={{ fontSize: '3rem', fontWeight: 900, color: '#00d4ff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>98%</motion.div>
            <motion.div variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)' }}>معدل رضا العملاء</motion.div>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginTop: '4rem' }}>
          <motion.h2 variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>قيمنا</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.035)', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ marginBottom: '0.5rem' }}>السرعة</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>الرد في أقل من ثانية</p>
            </motion.div>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.035)', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <h3 style={{ marginBottom: '0.5rem' }}>الأمان</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>معتمد من ميتا 100%</p>
            </motion.div>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.035)', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
              <h3 style={{ marginBottom: '0.5rem' }}>الذكاء</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>ردود تلقائية ذكية</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(35px,25px) scale(1.08); } }
      `}</style>
    </main>
  )
}