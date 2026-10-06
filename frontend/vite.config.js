import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5170,
    strictPort: true,
  },
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     hmr: {
//       clientPort: 5173,
//     },
//     watch: {
//       usePolling: true, // Guarantees file changes on Windows trigger a rebuild immediately
//     },
//   },
// optimizeDeps: {
//   include: [
//     '@mui/material',
//     '@mui/material/styles',
//     '@emotion/react',
//     '@emotion/styled',
//   ],
// },
// });
