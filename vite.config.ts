import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/', replacement: `${__dirname}/src/` },
    ],
  },
  css: {
    modules:{
      scopeBehaviour: "local",
    },
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./src/styles/index.scss";`
      }
    }
  }
})
