/**
 * Cloudflare Worker for TCSN.io Backend
 * Handles API requests and serves the Vue.js frontend
 */

// Import the routes
import { authRoutes } from './routes/auth.js'
import { visitorRoutes } from './routes/visitors.js'
import { projectRoutes } from './routes/projects.js'
import { analyticsRoutes } from './routes/analytics.js'

export default {
  async fetch(request, env, ctx) {
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

      // Serve static assets and frontend
      // For Cloudflare Pages, this would be handled automatically
      // This is a fallback for the worker-only deployment
      return new Response('Frontend should be served by Cloudflare Pages', {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html',
        },
      })

    } catch (error) {
      console.error('Worker error:', error)
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      })
    }
  },
}
