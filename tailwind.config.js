module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        sborange: "#f2581a",
      },
      keyframes: {
        pulse2: {
          "0%": { opacity: ".8" },
          "50%": { opacity: ".1" },
          "100%": { opacity: ".8" },
        },
      },
      animation: {
        pulse2: "pulse2 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
