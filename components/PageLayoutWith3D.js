// components/PageLayoutWith3D.js
'use client';
import React from 'react';
import GeometricBackground from '@/components/GeometricBackground';

export default function PageLayoutWith3D({ children, className = "", dir = "ltr" }) {
  return (
    <>
      {/* 1. الخلفية السوداء الثابتة */}
      <div className="fixed inset-0 bg-black -z-10"></div>

      {/* 2. الشكل الهندسي */}
      <GeometricBackground />

      {/* 3. حاوية المحتوى (تظهر فوق الخلفية) */}
      {/* dir يأتي من الصفحة لضبط الاتجاه (عربي/إنجليزي) */}
      <div className={`relative z-10 min-h-screen text-white ${className}`} dir={dir}>
        {children}
      </div>
    </>
  );
}