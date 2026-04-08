'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import PageLayoutWith3D from '@/components/PageLayoutWith3D';

const PricingPage = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  const content = {
    en: {
      title: "Pricing Plans",
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
      title: "خطط الأسعار",
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

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            {t.title}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Starter Plan */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col relative z-10">
            <h3 className="text-lg font-semibold mb-2 text-white">{t.plans.starter.name}</h3>
            <div className="text-4xl font-bold mb-6 text-white">{t.plans.starter.price}<span className="text-lg font-normal text-gray-500">{t.plans.starter.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.starter.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/login" className="block w-full py-3 px-6 rounded-full border border-white/20 text-center font-semibold text-white hover:bg-white hover:text-black transition-all">
              {t.plans.starter.cta}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-cyan-900/20 to-black/60 backdrop-blur-md p-8 rounded-3xl border border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] transform md:-translate-y-6 flex flex-col relative z-20">
            <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              {t.plans.pro.badge}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t.plans.pro.name}</h3>
            <div className="text-4xl font-bold mb-6 text-white">{t.plans.pro.price}<span className="text-lg font-normal text-gray-400">{t.plans.pro.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.pro.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-200">
                  <Check className="w-5 h-5 text-cyan-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/login" className="block w-full py-3 px-6 rounded-full bg-cyan-500 text-black text-center font-semibold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2">
              {t.plans.pro.cta}
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col relative z-10">
            <h3 className="text-lg font-semibold mb-2 text-white">{t.plans.enterprise.name}</h3>
            <div className="text-4xl font-bold mb-6 text-white">{t.plans.enterprise.price}<span className="text-lg font-normal text-gray-500">{t.plans.enterprise.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {t.features.enterprise.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full py-3 px-6 rounded-full border border-white/20 text-center font-semibold text-white hover:bg-white hover:text-black transition-all">
              {t.plans.enterprise.cta}
            </Link>
          </div>

        </div>
      </main>
    </PageLayoutWith3D>
  );
};

export default PricingPage;
