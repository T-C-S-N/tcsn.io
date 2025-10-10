/**
 * AI routes for OpenAI integration
 */

import openAIContext from '../utils/openAIContext.json'

export async function aiRoutes(request, env, path, corsHeaders) {
  const method = request.method

  // AI Chat endpoint
  if (path === '/ai' && method === 'POST') {
    try {
      const { prompt, conversationHistory = [] } = await request.json()

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!env.OPEN_AI_KEY) {
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Build the system message with context
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant for Tomas Caufriez's portfolio website (tcsn.io). 

CONTEXT ABOUT TOMAS:
${JSON.stringify(openAIContext, null, 2)}

Instructions:
- Answer questions about Tomas's background, experience, skills, and projects
- Be helpful, professional, and concise
- If asked about something not in the context, politely explain you only have information about Tomas's professional background
- Use a friendly but professional tone
- Feel free to highlight relevant experience and skills based on the user's questions
- If someone is asking about hiring or collaboration, encourage them to contact Tomas at ${openAIContext.email}`
      }

      // Build messages array
      const messages = [
        systemMessage,
        ...conversationHistory,
        { role: 'user', content: prompt }
      ]

      // Call OpenAI API
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPEN_AI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      })

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text()
        console.error('OpenAI API error:', errorText)
        return new Response(JSON.stringify({ error: 'AI service temporarily unavailable' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const openAIData = await openAIResponse.json()
      const aiResponse = openAIData.choices[0]?.message?.content

      if (!aiResponse) {
        return new Response(JSON.stringify({ error: 'No response from AI service' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        response: aiResponse,
        usage: openAIData.usage,
        model: openAIData.model
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (error) {
      console.error('AI route error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // AI endpoint info
  if (path === '/ai' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'AI Chat API',
      endpoints: [
        'GET /ai - This endpoint (API information)',
        'POST /ai - Chat with AI about Tomas Caufriez'
      ],
      usage: {
        method: 'POST',
        endpoint: '/ai',
        body: {
          prompt: 'Your question about Tomas',
          conversationHistory: '(optional) Previous conversation messages'
        }
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response('AI endpoint not found', {
    status: 404,
    headers: corsHeaders,
  })
}
