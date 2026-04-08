'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, Zap, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

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
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      newAutomationTitle: "Create New Automation",
      newAutomationSubtitle: "Configure how IryChat responds to your audience.",
      basicInfo: "Basic Information",
      automationName: "Automation Name",
      automationNamePlaceholder: "e.g. Sales Auto-Reply",
      linkedAccount: "Linked Account",
      noLinkedAccounts: "No linked accounts found.",
      linkFirst: "Link an account first.",
      selectAccount: "Select an account",
      postUrl: "Post URL (Optional)",
      postUrlPlaceholder: "https://instagram.com/p/...",
      postUrlHint: "Link a specific post to monitor comments on it only.",
      triggerWord: "Trigger Word",
      triggerKeyword: "Trigger Keyword",
      triggerPlaceholder: "e.g. price, offer, link",
      triggerHint: "This word will trigger the automation in comments.",
      responses: "Automation Responses",
      commentReply: "Comment Reply",
      commentReplyPlaceholder: "Write the reply to be posted as a comment...",
      dmMessage: "Direct Message",
      dmPlaceholder: "Write the DM to be sent to the user...",
      fillRequired: "Please fill in all required fields.",
      addReply: "Please add at least one reply (Comment or DM).",
      genericError: "An error occurred while creating automation.",
      saving: "Creating...",
      createBtn: "Create Automation",
      backToAutomations: "Back to Automations",
    },
    ar: {
      newAutomationTitle: "إنشاء أتمتة جديدة",
      newAutomationSubtitle: "قم بضبط كيف يرد IryChat على جمهورك.",
      basicInfo: "المعلومات الأساسية",
      automationName: "اسم الأتمتة",
      automationNamePlaceholder: "مثال: ردود المبيعات الآلية",
      linkedAccount: "الحساب المرتبط",
      noLinkedAccounts: "لم يتم العثور على حسابات مرتبطة.",
      linkFirst: "قم بربط حساب أولاً.",
      selectAccount: "اختر حساباً",
      postUrl: "رابط المنشور (اختياري)",
      postUrlPlaceholder: "https://instagram.com/p/...",
      postUrlHint: "اربط منشوراً محدداً لمراقبة التعليقات عليه فقط.",
      triggerWord: "كلمة التفعيل",
      triggerKeyword: "الكلمة المفتاحية",
      triggerPlaceholder: "مثال: سعر، عرض، رابط",
      triggerHint: "هذه الكلمة ستقوم بتشغيل الأتمتة في التعليقات.",
      responses: "ردود الأتمتة",
      commentReply: "رد على التعليق",
      commentReplyPlaceholder: "اكتب الرد الذي سيتم نشره كتعليق...",
      dmMessage: "رسالة خاصة",
      dmPlaceholder: "اكتب الرسالة التي سيتم إرسالها للمستخدم...",
      fillRequired: "يرجى ملء جميع الحقول المطلوبة.",
      addReply: "يرجى إضافة رد واحد على الأقل (تعليق أو رسالة خاصة).",
      genericError: "حدث خطأ أثناء إنشاء الأتمتة.",
      saving: "جاري الإنشاء...",
      createBtn: "إنشاء الأتمتة",
      backToAutomations: "العودة للأتمتات",
    }
  }

  const t = content[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('connected_accounts').select('*').eq('user_id', user.id).eq('is_active', true)
      setAccounts(data || [])
    }
    init()
  }, [])

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.trigger_keyword) {
      setError(t.fillRequired)
      return
    }
    if (!form.comment_reply && !form.dm_message) {
      setError(t.addReply)
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
      setError(t.genericError)
      setLoading(false)
      return
    }

    router.push('/dashboard/flows')
  }

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/flows" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            {t.backToAutomations}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t.newAutomationTitle}
          </h1>
          <p className="text-gray-400">{t.newAutomationSubtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-8"
        >
          
          {/* Section 1: Basic Info */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} />
              {t.basicInfo}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.automationName}</label>
                <input 
                  type="text" 
                  placeholder={t.automationNamePlaceholder} 
                  value={form.name}
                  onChange={e => { update('name', e.target.value); setStep(1) }} 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  onFocus={(e) => { setStep(1) }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.linkedAccount}</label>
                {accounts.length === 0 ? (
                  <div className="mt-2 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm">
                    {t.noLinkedAccounts}{' '}
                    <Link href="/dashboard/accounts" className="text-cyan-400 hover:underline font-bold">{t.linkFirst}</Link>
                  </div>
                ) : (
                  <select 
                    value={form.account_id} 
                    onChange={e => { update('account_id', e.target.value); setStep(2) }} 
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="">{t.selectAccount}</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_type === 'instagram' ? 'Instagram' : 'Facebook'})</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.postUrl}</label>
                <input 
                  type="text" 
                  placeholder={t.postUrlPlaceholder} 
                  value={form.post_url}
                  onChange={e => update('post_url', e.target.value)} 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <p className="text-gray-500 text-xs mt-2">{t.postUrlHint}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full"></div>

          {/* Section 2: Trigger */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} />
              {t.triggerWord}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.triggerKeyword}</label>
              <input 
                type="text" 
                placeholder={t.triggerPlaceholder} 
                value={form.trigger_keyword}
                onChange={e => { update('trigger_keyword', e.target.value); setStep(2) }} 
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                onFocus={(e) => { setStep(2) }}
              />
              <p className="text-gray-500 text-xs mt-2">{t.triggerHint}</p>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full"></div>

          {/* Section 3: Responses */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageSquare size={16} />
              {t.responses}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.commentReply}</label>
                <textarea 
                  placeholder={t.commentReplyPlaceholder} 
                  value={form.comment_reply}
                  onChange={e => { update('comment_reply', e.target.value); setStep(3) }} 
                  rows={4}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-vertical"
                  onFocus={(e) => { setStep(3) }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.dmMessage}</label>
                <textarea 
                  placeholder={t.dmPlaceholder} 
                  value={form.dm_message}
                  onChange={e => { update('dm_message', e.target.value); setStep(3) }} 
                  rows={4}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-vertical"
                  onFocus={(e) => { setStep(3) }}
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>{t.saving}</span>
            ) : (
              <>
                <CheckCircle size={20} />
                {t.createBtn}
              </>
            )}
          </motion.button>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}