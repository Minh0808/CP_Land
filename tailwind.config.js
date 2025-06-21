// tailwind.config.js
module.exports = {
  // Với Tailwind v3+, dùng `content` để khai báo nơi Tailwind quét class
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      // Nếu bạn muốn dùng spacing custom 100px
      spacing: {
        '100px': '100px',
      }
    },
  },
  plugins: [],
}
