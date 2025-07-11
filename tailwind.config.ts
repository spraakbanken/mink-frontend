import { Config } from "tailwindcss";

export default <Config>{
  content: ["./index.html", "./{instance,src}/**/*.{vue,js,ts}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        sborange: {
          900: "#4a1804",
          800: "#7a2807",
          700: "#c6410b",
          600: "#f2581a",
          500: "#F46D37",
          100: "#f2dbd1",
        },
        sbteal: {
          900: "#1b3c3e",
          600: "#1e989f",
          100: "#d7ebeb",
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3 Variable"', "sans-serif"],
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
