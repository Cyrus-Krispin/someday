import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-native-web', { commonjs: true }]],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: { 'react-native': 'react-native-web' },
  },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
  },
});
