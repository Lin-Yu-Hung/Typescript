import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  base: "Typescript/",
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
  ],
});