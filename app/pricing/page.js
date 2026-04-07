'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext'; // استيراد هوك اللغة

const PricingPage = () => {
  const { lang } = useLanguage();

  // محتوى الترجمة
  const content = {
    en: {
      title: "Simple, transparent pricing",
      subtitle: "Start for free, upgrade as you grow. No hidden fees.",
      plans: {
        starter: { name: "Starter", price: "$0", period: "/mo", cta: "Get Started" },
        pro: { name: "Pro", price: "$29", period: "/mo", cta: "Upgrade Now", badge: "POPULAR" },
        enterprise: { name: "Enterprise", price: "$99", period: "/mo", cta: "Contact Sales" },
      },
      features: {
        starter: ["1 Project", "Basic Analytics", "Community Support"],
        pro: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Domain", "Team Collaboration"],
        enterprise: ["Everything in Pro", "Dedicated Manager", "SSO & Security", "API Access"],
      }
    },
    ar: {
      title: "أسعار بسيطة وشفافة",
      subtitle: "ابدأ مجاناً، وترقِ خطتك مع نمو مشروعك. لا توجد رسوم خفية.",
      plans: {
        starter: { name: "البداية", price: "0$", period: "/شهر", cta: "ابدأ مجاناً" },
        pro: { name: "المحترف", price: "29$", period: "/شهر", cta: "ترقية الآن", badge: "الأكثر طلباً" },
        enterprise: { name: "المؤسسات", price: "99$", period: "/شهر", cta: "تواصل مع المبيعات" },
      },
      features: {
        starter: ["مشروع واحد", "تحليلات أساسية", "دعم المجتمع"],
        pro: ["مشاريع غير محدودة", "تحليلات متقدمة", "دعم أولوية", "نطاق مخصص", "تعاون الفريق"],
        enterprise: ["كل مميزات المحترف", "مدير مخصص", "حماية SSO", "وصول API"],
      }
    }
  };

  const t = content[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{t.plans.starter.name}</h3>
            <div className="text-4xl font-bold mb-6">{t.plans.starter.price}<span className="text-lg font-normal text-gray-500">{t.plans.starter.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.starter.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 px-6 rounded-full border border-black dark:border-white text-center font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              {t.plans.starter.cta}
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-black text-white p-8 rounded-3xl border border-black shadow-2xl transform md:-translate-y-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-bl-xl">{t.plans.pro.badge}</div>
            <h3 className="text-lg font-semibold mb-2">{t.plans.pro.name}</h3>
            <div className="text-4xl font-bold mb-6">{t.plans.pro.price}<span className="text-lg font-normal text-gray-400">{t.plans.pro.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.pro.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 px-6 rounded-full bg-white text-black text-center font-semibold hover:bg-gray-200 transition-all">
              {t.plans.pro.cta}
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{t.plans.enterprise.name}</h3>
            <div className="text-4xl font-bold mb-6">{t.plans.enterprise.price}<span className="text-lg font-normal text-gray-500">{t.plans.enterprise.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.enterprise.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full py-3 px-6 rounded-full border border-black dark:border-white text-center font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              {t.plans.enterprise.cta}
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PricingPage;