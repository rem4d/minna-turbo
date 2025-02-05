import type { Config } from "tailwindcss";
import baseConfig from "@rem4d/tailwind-config/client";

export default {
  content: [...baseConfig.content],
  // presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        butterflyBush: "#8F74B9",
        lightGray: "#f3f3f3",
        wildSand: "#f5f5f5",
        pacificBlue: "#0098C2",
        mercury: "#E5E5E5",
        grayChateau: "#9CA2AA",
        polar: "#E0F3F7",
        scooter: "#2FB0C6",
        halfDutchWhite: "#FEF7DA",
        supernova: "#FFCC00",
        black: "#3E3D37",
        boulder: "#7A7A7A",
        heatheredGray: "#B6AC94",
        jumbo: "#858588",
        white: "#fff",
        frenchGray: "#C5C5C7",
        silver: "#c5c5c5",
        denim: "#1673D9",
        scorpion: "#595959",
        rollingStone: "#72777A",
        azureRadiance: "#007AFF",
        mineShaft: "#323232",
      },
      fontFamily: {
        epkyoka: ["Epkyoka"],
        klee: ["Klee"],
        inter: ["Inter"],
        yuGothic: ["yuGothic"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} satisfies Config;
