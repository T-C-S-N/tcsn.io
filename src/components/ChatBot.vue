<template>
  <div class="rounded-lg shadow-sm flex flex-col w-full h-full">
    <!-- Header -->
    <header
      v-if="chatMessages?.length"
      :class="`border-b border-primary/20 px-4 py-2 hidden`"
    >
      <div class="flex items-center justify-end rounded-t-lg">
        <a
          class="text-md text-primary/60 font-mono border border-transparent px-2 py-1 rounded-md hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer"
          @click="isChatOpen = false"
        >
          <fa :icon="['fas', 'close']" />
        </a>
      </div>
    </header>

    <!-- Chat Messages Container -->
    <main
      v-if="chatMessages?.length"
      ref="chatContainer"
      :class="`flex flex-col h-full overflow-y-auto  transition rounded-t-lg p-4 border border-b-0
        ${chatMessages?.length ? '' : ''}
        ${isOnTop ? 'bg-primary/10 border-primary/10':'border-primary/20'}
      `"
    >
      <div
        v-for="(message, index) in chatMessages"
        :key="index"
        :class="`'flex flex-row justify-between items-center gap-2 w-full ${
          message.type === 'user' ? 'text-right opacity-60' : ''
        }`"
      >
        <div
          :class="`'flex flex-col gap-1 rounded-md text-md shadow-sm backdrop-blur-[2px] transition-all duration-300  ${
            message.type === 'user'
              ? ''
              : message.isEasterEgg
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-primary border border-purple-400/30 shadow-lg shadow-purple-500/10 animate-pulse'
              : ''
          }`"
        >
          <div
            v-if="message.type === 'bot'"
            class="text-xs font-mono flex items-center gap-1"
            :class="message.isEasterEgg ? 'text-purple-400/80' : 'text-primary/60'"
          >
            <fa v-if="message.isEasterEgg" :icon="['fas', 'wand-magic-sparkles']" />
            <span v-if="message.isEasterEgg">✨ Easter Egg Activated! ✨</span>
          </div>
          <div class="whitespace-pre-wrap leading-relaxed">
            {{ message.content }}
          </div>
        </div>
        <div
          class="text-xs"
          :class="
            message.type === 'user'
              ? 'text-primary/20 text-right'
              : 'text-primary/10 text-right'
          "
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="text-primary">
          <div class="flex items-center gap-2">
            <div
              class="animate-spin w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
            />
            <span>{{ $t('chatbot.thinking') }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Input Area -->
    <div
      :class="`flex flex-col border px-4 py-2 transition-all 
        ${chatMessages?.length ? 'rounded-b-lg' : 'rounded-lg'}
        ${
          isInputFocused || chatMessages?.length
            ? 'border-primary/20'
            : 'border-transparent'
        }
      `"
    >
      <div class="flex items-center gap-3 relative">
        <div class="relative flex-1">
          <input
            ref="chatInput"
            v-model="currentInput"
            type="text"
            :placeholder="$t('chatbot.placeholder')"
            :class="`w-full !bg-transparent py-2 border-b font-mono text-base text-primary placeholder-primary/50 focus:outline-none caret-transparent ${
              isInputFocused || chatMessages?.length
                ? 'border-primary/20 backdrop-blur-[1px]'
                : 'border-transparent'
            }`"
            style="font-size: 16px"
            autocomplete="off"
            spellcheck="false"
            :disabled="isLoading"
            @keydown="handleKeydown"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
            @input="updateCursorPosition()"
            @click="updateCursorPosition"
            @keyup="updateCursorPosition"
          />
          <!-- Custom blinking cursor -->
          <div
            v-if="isInputFocused"
            :class="`absolute bottom-2 h-0.5 w-3 bg-primary cursor-blink`"
            :style="`left: ${getCursorPosition()}px;`"
          />
        </div>

        <div class="flex felx-row items-canter gap-1">
          <button
            v-if="!isLoading"
            :class="`px-4 py-2 border border-primary/10 rounded-lg text-sm text-primary transition-all flex items-center gap-2 shadow-none ${
              (isInputFocused && currentInput.trim()) || chatMessages?.length
                ? 'opacity-100 hover:border-primary/20 hover:bg-primary/10'
                : isInputFocused
                ? 'opacity-30'
                : 'opacity-0'
            }`"
            :disabled="!currentInput.trim() || isLoading"
            @click="handleEnter"
          >
            <fa :icon="['fas', 'arrow-right']" />
            {{ $t('chatbot.send') }}
          </button>
          <div v-else class="flex justify-between items-center px-4 py-2">
            <div
              class="animate-spin w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
            />
          </div>

          <button
            v-if="!isLoading && chatMessages?.length"
            :class="`px-4 py-2 border border-primary/10 rounded-lg text-sm text-primary transition-all flex items-center gap-2 shadow-none hover:border-primary/20 hover:bg-primary/10
              ${isInputFocused || chatMessages?.length ? 'opacity-100' : 'opacity-0'}
            `"
            :disabled="isLoading"
            @click="clear"
          >
            {{ $t('chatbot.clear') }}
          </button>
        </div>
      </div>
      <div
        :class="`text-xs text-primary/50 font-mono transition-all ${
          isInputFocused || chatMessages?.length ? 'opacity-100' : 'opacity-0'
        }`"
      >
        {{ $t('chatbot.pressEnter') }}
      </div>
    </div>

    <div class="flex flex-row flex-wrap w-full hidden">
      <button
        v-for="example in exampleQuestions"
        :key="example"
        :disabled="isLoading"
        class="text-xs px-3 py-1 border border-primary/20 rounded-full text-primary/80 hover:bg-primary/10 transition-colors disabled:opacity-50 shadow-none"
        @click="askExample(example)"
      >
        {{ example }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVisitorStore } from '@/stores/visitorStore.js'
import { useAIStore } from '@/stores/aiStore.js'

const { t } = useI18n()
const visitorStore = useVisitorStore()
const aiStore = useAIStore()

// Terminal input state
const currentInput = ref('')
const chatInput = ref(null)
const chatContainer = ref(null)
const chatMessages = ref([])
const isLoading = ref(false)
const isChatOpen = ref(false)
const isInputFocused = ref(false)
const cursorPosition = ref(0)
const scrollPosition = ref(0)

const isOnTop = computed(() => scrollPosition.value <= 10)
const isScrolledDown = computed(() => {
  if (!chatContainer.value) return false
  // Force reactivity by accessing scrollPosition
  scrollPosition.value
  const isAtBottom = chatContainer.value.scrollHeight - chatContainer.value.scrollTop <= chatContainer.value.clientHeight + 10
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Scroll check:', {
      scrollHeight: chatContainer.value.scrollHeight,
      scrollTop: chatContainer.value.scrollTop,
      clientHeight: chatContainer.value.clientHeight,
      isAtBottom
    })
  }
  return isAtBottom
})
const exampleQuestions = computed(() => aiStore.getExampleQuestions())

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

function clear() {
  // Clear the chat messages
  chatMessages.value = []

  // Clear the current input
  currentInput.value = ''

  // Refocus the input
  setTimeout(() => {
    focusInput()
    updateCursorPosition()
  }, 100)
}

// Function to calculate cursor position for custom blinking cursor
const getCursorPosition = () => {
  if (!chatInput.value) return 0

  // Get the text before the cursor
  const textBeforeCursor = currentInput.value.substring(0, cursorPosition.value)

  // Create a temporary span to measure text width
  const tempSpan = document.createElement('span')
  tempSpan.style.position = 'absolute'
  tempSpan.style.visibility = 'hidden'
  tempSpan.style.whiteSpace = 'pre'
  tempSpan.style.font =
    '16px ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
  tempSpan.textContent = textBeforeCursor

  document.body.appendChild(tempSpan)
  const textWidth = tempSpan.getBoundingClientRect().width
  document.body.removeChild(tempSpan)

  return textWidth
}

const askExample = async (question) => {
  if (isLoading.value) return

  // Add user message to chat
  addMessage(question, 'user')
  // Ensure immediate scroll for user message
  scrollToBottom()

  await askAI(question)
}

// Update cursor position when input changes or cursor moves
const updateCursorPosition = () => {
  if (chatInput.value) {
    cursorPosition.value = chatInput.value.selectionStart || 0
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      // Update scroll position for reactivity
      scrollPosition.value = chatContainer.value.scrollTop
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
      updateCursorPosition()
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
      updateCursorPosition()
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

  // Initialize cursor position
  updateCursorPosition()

  // Add click listener to focus input when clicking anywhere
  //document.addEventListener('click', focusInput)

  // Add welcome message only if no previous history
  //if (chatMessages.value.length === 0) {
  //  addMessage(
  //    'Welcome to tcsn.io AI chat! Ask me anything about Toca or his work.',
  //    'bot'
  //  )
  //}

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

// Watch for chatContainer to become available and set up scroll listener
let scrollListener = null
watch(chatContainer, (newValue, oldValue) => {
  // Clean up old listener
  if (oldValue && scrollListener) {
    oldValue.removeEventListener('scroll', scrollListener)
  }
  
  // Set up new listener
  if (newValue) {
    scrollListener = () => {
      scrollPosition.value = newValue.scrollTop
    }
    newValue.addEventListener('scroll', scrollListener)
  }
}, { immediate: true })

onUnmounted(() => {
  if (chatContainer.value && scrollListener) {
    chatContainer.value.removeEventListener('scroll', scrollListener)
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

<style scoped>
/* Custom blinking cursor animation */
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.cursor-blink {
  animation: blink 1s infinite;
}

/* Hide default caret */
.caret-transparent {
  caret-color: transparent;
}
</style>
