/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // تعريف اللون الخاص بك كـ primary و cy لكي يعمل مع الكلاسات القديمة والجديدة
        primary: '#00d4ff', 
        cy: '#00d4ff',
      },
    },
  },
  plugins: [],
}