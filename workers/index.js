/**
 * Cloudflare Worker for TCSN.io
 * Handles API requests, database operations, and serves the Vue app
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, env, url, corsHeaders);
      }

      // Serve static assets (will be handled by Cloudflare Pages)
      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
};

/**
 * Handle API requests
 */
async function handleApiRequest(request, env, url, corsHeaders) {
  const path = url.pathname.replace('/api/', '');
  const method = request.method;

  // MongoDB connection helper
  const getMongoClient = async () => {
    if (!env.MONGO_URI) {
      throw new Error('MongoDB URI not configured');
    }
    
    // For Cloudflare Workers, we'll use MongoDB Data API or Atlas App Services
    // Since native MongoDB driver doesn't work in Workers, use Data API
    return {
      uri: env.MONGO_URI,
      dbName: env.MONGO_DB_NAME || 'tcsnio'
    };
  };

  // Route handlers
  const routes = {
    // Visitors API
    'visitors': async () => {
      if (method === 'GET') {
        // List visitors
        const visitors = await env.DB.prepare(
          'SELECT * FROM visitors ORDER BY created_at DESC LIMIT 20'
        ).all();
        
        return jsonResponse({ success: true, visitors: visitors.results }, corsHeaders);
      } else if (method === 'POST') {
        // Create visitor
        const data = await request.json();
        const { action, visitor } = data;
        
        if (action === 'create') {
          const result = await env.DB.prepare(
            `INSERT INTO visitors (visitor_id, session_id, generated_name, ip_address, user_agent, browser, os, device_type, location, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
          ).bind(
            visitor.visitorId,
            visitor.sessionId,
            visitor.generatedName,
            visitor.ipAddress,
            visitor.userAgent,
            visitor.browser,
            visitor.os,
            visitor.deviceType,
            JSON.stringify(visitor.location)
          ).run();
          
          return jsonResponse({ 
            success: true, 
            message: 'Visitor created',
            visitorId: visitor.visitorId 
          }, corsHeaders);
        }
      }
      
      return jsonResponse({ success: false, message: 'Invalid request' }, corsHeaders, 400);
    },

    // Visitor Analytics API
    'visitor-analytics': async () => {
      const action = url.searchParams.get('action');
      
      if (method === 'GET') {
        if (action === 'analytics_summary') {
          // Get analytics summary
          const summary = await env.DB.prepare(
            'SELECT event_type, COUNT(*) as count, MAX(timestamp) as latest_event FROM visitor_analytics GROUP BY event_type'
          ).all();
          
          return jsonResponse({ 
            success: true, 
            summary: summary.results 
          }, corsHeaders);
        } else if (action === 'popular_pages') {
          // Get popular pages
          const pages = await env.DB.prepare(
            `SELECT 
              json_extract(data, '$.page') as page,
              COUNT(*) as views,
              COUNT(DISTINCT visitor_id) as unique_visitors
             FROM visitor_analytics 
             WHERE event_type = 'page_entry'
             GROUP BY page
             ORDER BY views DESC
             LIMIT 10`
          ).all();
          
          return jsonResponse({ 
            success: true, 
            pages: pages.results 
          }, corsHeaders);
        } else if (action === 'active_visitors') {
          // Get active visitors (last 5 minutes)
          const visitors = await env.DB.prepare(
            `SELECT DISTINCT visitor_id, session_id 
             FROM visitor_analytics 
             WHERE timestamp > datetime('now', '-5 minutes')`
          ).all();
          
          return jsonResponse({ 
            success: true, 
            count: visitors.results.length,
            visitors: visitors.results 
          }, corsHeaders);
        }
      } else if (method === 'POST') {
        // Record event
        const data = await request.json();
        const { eventType, visitorId, sessionId, data: eventData } = data;
        
        const result = await env.DB.prepare(
          `INSERT INTO visitor_analytics (event_type, visitor_id, session_id, data, timestamp)
           VALUES (?, ?, ?, ?, datetime('now'))`
        ).bind(
          eventType,
          visitorId,
          sessionId,
          JSON.stringify(eventData)
        ).run();
        
        return jsonResponse({ 
          success: true, 
          message: 'Event recorded' 
        }, corsHeaders);
      }
      
      return jsonResponse({ success: false, message: 'Invalid request' }, corsHeaders, 400);
    },

    // URL Shortener API
    'url-shortener': async () => {
      const action = url.searchParams.get('action') || (await request.json()).action;
      
      if (method === 'GET') {
        if (action === 'get') {
          const shortCode = url.searchParams.get('shortCode');
          const urlData = await env.DB.prepare(
            'SELECT * FROM short_urls WHERE short_code = ?'
          ).bind(shortCode).first();
          
          if (!urlData) {
            return jsonResponse({ success: false, message: 'Short URL not found' }, corsHeaders, 404);
          }
          
          return jsonResponse({ 
            success: true, 
            urlData: {
              ...urlData,
              analytics: JSON.parse(urlData.analytics || '{}')
            }
          }, corsHeaders);
        } else if (action === 'list') {
          const limit = parseInt(url.searchParams.get('limit')) || 50;
          const urls = await env.DB.prepare(
            'SELECT * FROM short_urls ORDER BY created_at DESC LIMIT ?'
          ).bind(limit).all();
          
          return jsonResponse({ 
            success: true, 
            urls: urls.results.map(u => ({
              ...u,
              analytics: JSON.parse(u.analytics || '{}')
            })),
            count: urls.results.length 
          }, corsHeaders);
        }
      } else if (method === 'POST') {
        const data = await request.json();
        
        if (data.action === 'create') {
          const { urlData } = data;
          
          // Check if short code exists
          const existing = await env.DB.prepare(
            'SELECT short_code FROM short_urls WHERE short_code = ?'
          ).bind(urlData.shortCode).first();
          
          if (existing) {
            return jsonResponse({ success: false, message: 'Short code already exists' }, corsHeaders, 400);
          }
          
          // Insert new short URL
          await env.DB.prepare(
            `INSERT INTO short_urls (short_code, original_url, description, tracking_enabled, clicks, analytics, created_at, updated_at)
             VALUES (?, ?, ?, ?, 0, ?, datetime('now'), datetime('now'))`
          ).bind(
            urlData.shortCode,
            urlData.originalUrl,
            urlData.description || '',
            urlData.trackingEnabled ? 1 : 0,
            JSON.stringify(urlData.analytics || {})
          ).run();
          
          return jsonResponse({ 
            success: true, 
            message: 'Short URL created',
            shortCode: urlData.shortCode 
          }, corsHeaders);
        } else if (data.action === 'track_click') {
          const { shortCode, clickData } = data;
          
          // Insert click record
          await env.DB.prepare(
            `INSERT INTO url_clicks (short_code, visitor_id, session_id, referrer, user_agent, location, device, browser, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
          ).bind(
            shortCode,
            clickData.visitorId,
            clickData.sessionId,
            clickData.referrer,
            clickData.userAgent,
            JSON.stringify(clickData.location),
            JSON.stringify(clickData.device),
            JSON.stringify(clickData.browser)
          ).run();
          
          // Update click count
          await env.DB.prepare(
            'UPDATE short_urls SET clicks = clicks + 1, updated_at = datetime(\'now\') WHERE short_code = ?'
          ).bind(shortCode).run();
          
          return jsonResponse({ success: true, message: 'Click tracked' }, corsHeaders);
        }
      }
      
      return jsonResponse({ success: false, message: 'Invalid request' }, corsHeaders, 400);
    },

    // MongoDB API (for external MongoDB operations)
    'mongodb': async () => {
      const mongo = await getMongoClient();
      const data = await request.json();
      const { action, collection, query, document } = data;
      
      // Use MongoDB Data API
      const dataApiUrl = `${env.MONGO_DATA_API_URL}/action/${action}`;
      const dataApiKey = env.MONGO_DATA_API_KEY;
      
      if (!dataApiKey) {
        return jsonResponse({ 
          success: false, 
          message: 'MongoDB Data API not configured' 
        }, corsHeaders, 500);
      }
      
      const response = await fetch(dataApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': dataApiKey,
        },
        body: JSON.stringify({
          dataSource: 'Cluster0',
          database: mongo.dbName,
          collection,
          ...data
        })
      });
      
      const result = await response.json();
      return jsonResponse(result, corsHeaders);
    },

    // Auth API
    'auth': async () => {
      const data = await request.json();
      const { action } = data;
      
      if (action === 'google-signin') {
        const { token } = data;
        
        // Verify Google token
        const googleResponse = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
        );
        
        if (!googleResponse.ok) {
          return jsonResponse({ 
            success: false, 
            message: 'Invalid Google token' 
          }, corsHeaders, 401);
        }
        
        const googleData = await googleResponse.json();
        
        // Check if user is admin (tomas@tcsn.io)
        if (googleData.email !== 'tomas@tcsn.io') {
          return jsonResponse({ 
            success: false, 
            message: 'Unauthorized' 
          }, corsHeaders, 403);
        }
        
        // Generate JWT
        // Note: For production, use a proper JWT library or edge-compatible solution
        const jwtPayload = {
          email: googleData.email,
          name: googleData.name,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
        };
        
        return jsonResponse({ 
          success: true, 
          user: {
            email: googleData.email,
            name: googleData.name
          },
          token: btoa(JSON.stringify(jwtPayload)) // Simple encoding for demo
        }, corsHeaders);
      }
      
      return jsonResponse({ success: false, message: 'Invalid action' }, corsHeaders, 400);
    }
  };

  // Find matching route
  const routeKey = Object.keys(routes).find(key => path.startsWith(key));
  
  if (routeKey && routes[routeKey]) {
    return await routes[routeKey]();
  }

  return jsonResponse({ 
    success: false, 
    message: 'API endpoint not found' 
  }, corsHeaders, 404);
}

/**
 * Helper to create JSON response
 */
function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
