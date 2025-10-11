/**
 * Chat storage routes for AI conversations
 */

export async function chatRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // Store chat message
  if (path === '/chat/store' && method === 'POST') {
    try {
      const body = await request.json()
      const {
        visitorId,
        sessionId,
        messageType, // 'user' or 'assistant'
        content,
        conversationId,
        model,
        usage,
        timestamp
      } = body

      if (!visitorId || !messageType || !content) {
        return new Response(JSON.stringify({ 
          error: 'Visitor ID, message type, and content are required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Generate conversation ID if not provided
      const finalConversationId = conversationId || `conv_${visitorId}_${Date.now()}`

      // Store chat message in D1
      const result = await env.DB.prepare(`
        INSERT INTO chat_messages (
          visitor_id, session_id, conversation_id, message_type, 
          content, model, usage_tokens, usage_cost, timestamp, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        visitorId,
        sessionId || 'unknown',
        finalConversationId,
        messageType,
        content,
        model || null,
        usage?.total_tokens || null,
        usage?.cost || null,
        timestamp || new Date().toISOString()
      ).run()

      // Update conversation metadata
      await env.DB.prepare(`
        INSERT OR REPLACE INTO conversations (
          id, visitor_id, session_id, last_message_at, 
          message_count, total_tokens, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, 
          COALESCE((SELECT message_count FROM conversations WHERE id = ?), 0) + 1,
          COALESCE((SELECT total_tokens FROM conversations WHERE id = ?), 0) + ?,
          COALESCE((SELECT created_at FROM conversations WHERE id = ?), datetime('now')),
          datetime('now')
        )
      `).bind(
        finalConversationId,
        visitorId,
        sessionId || 'unknown',
        timestamp || new Date().toISOString(),
        finalConversationId,
        finalConversationId,
        usage?.total_tokens || 0,
        finalConversationId
      ).run()

      return new Response(JSON.stringify({ 
        success: true, 
        conversationId: finalConversationId,
        messageId: result.meta.last_row_id
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Store chat message error:', error)
      return new Response(JSON.stringify({ error: 'Failed to store chat message' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Get conversation history
  if (path === '/chat/history' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const visitorId = url.searchParams.get('visitorId')
      const conversationId = url.searchParams.get('conversationId')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      if (!visitorId) {
        return new Response(JSON.stringify({ error: 'Visitor ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      let query = `
        SELECT * FROM chat_messages 
        WHERE visitor_id = ?
      `
      let params = [visitorId]

      if (conversationId) {
        query += ` AND conversation_id = ?`
        params.push(conversationId)
      }

      query += ` ORDER BY timestamp ASC LIMIT ?`
      params.push(limit)

      const { results } = await env.DB.prepare(query).bind(...params).all()

      return new Response(JSON.stringify({ 
        success: true, 
        messages: results 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Get chat history error:', error)
      return new Response(JSON.stringify({ error: 'Failed to get chat history' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Get conversations list
  if (path === '/chat/conversations' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const visitorId = url.searchParams.get('visitorId')
      const limit = parseInt(url.searchParams.get('limit') || '20')

      if (!visitorId) {
        return new Response(JSON.stringify({ error: 'Visitor ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { results } = await env.DB.prepare(`
        SELECT 
          c.*,
          cm.content as last_message_preview
        FROM conversations c
        LEFT JOIN chat_messages cm ON (
          cm.conversation_id = c.id 
          AND cm.timestamp = c.last_message_at
        )
        WHERE c.visitor_id = ?
        ORDER BY c.updated_at DESC
        LIMIT ?
      `).bind(visitorId, limit).all()

      return new Response(JSON.stringify({ 
        success: true, 
        conversations: results 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Get conversations error:', error)
      return new Response(JSON.stringify({ error: 'Failed to get conversations' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Chat analytics
  if (path === '/chat/analytics' && method === 'GET') {
    try {
      const url = new URL(request.url)
      const visitorId = url.searchParams.get('visitorId')

      if (!visitorId) {
        return new Response(JSON.stringify({ error: 'Visitor ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { results } = await env.DB.prepare(`
        SELECT 
          COUNT(*) as total_messages,
          COUNT(DISTINCT conversation_id) as total_conversations,
          SUM(CASE WHEN message_type = 'user' THEN 1 ELSE 0 END) as user_messages,
          SUM(CASE WHEN message_type = 'assistant' THEN 1 ELSE 0 END) as ai_messages,
          SUM(usage_tokens) as total_tokens,
          MIN(timestamp) as first_message,
          MAX(timestamp) as last_message
        FROM chat_messages 
        WHERE visitor_id = ?
      `).bind(visitorId).all()

      return new Response(JSON.stringify({ 
        success: true, 
        analytics: results[0] 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Get chat analytics error:', error)
      return new Response(JSON.stringify({ error: 'Failed to get chat analytics' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // Default chat endpoint - list available endpoints
  if (path === '/chat' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Chat Storage API',
      endpoints: [
        'GET /chat - This endpoint (API information)',
        'POST /chat/store - Store chat message',
        'GET /chat/history?visitorId=<id>&conversationId=<id>&limit=<num> - Get chat history',
        'GET /chat/conversations?visitorId=<id>&limit=<num> - Get conversations list',
        'GET /chat/analytics?visitorId=<id> - Get chat analytics'
      ]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response('Chat endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
