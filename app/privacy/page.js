'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function PrivacyPage() {
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
      title: "سياسة الخصوصية",
      date: "آخر تحديث: 1 يناير 2025",
      sections: [
        {
          h: "1. مقدمة",
          p: "تصف سياسة الخصوصية هذه كيفية قيام IryChat («نحن» أو «الخدمة») بجمع معلوماتك واستخدامها وحمايتها عند استخدامك لمنصتنا لأتمتة تفاعلات إنستجرام وفيسبوك. باستخدامك للخدمة، فإنك توافق على هذه السياسة."
        },
        {
          h: "2. المعلومات التي نجمعها",
          p: "نجمع المعلومات التالية:\n• بيانات الحساب: الاسم والبريد الإلكتروني عند التسجيل.\n• بيانات Meta: عند ربط حسابك عبر Facebook Login، نحصل على: اسم الملف الشخصي، البريد الإلكتروني، وصول لصفحات Facebook وحسابات Instagram Business المرتبطة بها.\n• بيانات الاستخدام: سجلات الأتمتة، إحصائيات الردود التلقائية، وأنماط الاستخدام.\n• البيانات التقنية: عنوان IP، نوع المتصفح، الجهاز المستخدم."
        },
        {
          h: "3. الصلاحيات التي نطلبها من Meta",
          p: "لتشغيل الخدمة، نطلب الصلاحيات التالية من Meta:\n• pages_messaging: للرد التلقائي على رسائل صفحات Facebook.\n• instagram_basic: للوصول لبيانات حساب Instagram الأساسية.\n• instagram_manage_comments: لإدارة التعليقات والرد عليها تلقائياً.\n• instagram_manage_messages: للرد التلقائي على رسائل Instagram.\n• pages_read_engagement: لقراءة تفاعلات الصفحة.\n\nلن نطلب أي صلاحيات خارج نطاق ما يلزم لتشغيل الخدمة."
        },
        {
          h: "4. كيفية استخدام معلوماتك",
          p: "نستخدم المعلومات التي نجمعها من أجل:\n• تشغيل ميزات الأتمتة (الردود التلقائية على التعليقات والرسائل).\n• تحسين أداء الخدمة وتطويرها.\n• إرسال إشعارات تقنية أو رسائل دعم فني.\n• الامتثال للمتطلبات القانونية.\n\nلن نستخدم بياناتك لأغراض إعلانية أو تسويقية دون موافقتك الصريحة."
        },
        {
          h: "5. مشاركة البيانات مع أطراف ثالثة",
          p: "لا نبيع بياناتك أو نشاركها مع أطراف ثالثة، باستثناء:\n• Supabase: لتخزين البيانات بشكل آمن (مزود البنية التحتية).\n• Meta Platforms: للتواصل مع API الخاص بهم لتشغيل الأتمتة.\n• الجهات القانونية: عند الاقتضاء القانوني فقط."
        },
        {
          h: "6. الاحتفاظ بالبيانات",
          p: "نحتفظ ببياناتك طالما كان حسابك نشطاً. عند إلغاء الحساب:\n• يتم حذف بيانات الحساب خلال 30 يوماً.\n• يتم حذف سجلات الأتمتة خلال 90 يوماً.\n• يمكنك طلب الحذف الفوري عبر صفحة حذف البيانات."
        },
        {
          h: "7. أمان البيانات",
          p: "نطبق معايير أمان متقدمة تشمل:\n• تشفير AES-256-GCM لجميع الـ tokens المخزنة.\n• HTTPS لجميع الاتصالات.\n• Row Level Security (RLS) في قاعدة البيانات.\n• مراجعات أمنية دورية."
        },
        {
          h: "8. حقوقك",
          p: "لديك الحق في:\n• الوصول: طلب نسخة من بياناتك الشخصية.\n• التصحيح: تعديل أي بيانات غير دقيقة.\n• الحذف: طلب حذف بياناتك بالكامل عبر صفحة حذف البيانات أو بالتواصل معنا.\n• إلغاء الموافقة: فصل حسابك عن Meta في أي وقت من إعدادات الحساب."
        },
        {
          h: "9. سياسة بيانات المستخدمين الأطراف الثالثة",
          p: "من خلال أتمتة IryChat، قد تتم معالجة بيانات المستخدمين الذين يتفاعلون مع صفحاتك (مثل أسماء المرسلين وإشعارات التعليقات). لا نخزن هذه البيانات خارج نطاق ما يلزم لتنفيذ الرد التلقائي، ولا نستخدمها لأي غرض آخر."
        },
        {
          h: "10. التواصل معنا",
          p: "لأي استفسارات تتعلق بسياسة الخصوصية أو لممارسة حقوقك، تواصل معنا على: "
        }
      ],
      contactEmail: "privacy@irychat.com",
      deletionLink: "طلب حذف البيانات",
      deletionUrl: "/data-deletion"
    },
    en: {
      title: "Privacy Policy",
      date: "Last updated: January 1, 2025",
      sections: [
        {
          h: "1. Introduction",
          p: "This Privacy Policy describes how IryChat ('we' or 'the Service') collects, uses, and protects your information when you use our platform to automate Instagram and Facebook interactions. By using the Service, you agree to this policy."
        },
        {
          h: "2. Information We Collect",
          p: "We collect the following information:\n• Account Data: Name and email address upon registration.\n• Meta Data: When you connect your account via Facebook Login, we receive: profile name, email, access to Facebook Pages and linked Instagram Business accounts.\n• Usage Data: Automation logs, auto-reply statistics, and usage patterns.\n• Technical Data: IP address, browser type, and device used."
        },
        {
          h: "3. Meta Permissions We Request",
          p: "To operate the service, we request the following Meta permissions:\n• pages_messaging: To auto-reply to Facebook Page messages.\n• instagram_basic: To access basic Instagram account data.\n• instagram_manage_comments: To manage and auto-reply to comments.\n• instagram_manage_messages: To auto-reply to Instagram DMs.\n• pages_read_engagement: To read page engagement data.\n\nWe will not request any permissions beyond what is necessary to operate the service."
        },
        {
          h: "4. How We Use Your Information",
          p: "We use collected information to:\n• Operate automation features (auto-replies to comments and messages).\n• Improve and develop the service.\n• Send technical notifications or support messages.\n• Comply with legal requirements.\n\nWe will not use your data for advertising or marketing purposes without your explicit consent."
        },
        {
          h: "5. Sharing Data with Third Parties",
          p: "We do not sell or share your data with third parties, except:\n• Supabase: For secure data storage (infrastructure provider).\n• Meta Platforms: To communicate with their API to power automation.\n• Legal authorities: Only when legally required."
        },
        {
          h: "6. Data Retention",
          p: "We retain your data as long as your account is active. Upon account deletion:\n• Account data is deleted within 30 days.\n• Automation logs are deleted within 90 days.\n• You may request immediate deletion via the data deletion page."
        },
        {
          h: "7. Data Security",
          p: "We implement advanced security standards including:\n• AES-256-GCM encryption for all stored tokens.\n• HTTPS for all communications.\n• Row Level Security (RLS) in the database.\n• Periodic security reviews."
        },
        {
          h: "8. Your Rights",
          p: "You have the right to:\n• Access: Request a copy of your personal data.\n• Correction: Modify any inaccurate data.\n• Deletion: Request full deletion of your data via the data deletion page or by contacting us.\n• Withdraw Consent: Disconnect your account from Meta at any time via account settings."
        },
        {
          h: "9. Third-Party User Data Policy",
          p: "Through IryChat automation, data from users interacting with your pages (such as sender names and comment notifications) may be processed. We do not store this data beyond what is needed to execute the auto-reply, and we do not use it for any other purpose."
        },
        {
          h: "10. Contact Us",
          p: "For any inquiries about this Privacy Policy or to exercise your rights, contact us at: "
        }
      ],
      contactEmail: "privacy@irychat.com",
      deletionLink: "Request Data Deletion",
      deletionUrl: "/data-deletion"
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
                {/* رابط حذف البيانات في قسم الحقوق */}
                {index === 7 && (
                  <a href={t.deletionUrl} className="inline-block mt-3 text-sm text-cyan-400 hover:underline">
                    ← {t.deletionLink}
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
    </PageLayoutWith3D>
  )
}
