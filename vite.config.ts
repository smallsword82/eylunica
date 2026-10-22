import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        // Keep grade-5 material outside the initial app bundle and keep each
        // offline asset within Workbox's size limit as the catalog grows.
        manualChunks(id) {
          if (id.includes('/src/grade5/official-curriculum.json')) return 'grade5-curriculum';
          if (id.includes('/src/grade5/content/')) return 'grade5-lessons';
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "eylunica",
        short_name: "eylunica",
        lang: "tr",
        description: "Sessiz, reklamsız, çevrimdışı 5. sınıf matematik ve beceri macerası. Her zihin kendi ritminde.",
        theme_color: "#1b1238",
        background_color: "#1b1238",
        display: "standalone",
        orientation: "any",
        start_url: "./",
        scope: "./",
        categories: ["education", "kids"],
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,webp,woff2,mp3,wav}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
