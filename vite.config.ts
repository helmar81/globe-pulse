import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'; // removed loadEnv as we don't need to manually shim process.env anymore
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Allows access from network (0.0.0.0)
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});