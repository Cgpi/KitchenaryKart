/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    screens: {
      phone: '990px',
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
  50:  '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2933',
  900: '#111827',
  DEFAULT: '#111827', // main black
},
        cream: {
          50:  '#FDFAF6',
          100: '#FDF8F3',   // page background
          200: '#FAF3EB',
          300: '#F5E6D3',
          DEFAULT: '#FDF8F3',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',   // accent gold
          DEFAULT: '#D97706',
        },
        charcoal: {
          700: '#292524',
          800: '#1C1917',
          900: '#0C0A09',
          DEFAULT: '#1C1917',
        },
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
     fontFamily: {
  display: ['Roboto', 'Arial', 'sans-serif'], // headings
  body: ['Roboto', 'Arial', 'sans-serif'],          // main text
  sans: ['Roboto', 'Arial', 'sans-serif'],
},
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.08)',
        'header':    '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)',
        'dropdown':  '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'button':    '0 2px 8px rgba(185,28,28,0.30)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-up':     'fadeUp 0.5s ease forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.3s ease forwards',
        'slide-down':  'slideDown 0.18s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':     'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
