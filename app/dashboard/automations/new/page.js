'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Zap, MessageSquare, CheckCircle, AlertCircle, Plus, X } from 'lucide-react'

export default function NewAutomationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [form, setForm] = useState({
    name: '',
    account_id: '',
    post_url: '',
  })

  const [keywords, setKeywords] = useState([])
  const [keywordInput, setKeywordInput] = useState('')
  const [commentReplies, setCommentReplies] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [dmMessages, setDmMessages] = useState([])
  const [dmInput, setDmInput] = useState('')

  const content = {
    en: {
      title: "Create New Automation",
      subtitle: "Configure how IryChat responds to your audience.",
      basicInfo: "Basic Information",
      automationName: "Automation Name",
      namePlaceholder: "e.g. Sales Auto-Reply",
      linkedAccount: "Linked Account",
      selectAccount: "Select an account",
      noAccounts: "No linked accounts found.",
      linkFirst: "Link an account first.",
      postUrl: "Post URL (Optional)",
      postUrlPlaceholder: "https://instagram.com/p/...",
      postUrlHint: "Leave empty to monitor all posts.",
      triggerSection: "Trigger Keywords",
      triggerHint: "Add multiple keywords — automation triggers if any one matches.",
      keywordPlaceholder: "e.g. price",
      addKeyword: "Add",
      responsesSection: "Responses",
      commentReplyLabel: "Comment Replies",
      commentReplyHint: "Add multiple replies — one will be picked randomly.",
      commentPlaceholder: "Write a comment reply...",
      dmLabel: "DM Messages",
      dmHint: "Add multiple DMs — one will be picked randomly.",
      dmPlaceholder: "Write a DM message...",
      addReply: "Add",
      fillRequired: "Please fill in all required fields.",
      needKeyword: "Add at least one trigger keyword.",
      needReply: "Add at least one reply (comment or DM).",
      genericError: "An error occurred. Please try again.",
      saving: "Creating...",
      createBtn: "Create Automation",
      back: "Back to Automations",
      loading: "Loading...",
    },
    ar: {
      title: "إنشاء أتمتة جديدة",
      subtitle: "قم بضبط كيف يرد IryChat على جمهورك.",
      basicInfo: "المعلومات الأساسية",
      automationName: "اسم الأتمتة",
      namePlaceholder: "مثال: ردود المبيعات الآلية",
      linkedAccount: "الحساب المرتبط",
      selectAccount: "اختر حساباً",
      noAccounts: "لا توجد حسابات مرتبطة.",
      linkFirst: "قم بربط حساب أولاً.",
      postUrl: "رابط المنشور (اختياري)",
      postUrlPlaceholder: "https://instagram.com/p/...",
      postUrlHint: "اتركه فارغاً لمراقبة كل المنشورات.",
      triggerSection: "كلمات التفعيل",
      triggerHint: "أضف كلمات متعددة — الأتمتة تشتغل لو أي كلمة منهم موجودة في التعليق.",
      keywordPlaceholder: "مثال: سعر",
      addKeyword: "إضافة",
      responsesSection: "الردود",
      commentReplyLabel: "ردود التعليقات",
      commentReplyHint: "أضف ردود متعددة — سيتم اختيار رد عشوائي في كل مرة.",
      commentPlaceholder: "اكتب رداً على التعليق...",
      dmLabel: "رسائل DM",
      dmHint: "أضف رسائل متعددة — سيتم اختيار رسالة عشوائية في كل مرة.",
      dmPlaceholder: "اكتب رسالة خاصة...",
      addReply: "إضافة",
      fillRequired: "يرجى ملء جميع الحقول المطلوبة.",
      needKeyword: "أضف كلمة تفعيل واحدة على الأقل.",
      needReply: "أضف رداً واحداً على الأقل (تعليق أو رسالة).",
      genericError: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      saving: "جاري الإنشاء...",
      createBtn: "إنشاء الأتمتة",
      back: "العودة للأتمتات",
      loading: "جاري التحميل...",
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

  const addKeyword = () => {
    const kw = keywordInput.trim()
    if (!kw || keywords.includes(kw)) return
    setKeywords([...keywords, kw])
    setKeywordInput('')
    setStep(2)
  }
  const removeKeyword = (kw) => setKeywords(keywords.filter(k => k !== kw))

  const addCommentReply = () => {
    const r = commentInput.trim()
    if (!r) return
    setCommentReplies([...commentReplies, r])
    setCommentInput('')
    setStep(3)
  }
  const removeCommentReply = (i) => setCommentReplies(commentReplies.filter((_, idx) => idx !== i))

  const addDm = () => {
    const d = dmInput.trim()
    if (!d) return
    setDmMessages([...dmMessages, d])
    setDmInput('')
    setStep(3)
  }
  const removeDm = (i) => setDmMessages(dmMessages.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    if (!form.name || !form.account_id) { setError(t.fillRequired); return }
    if (keywords.length === 0) { setError(t.needKeyword); return }
    if (commentReplies.length === 0 && dmMessages.length === 0) { setError(t.needReply); return }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('automations').insert({
      user_id: user.id,
      account_id: form.account_id,
      name: form.name,
      post_url: form.post_url || null,
      trigger_keywords: keywords,
      comment_replies: commentReplies,
      dm_messages: dmMessages,
      trigger_keyword: keywords[0],
      comment_reply: commentReplies[0] || null,
      dm_message: dmMessages[0] || null,
      is_active: true,
    })

    if (error) { setError(t.genericError); setLoading(false); return }
    router.push('/dashboard/flows')
  }

  const TagInput = ({ items, onRemove, input, setInput, onAdd, placeholder, hint }) => (
    <div>
      <p className="text-gray-500 text-xs mb-3">{hint}</p>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium"
              >
                {item}
                <button onClick={() => onRemove(item)} className="text-cyan-600 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          className="flex-1 p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-bold transition-all flex items-center gap-1"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )

  const TextAreaInput = ({ items, onRemove, input, setInput, onAdd, placeholder, hint }) => (
    <div>
      <p className="text-gray-500 text-xs mb-3">{hint}</p>
      {items.length > 0 && (
        <div className="space-y-2 mb-3">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <span className="text-gray-300 text-sm flex-1 leading-relaxed">{item}</span>
                <button onClick={() => onRemove(i)} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <textarea
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          className="flex-1 p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none text-sm"
        />
        <button
          onClick={onAdd}
          className="px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-bold transition-all flex items-center gap-1 flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )

  return (
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/flows" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t.back}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Progress */}
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">

          {/* Section 1: Basic Info */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} /> {t.basicInfo}
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.automationName}</label>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setStep(1) }}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.linkedAccount}</label>
                {accounts.length === 0 ? (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm">
                    {t.noAccounts}{' '}
                    <Link href="/dashboard/accounts" className="text-cyan-400 hover:underline font-bold">{t.linkFirst}</Link>
                  </div>
                ) : (
                  <select
                    value={form.account_id}
                    onChange={e => { setForm({ ...form, account_id: e.target.value }); setStep(2) }}
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="">{t.selectAccount}</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name} ({acc.account_type === 'instagram' ? 'Instagram' : 'Facebook'})
                      </option>
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
                  onChange={e => setForm({ ...form, post_url: e.target.value })}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <p className="text-gray-500 text-xs mt-2">{t.postUrlHint}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Section 2: Keywords */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={16} /> {t.triggerSection}
            </div>
            <TagInput
              items={keywords}
              onRemove={removeKeyword}
              input={keywordInput}
              setInput={setKeywordInput}
              onAdd={addKeyword}
              placeholder={t.keywordPlaceholder}
              hint={t.triggerHint}
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* Section 3: Responses */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageSquare size={16} /> {t.responsesSection}
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t.commentReplyLabel}</label>
                <TextAreaInput
                  items={commentReplies}
                  onRemove={removeCommentReply}
                  input={commentInput}
                  setInput={setCommentInput}
                  onAdd={addCommentReply}
                  placeholder={t.commentPlaceholder}
                  hint={t.commentReplyHint}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t.dmLabel}</label>
                <TextAreaInput
                  items={dmMessages}
                  onRemove={removeDm}
                  input={dmInput}
                  setInput={setDmInput}
                  onAdd={addDm}
                  placeholder={t.dmPlaceholder}
                  hint={t.dmHint}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? t.saving : <><CheckCircle size={20} />{t.createBtn}</>}
          </motion.button>

        </motion.div>
      </main>
  )
}