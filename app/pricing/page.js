'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import {
  Check, X, Zap, Crown, Building2, Sparkles,
  ChevronDown, ChevronUp, MessageSquare, Users,
  Radio, Repeat, BarChart2, Bot, Webhook, Shield
} from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────
const plans = {
  ar: [
    {
      id: 'free',
      name: 'مجاني',
      nameEn: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'ابدأ رحلتك مع IryChat بدون أي تكلفة',
      icon: Zap,
      color: 'from-gray-600 to-gray-400',
      border: 'border-white/10',
      badge: null,
      cta: 'ابدأ مجاناً',
      ctaHref: '/signup',
      ctaStyle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      limits: {
        accounts: '1 حساب',
        automations: '3 أتمتات',
        subscribers: '500 مشترك',
        broadcasts: false,
        sequences: false,
        ai: false,
        analytics: 'أساسية',
        inbox: false,
        webhooks: false,
        support: 'مجتمع',
      }
    },
    {
      id: 'pro',
      name: 'احترافي',
      nameEn: 'Pro',
      price: { monthly: 19, yearly: 15 },
      description: 'للمتاجر والكوتشز والإيجنسيز الصغيرة',
      icon: Crown,
      color: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/30',
      badge: 'الأكثر طلباً',
      cta: 'ابدأ تجربة مجانية',
      ctaHref: '/signup?plan=pro',
      ctaStyle: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25',
      limits: {
        accounts: '5 حسابات',
        automations: '30 أتمتة',
        subscribers: '5,000 مشترك',
        broadcasts: '10 بث/شهر',
        sequences: '10 تسلسلات',
        ai: false,
        analytics: 'متقدمة',
        inbox: true,
        webhooks: false,
        support: 'أولوية بالإيميل',
      }
    },
    {
      id: 'business',
      name: 'الأعمال',
      nameEn: 'Business',
      price: { monthly: 49, yearly: 39 },
      description: 'للشركات والإيجنسيز الكبيرة والمتاجر المتقدمة',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      border: 'border-purple-500/30',
      badge: null,
      cta: 'ابدأ الآن',
      ctaHref: '/signup?plan=business',
      ctaStyle: 'bg-purple-500 hover:bg-purple-400 text-white font-bold shadow-lg shadow-purple-500/25',
      limits: {
        accounts: 'غير محدود',
        automations: 'غير محدود',
        subscribers: '50,000 مشترك',
        broadcasts: 'غير محدود',
        sequences: 'غير محدود',
        ai: true,
        analytics: 'كاملة + تصدير',
        inbox: true,
        webhooks: true,
        support: 'دعم مخصص 24/7',
      }
    },
  ],
  en: [
    {
      id: 'free',
      name: 'Free',
      nameEn: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Start your journey with IryChat at no cost',
      icon: Zap,
      color: 'from-gray-600 to-gray-400',
      border: 'border-white/10',
      badge: null,
      cta: 'Get Started Free',
      ctaHref: '/signup',
      ctaStyle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      limits: {
        accounts: '1 account',
        automations: '3 automations',
        subscribers: '500 subscribers',
        broadcasts: false,
        sequences: false,
        ai: false,
        analytics: 'Basic',
        inbox: false,
        webhooks: false,
        support: 'Community',
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      nameEn: 'Pro',
      price: { monthly: 19, yearly: 15 },
      description: 'For stores, coaches, and small agencies',
      icon: Crown,
      color: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/30',
      badge: 'Most Popular',
      cta: 'Start Free Trial',
      ctaHref: '/signup?plan=pro',
      ctaStyle: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25',
      limits: {
        accounts: '5 accounts',
        automations: '30 automations',
        subscribers: '5,000 subscribers',
        broadcasts: '10 broadcasts/mo',
        sequences: '10 sequences',
        ai: false,
        analytics: 'Advanced',
        inbox: true,
        webhooks: false,
        support: 'Priority email',
      }
    },
    {
      id: 'business',
      name: 'Business',
      nameEn: 'Business',
      price: { monthly: 49, yearly: 39 },
      description: 'For large agencies and advanced stores',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      border: 'border-purple-500/30',
      badge: null,
      cta: 'Get Started',
      ctaHref: '/signup?plan=business',
      ctaStyle: 'bg-purple-500 hover:bg-purple-400 text-white font-bold shadow-lg shadow-purple-500/25',
      limits: {
        accounts: 'Unlimited',
        automations: 'Unlimited',
        subscribers: '50,000 subscribers',
        broadcasts: 'Unlimited',
        sequences: 'Unlimited',
        ai: true,
        analytics: 'Full + Export',
        inbox: true,
        webhooks: true,
        support: 'Dedicated 24/7',
      }
    },
  ]
}

const comparisonFeatures = {
  ar: [
    { icon: Users, label: 'الحسابات المتصلة', key: 'accounts' },
    { icon: Zap, label: 'الأتمتات', key: 'automations' },
    { icon: Users, label: 'المشتركون', key: 'subscribers' },
    { icon: Radio, label: 'البث الجماعي', key: 'broadcasts' },
    { icon: Repeat, label: 'التسلسلات', key: 'sequences' },
    { icon: Bot, label: 'ردود الذكاء الاصطناعي', key: 'ai' },
    { icon: BarChart2, label: 'التحليلات', key: 'analytics' },
    { icon: MessageSquare, label: 'صندوق الوارد', key: 'inbox' },
    { icon: Webhook, label: 'Webhooks', key: 'webhooks' },
    { icon: Shield, label: 'الدعم الفني', key: 'support' },
  ],
  en: [
    { icon: Users, label: 'Connected Accounts', key: 'accounts' },
    { icon: Zap, label: 'Automations', key: 'automations' },
    { icon: Users, label: 'Subscribers', key: 'subscribers' },
    { icon: Radio, label: 'Broadcasts', key: 'broadcasts' },
    { icon: Repeat, label: 'Sequences', key: 'sequences' },
    { icon: Bot, label: 'AI Replies', key: 'ai' },
    { icon: BarChart2, label: 'Analytics', key: 'analytics' },
    { icon: MessageSquare, label: 'Inbox / Live Chat', key: 'inbox' },
    { icon: Webhook, label: 'Webhooks', key: 'webhooks' },
    { icon: Shield, label: 'Support', key: 'support' },
  ]
}

const faqs = {
  ar: [
    { q: 'هل يمكنني الترقية أو الرجوع في أي وقت؟', a: 'نعم، يمكنك تغيير خطتك في أي وقت. الترقية فورية، والرجوع يدخل حيز التنفيذ في نهاية دورة الفوترة الحالية.' },
    { q: 'هل البيانات آمنة؟', a: 'نعم، نستخدم تشفير AES-256 لجميع التوكنات والبيانات الحساسة، ونلتزم بسياسات ميتا الرسمية.' },
    { q: 'ماذا يحدث إذا تجاوزت الحد المسموح؟', a: 'سنُعلمك بذلك مسبقاً ونقترح عليك الترقية. لن يتوقف عمل الأتمتة فجأة.' },
    { q: 'هل هناك عقد طويل الأمد؟', a: 'لا، الاشتراك شهري أو سنوي ويمكن إلغاؤه في أي وقت بدون رسوم.' },
    { q: 'هل يدعم WhatsApp وTikTok؟', a: 'حالياً ندعم Instagram وFacebook. دعم WhatsApp وTikTok قادم قريباً.' },
  ],
  en: [
    { q: 'Can I upgrade or downgrade anytime?', a: 'Yes, you can change your plan at any time. Upgrades are instant, and downgrades take effect at the end of your current billing cycle.' },
    { q: 'Is my data secure?', a: 'Yes, we use AES-256 encryption for all tokens and sensitive data, and we comply with official Meta policies.' },
    { q: 'What happens if I exceed my limit?', a: "We'll notify you in advance and suggest upgrading. Your automations won't stop suddenly." },
    { q: 'Is there a long-term contract?', a: 'No, subscriptions are monthly or yearly and can be cancelled anytime with no fees.' },
    { q: 'Does it support WhatsApp and TikTok?', a: 'Currently we support Instagram and Facebook. WhatsApp and TikTok support is coming soon.' },
  ]
}

// ─── Feature Value Cell ─────────────────────────────────────
function FeatureValue({ value }) {
  if (value === false) return <X size={16} className="text-gray-700 mx-auto" />
  if (value === true) return <Check size={16} className="text-green-400 mx-auto" />
  return <span className="text-gray-300 text-sm">{value}</span>
}

// ─── FAQ Item ───────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-start hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function PricingPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const [billing, setBilling] = useState('monthly')

  const currentPlans = plans[lang]
  const features = comparisonFeatures[lang]
  const faqList = faqs[lang]

  const savings = lang === 'ar' ? 'وفّر 20%' : 'Save 20%'
  const monthlyLabel = lang === 'ar' ? 'شهري' : 'Monthly'
  const yearlyLabel = lang === 'ar' ? 'سنوي' : 'Yearly'
  const perMonth = lang === 'ar' ? '/شهر' : '/mo'
  const billedYearly = lang === 'ar' ? 'يُحسب سنوياً' : 'billed yearly'
  const compareTitle = lang === 'ar' ? 'مقارنة الخطط' : 'Compare Plans'
  const faqTitle = lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'
  const heroTitle = lang === 'ar' ? 'خطط تناسب كل مشروع' : 'Plans for every business'
  const heroDesc = lang === 'ar'
    ? 'ابدأ مجاناً وطوّر خطتك مع نمو مشروعك. لا رسوم خفية، لا عقود طويلة.'
    : 'Start free and scale as your business grows. No hidden fees, no long contracts.'

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
            <Sparkles size={14} />
            {lang === 'ar' ? 'بدون رسوم خفية' : 'No hidden fees'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{heroTitle}</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{heroDesc}</p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>{monthlyLabel}</span>
          <button
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billing === 'yearly' ? 'bg-cyan-500' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${billing === 'yearly' ? (isRTL ? 'end-1' : 'left-8') : (isRTL ? 'end-8' : 'left-1')}`} />
          </button>
          <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-white' : 'text-gray-500'}`}>{yearlyLabel}</span>
          {billing === 'yearly' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full"
            >
              {savings}
            </motion.span>
          )}
        </div>

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {currentPlans.map((plan, i) => {
            const Icon = plan.icon
            const price = billing === 'yearly' ? plan.price.yearly : plan.price.monthly
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-md border ${plan.border} rounded-3xl p-7 flex flex-col ${plan.badge ? 'ring-1 ring-cyan-500/30' : ''}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                    <p className="text-gray-500 text-xs">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-gray-500 text-sm mb-1">{perMonth}</span>
                  </div>
                  {billing === 'yearly' && price > 0 && (
                    <p className="text-gray-600 text-xs mt-1">{billedYearly}</p>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-8 flex-1">
                  {features.map(f => {
                    const val = plan.limits[f.key]
                    const FIcon = f.icon
                    return (
                      <div key={f.key} className="flex items-center gap-2.5">
                        {val === false
                          ? <X size={14} className="text-gray-700 flex-shrink-0" />
                          : <Check size={14} className="text-cyan-400 flex-shrink-0" />
                        }
                        <span className={`text-sm ${val === false ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                          {typeof val === 'string' ? val : f.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-full text-center text-sm font-bold transition-all duration-200 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">{compareTitle}</h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-5 text-start text-gray-400 text-sm font-medium w-1/2">
                      {lang === 'ar' ? 'الميزة' : 'Feature'}
                    </th>
                    {currentPlans.map(plan => {
                      const Icon = plan.icon
                      return (
                        <th key={plan.id} className="p-5 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-xs font-bold`}>
                            <Icon size={12} />
                            {plan.name}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => {
                    const FIcon = feature.icon
                    return (
                      <tr key={feature.key} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                        <td className="p-5">
                          <div className="flex items-center gap-2.5">
                            <FIcon size={15} className="text-gray-500 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{feature.label}</span>
                          </div>
                        </td>
                        {currentPlans.map(plan => (
                          <td key={plan.id} className="p-5 text-center">
                            <FeatureValue value={plan.limits[feature.key]} />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">{faqTitle}</h2>
          <div className="space-y-3">
            {faqList.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-10">
            <h3 className="text-2xl font-bold text-white mb-3">
              {lang === 'ar' ? 'جاهز تبدأ؟' : 'Ready to get started?'}
            </h3>
            <p className="text-gray-400 mb-6">
              {lang === 'ar'
                ? 'انضم لآلاف أصحاب المتاجر والكوتشز في العالم العربي'
                : 'Join thousands of store owners and coaches across the Arab world'}
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-lg shadow-cyan-500/25"
            >
              <Sparkles size={18} />
              {lang === 'ar' ? 'ابدأ مجاناً الآن' : 'Start for free now'}
            </Link>
          </div>
        </motion.div>

      </main>
    </PageLayoutWith3D>
  )
}