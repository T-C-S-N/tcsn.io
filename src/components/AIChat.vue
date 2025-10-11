<template>
  <div class="ai-chat-container max-w-2xl mx-auto p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-primary mb-2">
        Chat with AI about Toca
      </h2>
      <p class="text-sm text-primary/80">
        Ask questions about Toca's background, experience, skills, and projects.
      </p>
    </div>

    <!-- Chat History -->
    <div class="chat-history mb-6 max-h-96 overflow-y-auto border border-primary/20 rounded-lg p-4 bg-background/50">
      <div
        v-for="(message, index) in chatHistory"
        :key="index"
        class="mb-4 last:mb-0"
      >
        <div
          v-if="message.role === 'user'"
          class="flex justify-end"
        >
          <div class="bg-primary/10 text-primary px-4 py-2 rounded-lg max-w-xs">
            {{ message.content }}
          </div>
        </div>
        <div
          v-else
          class="flex justify-start"
        >
          <div class="bg-primary/5 text-primary px-4 py-2 rounded-lg max-w-sm">
            <div class="text-xs text-primary/60 mb-1">
              AI Assistant
            </div>
            <div class="whitespace-pre-wrap">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="isLoading" 
        class="flex justify-start"
      >
        <div class="bg-primary/5 text-primary px-4 py-2 rounded-lg">
          <div class="flex items-center gap-2">
            <div class="animate-spin w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full" />
            <span class="text-sm">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Form -->
    <form 
      class="flex gap-2"
      @submit.prevent="sendMessage"
    >
      <input
        v-model="currentMessage"
        :disabled="isLoading"
        type="text"
        placeholder="Ask about Toca's experience, skills, projects..."
        class="flex-1 px-4 py-2 border border-primary/20 rounded-lg bg-background text-primary placeholder-primary/50 focus:outline-none focus:border-primary/50"
        @keydown.enter.prevent="sendMessage"
      >
      <button
        type="submit"
        :disabled="isLoading || !currentMessage.trim()"
        class="px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
      <button
        v-if="chatHistory.length > 0"
        type="button"
        :disabled="isLoading"
        class="px-4 py-2 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="clearChat"
      >
        Clear
      </button>
    </form>

    <!-- Error Display -->
    <div
      v-if="error"
      class="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center justify-between"
    >
      <span>{{ error }}</span>
      <button
        class="ml-2 px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
        @click="clearError"
      >
        ✕
      </button>
    </div>

    <!-- Example Questions -->
    <div class="mt-6">
      <h3 class="text-sm font-semibold text-primary mb-2">
        Try asking:
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="example in exampleQuestions"
          :key="example"
          :disabled="isLoading"
          class="text-xs px-3 py-1 border border-primary/20 rounded-full text-primary/80 hover:bg-primary/10 transition-colors disabled:opacity-50"
          @click="askExample(example)"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAIStore } from '@/stores/aiStore.js'

// Store
const aiStore = useAIStore()

// Local reactive state
const currentMessage = ref('')

// Computed properties from store
const chatHistory = computed(() => aiStore.chatHistory)
const isLoading = computed(() => aiStore.isLoading)
const error = computed(() => aiStore.error)

// Get example questions from service
const exampleQuestions = computed(() => aiStore.getExampleQuestions())

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''

  await aiStore.sendMessage(userMessage)
}

const askExample = async (question) => {
  if (isLoading.value) return
  currentMessage.value = question
  await sendMessage()
}

const clearChat = () => {
  aiStore.clearChat()
}

const clearError = () => {
  aiStore.clearError()
}

// Initialize store on mount
onMounted(async () => {
  await aiStore.initialize()
})
</script>

<style scoped>
.chat-history::-webkit-scrollbar {
  width: 4px;
}

.chat-history::-webkit-scrollbar-track {
  background: transparent;
}

.chat-history::-webkit-scrollbar-thumb {
  background: rgba(255, 182, 121, 0.3);
  border-radius: 2px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 182, 121, 0.5);
}
</style>
