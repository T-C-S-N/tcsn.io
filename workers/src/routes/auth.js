/**
 * Authentication routes for Cloudflare Worker
 */

import { sign, verify } from '../utils/jwt.js'
import { hashPassword, verifyPassword } from '../utils/crypto.js'

export async function authRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // Handle POST requests with action-based routing (for Google OAuth and other actions)
  if (path === '/auth' && method === 'POST') {
    try {
      const body = await request.json()
      const { action } = body

      // Google OAuth Login
      if (action === 'google-login') {
        const { idToken } = body
        
        // Verify Google ID token
        try {
          // Call Google's token verification API
          const googleResponse = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
          )
          
          if (!googleResponse.ok) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Invalid Google token' 
            }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const googleData = await googleResponse.json()
          const { email, name, picture } = googleData

          // Check if user is admin
          const isAdmin = email === 'tomas@tcsn.io'

          // Check if user exists in database
          let user = await env.DB.prepare(
            'SELECT * FROM users WHERE email = ?'
          ).bind(email).first()

          // Create user if doesn't exist
          if (!user) {
            const result = await env.DB.prepare(
              'INSERT INTO users (email, name, role, created_at) VALUES (?, ?, ?, ?)'
            ).bind(
              email, 
              name, 
              isAdmin ? 'admin' : 'user',
              new Date().toISOString()
            ).run()

            user = {
              id: result.lastRowId,
              email,
              name,
              role: isAdmin ? 'admin' : 'user'
            }
          }

          // Create JWT token
          const token = await sign({ 
            userId: user.id, 
            email: user.email,
            name: user.name || name,
            role: user.role,
            picture
          }, env.JWT_SECRET || 'default-secret')

          return new Response(JSON.stringify({ 
            success: true,
            token, 
            user: { 
              id: user.id, 
              email: user.email, 
              name: user.name || name,
              role: user.role,
              picture,
              isAdmin
            } 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Google OAuth error:', error)
          return new Response(JSON.stringify({ 
            success: false,
            error: 'Google authentication failed',
            details: error.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      // Verify token action
      if (action === 'verify-token') {
        const { token } = body
        
        try {
          const payload = await verify(token, env.JWT_SECRET || 'default-secret')
          
          return new Response(JSON.stringify({ 
            success: true,
            valid: true, 
            user: payload 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false,
            error: 'Invalid token' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      // Logout action
      if (action === 'logout') {
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Logged out successfully' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unknown action' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Auth POST error:', error)
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Request processing failed',
        details: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Login endpoint
  if (path === '/auth/login' && method === 'POST') {
    try {
      const { email, password } = await request.json()
      
      // Get user from D1 database
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first()

      if (!user || !await verifyPassword(password, user.password_hash)) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create JWT token
      const token = await sign({ userId: user.id, email: user.email }, env.JWT_SECRET)

      return new Response(JSON.stringify({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name } 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Login failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Register endpoint
  if (path === '/auth/register' && method === 'POST') {
    try {
      const { email, password, name } = await request.json()
      
      // Check if user already exists
      const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
      ).bind(email).first()

      if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password)
      
      const result = await env.DB.prepare(
        'INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)'
      ).bind(email, passwordHash, name, new Date().toISOString()).run()

      // Create JWT token
      const token = await sign({ userId: result.meta.last_row_id, email }, env.JWT_SECRET)

      return new Response(JSON.stringify({ 
        token, 
        user: { id: result.meta.last_row_id, email, name } 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Registration failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Verify token endpoint
  if (path === '/auth/verify' && method === 'POST') {
    try {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'No token provided' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const token = authHeader.substring(7)
      const payload = await verify(token, env.JWT_SECRET)

      return new Response(JSON.stringify({ valid: true, user: payload }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Default auth endpoint - list available endpoints
  if (path === '/auth' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Authentication API endpoints',
      endpoints: [
        'GET /auth - This endpoint (lists available endpoints)',
        'POST /auth (action: google-login) - Google OAuth login',
        'POST /auth (action: verify-token) - Verify JWT token',
        'POST /auth (action: logout) - Logout user',
        'POST /auth/login - Email/password login',
        'POST /auth/register - User registration',
        'POST /auth/verify - Verify JWT token (alternative endpoint)'
      ],
      actions: {
        'google-login': 'Google OAuth authentication',
        'verify-token': 'Verify existing JWT token',
        'logout': 'End user session'
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response('Auth endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
