/**
 * AI Chat Store - Manages AI chat state and conversations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiService } from '@/services/aiService.js'
import { chatService } from '@/services/chatService.js'

export const useAIStore = defineStore('ai', () => {
  // State
  const chatHistory = ref([])
  const isLoading = ref(false)
  const error = ref('')
  const isAvailable = ref(true)
  const currentConversationId = ref(null)
  const conversations = ref(new Map()) // Store multiple conversations
  
  // Computed
  const hasMessages = computed(() => chatHistory.value.length > 0)
  const lastMessage = computed(() => {
    return chatHistory.value.length > 0 
      ? chatHistory.value[chatHistory.value.length - 1] 
      : null
  })
  
  const messageCount = computed(() => chatHistory.value.length)
  
  const conversationHistory = computed(() => {
    return aiService.formatConversationHistory(chatHistory.value)
  })

  // Actions
  const sendMessage = async (prompt, visitorId = null, sessionId = null) => {
    // Validate message
    const validation = aiService.validateMessage(prompt)
    if (!validation.valid) {
      error.value = validation.error
      return { success: false, error: validation.error }
    }

    const userMessage = {
      id: generateMessageId(),
      role: 'user',
      content: validation.message,
      timestamp: new Date().toISOString()
    }

    // Add user message to history
    chatHistory.value.push(userMessage)
    
    // Clear any previous errors
    error.value = ''
    isLoading.value = true

    try {
      // Send message to AI service
      const result = await aiService.sendMessage(
        validation.message,
        conversationHistory.value
      )

      if (result.success) {
        // Add AI response to history
        const aiMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: result.response,
          timestamp: result.timestamp,
          usage: result.usage,
          model: result.model
        }
        
        chatHistory.value.push(aiMessage)
        
        // Store conversation in database if visitor info is available
        if (visitorId && sessionId) {
          try {
            await chatService.storeConversationTurn(
              visitorId,
              sessionId,
              validation.message,
              result.response,
              {
                model: result.model,
                usage: result.usage
              }
            )
            console.log('Chat conversation stored successfully')
          } catch (storageError) {
            console.error('Failed to store chat conversation:', storageError)
            // Don't fail the entire request if storage fails
          }
        }
        
        // Save conversation if we have an ID
        if (currentConversationId.value) {
          saveCurrentConversation()
        }

        return { success: true, message: aiMessage }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send message'
      error.value = errorMessage
      console.error('AI Store - Send message error:', err)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const askExampleQuestion = async (question) => {
    return await sendMessage(question)
  }

  const clearChat = () => {
    chatHistory.value = []
    error.value = ''
    currentConversationId.value = null
  }

  const clearError = () => {
    error.value = ''
  }

  const deleteMessage = (messageId) => {
    const index = chatHistory.value.findIndex(msg => msg.id === messageId)
    if (index !== -1) {
      chatHistory.value.splice(index, 1)
    }
  }

  const editMessage = (messageId, newContent) => {
    const message = chatHistory.value.find(msg => msg.id === messageId)
    if (message && message.role === 'user') {
      message.content = newContent
      message.edited = true
      message.editedAt = new Date().toISOString()
    }
  }

  const startNewConversation = () => {
    saveCurrentConversation()
    clearChat()
    currentConversationId.value = generateConversationId()
  }

  const saveCurrentConversation = () => {
    if (currentConversationId.value && chatHistory.value.length > 0) {
      conversations.value.set(currentConversationId.value, {
        id: currentConversationId.value,
        messages: [...chatHistory.value],
        createdAt: chatHistory.value[0]?.timestamp,
        updatedAt: new Date().toISOString(),
        title: generateConversationTitle()
      })
    }
  }

  const loadConversation = (conversationId) => {
    const conversation = conversations.value.get(conversationId)
    if (conversation) {
      saveCurrentConversation() // Save current before switching
      chatHistory.value = [...conversation.messages]
      currentConversationId.value = conversationId
      error.value = ''
    }
  }

  const deleteConversation = (conversationId) => {
    conversations.value.delete(conversationId)
    if (currentConversationId.value === conversationId) {
      clearChat()
    }
  }

  // Database chat history functions
  const loadChatHistoryFromDB = async (visitorId, conversationId = null) => {
    try {
      const messages = await chatService.getChatHistory(visitorId, conversationId)
      
      // Convert database messages to chat history format
      const formattedMessages = messages.map(msg => ({
        id: generateMessageId(),
        role: msg.message_type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
        usage: msg.usage_tokens ? { total_tokens: msg.usage_tokens } : undefined,
        model: msg.model || undefined
      }))

      chatHistory.value = formattedMessages
      if (conversationId) {
        currentConversationId.value = conversationId
        chatService.setConversationId(conversationId)
      }
      
      return { success: true, messages: formattedMessages }
    } catch (error) {
      console.error('Failed to load chat history from database:', error)
      return { success: false, error: error.message }
    }
  }

  const loadConversationsFromDB = async (visitorId) => {
    try {
      const dbConversations = await chatService.getConversations(visitorId)
      
      // Convert to our internal format
      dbConversations.forEach(conv => {
        conversations.value.set(conv.id, {
          id: conv.id,
          title: conv.last_message_preview ? 
            (conv.last_message_preview.substring(0, 50) + 
             (conv.last_message_preview.length > 50 ? '...' : '')) :
            'Conversation',
          createdAt: conv.created_at,
          updatedAt: conv.updated_at,
          messageCount: conv.message_count,
          totalTokens: conv.total_tokens
        })
      })
      
      return { success: true, conversations: dbConversations }
    } catch (error) {
      console.error('Failed to load conversations from database:', error)
      return { success: false, error: error.message }
    }
  }

  const getChatAnalytics = async (visitorId) => {
    try {
      const analytics = await chatService.getChatAnalytics(visitorId)
      return { success: true, analytics }
    } catch (error) {
      console.error('Failed to get chat analytics:', error)
      return { success: false, error: error.message }
    }
  }

  const checkServiceAvailability = async () => {
    try {
      isAvailable.value = await aiService.checkAvailability()
      return isAvailable.value
    } catch (err) {
      isAvailable.value = false
      console.error('AI Store - Service availability check failed:', err)
      return false
    }
  }

  const getExampleQuestions = () => {
    return aiService.getExampleQuestions()
  }

  const exportConversation = (format = 'json') => {
    if (chatHistory.value.length === 0) return null

    const conversation = {
      id: currentConversationId.value,
      title: generateConversationTitle(),
      messages: chatHistory.value,
      exportedAt: new Date().toISOString()
    }

    if (format === 'json') {
      return JSON.stringify(conversation, null, 2)
    } else if (format === 'text') {
      return chatHistory.value
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n')
    }

    return conversation
  }

  const getConversationStats = () => {
    const userMessages = chatHistory.value.filter(msg => msg.role === 'user')
    const aiMessages = chatHistory.value.filter(msg => msg.role === 'assistant')
    const totalTokensUsed = aiMessages.reduce((total, msg) => {
      return total + (msg.usage?.total_tokens || 0)
    }, 0)

    return {
      totalMessages: chatHistory.value.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      totalTokensUsed,
      conversationDuration: lastMessage.value?.timestamp 
        ? new Date(lastMessage.value.timestamp) - new Date(chatHistory.value[0]?.timestamp)
        : 0
    }
  }

  // Helper functions
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateConversationTitle = () => {
    const firstUserMessage = chatHistory.value.find(msg => msg.role === 'user')
    if (firstUserMessage) {
      const preview = firstUserMessage.content.substring(0, 50)
      return preview.length < firstUserMessage.content.length 
        ? `${preview}...` 
        : preview
    }
    return `Conversation ${new Date().toLocaleDateString()}`
  }

  // Initialize
  const initialize = async () => {
    await checkServiceAvailability()
    if (!currentConversationId.value) {
      currentConversationId.value = generateConversationId()
    }
  }

  return {
    // State
    chatHistory,
    isLoading,
    error,
    isAvailable,
    currentConversationId,
    conversations,
    
    // Computed
    hasMessages,
    lastMessage,
    messageCount,
    conversationHistory,
    
    // Actions
    sendMessage,
    askExampleQuestion,
    clearChat,
    clearError,
    deleteMessage,
    editMessage,
    startNewConversation,
    saveCurrentConversation,
    loadConversation,
    deleteConversation,
    loadChatHistoryFromDB,
    loadConversationsFromDB,
    getChatAnalytics,
    checkServiceAvailability,
    getExampleQuestions,
    exportConversation,
    getConversationStats,
    initialize
  }
})
