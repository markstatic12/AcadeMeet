import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validate required environment variables
  const apiBaseUrl = env.VITE_API_BASE_URL;
  if (!apiBaseUrl && mode === 'production') {
    throw new Error('VITE_API_BASE_URL must be defined in .env file for production');
  }
  
  return {
    plugins: [
      react(),
      {
        name: 'security-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Content Security Policy
            res.setHeader(
              'Content-Security-Policy',
              [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline'",  // React needs inline for HMR in dev
                "style-src 'self' 'unsafe-inline'",   // Tailwind uses inline styles
                "img-src 'self' data: https:",
                "font-src 'self' data:",
                `connect-src 'self' ${apiBaseUrl || 'http://localhost:8080'}`,
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'"
              ].join('; ')
            );
            
            // Prevent clickjacking
            res.setHeader('X-Frame-Options', 'DENY');
            
            // Prevent MIME-type sniffing
            res.setHeader('X-Content-Type-Options', 'nosniff');
            
            // XSS Protection (legacy browsers)
            res.setHeader('X-XSS-Protection', '1; mode=block');
            
            // Referrer Policy
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            
            // Permissions Policy
            res.setHeader(
              'Permissions-Policy',
              'geolocation=(), microphone=(), camera=()'
            );
            
            next();
          });
        }
      }
    ],
    server: {
      port: 5173,
      https: false,  // Set to true for local HTTPS testing
    },
    build: {
      rollupOptions: {
        output: {
          // Add integrity hashes for security
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]'
        }
      }
    }
  };
})
