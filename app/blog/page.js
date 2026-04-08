'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

export default function Blog() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const content = {
    ar: {
      title: "أحدث <span class='text-cyan-400'>المقالات</span>",
      subtitle: "نصائح واستراتيجيات لزيادة مبيعاتك على انستجرام",
      backLink: "← رجوع للرئيسية",
      readMore: "اقرأ المزيد",
      posts: [
        {
          id: 1,
          title: 'كيف تزيد مبيعاتك 300% باستخدام أتمتة الـ DM',
          date: '٢ أبريل ٢٠٢٥',
          readTime: '٥ دقائق',
          excerpt: 'تعلم كيف حول كل رسالة على انستجرام لفرصة بيع حقيقية باستخدام IryChat. نصائح عملية لزيادة مبيعاتك.',
          category: 'نصائح',
          slug: 'increase-sales-300-dm'
        },
        {
          id: 2,
          title: 'أفضل 5 استراتيجيات للرد التلقائي على الكومنتات',
          date: '٢٨ مارس ٢٠٢٥',
          readTime: '٤ دقائق',
          excerpt: 'ازاي تخلي كل واحد يكتب "سعر" أو "عرض" في الكومنتات يتحول لعميل. استراتيجيات مجربة بنسبة نجاح 98%.',
          category: 'استراتيجيات',
          slug: 'auto-reply-comments'
        },
        {
          id: 3,
          title: 'IryChat vs المنافسين: ليه إحنا الأفضل؟',
          date: '٢٠ مارس ٢٠٢٥',
          readTime: '٦ دقائق',
          excerpt: 'مقارنة شاملة بين IryChat وأدوات الأتمتة التانية في السوق. تعرف على المميزات الحصرية.',
          category: 'مقارنات',
          slug: 'irychat-vs-competitors'
        },
        {
          id: 4,
          title: 'ازاي توصل لعملاء جدد عبر الـ Story Mentions',
          date: '١٥ مارس ٢٠٢٥',
          readTime: '٣ دقائق',
          excerpt: 'استراتيجية مبتكرة لتحويل كل منشن في الاستوري إلى عميل دافع. شرح خطوة بخطوة.',
          category: 'تسويق',
          slug: 'story-mentions-customers'
        },
        {
          id: 5,
          title: 'أخطاء تقتل مبيعاتك على انستجرام (وتجنبها بسهولة)',
          date: '١٠ مارس ٢٠٢٥',
          readTime: '٧ دقائق',
          excerpt: '٧ أخطاء شائعة في الـ DMs والكومنتات بتخسرك عملاء. وكيفية تجنبها باستخدام IryChat.',
          category: 'تحذيرات',
          slug: 'common-instagram-mistakes'
        },
        {
          id: 6,
          title: 'أتمتة الـ DM: مستقبل التجارة على انستجرام',
          date: '٥ مارس ٢٠٢٥',
          readTime: '٥ دقائق',
          excerpt: 'لماذا أتمتة الرسائل هي مستقبل البيع على انستجرام وكيف تستعد له الآن.',
          category: 'تقنية',
          slug: 'dm-automation-future'
        }
      ]
    },
    en: {
      title: "Latest <span class='text-cyan-400'>Articles</span>",
      subtitle: "Tips and strategies to boost your Instagram sales",
      backLink: "← Back to Home",
      readMore: "Read More",
      posts: [
        {
          id: 1,
          title: 'How to Increase Sales 300% Using DM Automation',
          date: 'April 2, 2025',
          readTime: '5 min',
          excerpt: 'Learn how to turn every Instagram message into a real sales opportunity with IryChat. Practical tips to boost sales.',
          category: 'Tips',
          slug: 'increase-sales-300-dm'
        },
        {
          id: 2,
          title: 'Top 5 Strategies for Auto-Replying to Comments',
          date: 'March 28, 2025',
          readTime: '4 min',
          excerpt: 'How to turn everyone who comments "price" or "offer" into a customer. Tested strategies with a 98% success rate.',
          category: 'Strategies',
          slug: 'auto-reply-comments'
        },
        {
          id: 3,
          title: 'IryChat vs Competitors: Why We Are The Best?',
          date: 'March 20, 2025',
          readTime: '6 min',
          excerpt: 'A comprehensive comparison between IryChat and other automation tools in the market. Discover exclusive features.',
          category: 'Comparisons',
          slug: 'irychat-vs-competitors'
        },
        {
          id: 4,
          title: 'How to Reach New Customers via Story Mentions',
          date: 'March 15, 2025',
          readTime: '3 min',
          excerpt: 'An innovative strategy to turn every Story mention into a paying customer. Step-by-step guide.',
          category: 'Marketing',
          slug: 'story-mentions-customers'
        },
        {
          id: 5,
          title: 'Mistakes Killing Your Instagram Sales (And How to Avoid Them)',
          date: 'March 10, 2025',
          readTime: '7 min',
          excerpt: '7 common mistakes in DMs and comments that lose you customers. And how to avoid them using IryChat.',
          category: 'Warnings',
          slug: 'common-instagram-mistakes'
        },
        {
          id: 6,
          title: 'DM Automation: The Future of Instagram Commerce',
          date: 'March 5, 2025',
          readTime: '5 min',
          excerpt: 'Why message automation is the future of selling on Instagram and how to prepare for it now.',
          category: 'Technology',
          slug: 'dm-automation-future'
        }
      ]
    }
  }

  const t = content[lang] || content.ar

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <motion.main
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-32 pb-20 px-4 max-w-7xl mx-auto relative z-10"
      >
        {/* Back Link */}
        <motion.div variants={fadeUp} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />}
            {t.backLink}
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-4">Blog</div>
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.posts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex flex-col">
                  {/* Category */}
                  <div className="inline-block bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full px-3 py-1 text-xs font-bold mb-4 w-fit">
                    {post.category}
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-500 mt-auto">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <span className="flex items-center gap-1 text-white font-bold group-hover:translate-x-1 transition-transform">
                      {t.readMore}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </PageLayoutWith3D>
  )
}