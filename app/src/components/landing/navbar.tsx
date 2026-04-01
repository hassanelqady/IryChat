'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/10">

      <div className="text-xl font-bold text-cyan-400">
        XChat
      </div>

      <div className="hidden md:flex gap-6 text-sm text-white/70">
        <a href="#how">كيف يعمل</a>
        <a href="#features">المميزات</a>
        <a href="#pricing">الأسعار</a>
        <a href="#faq">FAQ</a>
      </div>

      <Link
        href="/login"
        className="bg-cyan-400 text-black px-4 py-2 rounded-full text-sm font-bold"
      >
        تسجيل دخول
      </Link>
    </nav>
  )
}