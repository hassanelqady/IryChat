'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import PageLayoutWith3D from '@/components/PageLayoutWith3D';

// أيقونة تيك توك الرسمية (SVG)
const TikTokIcon = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const TikTokProductPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "TikTok Growth",
      subtitle: "Boost your engagement and manage your community on TikTok.",
      features: [
        { title: "Comment Auto-Reply", desc: "Automatically reply to comments to boost engagement.", icon: Video },
        { title: "DM Automation", desc: "Manage direct messages and automate welcome flows.", icon: TikTokIcon }, // استخدام أيقونة تيك توك
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
        { title: "أتمتة الرسائل", desc: "أدر الرسائل الخاصة وأتمتة الترحيب.", icon: TikTokIcon }, // استخدام أيقونة تيك توك
        { title: "تنبيهات الاتجاهات", desc: "احصل على إشعار عند اكتساب هاشتاج معين للشهرة.", icon: Check },
        { title: "التحليلات", desc: "تتبع الفيديوهات التي تجلب أكبر عدد من المشاهدات.", icon: Video },
      ],
      cta: "انمو على تيك توك"
    }
  };

  const t = content[lang];

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:underline">Home</Link> / <span className="text-white font-medium">Product</span> / TikTok
          </div>

          <div className="flex items-center gap-4 mb-8">
            {/* أيقونة تيك توك الرسمية بدلاً من الموسيقى */}
            <div className="p-4 bg-neutral-800 rounded-2xl text-white border border-white/10">
              <TikTokIcon size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{t.title}</h1>
              <p className="text-xl text-gray-400">{t.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {t.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-3xl border border-white/10 bg-white/5 hover:shadow-lg transition-shadow backdrop-blur-sm">
                <feature.icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/signup" 
              // تعديل الزر ليكون أسود مع حد أبيض خفيف (ليناسب الوضع الداكن والباقي)
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold text-lg border border-white/20 hover:bg-white hover:text-black transition-all duration-200 shadow-xl z-20 relative"
            >
              <TikTokIcon size={20} />
              {t.cta}
            </Link>
          </div>

        </div>
      </main>

    </PageLayoutWith3D>
  );
};

export default TikTokProductPage;