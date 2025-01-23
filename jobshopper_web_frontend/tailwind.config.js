/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blurr-bg": "#9d73ad",
        "btn-primary": "#4e007a",
        "primary-green": "#8DC63E",
      },
      screens: {
        'mid': '1217px',  // Example of custom breakpoint
         
        // You can add your custom breakpoints like 'xxl', 'xxxl' if needed
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
