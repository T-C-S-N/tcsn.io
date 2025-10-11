/**
 * AI routes for OpenAI integration
 */

// OpenAI context (simplified for now)
const openAIContext = {
  systemPrompt: "You are TCSN, a helpful AI assistant."
};

// Easter egg responses
const EASTER_EGGS = {
  // Konami code reference
  'up up down down left right left right b a': {
    response: "🎮 Konami Code activated! You've unlocked the secret developer mode! Fun fact: Toca has been coding since he could barely reach the keyboard. His first program was probably 'Hello World' in BASIC on a computer older than some of his current colleagues! 🕹️",
    special: true
  },

  // Matrix reference
  'follow the white rabbit': {
    response: "🐰 Welcome to the Matrix, Neo! You've found one of Toca's hidden easter eggs. In this reality, Toca codes in Vue.js instead of green rain code, but the magic is just as real! Take the red pill and explore his projects further... 💊",
    special: true
  },

  // Coffee addiction
  'coffee': {
    response: "☕ Ah, you've discovered the fuel of all great developers! Toca's relationship with coffee is like a perfectly optimized algorithm - essential, efficient, and absolutely critical for system performance. Fun fact: His code quality is directly proportional to his caffeine levels! 🚀",
    special: true
  },

  // Star Wars reference
  'may the force be with you': {
    response: "🌟 And also with you, young Padawan! The Force is strong with this one... Toca has mastered the ancient arts of JavaScript, Vue.js, and Node.js. His debugging skills are as precise as a lightsaber, and his code is more elegant than Obi-Wan's fighting style! ⚔️",
    special: true
  },

  // Developer humor
  '42': {
    response: "🌌 Ah, the Answer to the Ultimate Question of Life, the Universe, and Everything! And coincidentally, also the number of bugs Toca fixes before his first coffee break. Douglas Adams would be proud! Don't panic, and always carry a towel... and a good IDE! 🛸",
    special: true
  },

  // Gaming reference
  'all your base are belong to us': {
    response: "👾 Classic! Someone set up us the bomb! This legendary meme is older than some of the frameworks Toca works with. Speaking of bases, all your code bases are belong to clean, maintainable architecture when Toca is on the job! 🚀",
    special: true
  },

  // Hidden compliment
  'you are awesome': {
    response: "🎉 No, YOU are awesome for finding this easter egg! But yes, Toca is pretty awesome too. He's like the Swiss Army knife of developers - versatile, reliable, and always ready for any coding challenge! Thanks for the kind words! 🌟",
    special: true
  },

  // Tech humor
  'it works on my machine': {
    response: "😅 The classic developer phrase! Toca has transcended this level and now ensures his code works on everyone's machine through proper containerization, testing, and deployment pipelines. Docker containers are his best friends! 🐳",
    special: true
  },

  // Secret commands
  'show me the code': {
    response: "🔍 *hacker voice* I'm in! You want to see the code? Check out Toca's GitHub repositories where clean, documented, and well-tested code lives. No spaghetti code here, only beautiful, maintainable architecture! 💻",
    special: true
  },

  'hello world': {
    response: "👋 Hello World to you too! The first program every developer writes, and still the most satisfying. Toca has written 'Hello World' in more languages than most people speak. From JavaScript to Python, from C++ to Vue.js components! 🌍",
    special: true
  },

  'debug this': {
    response: "🐛 *puts on detective hat* Debugging mode activated! Toca approaches debugging like Sherlock Holmes - methodically, logically, and with lots of console.log() statements. Every bug is just a feature in disguise! 🔍",
    special: true
  },

  'sudo make me a sandwich': {
    response: "🥪 *beep boop* Sandwich making protocol activated! While I can't actually make you a sandwich (still working on that API), Toca can definitely cook up some delicious code solutions for your project! 🤖",
    special: true
  },

  'there is no spoon': {
    response: "🥄 Ah, a fellow Matrix philosopher! There is no spoon, but there ARE clean coding practices, proper documentation, and well-structured APIs. In Toca's world, the only thing that bends is inflexible legacy code! 🌟",
    special: true
  }
};

// Function to check for easter eggs
function checkEasterEggs (prompt) {
  const lowerPrompt = prompt.toLowerCase().trim();

  for (const [trigger, egg] of Object.entries(EASTER_EGGS)) {
    if (lowerPrompt.includes(trigger)) {
      return egg;
    }
  }

  return null;
}

export async function aiRoutes (request, env, path, corsHeaders) {
  const method = request.method;

  // AI Chat endpoint
  if (path === '/ai' && method === 'POST') {
    try {
      const { prompt, conversationHistory = [] } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check for easter eggs first
      const easterEgg = checkEasterEggs(prompt);
      if (easterEgg) {
        return new Response(JSON.stringify({
          success: true,
          response: easterEgg.response,
          easter_egg: true,
          special: easterEgg.special || false
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!env.OPEN_AI_KEY) {
        return new Response(JSON.stringify({
          error: 'OpenAI API key not configured',
          message: 'AI functionality is currently unavailable in development mode. Please configure OPEN_AI_KEY environment variable.',
          success: false
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Build the system message with context
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant for tcsn's website (tcsn.io). 
          CONTEXT ABOUT TCSN AND INSTRUCTIONS:
          ${JSON.stringify(openAIContext, null, 2)}
        `};

      // Build messages array
      const messages = [
        systemMessage,
        ...conversationHistory,
        { role: 'user', content: prompt }
      ];

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
      });

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error('OpenAI API error:', errorText);
        return new Response(JSON.stringify({ error: 'AI service temporarily unavailable' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const openAIData = await openAIResponse.json();
      const aiResponse = openAIData.choices[0]?.message?.content;

      if (!aiResponse) {
        return new Response(JSON.stringify({ error: 'No response from AI service' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        response: aiResponse,
        usage: openAIData.usage,
        model: openAIData.model
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('AI route error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // AI endpoint info
  if (path === '/ai' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      message: 'AI Chat API',
      endpoints: [
        'GET /ai - This endpoint (API information)',
        'POST /ai - Chat with AI about Toca'
      ],
      usage: {
        method: 'POST',
        endpoint: '/ai',
        body: {
          prompt: 'Your question about Toca',
          conversationHistory: '(optional) Previous conversation messages'
        }
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response('AI endpoint not found', {
    status: 404,
    headers: corsHeaders,
  });
}
