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

  // Get visitor analytics
  if (path === '/visitors/analytics' && method === 'GET') {
    try {
      const url = new URL(request.url)
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

  return new Response('Visitor endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
