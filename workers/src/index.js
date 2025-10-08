/**
 * Cloudflare Worker for TCSN.io Backend
 * Handles API requests and serves the Vue.js frontend
 */

import { authRoutes } from './routes/auth.js'
import { visitorRoutes } from './routes/visitors.js'
import { projectRoutes } from './routes/projects.js'
import { analyticsRoutes } from './routes/analytics.js'

// Frontend HTML template with inline styles for basic loading
const FRONTEND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TCSN.io</title>
  <meta name="description" content="TCSN - Technology, Creativity, and Innovation">
  
  <!-- Favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" href="/favicon.ico">
  
  <style>
    /* Basic loading styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #0a0a0a;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    #app {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .loading {
      text-align: center;
      padding: 50px;
    }
    
    .loading h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
      background: linear-gradient(45deg, #00ff88, #0088ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .loading p {
      color: #888;
      font-size: 1.1em;
    }
    
    .spinner {
      border: 3px solid #333;
      border-top: 3px solid #00ff88;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      color: #ff6b6b;
      background: #2a1a1a;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .nav {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin: 20px 0;
    }
    
    .nav a {
      color: #00ff88;
      text-decoration: none;
      padding: 10px 20px;
      border: 1px solid #00ff88;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .nav a:hover {
      background: #00ff88;
      color: #000;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="loading">
      <h1>TCSN.io</h1>
      <div class="spinner"></div>
      <p>Loading application...</p>
      
      <div class="nav">
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/contact">Contact</a>
        <a href="/dashboard">Dashboard</a>
      </div>
      
      <div id="fallback-content" style="display: none;">
        <div class="error">
          <h3>JavaScript Required</h3>
          <p>This application requires JavaScript to run. Please enable JavaScript and refresh the page.</p>
          <p>If you continue to have issues, please contact us at <a href="mailto:hello@tcsn.io" style="color: #00ff88;">hello@tcsn.io</a></p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Show fallback content if JS assets fail to load
    setTimeout(() => {
      const app = document.getElementById('app');
      if (app && app.innerHTML.includes('Loading application')) {
        document.getElementById('fallback-content').style.display = 'block';
      }
    }, 10000); // 10 second timeout
    
    // Try to load the main application assets
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.crossOrigin = '';
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    const loadCSS = (href) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.crossOrigin = '';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    };
    
    // Load application assets
    Promise.all([
      loadCSS('/assets/index-Dr8EI42-.css').catch(() => console.warn('Failed to load main CSS')),
      loadScript('/assets/vendor-BnNewJj9.js').catch(() => console.warn('Failed to load vendor JS')),
      loadScript('/assets/index-RgNp7f0H.js').catch(() => console.warn('Failed to load main JS'))
    ]).then(() => {
      console.log('Assets loaded successfully');
    }).catch((error) => {
      console.error('Failed to load some assets:', error);
      // App might still work with partial loading
    });
  </script>
</body>
</html>`

/**
 * Serve the frontend application
 */
async function serveFrontend(request, env, path, corsHeaders) {
  // Handle static assets
  if (path.startsWith('/assets/') || 
      path.endsWith('.ico') || 
      path.endsWith('.png') || 
      path.endsWith('.svg') || 
      path.endsWith('.jpg') || 
      path.endsWith('.jpeg') || 
      path.endsWith('.gif') ||
      path.endsWith('.css') ||
      path.endsWith('.js') ||
      path.startsWith('/generative/') ||
      path.startsWith('/images/') ||
      path.startsWith('/tcsn/')) {
    
    // Try to serve from KV storage first (if assets are stored there)
    if (env.ASSETS) {
      try {
        const asset = await env.ASSETS.get(path, { type: 'arrayBuffer' })
        if (asset) {
          return new Response(asset, {
            headers: {
              'Content-Type': getContentType(path),
              'Cache-Control': 'public, max-age=31536000', // 1 year cache
              ...corsHeaders
            }
          })
        }
      } catch (error) {
        console.log('Asset not found in KV:', path)
      }
    }
    
    // Fallback: For development, you might want to proxy to a dev server
    // or return a placeholder response
    if (path.startsWith('/assets/')) {
      // Return empty response for missing JS/CSS assets to prevent errors
      const contentType = getContentType(path)
      const emptyContent = contentType.includes('javascript') ? '// Asset not available' : 
                          contentType.includes('css') ? '/* Asset not available */' : ''
      
      return new Response(emptyContent, {
        headers: {
          'Content-Type': contentType,
          ...corsHeaders
        }
      })
    }
    
    // For other static assets, return 404
    return new Response('Asset not found', { 
      status: 404, 
      headers: corsHeaders 
    })
  }
  
  // For all other routes (/, /projects, /contact, etc.), serve the SPA
  return new Response(FRONTEND_HTML, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
      ...corsHeaders
    }
  })
}

/**
 * Get content type from file extension
 */
function getContentType(path) {
  const ext = path.split('.').pop()?.toLowerCase()
  
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'txt': 'text/plain'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        const apiPath = path.substring(4) // Remove '/api' prefix
        
        // Route to appropriate handlers
        if (apiPath.startsWith('/auth')) {
          return await authRoutes(request, env, apiPath, corsHeaders)
        }
        
        if (apiPath.startsWith('/visitors')) {
          return await visitorRoutes(request, env, apiPath, corsHeaders)
        }
        
        if (apiPath.startsWith('/projects')) {
          return await projectRoutes(request, env, apiPath, corsHeaders)
        }
        
        if (apiPath.startsWith('/analytics')) {
          return await analyticsRoutes(request, env, apiPath, corsHeaders)
        }
        
        // API 404
        return new Response('API endpoint not found', {
          status: 404,
          headers: corsHeaders,
        })
      }

      // Serve frontend for all non-API routes
      return await serveFrontend(request, env, path, corsHeaders)

    } catch (error) {
      console.error('Worker error:', error)
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      })
    }
  },
}
