/**
 * Visitor tracking routes for Cloudflare Worker
 */

export async function visitorRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // Track page visit
  if (path === '/visitors/track' && method === 'POST') {
    try {
      const data = await request.json()
      const {
        page,
        userAgent,
        referrer,
        timestamp,
        sessionId,
        visitorId,
        country,
        city
      } = data

      // Store in D1 database
      await env.DB.prepare(`
        INSERT INTO page_visits (
          page, user_agent, referrer, timestamp, session_id, 
          visitor_id, country, city, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        page,
        userAgent,
        referrer,
        timestamp,
        sessionId,
        visitorId,
        country || null,
        city || null,
        new Date().toISOString()
      ).run()

      // Also cache recent visits in KV for quick access
      const recentVisitsKey = `recent_visits:${new Date().toISOString().split('T')[0]}`
      const existingVisits = await env.CACHE.get(recentVisitsKey, 'json') || []
      existingVisits.push({
        page,
        timestamp,
        visitorId,
        country,
        city
      })

      // Keep only last 1000 visits in cache
      if (existingVisits.length > 1000) {
        existingVisits.splice(0, existingVisits.length - 1000)
      }

      await env.CACHE.put(recentVisitsKey, JSON.stringify(existingVisits), {
        expirationTtl: 86400 // 24 hours
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Visitor tracking error:', error)
      return new Response(JSON.stringify({ error: 'Tracking failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Record visitor analytics event
  if (path === '/visitors/analytics' && method === 'POST') {
    try {
      const data = await request.json()
      
      // Extract common fields
      const visitorId = data.visitorId || data.visitor_id || 'unknown'
      const sessionId = data.sessionId || data.session_id || 'unknown'
      const event = data.event || data.type || data.action || 'analytics_event'
      const page = data.page || data.url || '/'
      const timestamp = data.timestamp || new Date().toISOString()
      
      // Store analytics event in visitor_interactions table
      await env.DB.prepare(`
        INSERT INTO visitor_interactions 
        (visitor_id, session_id, interaction_type, page, timestamp, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        visitorId,
        sessionId,
        event,
        page,
        timestamp,
        JSON.stringify(data)
      ).run()

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Analytics recording error:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to record analytics event', 
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Get visitor analytics
  if (path === '/visitors/analytics' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const action = url.searchParams.get('action')
      const sessionId = url.searchParams.get('sessionId')

      // Handle specific actions
      if (action === 'session_duration' && sessionId) {
        // Get session duration for a specific session
        const sessionData = await env.DB.prepare(`
          SELECT 
            MIN(timestamp) as start_time,
            MAX(timestamp) as end_time,
            COUNT(*) as interactions
          FROM visitor_interactions 
          WHERE session_id = ?
        `).bind(sessionId).first()

        if (sessionData && sessionData.start_time && sessionData.end_time) {
          const duration = new Date(sessionData.end_time).getTime() - new Date(sessionData.start_time).getTime()
          return new Response(JSON.stringify({
            sessionId,
            duration: Math.floor(duration / 1000), // in seconds
            interactions: sessionData.interactions,
            startTime: sessionData.start_time,
            endTime: sessionData.end_time
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } else {
          return new Response(JSON.stringify({
            sessionId,
            duration: 0,
            interactions: 0
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      if (action === 'pages_visited' && sessionId) {
        // Get pages visited in a specific session
        const pages = await env.DB.prepare(`
          SELECT DISTINCT page, timestamp
          FROM page_visits 
          WHERE session_id = ?
          ORDER BY timestamp
        `).bind(sessionId).all()

        return new Response(JSON.stringify({
          sessionId,
          pages: pages.results || []
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Default analytics - general overview
      const days = parseInt(url.searchParams.get('days') || '7')
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get analytics from D1
      const visits = await env.DB.prepare(`
        SELECT 
          page,
          country,
          city,
          DATE(created_at) as date,
          COUNT(*) as count
        FROM page_visits 
        WHERE created_at >= ?
        GROUP BY page, country, city, DATE(created_at)
        ORDER BY created_at DESC
      `).bind(startDate.toISOString()).all()

      // Get unique visitors
      const uniqueVisitors = await env.DB.prepare(`
        SELECT COUNT(DISTINCT visitor_id) as count
        FROM page_visits 
        WHERE created_at >= ?
      `).bind(startDate.toISOString()).first()

      // Get top pages
      const topPages = await env.DB.prepare(`
        SELECT 
          page,
          COUNT(*) as visits,
          COUNT(DISTINCT visitor_id) as unique_visitors
        FROM page_visits 
        WHERE created_at >= ?
        GROUP BY page
        ORDER BY visits DESC
        LIMIT 10
      `).bind(startDate.toISOString()).all()

      return new Response(JSON.stringify({
        visits: visits.results,
        uniqueVisitors: uniqueVisitors.count,
        topPages: topPages.results
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Analytics error:', error)
      return new Response(JSON.stringify({ error: 'Analytics failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Set visitor name
  if (path === '/visitors/name' && method === 'POST') {
    try {
      const body = await request.json()
      const { visitorId, name, browserData, visitCount, isReturningVisitor } = body

      if (!visitorId || !name) {
        return new Response(JSON.stringify({ error: 'Visitor ID and name required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update visitor name and browser data in D1
      await env.DB.prepare(`
        UPDATE visitors 
        SET name = ?, 
            browser_data = ?,
            visit_count = ?,
            is_returning = ?,
            updated_at = datetime('now')
        WHERE visitor_id = ?
      `).bind(
        name.trim(), 
        JSON.stringify(browserData || {}),
        visitCount || 1,
        isReturningVisitor ? 1 : 0,
        visitorId
      ).run()

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Set visitor name error:', error)
      return new Response(JSON.stringify({ error: 'Failed to set name' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Get visitor by ID
  if (path === '/visitors/get' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const visitorId = url.searchParams.get('id')

      if (!visitorId) {
        return new Response(JSON.stringify({ error: 'Visitor ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get visitor from D1
      const visitor = await env.DB.prepare(`
        SELECT visitor_id, name, created_at, updated_at
        FROM visitors 
        WHERE visitor_id = ?
      `).bind(visitorId).first()

      return new Response(JSON.stringify({ visitor }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Get visitor error:', error)
      return new Response(JSON.stringify({ error: 'Failed to get visitor' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Save visitor interaction
  if (path === '/visitors/interaction' && method === 'POST') {
    try {
      const body = await request.json()
      const { visitorId, sessionId, interactionType, element, page, data } = body

      if (!visitorId || !interactionType || !page) {
        return new Response(JSON.stringify({ error: 'Visitor ID, interaction type, and page required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Save interaction to D1
      await env.DB.prepare(`
        INSERT INTO visitor_interactions 
        (visitor_id, session_id, interaction_type, element, page, timestamp, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        visitorId,
        sessionId || 'unknown',
        interactionType,
        element || null,
        page,
        new Date().toISOString(),
        JSON.stringify(data || {}),
      ).run()

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Save interaction error:', error)
      return new Response(JSON.stringify({ error: 'Failed to save interaction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Default visitors endpoint - list available endpoints
  if (path === '/visitors' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Visitor API endpoints',
      endpoints: [
        'GET /visitors - This endpoint (lists available endpoints)',
        'POST /visitors/track - Track page visit',
        'GET /visitors/analytics - Get visitor analytics',
        'POST /visitors/name - Generate visitor name',
        'GET /visitors/get?visitorId=xxx - Get visitor details',
        'POST /visitors/interaction - Track visitor interaction'
      ]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response('Visitor endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
