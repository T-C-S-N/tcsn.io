/**
 * Analytics routes for Cloudflare Worker
 */

export async function analyticsRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // Get site analytics
  if (path === '/analytics/site' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const days = parseInt(url.searchParams.get('days') || '30')
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get daily page views
      const dailyViews = await env.DB.prepare(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as unique_visitors
        FROM page_visits 
        WHERE created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `).bind(startDate.toISOString()).all()

      // Get top pages
      const topPages = await env.DB.prepare(`
        SELECT 
          page,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as unique_visitors
        FROM page_visits 
        WHERE created_at >= ?
        GROUP BY page
        ORDER BY views DESC
        LIMIT 10
      `).bind(startDate.toISOString()).all()

      // Get top countries
      const topCountries = await env.DB.prepare(`
        SELECT 
          country,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as unique_visitors
        FROM page_visits 
        WHERE created_at >= ? AND country IS NOT NULL
        GROUP BY country
        ORDER BY views DESC
        LIMIT 10
      `).bind(startDate.toISOString()).all()

      // Get referrers
      const topReferrers = await env.DB.prepare(`
        SELECT 
          referrer,
          COUNT(*) as views
        FROM page_visits 
        WHERE created_at >= ? AND referrer IS NOT NULL AND referrer != ''
        GROUP BY referrer
        ORDER BY views DESC
        LIMIT 10
      `).bind(startDate.toISOString()).all()

      return new Response(JSON.stringify({
        dailyViews: dailyViews.results,
        topPages: topPages.results,
        topCountries: topCountries.results,
        topReferrers: topReferrers.results
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

  // Default analytics endpoint - list available endpoints
  if (path === '/analytics' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Analytics API endpoints',
      endpoints: [
        'GET /api/analytics - This endpoint (lists available endpoints)',
        'GET /api/analytics/site?days=30 - Get site analytics for specified days',
        'GET /api/analytics/realtime - Get real-time analytics'
      ]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response('Analytics endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
