/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1A6FBF', light: '#D6E8F7' },
        accent: '#F0A500',
        text: { dark: '#1A2A3A', mid: '#374151', muted: '#6B7280' },
        border: '#CBD5E1',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
