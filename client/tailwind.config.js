/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A6B',
          light: '#D6E4F5',
        },
        accent: '#F26122',
        surface: {
          white: '#FFFFFF',
          gray: '#F8FAFC',
        },
        text: {
          dark: '#1A2A3A',
          mid: '#374151',
          muted: '#6B7280',
        },
        border: '#CBD5E1',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['42px', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h2: ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6' }],
        small: ['13px', { lineHeight: '1.5' }],
        btn: ['15px', { fontWeight: '500' }],
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
