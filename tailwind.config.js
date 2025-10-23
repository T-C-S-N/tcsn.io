/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.vue",
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
  ],
  safelist: [
    // Pattern-based safelist for dynamic classes
    {
      pattern: /^(bg|text|border)-(primary|secondary|tertiary|quaternary|accent|background|text|success|error|warning|info|danger)(-[0-9]+)?$/,
      variants: ['hover', 'focus', 'active', 'disabled']
    }
  ],
  theme: {
    extend: {
      colors: {
      text: {
          DEFAULT: '#e6c642',
          50: '#fefbf3',
          100: '#fdf6e0',
          200: '#fbecc2',
          300: '#f7dd98',
          400: '#f3cd6c',
          500: '#e6c642',
          600: '#d4a91f',
          700: '#b08819',
          800: '#8f6c1a',
          900: '#765a1a',
          950: '#442f0b'
        },
        background: {
          DEFAULT: '#0C1116',
          50: '#f5f5f6',
          100: '#e6e7e8',
          200: '#cfd1d3',
          300: '#acafb2',
          400: '#82868a',
          500: '#676b6f',
          600: '#585b5e',
          700: '#4c4e50',
          800: '#0C1116',
          900: '#2f3133',
          950: '#1a1b1c'
        },
        primary: {
          DEFAULT: '#ffb679',
          50: '#fff9f5',
          100: '#fff2ea',
          200: '#ffe4d1',
          300: '#ffd0ad',
          400: '#FFB679',
          500: '#ff9f4a',
          600: '#ff7f1a',
          700: '#e65100',
          800: '#bf4100',
          900: '#993300',
          950: '#661f00'
        },
        secondary: {
          DEFAULT: '#fdf0d5',
          50: '#fefef5',
          100: '#fdf0d5',
          200: '#fce2a8',
          300: '#fad071',
          400: '#f8bd47',
          500: '#f5a623',
          600: '#e68619',
          700: '#bf6515',
          800: '#9a4e17',
          900: '#7e4016',
          950: '#442008'
        },
        tertiary: {
          DEFAULT: '#669bbc',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#669bbc',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        quaternary: {
          DEFAULT: '#003049',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#003049',
          950: '#0c4a6e'
        },
        accent: {
          DEFAULT: '#780000',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#780000',
          950: '#4c0519'
        },
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        danger: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        error: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        info: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.5)',
        'md': '0 3px 6px rgba(0, 0, 0, 0.5)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.5)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.5)',
        '2xl': '0 16px 32px rgba(0, 0, 0, 0.5)',
        'none': 'none',
        // Glow effects
        'glow-sm': '0 0 4px currentColor',
        'glow': '0 0 8px currentColor',
        'glow-md': '0 0 12px currentColor',
        'glow-lg': '0 0 16px currentColor',
        'glow-xl': '0 0 24px currentColor',
        // Green glow (for terminal/cyber aesthetic)
        'green': '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4)',
        'green-lg': '0 0 15px rgba(34, 197, 94, 0.9), 0 0 30px rgba(34, 197, 94, 0.5), 0 0 45px rgba(34, 197, 94, 0.3)',
      }
    },
  },
  plugins: [
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
}