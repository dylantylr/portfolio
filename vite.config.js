import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = (path) => fileURLToPath(new URL(path, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute, not "", because /recruiter/ is a nested path: relative asset URLs
  // would resolve to /recruiter/assets/... and 404. The site is served from the
  // root of dylntylr.com, so "/" is correct for both entries.
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: entry('./index.html'),
        recruiter: entry('./recruiter/index.html'),
      },
    },
  },
})
