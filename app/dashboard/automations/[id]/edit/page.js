'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Save, X, Zap, MessageSquare, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

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

  const content = {
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
  }

  const t = content[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: automation }, { data: accountsData }] = await Promise.all([
        supabase.from('automations').select('*').eq('id', id).single(),
        supabase.from('connected_accounts').select('*').eq('user_id', user.id)
      ])

      if (!automation) { router.push('/dashboard/flows'); return }

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
    router.push('/dashboard/flows')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-cyan-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/flows" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t.backToAutomations}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.editAutomationTitle}</h1>
          <p className="text-gray-400">{t.editAutomationSubtitle}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-400">
            <X size={20} />
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-8"
        >

          {/* Section 1: Basic Info */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} /> {t.basicInfo}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.automationName}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.linkedAccount}</label>
                <select
                  value={form.account_id}
                  onChange={e => update('account_id', e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
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
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.postUrl}</label>
                <input
                  type="text"
                  value={form.post_url}
                  onChange={e => update('post_url', e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Section 2: Trigger */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} /> {t.triggerWord}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.triggerKeyword}</label>
              <input
                type="text"
                value={form.trigger_keyword}
                onChange={e => update('trigger_keyword', e.target.value)}
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">{t.triggerHint}</p>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Section 3: Responses */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageSquare size={16} /> {t.responses}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.commentReply}</label>
                <textarea
                  value={form.comment_reply}
                  onChange={e => update('comment_reply', e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-vertical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.dmMessage}</label>
                <textarea
                  value={form.dm_message}
                  onChange={e => update('dm_message', e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-vertical"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
              {saving ? t.saving : t.saveBtn}
            </motion.button>

            <Link
              href="/dashboard/flows"
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X size={20} />
              {t.cancelBtn}
            </Link>
          </div>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}