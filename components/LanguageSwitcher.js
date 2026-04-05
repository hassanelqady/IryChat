'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // إغلاق عند الضغط خارج القائمة
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectLang = (selected) => {
    if (selected !== lang) toggleLang()
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* الزرار الرئيسي */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          padding: '0.4rem 0.65rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          color: '#eef2ff',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: '0.95rem' }}>🌐</span>
        <span style={{ letterSpacing: '0.03em' }}>{lang === 'ar' ? 'عر' : 'EN'}</span>
        <span style={{
          fontSize: '0.6rem',
          opacity: 0.6,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>▼</span>
      </motion.button>

      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(10,15,25,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '0.4rem',
              minWidth: '140px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              zIndex: 999,
            }}
          >
            {/* العربية */}
            <button
              onClick={() => selectLang('ar')}
              style={{
                width: '100%',
                padding: '0.6rem 0.9rem',
                background: lang === 'ar' ? 'rgba(0,212,255,0.12)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: lang === 'ar' ? '#00d4ff' : '#eef2ff',
                fontSize: '0.9rem',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: lang === 'ar' ? 700 : 400,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = lang === 'ar' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = lang === 'ar' ? 'rgba(0,212,255,0.12)' : 'transparent'}
            >
              <span>🇸🇦 العربية</span>
              {lang === 'ar' && <span style={{ fontSize: '0.75rem' }}>✓</span>}
            </button>

            {/* English */}
            <button
              onClick={() => selectLang('en')}
              style={{
                width: '100%',
                padding: '0.6rem 0.9rem',
                background: lang === 'en' ? 'rgba(0,212,255,0.12)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: lang === 'en' ? '#00d4ff' : '#eef2ff',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: lang === 'en' ? 700 : 400,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = lang === 'en' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = lang === 'en' ? 'rgba(0,212,255,0.12)' : 'transparent'}
            >
              <span>🇺🇸 English</span>
              {lang === 'en' && <span style={{ fontSize: '0.75rem' }}>✓</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
