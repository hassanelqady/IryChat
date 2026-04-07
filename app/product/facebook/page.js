'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Check, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

const FacebookProductPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "Facebook Automation",
      subtitle: "Engage your audience on Messenger and Comments instantly.",
      features: [
        { title: "Messenger Bots", desc: "Automate conversations 24/7 on Facebook Messenger.", icon: MessageSquare },
        { title: "Comment Guard", desc: "Hide negative comments and reply to positive ones.", icon: Check },
        { title: "Lead Ads Sync", desc: "Instantly send leads from your ads to your CRM.", icon: MessageSquare },
        { title: "Post Scheduling", desc: "Plan and schedule your content across pages.", icon: Check },
      ],
      cta: "Connect Facebook"
    },
    ar: {
      title: "أتمتة فيسبوك",
      subtitle: "تفاعل مع جمهورك على الماسنجر والتعليقات فوراً.",
      features: [
        { title: "بوتات الماسنجر", desc: "أتمتة المحادثات على مدار الساعة.", icon: MessageSquare },
        { title: "حماية التعليقات", desc: "إخفاء التعليقات السلبية والرد على الإيجابية.", icon: Check },
        { title: "مزامنة الإعلانات", desc: "إرسال العملاء المحتملين من إعلاناتك فوراً.", icon: MessageSquare },
        { title: "جدولة المنشورات", desc: "تخطيط وجدولة المحتوى عبر الصفحات.", icon: Check },
      ],
      cta: "ربط فيسبوك"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link> / <span className="text-black dark:text-white font-medium">Product</span> / Facebook
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-600 rounded-2xl text-white">
              <Facebook size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{t.title}</h1>
              <p className="text-xl text-gray-500">{t.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {t.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/signup" 
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-xl shadow-blue-500/20"
            >
              {t.cta}
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FacebookProductPage;