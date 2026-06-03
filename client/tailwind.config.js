/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // All colors use CSS channel variables so opacity modifiers (bg-cream/90) keep working
        void:  'rgb(var(--color-void) / <alpha-value>)',
        cream: {
          DEFAULT: 'rgb(var(--color-cream) / <alpha-value>)',
          dark:    'rgb(var(--color-cream-dark) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft:    'rgb(var(--color-ink-soft) / <alpha-value>)',
          muted:   'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint:   'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        leaf: {
          50:  'rgb(var(--color-leaf-50) / <alpha-value>)',
          100: 'rgb(var(--color-leaf-100) / <alpha-value>)',
          200: 'rgb(var(--color-leaf-200) / <alpha-value>)',
          300: 'rgb(var(--color-leaf-300) / <alpha-value>)',
          400: 'rgb(var(--color-leaf-400) / <alpha-value>)',
          500: 'rgb(var(--color-leaf-500) / <alpha-value>)',
          600: 'rgb(var(--color-leaf-600) / <alpha-value>)',
          700: 'rgb(var(--color-leaf-700) / <alpha-value>)',
          800: 'rgb(var(--color-leaf-800) / <alpha-value>)',
          900: 'rgb(var(--color-leaf-900) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)',
          light:   'rgb(var(--color-amber-light) / <alpha-value>)',
          dark:    'rgb(var(--color-amber-dark) / <alpha-value>)',
        },
        rose: {
          DEFAULT: 'rgb(var(--color-rose) / <alpha-value>)',
          light:   'rgb(var(--color-rose-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        inner: 'inset 0 1px 3px rgba(0,0,0,0.08)',
        // card, lifted, neon-* all use CSS variables — defined in @layer components in index.css
      },
      keyframes: {
        'check-pop': {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(0.85)' },
          '65%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          '0%':   { opacity: '0', transform: 'scale(0.94) translateY(12px)' },
          '60%':  { opacity: '1', transform: 'scale(1.01) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flame-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.25)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // neon-pulse references CSS vars so it adapts to theme
        'neon-pulse': {
          '0%, 100%': { 'box-shadow': 'var(--shadow-neon-xs)' },
          '50%':      { 'box-shadow': 'var(--shadow-neon)' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.35' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'bounce-in': {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '55%':  { opacity: '1', transform: 'scale(1.12)' },
          '75%':  { transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'check-pop':   'check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up':    'slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-in':    'modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in':     'fade-in 0.22s ease-out',
        'fade-up':     'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'flame-pulse': 'flame-pulse 1.4s ease-in-out infinite',
        shimmer:       'shimmer 1.8s linear infinite',
        'neon-pulse':  'neon-pulse 2.5s ease-in-out infinite',
        'dot-pulse':   'dot-pulse 2s ease-in-out infinite',
        float:         'float 3s ease-in-out infinite',
        'bounce-in':   'bounce-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'scale-in':    'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
