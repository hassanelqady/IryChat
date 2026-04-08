'use client'

import { motion } from 'framer-motion'
import { Trash2, Mail, Clock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function DataDeletionPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  const content = {
    ar: {
      title: "طلب حذف البيانات",
      subtitle: "نحترم خصوصيتك. يمكنك طلب حذف جميع بياناتك من منصة IryChat في أي وقت.",
      date: "آخر تحديث: أبريل 2025",
      badge: "متوافق مع سياسات Meta",
      howTitle: "كيفية طلب حذف بياناتك",
      steps: [
        {
          icon: "1",
          title: "من داخل التطبيق",
          desc: "سجّل دخولك إلى حسابك ← اذهب إلى الإعدادات ← اضغط على «حذف الحساب والبيانات»."
        },
        {
          icon: "2",
          title: "عبر البريد الإلكتروني",
          desc: "أرسل طلبك على privacy@irychat.com مع ذكر البريد الإلكتروني المرتبط بحسابك."
        },
        {
          icon: "3",
          title: "عبر فيسبوك مباشرة",
          desc: "الإعدادات ← التطبيقات والمواقع ← IryChat ← إزالة. سيتم إلغاء صلاحيات التطبيق فوراً."
        }
      ],
      whatDeletedTitle: "ما الذي سيتم حذفه؟",
      whatDeleted: [
        "بيانات حسابك الشخصية (الاسم، البريد الإلكتروني)",
        "الحسابات المربوطة (Instagram / Facebook)",
        "جميع الأتمتات التي أنشأتها وإعداداتها",
        "سجلات العمليات والإحصائيات",
        "الـ Tokens المرتبطة بحساب Meta",
        "أي بيانات أخرى مرتبطة بحسابك"
      ],
      timelineTitle: "مدة المعالجة",
      timelineDesc: "نبدأ معالجة طلبك فور استلامه. يتم الحذف الكامل خلال 30 يوم عمل من تاريخ الطلب. ستصلك رسالة تأكيد على بريدك الإلكتروني عند اكتمال العملية.",
      notDeletedTitle: "ما الذي لا يمكن حذفه؟",
      notDeletedDesc: "قد نحتفظ ببعض البيانات المجهولة لأغراض إحصائية أو ما يلزم قانونياً كسجلات المعاملات المالية وفق متطلبات الضريبة.",
      contactTitle: "تواصل معنا",
      contactDesc: "لأي استفسار بخصوص حذف بياناتك:",
      contactEmail: "privacy@irychat.com",
      backHome: "العودة للرئيسية"
    },
    en: {
      title: "Data Deletion Request",
      subtitle: "We respect your privacy. You can request deletion of all your IryChat data at any time.",
      date: "Last updated: April 2025",
      badge: "Compliant with Meta Policies",
      howTitle: "How to Request Data Deletion",
      steps: [
        {
          icon: "1",
          title: "From Within the App",
          desc: "Log in to your account → Go to Settings → Click 'Delete Account and Data'."
        },
        {
          icon: "2",
          title: "Via Email",
          desc: "Send your request to privacy@irychat.com with the email address associated with your account."
        },
        {
          icon: "3",
          title: "Via Facebook Directly",
          desc: "Settings → Apps and Websites → IryChat → Remove. App permissions will be revoked immediately."
        }
      ],
      whatDeletedTitle: "What Gets Deleted?",
      whatDeleted: [
        "Your personal account data (name, email)",
        "Connected accounts (Instagram / Facebook)",
        "All automations you created and their settings",
        "Operation logs and statistics",
        "Tokens linked to your Meta account",
        "Any other data associated with your account"
      ],
      timelineTitle: "Processing Timeline",
      timelineDesc: "We begin processing your request upon receipt. Full deletion is completed within 30 business days. A confirmation email will be sent when the process is complete.",
      notDeletedTitle: "What Cannot Be Deleted?",
      notDeletedDesc: "We may retain some anonymized data for statistical purposes or as legally required, such as financial transaction records per tax requirements.",
      contactTitle: "Contact Us",
      contactDesc: "For any inquiries regarding data deletion:",
      contactEmail: "privacy@irychat.com",
      backHome: "Back to Home"
    }
  }

  const t = content[lang] || content.ar

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium">
                <CheckCircle size={14} />
                {t.badge}
              </span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <Trash2 className="text-red-400" size={28} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-2">
              {t.subtitle}
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-600 text-sm">{t.date}</motion.p>
          </motion.div>

          {/* Content */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-6">

            {/* How to delete */}
            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">{t.howTitle}</h2>
              <div className="space-y-5">
                {t.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{step.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What gets deleted */}
            <motion.div variants={fadeUp} className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{t.whatDeletedTitle}</h2>
              <ul className="space-y-2">
                {t.whatDeleted.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={20} className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">{t.timelineTitle}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{t.timelineDesc}</p>
            </motion.div>

            {/* What cannot be deleted */}
            <motion.div variants={fadeUp} className="bg-yellow-500/5 border border-yellow-500/10 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">{t.notDeletedTitle}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{t.notDeletedDesc}</p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail size={20} className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">{t.contactTitle}</h2>
              </div>
              <p className="text-gray-400 text-sm mb-3">{t.contactDesc}</p>
              <a href={`mailto:${t.contactEmail}`} className="text-cyan-400 hover:underline font-medium">
                {t.contactEmail}
              </a>
            </motion.div>

            {/* Back link */}
            <motion.div variants={fadeUp} className="text-center pt-2">
              <a href="/" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                ← {t.backHome}
              </a>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </PageLayoutWith3D>
  )
}
