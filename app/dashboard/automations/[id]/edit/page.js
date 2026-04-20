'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Save, X, Zap, MessageSquare, Loader2 } from 'lucide-react'

export default function EditAutomationPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    account_id: '',
    post_url: '',
    trigger_keyword: '',
    comment_reply: '',
    dm_message: '',
  })
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const t = {
    en: {
      editAutomationTitle: "Edit Automation",
      editAutomationSubtitle: "Update your automation settings and responses.",
      basicInfo: "Basic Information",
      automationName: "Automation Name",
      linkedAccount: "Linked Account",
      selectAccount: "Select an account",
      postUrl: "Post URL",
      triggerWord: "Trigger Word",
      triggerKeyword: "Trigger Keyword",
      triggerHint: "This word triggers the automation.",
      responses: "Automation Responses",
      commentReply: "Comment Reply",
      dmMessage: "Direct Message",
      fillRequired: "Please fill in all required fields.",
      addReply: "Please add at least one reply.",
      genericError: "An error occurred while saving.",
      saving: "Saving...",
      saveBtn: "Save Changes",
      cancelBtn: "Cancel",
      backToAutomations: "Back to Automations",
      loading: "Loading...",
    },
    ar: {
      editAutomationTitle: "تعديل الأتمتة",
      editAutomationSubtitle: "قم بتحديث إعدادات وردود الأتمتة.",
      basicInfo: "المعلومات الأساسية",
      automationName: "اسم الأتمتة",
      linkedAccount: "الحساب المرتبط",
      selectAccount: "اختر حساباً",
      postUrl: "رابط المنشور",
      triggerWord: "كلمة التفعيل",
      triggerKeyword: "الكلمة المفتاحية",
      triggerHint: "هذه الكلمة تقوم بتشغيل الأتمتة.",
      responses: "ردود الأتمتة",
      commentReply: "رد على التعليق",
      dmMessage: "رسالة خاصة",
      fillRequired: "يرجى ملء جميع الحقول المطلوبة.",
      addReply: "يرجى إضافة رد واحد على الأقل.",
      genericError: "حدث خطأ أثناء الحفظ.",
      saving: "جاري الحفظ...",
      saveBtn: "حفظ التغييرات",
      cancelBtn: "إلغاء",
      backToAutomations: "العودة للأتمتات",
      loading: "جاري التحميل...",
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: automation }, { data: accountsData }] = await Promise.all([
        supabase.from('automations').select('*').eq('id', id).single(),
        supabase.from('connected_accounts').select('*').eq('user_id', user.id)
      ])

      if (!automation) { router.push('/dashboard/automations'); return }

      setForm({
        name: automation.name || '',
        account_id: automation.account_id || '',
        post_url: automation.post_url || '',
        trigger_keyword: automation.trigger_keyword || '',
        comment_reply: automation.comment_reply || '',
        dm_message: automation.dm_message || '',
      })
      setAccounts(accountsData || [])
      setLoading(false)
    }
    init()
  }, [id])

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSave = async () => {
    if (!form.name || !form.trigger_keyword) { setError(t.fillRequired); return }
    if (!form.comment_reply && !form.dm_message) { setError(t.addReply); return }

    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('automations').update({
      name: form.name,
      account_id: form.account_id || null,
      post_url: form.post_url || null,
      trigger_keyword: form.trigger_keyword,
      comment_reply: form.comment_reply || null,
      dm_message: form.dm_message || null,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    if (error) { setError(t.genericError); setSaving(false); return }
    router.push('/dashboard/automations')
  }

  if (loading) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--db-bg)' }}
    >
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--db-primary)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--db-text-2)' }}>{t.loading}</span>
      </div>
    </div>
  )

  const inp = `w-full p-3.5 border rounded-xl text-sm focus:outline-none transition-all`

  return (
    <main
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ backgroundColor: 'var(--db-bg)' }}
    >

      {/* ── Header ── */}
      <div className="mb-8">
        <Link
          href="/dashboard/automations"
          className="inline-flex items-center gap-2 text-sm mb-5 transition-colors"
          style={{ color: 'var(--db-text-2)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--db-text-h)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--db-text-2)' }}
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {t.backToAutomations}
        </Link>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--db-text-h)' }}>
          {t.editAutomationTitle}
        </h1>
        <p className="text-sm" style={{ color: 'var(--db-text-2)' }}>
          {t.editAutomationSubtitle}
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center gap-3 text-sm"
          style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
        >
          <X size={16} /> {error}
        </div>
      )}

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-8"
        style={{
          backgroundColor: 'var(--db-surface)',
          border: '1px solid var(--db-border)',
          boxShadow: 'var(--db-shadow-md)',
        }}
      >

        {/* ── Section 1: Basic Info ── */}
        <div>
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: 'var(--db-primary)' }}
          >
            <Zap size={15} /> {t.basicInfo}
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
                {t.automationName}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className={inp}
                style={{
                  backgroundColor: 'var(--db-bg)',
                  borderColor: 'var(--db-border)',
                  color: 'var(--db-text-h)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
                {t.linkedAccount}
              </label>
              <select
                value={form.account_id}
                onChange={e => update('account_id', e.target.value)}
                className={inp}
                style={{
                  backgroundColor: 'var(--db-bg)',
                  borderColor: 'var(--db-border)',
                  color: 'var(--db-text-h)',
                }}
              >
                <option value="">{t.selectAccount}</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_name} ({acc.account_type === 'instagram' ? 'Instagram' : 'Facebook'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
                {t.postUrl}
              </label>
              <input
                type="text"
                value={form.post_url}
                onChange={e => update('post_url', e.target.value)}
                className={inp}
                style={{
                  backgroundColor: 'var(--db-bg)',
                  borderColor: 'var(--db-border)',
                  color: 'var(--db-text-h)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: 'var(--db-border)' }} />

        {/* ── Section 2: Trigger ── */}
        <div>
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: 'var(--db-primary)' }}
          >
            <Zap size={15} /> {t.triggerWord}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
              {t.triggerKeyword}
            </label>
            <input
              type="text"
              value={form.trigger_keyword}
              onChange={e => update('trigger_keyword', e.target.value)}
              className={inp}
              style={{
                backgroundColor: 'var(--db-bg)',
                borderColor: 'var(--db-border)',
                color: 'var(--db-text-h)',
              }}
            />
            <p className="text-xs mt-1.5" style={{ color: 'var(--db-text-3)' }}>
              {t.triggerHint}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: 'var(--db-border)' }} />

        {/* ── Section 3: Responses ── */}
        <div>
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: 'var(--db-primary)' }}
          >
            <MessageSquare size={15} /> {t.responses}
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
                {t.commentReply}
              </label>
              <textarea
                value={form.comment_reply}
                onChange={e => update('comment_reply', e.target.value)}
                rows={4}
                className={inp + ' resize-vertical'}
                style={{
                  backgroundColor: 'var(--db-bg)',
                  borderColor: 'var(--db-border)',
                  color: 'var(--db-text-h)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
                {t.dmMessage}
              </label>
              <textarea
                value={form.dm_message}
                onChange={e => update('dm_message', e.target.value)}
                rows={4}
                className={inp + ' resize-vertical'}
                style={{
                  backgroundColor: 'var(--db-bg)',
                  borderColor: 'var(--db-border)',
                  color: 'var(--db-text-h)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
            style={{ backgroundColor: 'var(--db-primary)' }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = 'var(--db-primary-h)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--db-primary)' }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            {saving ? t.saving : t.saveBtn}
          </motion.button>

          <Link
            href="/dashboard/automations"
            className="flex-1 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm border"
            style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'
              e.currentTarget.style.color = 'var(--db-text-h)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--db-text-2)'
            }}
          >
            <X size={16} /> {t.cancelBtn}
          </Link>
        </div>

      </motion.div>
    </main>
  )
}