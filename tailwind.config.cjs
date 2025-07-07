// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    screens: {
      xs: {max: '390px'},
      sm: '640px',  
      md: {max: '768px'},  
      lg: '1024px',  
      xl: '1280px',  
      '2xl': '1536px',
    },
  },
  plugins: [],
}
