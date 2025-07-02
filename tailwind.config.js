//tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [
    require('tailwindcss-rem2px-preset').createPreset({
      // 28 意味着 1rem = 28rpx
      fontSize: 28,
      // 转化的单位,可以变成 px / rpx
      unit: 'rpx',
    }),
  ],
}
