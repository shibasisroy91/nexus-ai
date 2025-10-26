import type { Config } from "tailwindcss";

type ExtendedConfig = Config & {
  daisyui?: {
    themes?: Array<string | Record<string, any>>;
    [key: string]: any;
  };
};

const config: ExtendedConfig = {
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
  // Optional: DaisyUI configuration (themes, etc.)
  daisyui: {
    themes: ["light", "dark"], // You can specify which themes you want to use
  },
};
export default config;
