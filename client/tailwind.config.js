/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
  // 🎨 Primary — sunset orange scale
  brand: {
    50: '#fff7ed',
    100: '#ffedd3',
    200: '#ffd9a3',
    300: '#ffbe63',
    400: '#ffa32e',
    500: '#ff9408', // matches your #FF9408
    600: '#ef9408', // matches your #EF9408
    700: '#ca3f16', // matches your #CA3F16
    800: '#a8341a',
    900: '#100c08', // matches your #100C08
  },
  // 🎨 Accent — deep maroon
  accent: {
    50: '#fdf1f3',
    100: '#fbd9df',
    200: '#f2adb9',
    300: '#e17f92',
    400: '#c04a5e',
    500: '#95122c', // matches your #95122C
    600: '#7d0f25',
    700: '#5f0b1c',
  },
},
      fontFamily: {
        // 🔤 FONT: Swap this for any Google Font you like (update index.html <link> too)
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -8px rgba(15, 23, 42, 0.15)',
        glow: '0 0 0 4px rgba(37, 99, 235, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
