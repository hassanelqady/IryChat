'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Check, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

const WhatsAppProductPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "WhatsApp Business API",
      subtitle: "Turn conversations into customers on the world's most popular chat app.",
      features: [
        { title: "Bulk Messaging", desc: "Send promotional messages to your approved lists.", icon: Send },
        { title: "Team Inbox", desc: "Manage multiple WhatsApp numbers in one unified inbox.", icon: MessageCircle },
        { title: "Catalog Sharing", desc: "Send product catalogs directly in chat.", icon: Check },
        { title: "Automated Flows", desc: "Set up chatbots to handle common queries.", icon: Send },
      ],
      cta: "Start WhatsApp API"
    },
    ar: {
      title: "واتساب بزنس API",
      subtitle: "حول المحادثات إلى عملاء على تطبيق الدردشة الأكثر شعبية.",
      features: [
        { title: "رسائل جماعية", desc: "أرسل رسائل ترويجية لقوائمك المعتمدة.", icon: Send },
        { title: "صندوق الوارد الفريق", desc: "أدر أرقام واتساب متعددة في صندوق واحد.", icon: MessageCircle },
        { title: "مشاركة الكتالوج", desc: "أرسل كتالوج المنتجات مباشرة في المحادثة.", icon: Check },
        { title: "تدفقات آلية", desc: "أنشئ روبوتات محادثة للرد على الاستفسارات.", icon: Send },
      ],
      cta: "ابدأ واتساب API"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link> / <span className="text-black dark:text-white font-medium">Product</span> / WhatsApp
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-green-500 rounded-2xl text-white">
              <MessageCircle size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{t.title}</h1>
              <p className="text-xl text-gray-500">{t.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {t.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/signup" 
              className="inline-block px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-xl shadow-green-500/20"
            >
              {t.cta}
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WhatsAppProductPage;