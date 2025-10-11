/**
 * Projects routes for Cloudflare Worker
 */

export async function projectRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // Get all projects
  if (path === '/projects' && method === 'GET') {
    try {
      const projects = await env.DB.prepare(`
        SELECT * FROM projects 
        WHERE published = true 
        ORDER BY created_at DESC
      `).all()

      return new Response(JSON.stringify(projects.results), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Projects fetch error:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Get single project
  if (path.startsWith('/projects/') && method === 'GET') {
    try {
      const projectId = path.split('/')[2]
      
      const project = await env.DB.prepare(`
        SELECT * FROM projects WHERE id = ? AND published = true
      `).bind(projectId).first()

      if (!project) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(project), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Project fetch error:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch project' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Create project (admin only)
  if (path === '/projects' && method === 'POST') {
    try {
      // TODO: Add authentication middleware
      const data = await request.json()
      const {
        title,
        description,
        content,
        technologies,
        githubUrl,
        liveUrl,
        imageUrl,
        published = false
      } = data

      const result = await env.DB.prepare(`
        INSERT INTO projects (
          title, description, content, technologies, 
          github_url, live_url, image_url, published, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        title,
        description,
        content,
        JSON.stringify(technologies),
        githubUrl,
        liveUrl,
        imageUrl,
        published,
        new Date().toISOString()
      ).run()

      return new Response(JSON.stringify({ 
        id: result.meta.last_row_id,
        message: 'Project created successfully' 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Project creation error:', error)
      return new Response(JSON.stringify({ error: 'Failed to create project' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response('Project endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
