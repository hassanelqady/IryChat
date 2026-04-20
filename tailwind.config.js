/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Off-White Backgrounds ──
        canvas:  '#F5F5F7', // خلفية الصفحة الرئيسية
        surface: '#FFFFFF', // كروت + inputs

        // ── Grays ──
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0A0A0F',
        },

        // ── Blue Primary ──
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // الأزرق الأساسي
          600: '#2563EB', // hover
          700: '#1D4ED8', // active
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // ── Dark Mode Surfaces ──
        dark: {
          bg:      '#0F0F12', // خلفية الداشبورد dark
          surface: '#1A1A1F', // كروت dark
          border:  '#2A2A32', // borders dark
          hover:   '#222228', // hover dark
        },
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.08)',
        'btn':     '0 1px 2px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
