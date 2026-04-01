'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">

      <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
        حوّل كل <span className="text-cyan-400">DM</span>
        <br />
        لبيع حقيقي
      </h1>

      <p className="text-white/60 max-w-xl mb-8">
        XChat يرد على رسائل انستجرام تلقائيًا ويحوّل متابعينك لعملاء حقيقيين
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-cyan-400 text-black px-6 py-3 rounded-full font-bold"
        >
          ابدأ الآن
        </Link>

        <a
          href="#how"
          className="border border-white/20 px-6 py-3 rounded-full"
        >
          كيف يعمل
        </a>
      </div>
    </section>
  )
}