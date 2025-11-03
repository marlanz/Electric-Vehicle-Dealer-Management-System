/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        figma: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
        detail: "0px -4px 4px 0px rgba(0, 0, 0, 0.02)",
      },
      colors: {
        secondary: "#959CA7",
        gray: "#1C242D",
        dark: "#0B1220",
        green: {
          100: "#2A9083",
          200: "#16D68F",
        },
        blue: "#1173D4",
        error: "#F14141",
        success: "#2F9B65",
      },
      fontFamily: {
        msr: ["Montserrat-Regular", "sans-serif"],
        "msr-bold": ["Montserrat-Bold", "sans-serif"],
        "msr-sbold": ["Montserrat-SemiBold", "sans-serif"],
        "msr-ebold": ["Montserrat-ExtraBold", "sans-serif"],
        "msr-medium": ["Montserrat-Medium", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(66deg, #FD8200 0%, #EB4F26 100%)",
      },
    },
  },
  plugins: [],
};
