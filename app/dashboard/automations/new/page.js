'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function NewAutomationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({
    name: '',
    account_id: '',
    post_url: '',
    trigger_keyword: '',
    comment_reply: '',
    dm_message: '',
  })
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
      setAccounts(data || [])
    }
    init()
  }, [])

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.trigger_keyword) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    if (!form.comment_reply && !form.dm_message) {
      setError('يجب إضافة رد على التعليق أو رسالة DM على الأقل')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('automations').insert({
      user_id: user.id,
      account_id: form.account_id,
      name: form.name,
      post_url: form.post_url || null,
      trigger_keyword: form.trigger_keyword,
      comment_reply: form.comment_reply || null,
      dm_message: form.dm_message || null,
      is_active: true,
    })

    if (error) {
      setError('حدث خطأ، حاول مرة أخرى')
      setLoading(false)
      return
    }

    router.push('/dashboard/flows')
  }

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#eef2ff',
    fontSize: '0.95rem',
    outline: 'none',
    marginTop: '0.5rem',
  }

  const labelStyle = {
    color: 'rgba(238,242,255,0.7)',
    fontSize: '0.85rem',
    fontWeight: 600,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px' }}></div>
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '0.85rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        <Link href="/dashboard/flows" style={{ color: 'rgba(238,242,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>← العودة للأتمتة</Link>
      </nav>

      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.3rem' }}>
            إنشاء أتمتة جديدة
          </h1>
          <p style={{ color: 'rgba(238,242,255,0.5)' }}>سيتم الرد تلقائياً عند كتابة الكلمة المحددة في التعليقات</p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '99px', background: s <= step ? '#00d4ff' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ff6b6b', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Step 1: Basic Info */}
          <div>
            <div style={{ color: '#00d4ff', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>① المعلومات الأساسية</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>اسم الأتمتة *</label>
                <input type="text" placeholder="مثال: رد على طلبات السعر" value={form.name}
                  onChange={e => { update('name', e.target.value); setStep(1) }} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#00d4ff'; setStep(1) }}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <label style={labelStyle}>الحساب المرتبط *</label>
                {accounts.length === 0 ? (
                  <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', borderRadius: '12px', color: '#ffa500', fontSize: '0.85rem' }}>
                    ⚠️ لا توجد حسابات مربوطة —{' '}
                    <Link href="/dashboard/accounts" style={{ color: '#00d4ff' }}>اربط حسابك أولاً</Link>
                  </div>
                ) : (
                  <select value={form.account_id} onChange={e => { update('account_id', e.target.value); setStep(2) }} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">اختر الحساب...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_type === 'instagram' ? 'Instagram' : 'Facebook'})</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label style={labelStyle}>رابط البوست (اختياري)</label>
                <input type="text" placeholder="https://www.instagram.com/p/..." value={form.post_url}
                  onChange={e => update('post_url', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00d4ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <p style={{ color: 'rgba(238,242,255,0.4)', fontSize: '0.75rem', marginTop: '0.4rem' }}>اتركه فارغاً للتطبيق على كل البوستات</p>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Step 2: Trigger */}
          <div>
            <div style={{ color: '#00d4ff', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>② كلمة التشغيل</div>
            <div>
              <label style={labelStyle}>الكلمة المحفزة *</label>
              <input type="text" placeholder="مثال: سعر" value={form.trigger_keyword}
                onChange={e => { update('trigger_keyword', e.target.value); setStep(2) }} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00d4ff'; setStep(2) }}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <p style={{ color: 'rgba(238,242,255,0.4)', fontSize: '0.75rem', marginTop: '0.4rem' }}>عند كتابة أي متابع لهذه الكلمة في التعليقات، سيتم تشغيل الأتمتة تلقائياً</p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Step 3: Responses */}
          <div>
            <div style={{ color: '#00d4ff', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>③ الردود التلقائية</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>الرد على التعليق</label>
                <textarea placeholder="مثال: شكراً! سنتواصل معك عبر الخاص 📩" value={form.comment_reply}
                  onChange={e => { update('comment_reply', e.target.value); setStep(3) }} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = '#00d4ff'; setStep(3) }}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <label style={labelStyle}>رسالة DM التلقائية</label>
                <textarea placeholder="مثال: مرحباً! شكراً على اهتمامك، سعر المنتج هو..." value={form.dm_message}
                  onChange={e => { update('dm_message', e.target.value); setStep(3) }} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = '#00d4ff'; setStep(3) }}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '1rem', background: loading ? 'rgba(0,212,255,0.4)' : '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
            {loading ? 'جاري الحفظ...' : '✓ إنشاء الأتمتة'}
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}
