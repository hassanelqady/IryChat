'use client'

import Link from 'next/link'
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
        { h: "1. قبول الشروط", p: "باستخدامك لخدمات IryChat، فإنك توافق على الالتزام بهذه الشروط والأحكام." },
        { h: "2. استخدام الخدمة", p: "يحق لك استخدام خدمات IryChat لأغراضك التجارية الشخصية، مع الالتزام بقوانين ميتا وانستجرام." },
        { h: "3. الحساب والمسؤولية", p: "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك." },
        { h: "4. الدفع والإلغاء", p: "يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة التحكم. لن يتم إصدار استرداد للفترة المتبقية من الاشتراك." },
        { h: "5. إنهاء الخدمة", p: "نحتفظ بالحق في إنهاء أو تعليق حسابك في حال انتهاك هذه الشروط." },
        { h: "6. التواصل", p: "للاستفسارات حول الشروط والأحكام، تواصل معنا على" }
      ],
      contactEmail: "legal@irychat.com"
    },
    en: {
      title: "Terms and Conditions",
      date: "Last updated: January 1, 2025",
      sections: [
        { h: "1. Acceptance of Terms", p: "By using IryChat services, you agree to abide by these terms and conditions." },
        { h: "2. Use of Service", p: "You may use IryChat services for your own commercial purposes, subject to Meta and Instagram's policies." },
        { h: "3. Account and Responsibility", p: "You are responsible for maintaining the confidentiality of your account and password." },
        { h: "4. Payment and Cancellation", p: "You can cancel your subscription at any time via the dashboard. No refunds will be issued for the remaining period." },
        { h: "5. Termination of Service", p: "We reserve the right to terminate or suspend your account if these terms are violated." },
        { h: "6. Contact", p: "For inquiries regarding terms and conditions, contact us at" }
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
              <motion.div key={index} variants={fadeUp} className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-white">{section.h}</h2>
                <p className="text-gray-400 leading-relaxed">
                  {section.p}
                  {index === t.sections.length - 1 && (
                    <a href={`mailto:${t.contactEmail}`} className="text-blue-400 hover:underline">
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