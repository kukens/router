import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
resolve: {
    alias: {
      // Ensure this is defined here, not just in tsconfig.json
      "~": path.resolve(__dirname, "./app"), 
    },
  },
  plugins: [reactRouter(), tsconfigPaths(), devtoolsJson()],
});