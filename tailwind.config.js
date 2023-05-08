/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    options: {
      safelist: [
        'bg-main',
        'hover:text-main',
        'hover:bg-success',
        'text-header',
      ],
    },
  },
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'safe': "url('../assets/safe.png')",
        'warning': "url('../assets/warning.png')",
        'danger': "url('../assets/danger.png')",
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
