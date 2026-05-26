/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        pulseRed: "pulseRed 1.2s ease-in-out infinite",
        siren: "siren 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite"
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(239, 68, 68, 0.45)",
            transform: "scale(1)"
          },
          "50%": {
            boxShadow: "0 0 38px rgba(239, 68, 68, 0.95)",
            transform: "scale(1.03)"
          }
        },
        siren: {
          "0%, 100%": {
            opacity: "1",
            transform: "rotate(-5deg)"
          },
          "50%": {
            opacity: "0.7",
            transform: "rotate(5deg)"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-6px)"
          }
        }
      }
    }
  },
  plugins: []
};