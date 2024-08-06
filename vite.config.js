import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    vue(),
    UnoCSS({
      configFile: "./uno.config.js",
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          "@/store/index.js": ["useMainStore"],
          "@/utils/useProgres.js": ["useProgres"],
          "@/components/MessageBox/messageBox.js": [["default", "MessageBox"]],
          // "@/utils/request.js": [["default", "useRequest"]],
        },
      ],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
      dts: "./auto-imports.d.ts",
      vueTemplate: false,
    }),
    Components({
      dts: "./components.d.ts",
    }),
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://dev.usemock.com/65e8005d48882231b5644106/",
        // target: "http://127.0.0.1:3010",
        changeOrigin: true,
      },
    },
  },
});
