'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Blog() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const blogPosts = [
    {
      id: 1,
      title: 'كيف تزيد مبيعاتك 300% باستخدام أتمتة الـ DM',
      date: '٢ أبريل ٢٠٢٥',
      readTime: '٥ دقائق',
      excerpt: 'تعلم كيف حول كل رسالة على انستجرام لفرصة بيع حقيقية باستخدام IryChat. نصائح عملية لزيادة مبيعاتك.',
      category: 'نصائح'
    },
    {
      id: 2,
      title: 'أفضل 5 استراتيجيات للرد التلقائي على الكومنتات',
      date: '٢٨ مارس ٢٠٢٥',
      readTime: '٤ دقائق',
      excerpt: 'ازاي تخلي كل واحد يكتب "سعر" أو "عرض" في الكومنتات يتحول لعميل. استراتيجيات مجربة بنسبة نجاح 98%.',
      category: 'استراتيجيات'
    },
    {
      id: 3,
      title: 'IryChat vs المنافسين: ليه إحنا الأفضل؟',
      date: '٢٠ مارس ٢٠٢٥',
      readTime: '٦ دقائق',
      excerpt: 'مقارنة شاملة بين IryChat وأدوات الأتمتة التانية في السوق. تعرف على المميزات الحصرية.',
      category: 'مقارنات'
    },
    {
      id: 4,
      title: 'ازاي توصل لعملاء جدد عبر الـ Story Mentions',
      date: '١٥ مارس ٢٠٢٥',
      readTime: '٣ دقائق',
      excerpt: 'استراتيجية مبتكرة لتحويل كل منشن في الاستوري إلى عميل دافع. شرح خطوة بخطوة.',
      category: 'تسويق'
    },
    {
      id: 5,
      title: 'أخطاء تقتل مبيعاتك على انستجرام (وتجنبها بسهولة)',
      date: '١٠ مارس ٢٠٢٥',
      readTime: '٧ دقائق',
      excerpt: '٧ أخطاء شائعة في الـ DMs والكومنتات بتخسرك عملاء. وكيفية تجنبها باستخدام IryChat.',
      category: 'تحذيرات'
    },
    {
      id: 6,
      title: 'أتمتة الـ DM: مستقبل التجارة على انستجرام',
      date: '٥ مارس ٢٠٢٥',
      readTime: '٥ دقائق',
      excerpt: 'لماذا أتمتة الرسائل هي مستقبل البيع على انستجرام وكيف تستعد له الآن.',
      category: 'تقنية'
    }
  ]

  return (
    <>
      {/* خلفية زي الرئيسية */}
      <div className="bg-mesh">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>
      <div className="bg-grid"></div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ position: 'relative', zIndex: 1, padding: '8rem 5% 5rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* رجوع للرئيسية */}
        <motion.div variants={fadeUp}>
          <Link href="/" style={{ color: '#00d4ff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            ← رجوع للرئيسية
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="stag">المدونة</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>
            أحدث <span style={{ color: '#00d4ff' }}>المقالات</span>
          </h1>
          <p style={{ color: 'rgba(238,242,255,.62)', maxWidth: '600px', margin: '0 auto' }}>
            نصائح واستراتيجيات لزيادة مبيعاتك على انستجرام
          </p>
        </motion.div>

        {/* Grid Cards زي باقي الموقع */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="gl"
              style={{
                borderRadius: '20px',
                padding: '1.8rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {/* التصنيف */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(0,212,255,0.12)',
                border: '1px solid rgba(0,212,255,0.18)',
                borderRadius: '99px',
                padding: '0.25rem 0.9rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#00d4ff',
                marginBottom: '1rem'
              }}>
                {post.category}
              </div>
              
              {/* العنوان */}
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                lineHeight: 1.4,
                color: '#fff'
              }}>
                {post.title}
              </h2>
              
              {/* الملخص */}
              <p style={{
                fontSize: '0.88rem',
                color: 'rgba(238,242,255,.62)',
                lineHeight: 1.6,
                marginBottom: '1.2rem'
              }}>
                {post.excerpt}
              </p>
              
              {/* التاريخ ووقت القراءة */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.75rem',
                color: 'rgba(238,242,255,.42)',
                borderTop: '1px solid rgba(255,255,255,.07)',
                paddingTop: '1rem'
              }}>
                <span>📅 {post.date}</span>
                <span>⏱️ {post.readTime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
      
      <style jsx global>{`
        :root {
          --c1: #05080f;
          --c2: #00d4ff;
          --c2-dim: rgba(0,212,255,.12);
          --c2-glow: rgba(0,212,255,.22);
          --c2-border: rgba(0,212,255,.18);
          --glass: rgba(255,255,255,.035);
          --gb: rgba(255,255,255,.07);
          --gs: rgba(255,255,255,.12);
          --text: #eef2ff;
          --muted: rgba(238,242,255,.42);
          --muted2: rgba(238,242,255,.62);
        }

        .bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          animation: bd 12s ease-in-out infinite alternate;
        }

        .b1 {
          width: 700px;
          height: 700px;
          background: rgba(0,212,255,.14);
          top: -200px;
          right: -180px;
        }

        .b2 {
          width: 550px;
          height: 550px;
          background: rgba(0,80,255,.11);
          bottom: -150px;
          left: -150px;
          animation-delay: -5s;
        }

        .b3 {
          width: 400px;
          height: 400px;
          background: rgba(0,212,255,.06);
          top: 45%;
          left: 38%;
          animation-delay: -9s;
        }

        @keyframes bd {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(0,212,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .gl {
          background: var(--glass);
          backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid var(--gb);
          box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05);
        }

        .stag {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--c2);
          margin-bottom: .65rem;
        }
      `}</style>
    </>
  )
}