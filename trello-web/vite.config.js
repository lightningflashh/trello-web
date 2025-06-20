import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // This is important for relative paths to work correctly in production
  resolve: {
    alias: { '~': path.resolve(__dirname, 'src') }
  }
})
