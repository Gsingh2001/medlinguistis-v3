module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0ff',
        secondary: '#f0f',
        accent: '#0f0',
        bg: '#010011',
        surface: '#111122',
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3)',
      },
    },
  },
  plugins: [],
};