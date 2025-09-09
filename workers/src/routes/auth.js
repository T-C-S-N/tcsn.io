/**
 * Authentication routes for Cloudflare Worker
 */

import { sign, verify } from '../utils/jwt.js'
import { hashPassword, verifyPassword } from '../utils/crypto.js'

export async function authRoutes(request, env, path, corsHeaders) {
  const method = request.method

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

  return new Response('Auth endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
