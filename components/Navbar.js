'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, Menu, X, Instagram, Facebook, MessageCircle, Music } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const { lang, toggleLanguage } = useLanguage();
  const pathname = usePathname();

  const isRTL = lang === 'ar';

  const content = {
    ar: {
      getStarted: 'ابدأ مجاناً',
      product: 'المنتج',
      about: 'حول',
      pricing: 'خطط الأسعار',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      support: 'الدعم',
      blog: 'المدونة',
      close: 'إغلاق',
      instagram: 'Instagram',
      facebook: 'Facebook',
      whatsapp: 'WhatsApp',
      tiktok: 'TikTok',
      langBtn: 'English',
      arabic: 'العربية',
      english: 'English',
    },
    en: {
      getStarted: 'Get Started',
      product: 'Product',
      about: 'About',
      pricing: 'Pricing',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      support: 'Support',
      blog: 'Blog',
      close: 'Close',
      instagram: 'Instagram',
      facebook: 'Facebook',
      whatsapp: 'WhatsApp',
      tiktok: 'TikTok',
      langBtn: 'العربية',
      arabic: 'العربية',
      english: 'English',
    },
  };

  const t = content[lang];

  const productItems = [
    { name: t.instagram, icon: <Instagram size={18} />, href: '/product/instagram' },
    { name: t.facebook, icon: <Facebook size={18} />, href: '/product/facebook' },
    { name: t.whatsapp, icon: <MessageCircle size={18} />, href: '/product/whatsapp' },
    { name: t.tiktok, icon: <Music size={18} />, href: '/product/tiktok' },
  ];

  const aboutItems = [
    { name: t.privacy, href: '/privacy' },
    { name: t.terms, href: '/terms' },
    { name: t.support, href: '/contact' },
    { name: t.blog, href: '/blog' },
  ];

  const languageOptions = [
    { code: 'ar', label: t.arabic, flag: '🇸🇦' },
    { code: 'en', label: t.english, flag: '🇺🇸' },
  ];

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) setActiveDropdown(null);
    else setActiveDropdown(name);
  };

  const handleLanguageSelect = (selectedLang) => {
    if (lang !== selectedLang) {
      toggleLanguage();
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* --- الشريط العلوي --- */}
      <nav className="
        fixed 
        top-6 
        left-2 
        right-2 
        md:left-6 
        md:right-6 
        lg:left-10 
        lg:right-10 
        z-50 
        bg-white/80 
        dark:bg-white/10 
        backdrop-blur-2xl 
        border 
        border-white/30 
        dark:border-white/20 
        shadow-xl 
        shadow-black/5 
        rounded-2xl 
        transition-all 
        duration-300
      ">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* الشعار */}
            <Link href="/" className="flex-shrink-0 cursor-pointer" onClick={closeMenu}>
              <span className="text-2xl font-bold text-black dark:text-white">
                IryChat
              </span>
            </Link>

            {/* قائمة سطح المكتب (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              
              {/* Product Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors py-2">
                  <span>{t.product}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {/* 
                  تم التعديل: 
                  - السرعة: duration-200 (سريع)
                  - الحركة: translate-y-1 (مختصر وأنعم لتجنب الاهتزاز)
                */}
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                  <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 space-y-1">
                    {productItems.map((item) => (
                      <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-colors text-sm font-medium">
                        <span className="text-black dark:text-white">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors py-2">
                  <span>{t.about}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                  <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 space-y-1">
                    {aboutItems.map((item) => (
                      <Link key={item.name} href={item.href} className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-colors text-sm font-medium">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Link */}
              <Link href="/pricing" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors py-2">
                {t.pricing}
              </Link>

            </div>

            {/* العناصر الجانبية */}
            <div className="flex items-center gap-3 rtl:gap-3">
              
              {/* Language Dropdown */}
              <div className="relative group">
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-bold text-black dark:text-white transition-colors">
                  <span>{isRTL ? '🇸🇦' : '🇺🇸'}</span>
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-1 space-y-1">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => handleLanguageSelect(opt.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          lang === opt.code
                            ? 'bg-gray-200 dark:bg-white/20 text-black dark:text-white'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* زر البدء: حواف رفيعة */}
              <Link 
                href="/signup" 
                className="
                  hidden 
                  md:inline-flex 
                  items-center 
                  justify-center 
                  px-6 
                  py-2.5 
                  border-2 
                  border-black 
                  dark:border-white 
                  text-sm 
                  font-bold 
                  rounded-full 
                  text-black 
                  dark:text-white 
                  hover:bg-black 
                  dark:hover:bg-white 
                  hover:text-white 
                  dark:hover:text-black 
                  transition-all 
                  duration-200
                  shadow-sm 
                  hover:shadow-md
                "
              >
                {t.getStarted}
              </Link>

              {/* هامبرغر موبايل */}
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- قائمة الموبايل (Full Screen Overlay) --- */}
      <div
        className={`fixed inset-0 z-[60] bg-white/95 dark:bg-white/10 backdrop-blur-xl transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full' 
              : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full max-w-2xl mx-auto px-6 py-6">
          
          <div className="flex justify-between items-center h-16 border-b border-gray-100 dark:border-white/10 mb-6">
            <span className="text-2xl font-bold text-black dark:text-white">IryChat</span>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500">
              <X size={32} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <div className="border-b border-gray-100 dark:border-white/10 pb-2">
              <button onClick={() => toggleDropdown('product')} className="w-full flex items-center justify-between text-xl font-bold text-black dark:text-white py-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span>{t.product}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''}`} size={20} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out space-y-1 ${activeDropdown === 'product' ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {productItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-all">
                    <span className="text-black dark:text-white">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-b border-gray-100 dark:border-white/10 pb-2">
              <button onClick={() => toggleDropdown('about')} className="w-full flex items-center justify-between text-xl font-bold text-black dark:text-white py-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span>{t.about}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} size={20} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out space-y-1 ${activeDropdown === 'about' ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {aboutItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeMenu} className="block px-4 py-3 rounded-xl text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-all">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <Link href="/pricing" onClick={closeMenu} className="block text-xl font-bold text-black dark:text-white py-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {t.pricing}
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 space-y-4">
             <button onClick={toggleLanguage} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/10 text-black dark:text-gray-300 font-medium">
               <span>{isRTL ? '🇸🇦' : '🇺🇸'}</span>
               {t.langBtn}
             </button>
             <Link href="/signup" onClick={closeMenu} className="w-full flex items-center justify-center px-6 py-4 border-2 border-black dark:border-white text-lg font-bold rounded-2xl text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200">
               {t.getStarted}
             </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;