import type { Config } from "tailwindcss";

type ExtendedConfig = Config & {
  daisyui?: {
    themes?: Array<string | Record<string, any>>;
    [key: string]: any;
  };
};

const config: ExtendedConfig = {
  // Use class-based dark mode so we don't automatically follow the user's OS setting.
  // This prevents Tailwind's `dark:` utilities from applying unless a `.dark` class is added.
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can add custom theme extensions here if needed
    },
  },
  plugins: [
    require("daisyui"), // Add this line
  ],
  // DaisyUI configuration: restrict to light theme only
  daisyui: {
    themes: ["light"],
  },
};
export default config;
