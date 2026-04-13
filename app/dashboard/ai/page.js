'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Bot, Zap, Save, ToggleLeft, ToggleRight,
  AlertCircle, CheckCircle2, Sparkles, MessageSquare,
  Settings, ChevronDown, Info, Lock
} from 'lucide-react'

const TONES = {
  ar: [
    { value: 'friendly',     label: 'ودي ومرح' },
    { value: 'professional', label: 'احترافي ورسمي' },
    { value: 'sales',        label: 'مبيعات ومقنع' },
    { value: 'supportive',   label: 'داعم ومتفهم' },
  ],
  en: [
    { value: 'friendly',     label: 'Friendly & Fun' },
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'sales',        label: 'Sales & Persuasive' },
    { value: 'supportive',   label: 'Supportive & Empathetic' },
  ]
}

const PROMPT_TEMPLATES = {
  ar: [
    {
      label: 'متجر إلكتروني',
      prompt: `أنت مساعد مبيعات ذكي لمتجر إلكتروني. مهمتك:
- الرد على استفسارات العملاء بشكل ودي وسريع
- مساعدة العملاء في اختيار المنتج المناسب
- الإجابة على أسئلة التوصيل والدفع
- تشجيع العملاء على إتمام الشراء
كن مختصراً وواضحاً في ردودك.`
    },
    {
      label: 'كوتش / مدرب',
      prompt: `أنت مساعد ذكي لكوتش متخصص. مهمتك:
- الترحيب بالعملاء المحتملين بشكل حار
- التعرف على احتياجاتهم وأهدافهم
- شرح خدمات الكوتش وكيف يمكنها مساعدتهم
- تشجيعهم على حجز جلسة استكشافية`
    },
    {
      label: 'خدمات عامة',
      prompt: `أنت مساعد ذكي لشركة خدمات. مهمتك:
- الرد على استفسارات العملاء بسرعة واحترافية
- جمع معلومات العميل (الاسم، الاحتياج)
- شرح الخدمات المتاحة
- تحويل العميل المهتم لفريق المبيعات`
    },
  ],
  en: [
    {
      label: 'E-commerce Store',
      prompt: `You are a smart sales assistant for an online store. Your tasks:
- Respond to customer inquiries in a friendly and quick manner
- Help customers choose the right product
- Answer questions about shipping and payment
- Encourage customers to complete their purchase
Be concise and clear in your responses.`
    },
    {
      label: 'Coach / Trainer',
      prompt: `You are a smart assistant for a specialized coach. Your tasks:
- Welcome potential clients warmly
- Understand their needs and goals
- Explain the coaching services and how they can help
- Encourage them to book a discovery session`
    },
    {
      label: 'General Services',
      prompt: `You are a smart assistant for a service company. Your tasks:
- Respond to customer inquiries quickly and professionally
- Collect customer information (name, need)
- Explain available services
- Transfer interested customers to the sales team`
    },
  ]
}

export default function AIRepliesPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [accounts, setAccounts] = useState([])
  const [configs, setConfigs] = useState({})
  const [selectedAccount, setSelectedAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userPlan, setUserPlan] = useState('free')

  const [form, setForm] = useState({
    is_active: false,
    ai_name: '',
    system_prompt: '',
    fallback_message: '',
    language: lang,
    tone: 'friendly',
  })

  const t = {
    ar: {
      title: 'ردود الذكاء الاصطناعي',
      desc: 'دع الذكاء الاصطناعي يرد على رسائل جمهورك بشكل ذكي وتلقائي',
      selectAccount: 'اختر الحساب',
      noAccounts: 'لا توجد حسابات مرتبطة',
      aiName: 'اسم المساعد',
      aiNamePlaceholder: 'مثال: مساعد المتجر',
      systemPrompt: 'تعليمات الذكاء الاصطناعي',
      systemPromptHint: 'اشرح للذكاء الاصطناعي من هو وكيف يرد على العملاء',
      systemPromptPlaceholder: 'اكتب تعليمات تفصيلية...',
      templates: 'قوالب جاهزة',
      tone: 'أسلوب الرد',
      fallback: 'رسالة الاحتياط',
      fallbackHint: 'الرسالة اللي تُرسل لو الذكاء الاصطناعي مش عارف يرد',
      fallbackPlaceholder: 'مثال: شكراً على تواصلك! سيتواصل معك فريقنا قريباً.',
      language: 'لغة الرد',
      arabic: 'العربية',
      english: 'الإنجليزية',
      both: 'عربي + إنجليزي',
      activate: 'تفعيل AI',
      deactivate: 'إيقاف AI',
      save: 'حفظ الإعدادات',
      saving: 'جاري الحفظ...',
      savedMsg: 'تم الحفظ بنجاح!',
      loading: 'جاري التحميل...',
      useTemplate: 'استخدام',
      proRequired: 'هذه الميزة متاحة في خطة الأعمال فقط',
      upgrade: 'ترقية الآن',
      howItWorks: 'كيف يعمل؟',
      tip1: 'الذكاء الاصطناعي يقرأ رسالة المستخدم ويرد عليها بناءً على تعليماتك',
      tip2: 'لو مش عارف يرد، بيبعت رسالة الاحتياط تلقائياً',
      tip3: 'يمكنك تفعيله أو إيقافه في أي وقت لكل حساب',
      accountLabel: 'الحساب',
      stats: 'إحصائيات',
      totalReplies: 'ردود AI',
      active: 'نشط',
      inactive: 'متوقف',
    },
    en: {
      title: 'AI Replies',
      desc: 'Let AI respond to your audience\'s messages intelligently and automatically',
      selectAccount: 'Select Account',
      noAccounts: 'No connected accounts',
      aiName: 'Assistant Name',
      aiNamePlaceholder: 'e.g. Store Assistant',
      systemPrompt: 'AI Instructions',
      systemPromptHint: 'Tell the AI who it is and how to respond to customers',
      systemPromptPlaceholder: 'Write detailed instructions...',
      templates: 'Ready Templates',
      tone: 'Response Tone',
      fallback: 'Fallback Message',
      fallbackHint: 'Message sent when AI doesn\'t know how to respond',
      fallbackPlaceholder: 'e.g. Thank you for reaching out! Our team will contact you shortly.',
      language: 'Response Language',
      arabic: 'Arabic',
      english: 'English',
      both: 'Arabic + English',
      activate: 'Activate AI',
      deactivate: 'Deactivate AI',
      save: 'Save Settings',
      saving: 'Saving...',
      savedMsg: 'Saved successfully!',
      loading: 'Loading...',
      useTemplate: 'Use',
      proRequired: 'This feature is available on the Business plan only',
      upgrade: 'Upgrade Now',
      howItWorks: 'How it works?',
      tip1: 'AI reads the user\'s message and responds based on your instructions',
      tip2: 'If it can\'t respond, it automatically sends the fallback message',
      tip3: 'You can activate or deactivate it anytime per account',
      accountLabel: 'Account',
      stats: 'Statistics',
      totalReplies: 'AI Replies',
      active: 'Active',
      inactive: 'Inactive',
    }
  }[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const plan = user.user_metadata?.plan || 'free'
    setUserPlan(plan)

    const [{ data: accs }, { data: aiConfs }] = await Promise.all([
      supabase.from('connected_accounts').select('*').eq('user_id', user.id).eq('is_active', true),
      supabase.from('ai_configs').select('*').eq('user_id', user.id),
    ])

    const accsList = accs || []
    setAccounts(accsList)

    const confsMap = {}
    for (const conf of aiConfs || []) {
      confsMap[conf.account_id] = conf
    }
    setConfigs(confsMap)

    if (accsList.length > 0) {
      const firstId = accsList[0].id
      setSelectedAccount(firstId)
      if (confsMap[firstId]) {
        setForm({
          is_active: confsMap[firstId].is_active,
          ai_name: confsMap[firstId].ai_name || '',
          system_prompt: confsMap[firstId].system_prompt || '',
          fallback_message: confsMap[firstId].fallback_message || '',
          language: confsMap[firstId].language || lang,
          tone: confsMap[firstId].tone || 'friendly',
        })
      }
    }

    setLoading(false)
  }, [router, lang])

  useEffect(() => { load() }, [load])

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId)
    const conf = configs[accountId]
    if (conf) {
      setForm({
        is_active: conf.is_active,
        ai_name: conf.ai_name || '',
        system_prompt: conf.system_prompt || '',
        fallback_message: conf.fallback_message || '',
        language: conf.language || lang,
        tone: conf.tone || 'friendly',
      })
    } else {
      setForm({ is_active: false, ai_name: '', system_prompt: '', fallback_message: '', language: lang, tone: 'friendly' })
    }
  }

  const handleSave = async () => {
    if (!selectedAccount) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('ai_configs').upsert({
      user_id: user.id,
      account_id: selectedAccount,
      is_active: form.is_active,
      ai_name: form.ai_name || 'Assistant',
      system_prompt: form.system_prompt,
      fallback_message: form.fallback_message,
      language: form.language,
      tone: form.tone,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,account_id' })

    setConfigs(prev => ({ ...prev, [selectedAccount]: { ...form, account_id: selectedAccount } }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const isPro = userPlan === 'business' || userPlan === 'pro'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Bot className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <main className="p-6 md:p-8 max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{t.title}</h1>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
        </div>
      </motion.div>

      {/* Pro Gate */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">{t.proRequired}</p>
              <p className="text-gray-400 text-xs mt-0.5">{lang === 'ar' ? 'خطة الأعمال $49/شهر' : 'Business Plan $49/mo'}</p>
            </div>
          </div>
          <a href="/pricing"
            className="flex items-center gap-2 px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-full text-sm transition-all flex-shrink-0"
          >
            <Sparkles size={14} />
            {t.upgrade}
          </a>
        </motion.div>
      )}

      <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none' : ''}`}>

        {/* Account Selector */}
        {accounts.length === 0 ? (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-6 text-orange-400 text-sm">
            {t.noAccounts}
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.accountLabel}</label>
            <div className="flex gap-2 flex-wrap">
              {accounts.map(acc => {
                const conf = configs[acc.id]
                const isSelected = selectedAccount === acc.id
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleAccountChange(acc.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span>{acc.account_type === 'instagram' ? '📸' : '📘'}</span>
                    <span>{acc.account_name}</span>
                    {conf?.is_active && (
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {selectedAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Config */}
            <div className="lg:col-span-2 space-y-5">

              {/* Toggle + Name */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white font-semibold">{form.is_active ? t.active : t.inactive}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {form.is_active
                        ? (lang === 'ar' ? 'الذكاء الاصطناعي يرد تلقائياً' : 'AI is responding automatically')
                        : (lang === 'ar' ? 'الذكاء الاصطناعي متوقف' : 'AI is paused')
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className={`transition-colors ${form.is_active ? 'text-green-400' : 'text-gray-600'}`}
                  >
                    {form.is_active
                      ? <ToggleRight size={40} />
                      : <ToggleLeft size={40} />
                    }
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.aiName}</label>
                  <input
                    value={form.ai_name}
                    onChange={e => setForm(f => ({ ...f, ai_name: e.target.value }))}
                    placeholder={t.aiNamePlaceholder}
                    className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>

              {/* Tone + Language */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.tone}</label>
                    <select
                      value={form.tone}
                      onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                      className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {TONES[lang].map(tone => (
                        <option key={tone.value} value={tone.value}>{tone.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.language}</label>
                    <select
                      value={form.language}
                      onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                      className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="ar">{t.arabic}</option>
                      <option value="en">{t.english}</option>
                      <option value="both">{t.both}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">{t.systemPrompt}</label>
                  <span className="text-gray-600 text-xs">{form.system_prompt.length}/2000</span>
                </div>
                <p className="text-gray-600 text-xs mb-3">{t.systemPromptHint}</p>
                <textarea
                  value={form.system_prompt}
                  onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value.slice(0, 2000) }))}
                  placeholder={t.systemPromptPlaceholder}
                  rows={8}
                  className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none font-mono leading-relaxed"
                />
              </div>

              {/* Fallback */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-1">{t.fallback}</label>
                <p className="text-gray-600 text-xs mb-3">{t.fallbackHint}</p>
                <textarea
                  value={form.fallback_message}
                  onChange={e => setForm(f => ({ ...f, fallback_message: e.target.value }))}
                  placeholder={t.fallbackPlaceholder}
                  rows={3}
                  className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none"
                />
              </div>

              {/* Save */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                } disabled:opacity-60`}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : saved ? (
                  <><CheckCircle2 size={18} />{t.savedMsg}</>
                ) : (
                  <><Save size={18} />{t.save}</>
                )}
              </motion.button>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Templates */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{t.templates}</p>
                <div className="space-y-2">
                  {PROMPT_TEMPLATES[lang].map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => setForm(f => ({ ...f, system_prompt: tpl.prompt }))}
                      className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all group"
                    >
                      <span className="text-gray-300 group-hover:text-white">{tpl.label}</span>
                      <span className="text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">{t.useTemplate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-5">
                <p className="text-purple-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <Info size={14} />
                  {t.howItWorks}
                </p>
                <ul className="space-y-2">
                  {[t.tip1, t.tip2, t.tip3].map((tip, i) => (
                    <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                      <Sparkles size={10} className="text-purple-400 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status card */}
              {configs[selectedAccount] && (
                <div className={`border rounded-2xl p-4 ${
                  configs[selectedAccount].is_active
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${configs[selectedAccount].is_active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                    <span className={`text-sm font-medium ${configs[selectedAccount].is_active ? 'text-green-400' : 'text-gray-500'}`}>
                      {configs[selectedAccount].is_active ? t.active : t.inactive}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}