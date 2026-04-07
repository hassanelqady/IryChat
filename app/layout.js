import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata = {
  title: 'IryChat — Instagram Automation',
  description: 'حوّل كل DM إلى بيع حقيقي مع IryChat - أتمتة انستجرام الذكية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="bg-white dark:bg-black text-gray-900 dark:text-gray-100"
        style={{ fontFamily: 'Cairo, Inter, sans-serif' }}
      >
        <LanguageProvider>
          
          {/* 2. استخدم الـ Wrapper بدلاً من <Navbar /> و <main> يدوياً */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>

        </LanguageProvider>
      </body>
    </html>
  )
}