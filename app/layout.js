import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IryChat',
  description: 'Automation Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-[#e5e5e5]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}