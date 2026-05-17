/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary color scale (government-style blue)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        },
        // Design system tokens
        'bg-primary': '#F8FAFC',
        'bg-light': '#F8FAFC',
        'bg-dark': '#0F172A',
        'text-primary': '#0F172A',
        navy: '#0F172A',
        accent: '#2563EB',
        'accent-light': '#DBEAFE',
        success: '#10B981',
        'success-light': '#D1FAE5',
        danger: '#EF4444',
        'danger-light': '#FEE2E2',
        warning: '#F59E0B',
        'warning-light': '#FEF3C7',
        'card-border': '#E2E8F0',
        'card-dark': '#1E293B',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-text': '#F1F5F9',
        'text-dark': '#F1F5F9',
        'dark-border': '#334155',
        muted: '#64748B',
        'text-muted': '#64748B',
        surface: '#FFFFFF',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
