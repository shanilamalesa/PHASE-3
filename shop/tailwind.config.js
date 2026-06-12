//for configuration design

module.exports = {
  content: ["./app/**/*.{js,jsx}"], //the path and include js or jsx
  theme: {
    extend: { //
      colors: { //custom color utility
        brand: { //
          DEFAULT: "#1a1a1a",  //the defaul colorr
          accent: "#16a34a",
          bg: "#faf9f6", 
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
    },
  },
  plugins: [], //Tailwing plugins
};
