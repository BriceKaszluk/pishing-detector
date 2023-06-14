/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [
        'bg-main',
        'hover:text-main',
        'hover:bg-success',
        'text-header',
      ],
    },
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'safe': "url('../assets/safe.png')",
        'warning': "url('../assets/warning.png')",
        'danger': "url('../assets/danger.png')",
        'wave': "url('../assets/Wave-10s-1920px.svg')",
        'hero': "url('../assets/phshing-detector-hero.png')",
        'wave_section': "url('../assets/wave_section.svg')",
        'video_background': "url('../assets/video_background.png')",
        'video_background2': "url('../assets/video_background2.png')",
      },
      backgroundColor: {
        'button': '#0077c2',
      },
      colors: {
        'header': '#0077c2',
        'footer': '#273142',
        'main': '#E6F2FF',
        'success': '#4CAF50',
      },
      minHeight: {
        'main': 'calc(100vh - (64px + 260px))',
      },
    },
  },
  plugins: [],
}
