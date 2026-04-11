'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FEATURES = {
  ar: [
    {
      id: 'dm',
      tag: 'الردود التلقائية على DM',
      headline: 'كل رسالة خاصة\nفرصة بيع حقيقية',
      body: 'حدد كلمة مفتاحية واحدة — بالعربي أو بالعامية — وIryChat يتولى المحادثة كاملةً حتى إتمام الشراء.',
      bgGradient: 'linear-gradient(135deg, #FFF200 0%, #FFD700 100%)', 
      textColor: '#000000',
      messages: [
        { from: 'user', text: 'السعر كام؟', delay: 400 },
        { from: 'bot',  text: 'أهلاً! الفستان بـ٢٨٩ج — متاح بالأسود والبيج.\nتحبي تشوفي الألوان؟', delay: 1200 },
        { from: 'user', text: 'عارضيلي الأسود', delay: 2200 },
        { from: 'bot',  text: 'تحفة! إليكِ صور الأسود.\nعايزة تطلبي دلوقتي؟', delay: 3100 },
        { from: 'user', text: 'أيوه، طلبي دلوقتي!', delay: 4100 },
        { from: 'bot',  text: 'ممتاز! أرسلت لكِ رابط الدفع الآمن.', delay: 5000 },
      ],
    },
    {
      id: 'comments',
      tag: 'أتمتة التعليقات',
      headline: 'تعليق واحد\nيشعل رحلة البيع',
      body: 'أي تعليق يحتوي كلمة مفتاحية — "السعر" أو "رابط" — يُحوَّل فوراً لرسالة خاصة.',
      bgGradient: 'linear-gradient(135deg, #CCFF00 0%, #A3E635 100%)', 
      textColor: '#000000',
      messages: [
        { from: 'user', text: '🔥🔥 محتاج البرنامج ده!', delay: 400 },
        { from: 'bot',  text: 'أهلاً! برنامج التحول في ٩٠ يوم وصلك.', delay: 1200 },
        { from: 'bot',  text: 'مع البرنامج:\n✅ خطة تغذية مجانية\n✅ تمارين اليوم الأول', delay: 2200 },
        { from: 'user', text: 'أيوه عايز أبدأ دلوقتي!', delay: 3300 },
        { from: 'bot',  text: 'رائع! إليك رابط الاشتراك.', delay: 4100 },
      ],
    },
    {
      id: 'story',
      tag: 'إشارات القصص',
      headline: 'كل منشن\nعميل محتمل',
      body: 'حين يذكرك أحد في قصته، يصله رد تلقائي فوري — شكر حقيقي وعرض ذو قيمة.',
      bgGradient: 'linear-gradient(135deg, #D946EF 0%, #A855F7 100%)', 
      textColor: '#000000',
      messages: [
        { from: 'bot',  text: 'شكراً جزيلاً على المنشن! يسعدنا ثقتك بينا', delay: 400 },
        { from: 'bot',  text: 'هدية خاصة ليك:\nخصم ٢٠٪ على جلستك القادمة.', delay: 1400 },
        { from: 'user', text: 'أيوه عايز أحجز!', delay: 2500 },
        { from: 'bot',  text: 'اختار الوقت المناسب:\n• الخميس ٤م\n• الجمعة ١١ص', delay: 3300 },
        { from: 'user', text: 'الجمعة ١١ص', delay: 4200 },
        { from: 'bot',  text: 'تم الحجز! هيوصلك تأكيد على إيميلك', delay: 5000 },
      ],
    },
    {
      id: 'broadcast',
      tag: 'البث الجماعي',
      headline: 'رسالة واحدة\nلآلاف العملاء',
      body: 'أرسل حملاتك وعروضك لجميع المشتركين دفعةً واحدة — مع تخصيص بالاسم والاهتمام.',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
      textColor: '#000000',
      messages: [
        { from: 'bot',  text: 'أهلاً يا أحمد!\nعروض الجمعة البيضاء وصلتك قبل الكل', delay: 400 },
        { from: 'bot',  text: 'خصومات حتى ٦٠٪\nلأول ١٠٠ مشترك فقط!', delay: 1400 },
        { from: 'user', text: 'وصلني! جاي أشوف دلوقتي 🔥', delay: 2600 },
        { from: 'bot',  text: 'رابطك الخاص:\nstore.com/vip-friday', delay: 3400 },
      ],
    },
  ],
  en: [
    {
      id: 'dm',
      tag: 'Auto DM Replies',
      headline: 'Every DM\na Sale Waiting',
      body: 'Set one keyword — in Arabic or any dialect — and IryChat handles the full conversation until purchase.',
      bgGradient: 'linear-gradient(135deg, #FFF200 0%, #FFD700 100%)',
      textColor: '#000000',
      messages: [
        { from: 'user', text: 'How much is the dress?', delay: 400 },
        { from: 'bot',  text: 'Hi! The dress is $49 — available in black, beige & burgundy.', delay: 1200 },
        { from: 'user', text: 'Show me the black one', delay: 2200 },
        { from: 'bot',  text: 'Great choice! Here are the black photos.\nReady to order?', delay: 3100 },
        { from: 'user', text: 'Yes, order now!', delay: 4100 },
        { from: 'bot',  text: 'Done! Secure payment link sent.', delay: 5000 },
      ],
    },
    {
      id: 'comments',
      tag: 'Comment Automation',
      headline: 'One Comment\nStarts the Sale',
      body: 'Any comment with a keyword — "price", "link", or even a 🔥 emoji — instantly triggers a private message.',
      bgGradient: 'linear-gradient(135deg, #CCFF00 0%, #A3E635 100%)',
      textColor: '#000000',
      messages: [
        { from: 'user', text: '🔥🔥 I need this program!', delay: 400 },
        { from: 'bot',  text: 'Hey! Your 90-Day Transformation just landed in your DMs!', delay: 1200 },
        { from: 'bot',  text: 'Also included:\n✅ Free nutrition plan\n✅ Day 1 workout', delay: 2200 },
        { from: 'user', text: 'Yes, starting today!', delay: 3300 },
        { from: 'bot',  text: 'Amazing! Special price just for you', delay: 4100 },
      ],
    },
    {
      id: 'story',
      tag: 'Story Mentions',
      headline: 'Every Mention\na Potential Client',
      body: 'When someone mentions you in their story, they instantly get a genuine thank-you and a value offer.',
      bgGradient: 'linear-gradient(135deg, #D946EF 0%, #A855F7 100%)',
      textColor: '#ffffff',
      messages: [
        { from: 'bot',  text: 'Thank you so much for the mention! Really means a lot', delay: 400 },
        { from: 'bot',  text: 'Special gift for you:\n20% off your next session.', delay: 1400 },
        { from: 'user', text: 'Yes I want to book!', delay: 2500 },
        { from: 'bot',  text: 'Pick a time:\n• Thursday 4pm\n• Friday 11am', delay: 3300 },
        { from: 'user', text: 'Friday 11am', delay: 4200 },
        { from: 'bot',  text: 'Booked! Confirmation sent to your email', delay: 5000 },
      ],
    },
    {
      id: 'broadcast',
      tag: 'Broadcast',
      headline: 'One Message\nThousands of Sales',
      body: 'Send campaigns to all your subscribers at once — personalized by name and interest.',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      textColor: '#ffffff',
      messages: [
        { from: 'bot',  text: 'Hey Ahmed!\nYou get early access to Black Friday deals', delay: 400 },
        { from: 'bot',  text: 'Up to 60% OFF\nFirst 100 subscribers only!', delay: 1400 },
        { from: 'user', text: 'Got it! Checking now 🔥', delay: 2600 },
        { from: 'bot',  text: 'Your personal link:\nstore.com/vip-friday', delay: 3400 },
      ],
    },
  ],
}

// ─── SHARED CHAT FRAME ─────────────────────────────────────────────────────

function PhoneMockup({ feature, isRTL, scrollDirection }) {
  const [visibleMessages, setVisibleMessages] = useState([])
  const [showTyping, setShowTyping] = useState(false)
  const timersRef = useRef([])

  const runAnimation = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisibleMessages([])
    setShowTyping(false)

    feature.messages.forEach((msg, i) => {
      if (msg.from === 'bot') {
        const t1 = setTimeout(() => setShowTyping(true), msg.delay - 600)
        timersRef.current.push(t1)
      }
      const t2 = setTimeout(() => {
        setShowTyping(false)
        setVisibleMessages(prev => [...prev, { ...msg, key: `${i}-${Date.now()}` }])
      }, msg.delay)
      timersRef.current.push(t2)
    })

    const total = feature.messages[feature.messages.length - 1].delay + 2500
    const loop = setTimeout(runAnimation, total)
    timersRef.current.push(loop)
  }, [feature])

  useEffect(() => {
    runAnimation()
    return () => timersRef.current.forEach(clearTimeout)
  }, [runAnimation])

  const enterAnimation = scrollDirection === 'next' 
    ? 'slideInFromBottom' 
    : 'slideInFromTop'

  return (
    <div style={{
      width: '100%', 
      height: '100%',
      borderRadius: 28,
      background: '#000000',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      zIndex: 10,
      boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      animation: `${enterAnimation} 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px 20px',
          overflow: 'hidden',
          background: '#000000',
        }}
      >
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {visibleMessages.map((msg) => {
            const isBot = msg.from === 'bot'
            return (
              <div key={msg.key} style={{
                display: 'flex',
                justifyContent: isBot
                  ? (isRTL ? 'flex-end' : 'flex-start')
                  : (isRTL ? 'flex-start' : 'flex-end'),
                width: '100%',
              }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 18px',
                  borderRadius: 20,
                  animation: 'bubblePopIn 0.6s cubic-bezier(0.12, 0, 0.12, 1) forwards',
                  background: isBot ? '#262626' : '#8B5CF6',
                  color: '#ffffff',
                  overflow: 'hidden',
                }}>
                  <span style={{
                    fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', display: 'block',
                    animation: 'textFadeIn 0.5s ease-out 0.1s forwards', opacity: 0,
                  }}>
                    {msg.text}
                  </span>
                </div>
              </div>
            )
          })}

          {showTyping && (
            <div style={{ display: 'flex', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '12px 18px', borderRadius: 20, background: '#262626',
                display: 'flex', gap: 6, alignItems: 'center',
                animation: 'bubblePopIn 0.5s cubic-bezier(0.12, 0, 0.12, 1) forwards',
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#8e8e8e',
                    animation: `typingDot 1.2s infinite ${j * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MOBILE VIEW COMPONENT ───────────────────────────────────────────────────

function MobileView({ features, isRTL, lang }) {
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ width: '100%' }}>
      {features.map((feature, index) => (
        <div
          key={feature.id}
          style={{
            minHeight: '100vh', 
            width: '100%',
            background: feature.bgGradient,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
             position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1,
             backgroundSize: '40px 40px',
             backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`
          }} />

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 40, width: '100%' }}>
               <div style={{
                  fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.6)', marginBottom: 20
               }}>
                  {lang === 'ar' ? 'المميزات' : 'Features'} {index + 1}
               </div>
               <h2 style={{
                 color: feature.textColor,
                 fontSize: 'clamp(2rem, 8vw, 3rem)', 
                 fontWeight: 900,
                 lineHeight: 1.1,
                 marginBottom: 20,
                 whiteSpace: 'pre-line',
                 fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif'
               }}>
                 {feature.headline}
               </h2>
               <p style={{
                 color: 'rgba(0,0,0,0.8)',
                 fontSize: '1.1rem',
                 lineHeight: 1.6,
                 maxWidth: 500,
                 margin: '0 auto',
               }}>
                 {feature.body}
               </p>
            </div>

            <div style={{ 
                width: '100%', 
                maxWidth: 320, 
                height: 480, // Fixed height for mobile too to prevent layout shift
                transform: 'scale(0.9)' 
            }}>
               <PhoneMockup feature={feature} isRTL={isRTL} scrollDirection="next" />
            </div>

            {index === features.length - 1 && (
               <div style={{ marginTop: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Link 
                    href="/signup"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '16px 40px', backgroundColor: '#000000', color: '#ffffff',
                      borderRadius: '50px', fontSize: '1rem', fontWeight: 700,
                      textDecoration: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                      width: '100%', maxWidth: 300
                  }}>
                    {isRTL ? 'ابدأ مجاناً' : 'Get Started Free'}
                    <span style={{ fontSize: 18, display:'flex', alignItems:'center', marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
                      {isRTL ? '←' : '→'}
                    </span>
                  </Link>
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DESKTOP VIEW COMPONENT ───────────────────────────────────────────────────

function DesktopView({ features, isRTL, lang }) {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const [phoneVisible, setPhoneVisible] = useState(true)
  const [scrollDir, setScrollDir] = useState('next')
  
  const isProgrammaticScrollRef = useRef(false)

  const triggerTransition = useCallback((newIndex) => {
    if (newIndex === activeIndex) return
    setScrollDir(newIndex > activeIndex ? 'next' : 'prev')
    setTextVisible(false)
    setPhoneVisible(false)
    setTimeout(() => {
      setActiveIndex(newIndex)
      setTextVisible(true)
      setPhoneVisible(true)
    }, 500)
  }, [activeIndex])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return
      const rect = section.getBoundingClientRect()
      const totalScroll = section.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(1, scrolled / totalScroll)
      const newIndex = Math.min(features.length - 1, Math.floor(progress * features.length))

      if (newIndex !== activeIndex) {
        triggerTransition(newIndex)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [activeIndex, features.length, triggerTransition])

  const goTo = (i) => {
    isProgrammaticScrollRef.current = true
    if (i !== activeIndex) triggerTransition(i)
    const section = sectionRef.current
    if (!section) return
    const totalScroll = section.offsetHeight - window.innerHeight
    const target = section.offsetTop + (i / features.length) * totalScroll + 10
    window.scrollTo({ top: target, behavior: 'smooth' })
    setTimeout(() => { isProgrammaticScrollRef.current = false }, 1000)
  }

  const active = features[activeIndex]
  const isDarkBg = active.id === 'story' || active.id === 'broadcast'
  const buttonBg = isDarkBg ? '#000000' : '#000000'
  const buttonText = isDarkBg ? '#ffffff' : '#ffffff'

  return (
    <div ref={sectionRef} style={{ height: `${features.length * 100}vh`, position:'relative' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{
        position:'sticky', top:0, height:'100vh', display:'flex', overflow:'hidden',
        background: active.bgGradient, transition: 'background 0.8s ease-in-out', 
      }}>
        {/* LEFT / TEXT SIDE */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding: '5%', position:'relative' }}>
          <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: isDarkBg ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0,0,0,0.6)', marginBottom: 28 }}>
              {lang === 'ar' ? 'المميزات' : 'Features'}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:36 }}>
              {features.map((f, i) => (
                <button key={f.id} onClick={() => goTo(i)} style={{
                  display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer', padding:'4px 0',
                  opacity: activeIndex === i ? 1 : 0.4, transition:'opacity 0.3s', textAlign: isRTL ? 'right' : 'left',
                }}>
                  <div style={{ width: activeIndex === i ? 24 : 6, height:6, borderRadius:3, background: active.textColor, transition:'all 0.3s ease', flexShrink:0 }} />
                  <span style={{ color: active.textColor, fontSize:12, fontWeight: activeIndex === i ? 800 : 400, transition:'color 0.3s', whiteSpace:'nowrap' }}>{f.tag}</span>
                </button>
              ))}
            </div>
            <div key={active.id} className="text-panel-in" style={{ opacity: textVisible ? 1 : 0, transition:'opacity 0.2s', maxWidth:480 }}>
              <h2 style={{ color: active.textColor, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight:1.1, marginBottom:20, whiteSpace:'pre-line', fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                {active.headline}
              </h2>
              <p style={{ color: isDarkBg ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0,0,0,0.7)', fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', lineHeight:1.6, maxWidth:420 }}>
                {active.body}
              </p>
            </div>
          </div>
          <div style={{ width: '100%', marginTop: 'auto', marginBottom: '40px' }}>
             <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px 32px', backgroundColor: buttonBg, color: buttonText, border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 30px -5px rgba(0,0,0,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.2)'; }}>
              {isRTL ? 'ابدأ مجاناً' : 'Get Started Free'}
              <span style={{ fontSize: 18, display:'flex', alignItems:'center', marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>{isRTL ? '←' : '→'}</span>
            </Link>
          </div>
        </div>

        {/* RIGHT / CHAT FRAME SIDE */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', padding: '5%', backgroundSize: '100px 100px', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)` }}>
          <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 65%)`, pointerEvents:'none', zIndex:1 }} />
          
          {/* FIXED SIZE CONTAINER to prevent resizing/thinning */}
          <div style={{ 
            width: 320, 
            height: 480, 
            opacity: phoneVisible ? 1 : 0, 
            transform: `translateY(${phoneVisible ? '0%' : (scrollDir === 'next' ? '-150%' : '150%')})`, 
            transition: phoneVisible ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <PhoneMockup key={active.id} feature={active} isRTL={isRTL} scrollDirection={scrollDir} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

function FeatureShowcase() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const features = FEATURES[lang] ?? FEATURES.ar

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <style>{`
        /* Global Animations */
        @keyframes slideInFromBottom { 0% { opacity: 0; transform: translateY(150%); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideInFromTop { 0% { opacity: 0; transform: translateY(-150%); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes bubblePopIn { 0% { opacity: 0; transform: scale(0.85) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes textFadeIn { 0% { opacity: 0; transform: translateY(8px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes typingDot { 0%,60%,100% { transform:translateY(0); opacity:0.4; } 30% { transform:translateY(-4px); opacity:1; } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .text-panel-in { animation: fadeSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
      
      {isMobile 
        ? <MobileView features={features} isRTL={isRTL} lang={lang} />
        : <DesktopView features={features} isRTL={isRTL} lang={lang} />
      }
    </>
  )
}

export default FeatureShowcase