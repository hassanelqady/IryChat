'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TermsPage() {
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

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ marginBottom: '3rem' }}>
          <motion.h1 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الشروط والأحكام</motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)' }}>آخر تحديث: 1 يناير 2025</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. قبول الشروط</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>باستخدامك لخدمات IryChat، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. استخدام الخدمة</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>يحق لك استخدام خدمات IryChat لأغراضك التجارية الشخصية، مع الالتزام بقوانين ميتا وانستجرام.</p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. الحساب والمسؤولية</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك.</p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. الدفع والإلغاء</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة التحكم. لن يتم إصدار استرداد للفترة المتبقية من الاشتراك.</p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>5. إنهاء الخدمة</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>نحتفظ بالحق في إنهاء أو تعليق حسابك في حال انتهاك هذه الشروط.</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>6. التواصل</h2>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>للاستفسارات حول الشروط والأحكام، تواصل معنا على <a href="mailto:legal@irychat.com" style={{ color: '#00d4ff' }}>legal@irychat.com</a></p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(35px,25px) scale(1.08); } }
      `}</style>
    </main>
  )
}