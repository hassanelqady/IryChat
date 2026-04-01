'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem' }}
      >
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          style={{ fontSize: '8rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(135deg, #00d4ff, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </motion.div>
        
        <motion.h1 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#eef2ff' }}>
          الصفحة غير موجودة
        </motion.h1>
        
        <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', marginBottom: '2rem', maxWidth: '500px' }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </motion.p>
        
        <motion.div variants={fadeUp}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" style={{ background: '#00d4ff', color: '#05080f', padding: '0.88rem 2.2rem', borderRadius: '99px', textDecoration: 'none', fontWeight: 700, display: 'inline-block', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              العودة إلى الرئيسية
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div variants={fadeUp} style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{ color: 'rgba(238,242,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>لوحة التحكم</Link>
          <span style={{ color: 'rgba(238,242,255,0.3)' }}>•</span>
          <Link href="/login" style={{ color: 'rgba(238,242,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>تسجيل الدخول</Link>
          <span style={{ color: 'rgba(238,242,255,0.3)' }}>•</span>
          <Link href="/signup" style={{ color: 'rgba(238,242,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>إنشاء حساب</Link>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }
      `}</style>
    </main>
  )
}