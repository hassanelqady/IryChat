'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Check, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

const TikTokProductPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "TikTok Growth",
      subtitle: "Boost your engagement and manage your community on TikTok.",
      features: [
        { title: "Comment Auto-Reply", desc: "Automatically reply to comments to boost engagement.", icon: Video },
        { title: "DM Automation", desc: "Manage direct messages and automate welcome flows.", icon: Music },
        { title: "Trend Alerts", desc: "Get notified when a specific hashtag starts trending.", icon: Check },
        { title: "Analytics", desc: "Track which videos drive the most traffic.", icon: Video },
      ],
      cta: "Grow on TikTok"
    },
    ar: {
      title: "النمو على تيك توك",
      subtitle: "عزز تفاعلك وأدر مجتمعك على تيك توك.",
      features: [
        { title: "رد آلي على التعليقات", desc: "رد تلقائياً على التعليقات لزيادة التفاعل.", icon: Video },
        { title: "أتمتة الرسائل", desc: "أدر الرسائل الخاصة وأتمتة الترحيب.", icon: Music },
        { title: "تنبيهات الاتجاهات", desc: "احصل على إشعار عند اكتساب هاشتاج معين للشهرة.", icon: Check },
        { title: "التحليلات", desc: "تتبع الفيديوهات التي تجلب أكبر عدد من المشاهدات.", icon: Video },
      ],
      cta: "انمو على تيك توك"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link> / <span className="text-black dark:text-white font-medium">Product</span> / TikTok
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-black rounded-2xl text-white border border-white/10">
              <Music size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{t.title}</h1>
              <p className="text-xl text-gray-500">{t.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {t.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-black dark:text-white mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/signup" 
              className="inline-block px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-xl"
            >
              {t.cta}
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TikTokProductPage;