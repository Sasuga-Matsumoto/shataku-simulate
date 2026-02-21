import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A8A',
          blue: '#3366FF',
          orange: '#F97316',
          green: '#22B860',
          bg: '#F8FAFC',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
        mono: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
