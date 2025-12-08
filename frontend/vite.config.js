////////////////                  OLD  ORIGINNAL CODE                /////////////////////////

// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'
// export default defineConfig({
//   plugins: [
//     tailwindcss(),   
//     react()
//   ],
// })


////////////////////////         NEW GPT CODE               //////////////////////////////

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:8000', // Your backend server
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:3000', // Proxy Socket.IO if needed
        ws: true, // enable websocket proxy
      }
    }
  }
})




// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         fadeInUp: 'fadeInUp 0.8s ease-out forwards',
//         slideInRight: 'slideInRight 1s ease-out forwards',
//       },
//       keyframes: {
//         fadeInUp: {
//           '0%': { opacity: 0, transform: 'translateY(30px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' },
//         },
//         slideInRight: {
//           '0%': { opacity: 0, transform: 'translateX(60px)' },
//           '100%': { opacity: 1, transform: 'translateX(0)' },
//         },
//       },
//     },
//   },
// };