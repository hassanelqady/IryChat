'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  CreditCard, Zap, Crown, Building2, ArrowLeft, ArrowRight,
  CheckCircle2, Users, Radio, Repeat,
  Shield, ExternalLink, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react'

// ─── Plan Config ────────────────────────────────────────────
const PLANS = {
  free: {
    id: 'free',
    icon: Zap,
    color: 'from-gray-600 to-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    textColor: 'text-gray-400',
    price: { monthly: 0, yearly: 0 },
    limits: {
      accounts: 1,
      automations: 3,
      subscribers: 500,
      broadcasts: 0,
      sequences: 0,
    }
  },
  pro: {
    id: 'pro',
    icon: Crown,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    price: { monthly: 19, yearly: 15 },
    limits: {
      accounts: 5,
      automations: 30,
      subscribers: 5000,
      broadcasts: 10,
      sequences: 10,
    }
  },
  business: {
    id: 'business',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    price: { monthly: 49, yearly: 39 },
    limits: {
      accounts: 999,
      automations: 999,
      subscribers: 50000,
      broadcasts: 999,
      sequences: 999,
    }
  }
}

// ─── Usage Bar ──────────────────────────────────────────────
function UsageBar({ label, used, limit, icon: Icon, color = 'bg-cyan-500' }) {
  const pct = limit === 999 ? 10 : Math.min((used / limit) * 100, 100)
  const isUnlimited = limit === 999
  const isWarning = pct >= 80 && !isUnlimited
  const isDanger = pct >= 95 && !isUnlimited

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-gray-400" />
          <span className="text-gray-300 text-sm font-medium">{label}</span>
        </div>
        <span className={`text-xs font-bold ${isDanger ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-gray-400'}`}>
          {isUnlimited ? '∞' : `${used} / ${limit.toLocaleString()}`}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? '10%' : `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${isDanger ? 'bg-red-500' : isWarning ? 'bg-orange-500' : color}`}
        />
      </div>
      {isWarning && !isDanger && (
        <p className="text-orange-400 text-xs mt-2 flex items-center gap-1">
          <AlertCircle size={11} /> اقتربت من الحد المسموح
        </p>
      )}
      {isDanger && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
          <AlertCircle size={11} /> وصلت للحد الأقصى تقريباً
        </p>
      )}
    </div>
  )
}

// ─── Plan Card (upgrade option) ─────────────────────────────
function PlanOption({ plan, planKey, currentPlan, lang, onSelect }) {
  const Icon = plan.icon
  const isCurrent = currentPlan === planKey
  const content = {
    ar: { current: 'خطتك الحالية', upgrade: 'الترقية', downgrade: 'التخفيض', perMonth: '/شهر' },
    en: { current: 'Current Plan', upgrade: 'Upgrade', downgrade: 'Downgrade', perMonth: '/mo' },
  }[lang]

  const planNames = { ar: { free: 'مجاني', pro: 'احترافي', business: 'الأعمال' }, en: { free: 'Free', pro: 'Pro', business: 'Business' } }

  return (
    <div className={`relative bg-white/5 border ${plan.borderColor} rounded-2xl p-5 transition-all ${isCurrent ? 'ring-1 ring-cyan-500/50' : 'hover:border-white/20'}`}>
      {isCurrent && (
        <div className="absolute -top-2.5 start-4 px-3 py-0.5 bg-cyan-500 text-black text-xs font-bold rounded-full">
          {content.current}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold">{planNames[lang][planKey]}</p>
            <p className={`text-sm font-bold ${plan.textColor}`}>
              {plan.price.monthly === 0 ? (lang === 'ar' ? 'مجاناً' : 'Free') : `$${plan.price.monthly}${content.perMonth}`}
            </p>
          </div>
        </div>
        {!isCurrent && (
          <button
            onClick={() => onSelect(planKey)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              planKey === 'free'
                ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                : `bg-gradient-to-r ${plan.color} text-white shadow-lg`
            }`}
          >
            {planKey === 'free' ? content.downgrade : content.upgrade}
          </button>
        )}
        {isCurrent && <CheckCircle2 size={20} className="text-cyan-400" />}
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function BillingPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [usage, setUsage] = useState({
    accounts: 0,
    automations: 0,
    subscribers: 0,
    broadcasts: 0,
    sequences: 0,
  })
  const [nextRenewal] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d
  })

  const t = {
    ar: {
      title: 'الفوترة والاشتراك',
      desc: 'إدارة خطتك واستخدامك الحالي',
      currentPlan: 'خطتك الحالية',
      usage: 'الاستخدام الحالي',
      changePlan: 'تغيير الخطة',
      accounts: 'الحسابات المتصلة',
      automations: 'الأتمتات',
      subscribers: 'المشتركون',
      broadcasts: 'رسائل البث',
      sequences: 'التسلسلات',
      nextRenewal: 'التجديد القادم',
      freePlan: 'أنت على الخطة المجانية',
      freeDesc: 'قم بالترقية للوصول لميزات متقدمة',
      upgradeNow: 'ترقية الآن',
      viewPricing: 'عرض خطط الأسعار',
      cancelAnytime: 'إلغاء في أي وقت',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      planFeatures: 'مميزات خطتك',
      renewsOn: 'يتجدد في',
      monthly: 'شهري',
      billingHistory: 'سجل الفوترة',
      noBillingHistory: 'لا يوجد سجل فوترة بعد',
      contactSupport: 'تواصل مع الدعم',
    },
    en: {
      title: 'Billing & Subscription',
      desc: 'Manage your plan and current usage',
      currentPlan: 'Current Plan',
      usage: 'Current Usage',
      changePlan: 'Change Plan',
      accounts: 'Connected Accounts',
      automations: 'Automations',
      subscribers: 'Subscribers',
      broadcasts: 'Broadcasts',
      sequences: 'Sequences',
      nextRenewal: 'Next Renewal',
      freePlan: "You're on the Free Plan",
      freeDesc: 'Upgrade to access advanced features',
      upgradeNow: 'Upgrade Now',
      viewPricing: 'View Pricing',
      cancelAnytime: 'Cancel anytime',
      back: 'Back',
      loading: 'Loading...',
      planFeatures: 'Plan Features',
      renewsOn: 'Renews on',
      monthly: 'Monthly',
      billingHistory: 'Billing History',
      noBillingHistory: 'No billing history yet',
      contactSupport: 'Contact Support',
    }
  }[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)

    const [
      { count: accountsCount },
      { count: automationsCount },
      { count: subscribersCount },
      { count: broadcastsCount },
      { count: sequencesCount },
    ] = await Promise.all([
      supabase.from('connected_accounts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('broadcasts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('sequences').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    setUsage({
      accounts: accountsCount || 0,
      automations: automationsCount || 0,
      subscribers: subscribersCount || 0,
      broadcasts: broadcastsCount || 0,
      sequences: sequencesCount || 0,
    })

    const plan = user.user_metadata?.plan || 'free'
    setCurrentPlan(plan)
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleSelectPlan = (planKey) => {
    router.push(`/pricing?plan=${planKey}`)
  }

  const plan = PLANS[currentPlan]
  const PlanIcon = plan.icon

  const planNames = {
    ar: { free: 'مجاني', pro: 'احترافي', business: 'الأعمال' },
    en: { free: 'Free', pro: 'Pro', business: 'Business' }
  }

  const usageItems = [
    { key: 'accounts',    label: t.accounts,    icon: Users,   color: 'bg-blue-500' },
    { key: 'automations', label: t.automations, icon: Zap,     color: 'bg-cyan-500' },
    { key: 'subscribers', label: t.subscribers, icon: Users,   color: 'bg-green-500' },
    { key: 'broadcasts',  label: t.broadcasts,  icon: Radio,   color: 'bg-orange-500' },
    { key: 'sequences',   label: t.sequences,   icon: Repeat,  color: 'bg-purple-500' },
  ]

  const planFeatures = {
    ar: {
      free:     ['3 أتمتات', '500 مشترك', 'تحليلات أساسية', 'دعم المجتمع'],
      pro:      ['30 أتمتة', '5,000 مشترك', '10 بث/شهر', '10 تسلسلات', 'صندوق الوارد', 'تحليلات متقدمة', 'دعم أولوية'],
      business: ['أتمتات غير محدودة', '50,000 مشترك', 'بث غير محدود', 'تسلسلات غير محدودة', 'Webhooks', 'دعم مخصص 24/7'],
    },
    en: {
      free:     ['3 automations', '500 subscribers', 'Basic analytics', 'Community support'],
      pro:      ['30 automations', '5,000 subscribers', '10 broadcasts/mo', '10 sequences', 'Inbox', 'Advanced analytics', 'Priority support'],
      business: ['Unlimited automations', '50,000 subscribers', 'Unlimited broadcasts', 'Unlimited sequences', 'Webhooks', 'Dedicated 24/7 support'],
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <CreditCard className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{t.title}</h1>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
          <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t.back}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Current Plan Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`bg-white/5 border ${plan.borderColor} rounded-3xl p-6`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{t.currentPlan}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <PlanIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{planNames[lang][currentPlan]}</h2>
                      <p className={`text-sm font-bold ${plan.textColor}`}>
                        {plan.price.monthly === 0
                          ? (lang === 'ar' ? 'مجاناً' : 'Free')
                          : `$${plan.price.monthly}/${lang === 'ar' ? 'شهر' : 'mo'}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                {currentPlan !== 'free' && (
                  <div className="text-end">
                    <p className="text-gray-500 text-xs">{t.renewsOn}</p>
                    <p className="text-white text-sm font-medium">
                      {nextRenewal.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{t.monthly}</p>
                  </div>
                )}
              </div>

              {/* Plan features */}
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{t.planFeatures}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planFeatures[lang][currentPlan].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className={plan.textColor} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {currentPlan === 'free' && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.freePlan}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t.freeDesc}</p>
                  </div>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm transition-all flex-shrink-0 whitespace-nowrap"
                  >
                    <Sparkles size={14} />
                    {t.upgradeNow}
                  </Link>
                </div>
              )}

              {currentPlan !== 'free' && (
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Shield size={12} />
                  {t.cancelAnytime}
                </div>
              )}
            </motion.div>

            {/* Usage */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">{t.usage}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usageItems.map(item => (
                  <UsageBar
                    key={item.key}
                    label={item.label}
                    used={usage[item.key]}
                    limit={plan.limits[item.key]}
                    icon={item.icon}
                    color={item.color}
                  />
                ))}
              </div>
            </motion.div>

            {/* Billing History */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">{t.billingHistory}</p>
              {currentPlan === 'free' ? (
                <div className="text-center py-8">
                  <CreditCard size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{t.noBillingHistory}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {planNames[lang][currentPlan]} — {lang === 'ar' ? 'شهري' : 'Monthly'}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-sm">${plan.price.monthly}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right Column */}
          <div className="space-y-6">

            {/* Change Plan */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{t.changePlan}</p>
              <div className="space-y-3">
                {Object.entries(PLANS).map(([key, planData]) => (
                  <PlanOption
                    key={key}
                    plan={planData}
                    planKey={key}
                    currentPlan={currentPlan}
                    lang={lang}
                    onSelect={handleSelectPlan}
                  />
                ))}
              </div>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 mt-4 text-gray-500 hover:text-white text-xs transition-colors"
              >
                <ExternalLink size={12} />
                {t.viewPricing}
              </Link>
            </motion.div>

            {/* Support */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
                {lang === 'ar' ? 'تحتاج مساعدة؟' : 'Need Help?'}
              </p>
              <Link
                href="/contact"
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-cyan-400" />
                  {t.contactSupport}
                </div>
                <ChevronRight size={15} className={`text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  )
}