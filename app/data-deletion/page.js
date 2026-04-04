'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DataDeletionPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f', padding: '7rem 5% 5rem' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px' }}></div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            حذف البيانات
          </h1>
          <p style={{ color: 'rgba(238,242,255,0.6)' }}>آخر تحديث: أبريل 2025</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '1rem' }}>كيفية حذف بياناتك</h2>
          <p style={{ color: 'rgba(238,242,255,0.7)', lineHeight: '1.8', marginBottom: '1rem' }}>
            إذا كنت تريد حذف بياناتك من IryChat، يمكنك ذلك بإحدى الطريقتين:
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>الطريقة الأولى: من داخل التطبيق</h3>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>
              1. سجّل دخولك إلى حسابك<br/>
              2. اذهب إلى الإعدادات<br/>
              3. اضغط على "حذف الحساب والبيانات"
            </p>
          </div>
          <div>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>الطريقة الثانية: التواصل معنا</h3>
            <p style={{ color: 'rgba(238,242,255,0.6)', lineHeight: '1.6' }}>
              أرسل طلب الحذف عبر البريد الإلكتروني:{' '}
              <a href="mailto:privacy@irychat.com" style={{ color: '#00d4ff' }}>privacy@irychat.com</a>
              <br/>مع ذكر البريد الإلكتروني المرتبط بحسابك.
            </p>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '1rem' }}>ما الذي سيتم حذفه؟</h2>
          <ul style={{ color: 'rgba(238,242,255,0.7)', lineHeight: '2', paddingRight: '1.5rem' }}>
            <li>بيانات حسابك الشخصية</li>
            <li>الحسابات المربوطة (Instagram / Facebook)</li>
            <li>جميع الـ Automations التي أنشأتها</li>
            <li>سجلات العمليات والإحصائيات</li>
            <li>أي بيانات أخرى مرتبطة بحسابك</li>
          </ul>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
          <h2 style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '1rem' }}>مدة المعالجة</h2>
          <p style={{ color: 'rgba(238,242,255,0.7)', lineHeight: '1.8' }}>
            سيتم معالجة طلب الحذف خلال <strong style={{ color: '#fff' }}>30 يوم عمل</strong> من تاريخ استلام الطلب.
            ستصلك رسالة تأكيد على بريدك الإلكتروني عند اكتمال العملية.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#00d4ff', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
