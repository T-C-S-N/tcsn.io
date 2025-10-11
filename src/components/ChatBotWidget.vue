<template>
  <!-- Trigger -->
  <div
    v-if="!isChatOpen"
    class="fixed bottom-[50px] right-[20px] flex justify-center items-center z-[200] border border-primary-100/10 rounded-full backdrop-blur-[2px] text-primary w-[50px] h-[50px] cursor-pointer transition-all hover:brightness-110 hover:bg-primary/10"
    style="box-shadow: 0 4px 14px -2px rgba(255, 182, 121, 0.4), inset 0 2px 6px rgba(255, 182, 121, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.1);"
    @click="isChatOpen = true"
  >
    <fa :icon="['fas', 'robot']" class="text-lg" />
  </div>

  <!-- Chat -->
  <div
    v-if="isChatOpen"
    class="fixed bottom-[50px] right-[20px] bg-background/80 backdrop-blur-sm rounded-lg shadow-sm w-[calc(100vw-40px)] lg:w-[400px] md:max-w-lg lg:max-w-xl h-[600px] flex flex-col z-[300] border border-primary/20"
  >
    <!-- Chat Header -->
    <div class="border-b border-primary/20 p-2">
      <div class="flex flex-row justify-between items-center">
        <div class="text-primary font-mono text-md flex items-center gap-2">
          <fa :icon="['fas', 'robot']" />
          tcsn Assistant
        </div>
        <a>
          <fa
            :icon="['fas', 'times']"
            class="text-primary hover:text-primary-400 cursor-pointer border border-transparent hover:border-primary/20 rounded-sm px-2 py-1 transition hover:bg-primary/10"
            @click="isChatOpen = false"
          />
        </a>
      </div>

      <p class="text-primary/60 text-sm">Ask me anything</p>
    </div>

    <!-- Chat Messages Container -->
    <div ref="chatContainer" class="h-96 overflow-y-auto p-4 space-y-4 bg-background/50">
      <div
        v-for="(message, index) in chatMessages"
        :key="index"
        :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'flex flex-col gap-1 max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm shadow-sm',
            message.type === 'user'
              ? 'bg-primary text-background rounded-br-sm'
              : 'bg-primary/10 text-primary rounded-bl-sm border border-primary/20'
          ]"
        >
          <div
            v-if="message.type === 'bot'"
            class="text-xs text-primary/60 mb-2 font-mono flex items-center gap-1"
          >
            <fa :icon="['fas', 'robot']" />
            AI
          </div>
          <div class="whitespace-pre-wrap leading-relaxed">
            {{ message.content }}
          </div>
          <div
            class="text-xs opacity-60"
            :class="
              message.type === 'user'
                ? 'text-background/70 text-right'
                : 'text-primary/50 text-left'
            "
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div
          class="bg-primary/10 text-primary px-4 py-3 rounded-2xl rounded-bl-md text-sm border border-primary/20 shadow-sm"
        >
          <div class="text-xs text-primary/60 mb-2 font-mono flex items-center gap-1">
            <fa :icon="['fas', 'robot']" />
            AI
          </div>
          <div class="flex items-center gap-2">
            <div
              class="animate-spin w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
            />
            <span>Thinking...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-primary/20 p-4 bg-background/80">
      <div class="flex items-center gap-3">
        <span class="text-primary font-mono text-lg">
          <fa :icon="['fas', 'chevron-right']" />
        </span>
        <input
          ref="chatInput"
          v-model="currentInput"
          type="text"
          placeholder="Ask me anything about Toca or his work..."
          class="flex-1 bg-primary/5 rounded-lg px-3 py-2 border border-primary/20 font-mono text-base text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          style="font-size: 16px;"
          autocomplete="off"
          spellcheck="false"
          :disabled="isLoading"
          @keydown="handleKeydown"
        />
        <button
          :disabled="!currentInput.trim() || isLoading"
          class="px-4 py-2 bg-primary text-background rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleEnter"
        >
          <fa :icon="['fas', 'arrow-right']" />
          Send
        </button>
      </div>
      <div class="text-xs text-primary/50 mt-2 font-mono">
        Press Tab for suggestions • Type "help" for commands
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'
import { useAIStore } from '@/stores/aiStore.js'

const visitorStore = useVisitorStore()
const aiStore = useAIStore()

// Terminal input state
const currentInput = ref('')
const chatInput = ref(null)
const chatContainer = ref(null)
const chatMessages = ref([])
const isLoading = ref(false)
const isChatOpen = ref(false)

// Commands
const commands = {
  help: () => `AI Terminal - Direct AI Chat:
   
   Just type your question directly!
   Examples: What's Toca's background?
             What technologies does he work with?
             Tell me about his projects
   
   Special commands:
   help     - Show this help
   examples - Show example questions
   clear    - Clear terminal history`,
  clear: () => {
    chatMessages.value = []
    return ''
  },
  examples: () => {
    try {
      const examples = aiStore.getExampleQuestions()
      let result = 'Example questions you can ask:\n'
      examples.slice(0, 5).forEach((example, index) => {
        result += `   ${index + 1}. ${example}\n`
      })
      result += '\nJust type any question directly!'
      return result
    } catch (error) {
      return `Error loading examples: ${error.message}`
    }
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 50)
}

const addMessage = (content, type = 'bot') => {
  chatMessages.value.push({
    content,
    type,
    timestamp: new Date().toISOString()
  })

  // Auto scroll to bottom
  scrollToBottom()
}

const askAI = async (question) => {
  isLoading.value = true

  try {
    console.log('AI Store available:', aiStore.isAvailable)
    console.log('Sending message to AI:', question)

    // Get visitor info for storage
    const visitorId = visitorStore.visitor.id
    const sessionId = `session_${visitorStore.visitor.sessionStart}`

    console.log('Visitor info for storage:', { visitorId, sessionId })

    // Ensure we have a visitor ID before proceeding
    if (!visitorId) {
      console.warn('No visitor ID available, chat will not be stored in database')
    }

    const result = await aiStore.sendMessage(question, visitorId, sessionId)
    console.log('AI result:', result)

    if (result.success) {
      addMessage(result.message.content, 'bot')
      // Ensure scroll after AI response
      scrollToBottom()
      return ''
    } else {
      addMessage(`AI Error: ${result.error}`, 'bot')
      scrollToBottom()
      return ''
    }
  } catch (error) {
    console.error('AI command error:', error)
    addMessage(`AI Error: ${error.message}`, 'bot')
    return ''
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const input = currentInput.value.trim()

    if (input) {
      // Add user message to chat
      addMessage(input, 'user')
      // Ensure immediate scroll for user message
      scrollToBottom()

      // Check if it's a special command
      const command = input.toLowerCase()

      if (commands[command]) {
        try {
          const result = await commands[command]()
          if (result) {
            addMessage(result, 'bot')
          }
        } catch (error) {
          addMessage(`Error executing command: ${error.message}`, 'bot')
        }
      } else {
        // Treat everything else as an AI question
        await askAI(input)
      }

      // Track interaction with more details
      visitorStore.addInteraction('ai_chat_message', {
        message: input,
        messageType: 'user',
        conversationId: aiStore.currentConversationId
      })
    }

    // Clear input and refocus
    currentInput.value = ''
    setTimeout(() => {
      focusInput()
    }, 100)
  } else if (event.key === 'Tab') {
    event.preventDefault()
    // Simple tab completion for special commands
    const input = currentInput.value.toLowerCase()

    if (input.length > 0) {
      const matches = Object.keys(commands).filter((cmd) => cmd.startsWith(input))

      if (matches.length === 1) {
        currentInput.value = matches[0]
      } else if (matches.length > 1) {
        addMessage(`Special commands: ${matches.join(', ')}`, 'bot')
      } else {
        // Show AI question suggestions
        try {
          const examples = aiStore.getExampleQuestions()
          const suggestions = examples.slice(0, 3)

          let suggestionText = 'AI Question suggestions:\n'
          suggestions.forEach((suggestion, index) => {
            suggestionText += `   ${index + 1}. ${suggestion}\n`
          })
          addMessage(suggestionText.trim(), 'bot')
        } catch (error) {
          console.error('Error getting AI examples:', error)
        }
      }
    }
  }
}

const focusInput = () => {
  if (chatInput.value) {
    chatInput.value.focus()
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleEnter = async () => {
  const input = currentInput.value.trim()
  if (input && !isLoading.value) {
    // Add user message to chat
    addMessage(input, 'user')
    // Ensure immediate scroll for user message
    scrollToBottom()

    // Check if it's a special command
    const command = input.toLowerCase()

    if (commands[command]) {
      try {
        const result = await commands[command]()
        if (result) {
          addMessage(result, 'bot')
        }
      } catch (error) {
        addMessage(`Error executing command: ${error.message}`, 'bot')
      }
    } else {
      // Treat everything else as an AI question
      await askAI(input)
    }

    // Track interaction with more details
    visitorStore.addInteraction('ai_chat_message', {
      message: input,
      messageType: 'user',
      conversationId: aiStore.currentConversationId
    })    
    // Clear input and refocus
    currentInput.value = ''
    setTimeout(() => {
      focusInput()
    }, 100)
  }
}

onMounted(async () => {
  // Initialize visitor store first and wait for it
  await visitorStore.initializeVisitor()
  visitorStore.addInteraction('page_loaded', { page: 'home' })

  // Wait for visitor ID to be available
  let attempts = 0
  while (!visitorStore.visitor.id && attempts < 10) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  console.log('Final visitor ID after initialization:', visitorStore.visitor.id)

  // Initialize AI store
  console.log('Initializing AI store...')
  try {
    await aiStore.initialize()
    console.log('AI store initialized successfully:', aiStore.isAvailable)

    // Load previous chat history if visitor exists
    if (visitorStore.visitor.id) {
      console.log('Loading chat history for visitor:', visitorStore.visitor.id)
      try {
        const historyResult = await aiStore.loadChatHistoryFromDB(visitorStore.visitor.id)
        console.log('Chat history result:', historyResult)
        if (historyResult.success && historyResult.messages.length > 0) {
          console.log('Loaded chat history:', historyResult.messages.length, 'messages')
          // Convert stored messages to chat format
          chatMessages.value = historyResult.messages.map((msg) => ({
            content: msg.content,
            type: msg.role === 'user' ? 'user' : 'bot',
            timestamp: msg.timestamp
          }))
          // Scroll to bottom after loading history
          scrollToBottom()
        } else {
          console.log('No chat history found or failed to load')
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    } else {
      console.log('No visitor ID available for loading chat history')
    }
  } catch (error) {
    console.error('AI store initialization failed:', error)
  }

  // Focus the hidden input to capture keyboard events
  focusInput()

  // Add click listener to focus input when clicking anywhere
  document.addEventListener('click', focusInput)

  // Add welcome message only if no previous history
  if (chatMessages.value.length === 0) {
    addMessage(
      'Welcome to tcsn.io AI chat! Ask me anything about Toca or his work.',
      'bot'
    )
  }

  // Ensure we scroll to bottom after everything is loaded
  setTimeout(() => {
    scrollToBottom()
  }, 200)
})

// Watch for chat open state to auto-focus input
watch(isChatOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      focusInput()
    }, 150)
  }
})

// Watch for changes in chat messages and loading state to ensure proper scrolling
watch(
  [chatMessages, isLoading],
  (newValues, oldValues) => {
    const [, newIsLoading] = newValues
    const [, oldIsLoading] = oldValues
    
    if (!newIsLoading) {
      scrollToBottom()
      
      // Auto-focus input when AI finishes responding
      if (oldIsLoading && !newIsLoading) {
        setTimeout(() => {
          focusInput()
        }, 200)
      }
    }
  },
  { deep: true }
)
</script>
