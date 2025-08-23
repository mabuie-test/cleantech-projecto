module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        accent: "#00A676"
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.2rem"
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
}