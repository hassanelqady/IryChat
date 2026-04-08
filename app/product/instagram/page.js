'use client';
import GeometricBackground from '@/components/GeometricBackground'
import React from 'react';
import Link from 'next/link';
import { Instagram, Check, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

const InstagramProductPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "Instagram Automation",
      subtitle: "Grow your followers and engagement on autopilot.",
      features: [
        { title: "Auto Replies", desc: "Reply to comments and DMs instantly.", icon: Zap },
        { title: "Story Mentions", desc: "Get notified when anyone mentions you.", icon: Check },
        { title: "Growth Tools", desc: "Safe and organic growth strategies.", icon: Zap },
        { title: "Analytics", desc: "Track your performance over time.", icon: Check },
      ],
      cta: "Start for Free"
    },
    ar: {
      title: "أتمتة إنستغرام",
      subtitle: "زد متابعيك وتفاعلك تلقائياً وبشكل آمن.",
      features: [
        { title: "ردود تلقائية", desc: "رد على التعليقات والرسائل الخاصة فوراً.", icon: Zap },
        { title: "الإشارات في القصص", desc: "احصل على إشعار عند الإشارة إليك في قصة.", icon: Check },
        { title: "أدوات النمو", desc: "استراتيجيات نمو آمنة وعضوية.", icon: Zap },
        { title: "التحليلات", desc: "تتبع أدائك وحسابك مع مرور الوقت.", icon: Check },
      ],
      cta: "ابدأ مجاناً"
    }
  };

  const t = content[lang];

  return (
    <>
      {/* 1. خلفية سوداء صلبة في الخلف جداً (أسفل كل شيء) */}
      <div className="fixed inset-0 bg-black -z-10"></div>

      {/* 2. الشكل الهندسي في الطبقة الوسطى (z-0) */}
      <GeometricBackground />

      {/* 3. المحتوى في الطبقة الأمامية (z-10) */}
      {/* ملاحظة: أزيلت bg-black هنا لكي لا تغطي الشكل */}
      <div className="relative z-10 min-h-screen text-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        
        <main className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:underline">Home</Link> / <span className="text-white font-medium">Product</span> / Instagram
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white">
                <Instagram size={32} />
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
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link 
                href="/signup" 
                className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl z-20 relative"
              >
                {t.cta}
              </Link>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default InstagramProductPage;