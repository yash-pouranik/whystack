import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingoCompilerPlugin } from '@lingo.dev/compiler/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceLocale: 'en',
      targetLocales: ['eu', 'fr'],
    }),
    react()
  ],
  server: {
    proxy: {
      // Proxy all API routes to backend, except /auth/callback (frontend route)
      '^/(auth/(github|me|logout|dev-login)|projects|decisions)': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
