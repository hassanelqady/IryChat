'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function PrivacyPage() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar' // سنستخدم هذا لضبط اتجاه الصفحة

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  // النصوص (يمكنك إضافة الإنجليزية لاحقاً هنا)
  const content = {
    ar: {
      title: "سياسة الخصوصية",
      date: "آخر تحديث: 1 يناير 2025",
      sections: [
        { h: "1. المعلومات التي نجمعها", p: "نقوم بجمع المعلومات التي تقدمها لنا عند إنشاء حساب، مثل الاسم، البريد الإلكتروني، وبيانات حساب انستجرام الخاص بك." },
        { h: "2. كيفية استخدام معلوماتك", p: "نستخدم معلوماتك لتشغيل وتحسين خدماتنا، والتواصل معك، وتقديم الدعم الفني." },
        { h: "3. مشاركة المعلومات", p: "لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا بموافقتك أو وفقاً للقانون." },
        { h: "4. الأمان", p: "نستخدم إجراءات أمنية متقدمة لحماية بياناتك، بما في ذلك التشفير وجدران الحماية." },
        { h: "5. حقوقك", p: "لديك الحق في الوصول إلى بياناتك وتصحيحها أو حذفها في أي وقت." },
        { h: "6. الاتصال بنا", p: "للاستفسارات حول سياسة الخصوصية، تواصل معنا على" }
      ],
      contactEmail: "privacy@irychat.com"
    },
    en: {
      title: "Privacy Policy",
      date: "Last updated: January 1, 2025",
      sections: [
        { h: "1. Information We Collect", p: "We collect information you provide when creating an account, such as name, email, and Instagram account data." },
        { h: "2. How We Use Your Information", p: "We use your information to operate and improve our services, communicate with you, and provide technical support." },
        { h: "3. Sharing Information", p: "We do not sell or share your personal information with third parties except with your consent or as required by law." },
        { h: "4. Security", p: "We use advanced security measures to protect your data, including encryption and firewalls." },
        { h: "5. Your Rights", p: "You have the right to access, correct, or delete your data at any time." },
        { h: "6. Contact Us", p: "For inquiries about the privacy policy, contact us at" }
      ],
      contactEmail: "privacy@irychat.com"
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