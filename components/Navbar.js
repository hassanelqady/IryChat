'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, Instagram, Facebook, MessageCircle, Music, Settings, LogOut } from 'lucide-react';

// مكون زر القائمة
const AnimatedMenuButton = ({ isOpen, toggle, size = 26 }) => {
  return (
    <button
      onClick={toggle}
      className="
        md:hidden 
        p-3 
        focus:outline-none 
        text-white 
        hover:bg-white/10 
        transition-colors 
        z-[100] 
        rounded-lg
      "
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-all duration-300"
      >
        <line 
          x1="4" y1="8" x2="20" y2="8" 
          className={`origin-center transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-3.5' : ''}`} 
        />
        <line 
          x1="4" y1="16" x2="20" y2="16" 
          className={`origin-center transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-3.5' : ''}`} 
        />
      </svg>
    </button>
  );
};

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavHidden, setIsNavHidden] = useState(false);
  
  const { lang, toggleLanguage } = useLanguage();
  const pathname = usePathname();

  const isRTL = lang === 'ar';

  // -----------------------------------------------------------
  // تعديل منطق تسجيل الدخول
  // هذا شرط تجريبي: إذا كان المستخدم في صفحة الداش بورد، نعتبره مسجل دخول
  // -----------------------------------------------------------
  const isDashboard = pathname.startsWith('/dashboard');
  const isLoggedIn = isDashboard;

  // في المستقبل ستحتاج لاستبدال السطر أعلاه بـ:
  // const { user } = useAuth(); 
  // const isLoggedIn = !!user;
  // -----------------------------------------------------------

  const content = {
    ar: {
      getStarted: 'ابدأ مجاناً',
      logout: 'تسجيل الخروج',
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
      logout: 'Log Out',
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
    { name: t.instagram, icon: <Instagram size={16} />, href: '/product/instagram' },
    { name: t.facebook, icon: <Facebook size={16} />, href: '/product/facebook' },
    { name: t.whatsapp, icon: <MessageCircle size={16} />, href: '/product/whatsapp' },
    { name: t.tiktok, icon: <Music size={16} />, href: '/product/tiktok' },
  ];

  const aboutItems = [
    { name: t.privacy, href: '/privacy' },
    { name: t.terms, href: '/terms' },
    { name: t.support, href: '/contact' },
    { name: t.blog, href: '/blog' },
  ];

  const languageOptions = [
    { code: 'ar', label: t.arabic },
    { code: 'en', label: t.english },
  ];

  const handleLogout = () => {
    // هنا تضع كود تسجيل الخروج الفعلي
    console.log("Logging out...");
    router.push('/'); // التوجيه للرئيسية
    closeMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!isOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
          setIsNavHidden(true); 
        } else {
          setIsNavHidden(false); 
        }
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className={`
        fixed 
        top-0 
        left-0 
        right-0 
        z-50 
        transition-transform 
        duration-300 
        ${isNavHidden ? '-translate-y-full' : 'translate-y-0'}
        md:translate-y-0
        bg-transparent
        md:bg-black/40
        md:backdrop-blur-md
        md:border-b md:border-white/10
        py-4
      `}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 cursor-pointer z-40" onClick={closeMenu}>
              <span className="text-xl md:text-3xl font-bold tracking-tight text-white">
                IryChat
              </span>
            </Link>

            {/* --- Desktop Menu --- */}
            <div className="hidden md:flex items-center gap-8">
              
              {/* Product Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors`}>
                  <span>{t.product}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 space-y-1">
                    {productItems.map((item) => (
                      <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
                        <span className="text-white/70">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors`}>
                  <span>{t.about}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 space-y-1">
                    {aboutItems.map((item) => (
                      <Link key={item.name} href={item.href} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Link */}
              <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t.pricing}
              </Link>

            </div>

            {/* --- Right Side Actions --- */}
            <div className="flex items-center gap-3 rtl:gap-3">
              
              {/* Language Dropdown (Desktop Only) - Gear Icon */}
              <div className="relative group hidden md:block">
                <button className={`
                  hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300
                `}>
                  <Settings size={16} className="text-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">{lang === 'ar' ? 'AR' : 'EN'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <div className="absolute top-full right-0 mt-3 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1 space-y-1">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => handleLanguageSelect(opt.code)}
                        className={`
                          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${lang === opt.code ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- Auth Button (Desktop) --- */}
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="
                    hidden md:flex items-center justify-center gap-2
                    px-5 py-2.5 rounded-full
                    border border-red-500/30 bg-red-500/10
                    text-red-400 hover:text-red-300 hover:bg-red-500/20
                    text-sm font-medium
                    transition-all duration-200
                  "
                >
                  <LogOut size={16} />
                  {t.logout}
                </button>
              ) : (
                <Link 
                  href="/signup" 
                  className={`
                    hidden 
                    md:inline-flex 
                    items-center 
                    justify-center 
                    px-6 
                    py-2.5 
                    bg-white 
                    text-black 
                    text-sm 
                    font-bold 
                    rounded-full 
                    hover:bg-gray-200 
                    hover:scale-105
                    transition-all 
                    duration-200
                    shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  `}
                >
                  {t.getStarted}
                </Link>
              )}

              {/* Mobile Hamburger Button */}
              <AnimatedMenuButton 
                isOpen={isOpen} 
                toggle={toggleMenu} 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <div
        className={`
          fixed 
          inset-0 
          z-40 
          bg-black/60 
          backdrop-blur-xl 
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full' 
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex flex-col h-full max-w-md mx-auto px-4 sm:px-6 py-6">
          
          {/* Header */}
          <div className="flex justify-center items-center h-16 border-b border-white/10 mb-6">
            <span className="text-2xl font-bold text-white">IryChat</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <div className="border-b border-white/10 pb-2">
              <button onClick={() => toggleDropdown('product')} className="w-full flex items-center justify-between text-lg font-bold text-white py-4 hover:text-gray-300 transition-colors">
                <span>{t.product}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''}`} size={20} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out space-y-1 ${activeDropdown === 'product' ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {productItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <span className="text-white/70">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-b border-white/10 pb-2">
              <button onClick={() => toggleDropdown('about')} className="w-full flex items-center justify-between text-lg font-bold text-white py-4 hover:text-gray-300 transition-colors">
                <span>{t.about}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} size={20} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out space-y-1 ${activeDropdown === 'about' ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {aboutItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeMenu} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <Link href="/pricing" onClick={closeMenu} className="block text-lg font-bold text-white py-4 hover:text-gray-300 transition-colors">
                {t.pricing}
              </Link>
            </div>
          </div>

          {/* --- Mobile Footer Buttons --- */}
          <div className="mt-auto pt-10 pb-6 border-t border-white/10 space-y-4">
            
            {/* Language Button - Gear Icon */}
            <button 
              onClick={toggleLanguage} 
              className="
                w-full flex items-center justify-center gap-3 
                py-3.5 rounded-full 
                border border-white/20 bg-white/5 
                text-gray-300 font-medium 
                hover:bg-white/10 hover:border-white/40 hover:text-white 
                transition-all duration-300 
                active:scale-[0.98]
              "
            >
              <Settings size={20} className="text-white/70" />
              <span>{t.langBtn}</span>
            </button>

            {/* --- Auth Button (Mobile) --- */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="
                  w-full flex items-center justify-center gap-3
                  py-4 rounded-full 
                  border border-red-500/30 bg-red-500/10
                  text-red-400 hover:text-red-300 hover:bg-red-500/20
                  text-base font-bold
                  transition-all duration-300 
                  active:scale-[0.98]
                "
              >
                <LogOut size={20} />
                {t.logout}
              </button>
            ) : (
              <Link 
                href="/signup" 
                onClick={closeMenu} 
                className="
                  w-full flex items-center justify-center 
                  py-4 rounded-full 
                  bg-white text-black 
                  text-base font-bold 
                  hover:bg-gray-200 
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] 
                  transition-all duration-300 
                  active:scale-[0.98]
                "
              >
                {t.getStarted}
              </Link>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;