'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function TermsPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const content = {
    ar: {
      title: "الشروط والأحكام",
      date: "آخر تحديث: 1 يناير 2025",
      sections: [
        {
          h: "1. قبول الشروط",
          p: "باستخدامك لخدمات IryChat، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى التوقف عن استخدام الخدمة."
        },
        {
          h: "2. وصف الخدمة",
          p: "IryChat هي منصة SaaS تتيح للمستخدمين أتمتة الردود على التعليقات والرسائل في إنستجرام وفيسبوك عبر Meta API الرسمي. الخدمة مخصصة للاستخدام التجاري المشروع فقط."
        },
        {
          h: "3. الحساب والمسؤولية",
          p: "• تسجيل الدخول يتم حصرياً عبر حساب Meta (Facebook) الخاص بك.\n• أنت مسؤول عن الحفاظ على أمان حساب Meta الخاص بك.\n• أنت مسؤول عن جميع الأنشطة التي تحدث من خلال حسابك على IryChat.\n• يجب أن تكون مالكاً أو مديراً مفوضاً للصفحات التي تقوم بأتمتتها."
        },
        {
          h: "4. الالتزام بسياسات Meta",
          p: "يجب عليك الالتزام الكامل بـ:\n• سياسات Meta للمطورين وشروط الخدمة.\n• سياسات استخدام Instagram وFacebook.\n• قواعد المراسلة والتعليقات الخاصة بـ Meta.\n\nأي انتهاك لسياسات Meta قد يؤدي إلى تعليق حسابك على IryChat."
        },
        {
          h: "5. الاستخدام المقبول",
          p: "يُحظر استخدام IryChat من أجل:\n• إرسال رسائل spam أو محتوى مضلل.\n• انتهاك حقوق الخصوصية للمستخدمين الآخرين.\n• أي نشاط مخالف للقوانين المحلية أو الدولية.\n• الأتمتة المفرطة التي تنتهك حدود Meta API."
        },
        {
          h: "6. الدفع والإلغاء",
          p: "يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة التحكم. لن يتم إصدار استرداد للفترة المتبقية من الاشتراك الحالي. عند الإلغاء، يستمر وصولك حتى نهاية فترة الاشتراك المدفوعة."
        },
        {
          h: "7. حدود المسؤولية",
          p: "IryChat غير مسؤولة عن:\n• أي خسائر ناتجة عن تغييرات في Meta API أو سياساتهم.\n• انقطاع الخدمة الناتج عن عوامل خارجة عن إرادتنا.\n• أي قرارات تجارية تتخذها بناءً على بيانات المنصة."
        },
        {
          h: "8. إنهاء الخدمة",
          p: "نحتفظ بالحق في إنهاء أو تعليق حسابك في حال:\n• انتهاك هذه الشروط أو سياسات Meta.\n• الاشتباه في أي نشاط احتيالي.\n• عدم سداد رسوم الاشتراك.\n\nفي حالة الإنهاء من طرفنا دون مبرر، سيتم رد الرسوم المدفوعة مسبقاً."
        },
        {
          h: "9. التواصل",
          p: "للاستفسارات حول الشروط والأحكام، تواصل معنا على: "
        }
      ],
      contactEmail: "legal@irychat.com"
    },
    en: {
      title: "Terms and Conditions",
      date: "Last updated: January 1, 2025",
      sections: [
        {
          h: "1. Acceptance of Terms",
          p: "By using IryChat services, you agree to abide by these terms and conditions. If you do not agree to any part of these terms, please stop using the service."
        },
        {
          h: "2. Service Description",
          p: "IryChat is a SaaS platform that enables users to automate replies to comments and messages on Instagram and Facebook via the official Meta API. The service is intended for legitimate commercial use only."
        },
        {
          h: "3. Account and Responsibility",
          p: "• Login is done exclusively via your Meta (Facebook) account.\n• You are responsible for maintaining the security of your Meta account.\n• You are responsible for all activities that occur through your IryChat account.\n• You must be the owner or authorized manager of the pages you automate."
        },
        {
          h: "4. Compliance with Meta Policies",
          p: "You must fully comply with:\n• Meta's Developer Policies and Terms of Service.\n• Instagram and Facebook usage policies.\n• Meta's messaging and comments rules.\n\nAny violation of Meta's policies may result in suspension of your IryChat account."
        },
        {
          h: "5. Acceptable Use",
          p: "It is prohibited to use IryChat to:\n• Send spam or misleading content.\n• Violate the privacy rights of other users.\n• Engage in any activity that violates local or international laws.\n• Excessive automation that violates Meta API rate limits."
        },
        {
          h: "6. Payment and Cancellation",
          p: "You can cancel your subscription at any time via the dashboard. No refunds will be issued for the remaining period of the current subscription. Upon cancellation, your access continues until the end of the paid subscription period."
        },
        {
          h: "7. Limitation of Liability",
          p: "IryChat is not responsible for:\n• Any losses resulting from changes to Meta's API or policies.\n• Service interruptions caused by factors beyond our control.\n• Any business decisions you make based on platform data."
        },
        {
          h: "8. Termination",
          p: "We reserve the right to terminate or suspend your account in case of:\n• Violation of these terms or Meta's policies.\n• Suspicion of any fraudulent activity.\n• Non-payment of subscription fees.\n\nIn case of termination by us without cause, pre-paid fees will be refunded."
        },
        {
          h: "9. Contact",
          p: "For inquiries regarding terms and conditions, contact us at: "
        }
      ],
      contactEmail: "legal@irychat.com"
    }
  }

  const t = content[lang] || content.ar

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12">
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {t.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400">{t.date}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {t.sections.map((section, index) => (
              <motion.div key={index} variants={fadeUp} className="mb-8 pb-8 border-b border-white/5 last:border-0">
                <h2 className="text-xl font-bold mb-3 text-white">{section.h}</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.p}
                  {index === t.sections.length - 1 && (
                    <a href={`mailto:${t.contactEmail}`} className="text-cyan-400 hover:underline">
                      {t.contactEmail}
                    </a>
                  )}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
    </PageLayoutWith3D>
  )
}
