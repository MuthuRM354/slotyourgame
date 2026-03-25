/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cricket-green": "#137B10",
        "cricket-light": "#228B22",
        "cricket-bright": "#32CD32",
        "icc-gold": "#FFD700",
        "stadium-dark": "#1a1a1a",
      },
      animation: {
        "ball-bounce": "ball-bounce 0.6s infinite",
        "tilt-hover": "tilt-hover 0.3s ease-out",
        "ripple": "ripple 0.6s ease-out",
      },
      keyframes: {
        "ball-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "tilt-hover": {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(5deg) rotateY(5deg)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      backgroundImage: {
        "stadium-gradient": "linear-gradient(135deg, #137B10 0%, #228B22 50%, #32CD32 100%)",
      },
    },
  },
  plugins: [],
}