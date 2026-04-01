import './globals.css'

export const metadata = {
  title: 'IryChat — Instagram Automation',
  description: 'حوّل كل DM إلى بيع حقيقي مع IryChat - أتمتة انستجرام الذكية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}