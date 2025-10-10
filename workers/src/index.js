/**
 * Cloudflare Worker for TCSN.io Backend API
 * Handles API requests only - Frontend is served by Cloudflare Pages
 */

import { authRoutes } from './routes/auth.js'
import { visitorRoutes } from './routes/visitors.js'
import { projectRoutes } from './routes/projects.js'
import { analyticsRoutes } from './routes/analytics.js'
import { aiRoutes } from './routes/ai.js'
import { chatRoutes } from './routes/chat.js'

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
      // Root path - API info and health check
      if (path === '/' || path === '') {
        return new Response(JSON.stringify({
          name: 'TCSN.io API',
          version: '1.0.0',
          status: 'healthy',
          message: 'TCSN.io API is running',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'production',
          documentation: 'https://tcsn.io/api-docs',
          services: {
            database: 'connected',
            cache: 'connected'
          },
          endpoints: {
            health: '/',
            auth: '/auth/*',
            visitors: '/visitors/*',
            projects: '/projects/*',
            analytics: '/analytics/*',
            ai: '/ai/*',
            chat: '/chat/*'
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        })
      }
      
      // Route to appropriate handlers
      if (path.startsWith('/auth')) {
        return await authRoutes(request, env, path, corsHeaders)
      }
      
      if (path.startsWith('/visitors')) {
        return await visitorRoutes(request, env, path, corsHeaders)
      }
      
      if (path.startsWith('/projects')) {
        return await projectRoutes(request, env, path, corsHeaders)
      }
      
      if (path.startsWith('/analytics')) {
        return await analyticsRoutes(request, env, path, corsHeaders)
      }

      if (path.startsWith('/ai')) {
        return await aiRoutes(request, env, path, corsHeaders)
      }

      if (path.startsWith('/chat')) {
        return await chatRoutes(request, env, path, corsHeaders)
      }

      
      // Any other path - not found
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        path: path,
        message: 'This is an API-only worker. Frontend is served by Cloudflare Pages.',
        availableEndpoints: ['/auth', '/visitors', '/projects', '/analytics', '/ai']
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })

    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }
  },
}
