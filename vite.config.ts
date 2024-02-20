/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: "info",
  plugins: [react()],
  /*
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@nostr-dev-kit/ndk": path.resolve(
        __dirname,
        "node_modules/@nostr-dev-kit/ndk"
      ),
    },
  },
  */
  /*
  optimizeDeps: {
    include: ["./ndk/ndk"],
  },
  */
});
