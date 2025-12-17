import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
resolve: {
    alias: {
      // Ensure this is defined here, not just in tsconfig.json
      "~": path.resolve(__dirname, "./app"), 
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), flowbiteReact()],
});