/**
 * Chat Storage Service - Handles chat persistence and retrieval
 */

import { apiCall, API_CONFIG } from '@/lib/apiConfig.js'

class ChatService {
  constructor() {
    this.currentConversationId = null
  }

  /**
   * Store a chat message in the database
   * @param {string} visitorId - The visitor's ID
   * @param {string} sessionId - The session ID
   * @param {string} messageType - 'user' or 'assistant'
   * @param {string} content - The message content
   * @param {object} options - Additional options (model, usage, etc.)
   * @returns {Promise<object>} Response with success status and conversation ID
   */
  async storeMessage(visitorId, sessionId, messageType, content, options = {}) {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.CHAT_STORE, {
        method: 'POST',
        body: JSON.stringify({
          visitorId,
          sessionId,
          messageType,
          content,
          conversationId: this.currentConversationId,
          model: options.model,
          usage: options.usage,
          timestamp: new Date().toISOString()
        })
      })

      if (response.success) {
        // Update current conversation ID if this is a new conversation
        if (!this.currentConversationId) {
          this.currentConversationId = response.conversationId
        }
        return response
      } else {
        throw new Error(response.error || 'Failed to store message')
      }
    } catch (error) {
      console.error('Chat service - store message error:', error)
      throw error
    }
  }

  /**
   * Store both user question and AI response
   * @param {string} visitorId - The visitor's ID
   * @param {string} sessionId - The session ID
   * @param {string} userMessage - The user's question
   * @param {string} aiResponse - The AI's response
   * @param {object} aiMetadata - AI response metadata (model, usage, etc.)
   * @returns {Promise<object>} Response with success status
   */
  async storeConversationTurn(visitorId, sessionId, userMessage, aiResponse, aiMetadata = {}) {
    try {
      // Store user message
      await this.storeMessage(visitorId, sessionId, 'user', userMessage)

      // Store AI response
      await this.storeMessage(visitorId, sessionId, 'assistant', aiResponse, {
        model: aiMetadata.model,
        usage: aiMetadata.usage
      })

      return { success: true }
    } catch (error) {
      console.error('Chat service - store conversation turn error:', error)
      throw error
    }
  }

  /**
   * Get chat history for a visitor
   * @param {string} visitorId - The visitor's ID
   * @param {string} conversationId - Optional conversation ID to filter
   * @param {number} limit - Maximum number of messages to retrieve
   * @returns {Promise<array>} Array of chat messages
   */
  async getChatHistory(visitorId, conversationId = null, limit = 50) {
    try {
      const params = new URLSearchParams({
        visitorId,
        limit: limit.toString()
      })

      if (conversationId) {
        params.append('conversationId', conversationId)
      }

      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CHAT_HISTORY}?${params}`, {
        method: 'GET'
      })

      if (response.success) {
        return response.messages || []
      } else {
        throw new Error(response.error || 'Failed to get chat history')
      }
    } catch (error) {
      console.error('Chat service - get chat history error:', error)
      throw error
    }
  }

  /**
   * Get conversations list for a visitor
   * @param {string} visitorId - The visitor's ID
   * @param {number} limit - Maximum number of conversations to retrieve
   * @returns {Promise<array>} Array of conversations
   */
  async getConversations(visitorId, limit = 20) {
    try {
      const params = new URLSearchParams({
        visitorId,
        limit: limit.toString()
      })

      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CHAT_CONVERSATIONS}?${params}`, {
        method: 'GET'
      })

      if (response.success) {
        return response.conversations || []
      } else {
        throw new Error(response.error || 'Failed to get conversations')
      }
    } catch (error) {
      console.error('Chat service - get conversations error:', error)
      throw error
    }
  }

  /**
   * Get chat analytics for a visitor
   * @param {string} visitorId - The visitor's ID
   * @returns {Promise<object>} Analytics data
   */
  async getChatAnalytics(visitorId) {
    try {
      const params = new URLSearchParams({ visitorId })

      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CHAT_ANALYTICS}?${params}`, {
        method: 'GET'
      })

      if (response.success) {
        return response.analytics || {}
      } else {
        throw new Error(response.error || 'Failed to get chat analytics')
      }
    } catch (error) {
      console.error('Chat service - get chat analytics error:', error)
      throw error
    }
  }

  /**
   * Start a new conversation
   */
  startNewConversation() {
    this.currentConversationId = null
  }

  /**
   * Set current conversation ID
   * @param {string} conversationId - The conversation ID to set
   */
  setConversationId(conversationId) {
    this.currentConversationId = conversationId
  }

  /**
   * Get current conversation ID
   * @returns {string|null} Current conversation ID
   */
  getCurrentConversationId() {
    return this.currentConversationId
  }
}

// Create and export singleton instance
export const chatService = new ChatService()
export default chatService
