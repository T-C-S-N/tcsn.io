/**
 * AI Service for communicating with the OpenAI API endpoint
 */

import { apiCall } from '@/lib/apiConfig.js'

export class AIService {
  constructor() {
    this.baseEndpoint = '/ai'
  }

  /**
   * Send a message to the AI and get a response
   * @param {string} prompt - The user's message/question
   * @param {Array} conversationHistory - Previous conversation messages
   * @returns {Promise<Object>} AI response data
   */
  async sendMessage(prompt, conversationHistory = []) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string')
    }

    try {
      const data = await apiCall(this.baseEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          prompt: prompt.trim(),
          conversationHistory: conversationHistory
        })
      })

      if (!data.response) {
        throw new Error(data.error || 'No response from AI service')
      }

      return {
        success: true,
        response: data.response,
        usage: data.usage,
        model: data.model,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('AI Service error:', error)
      
      // Return structured error response
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get AI endpoint information
   * @returns {Promise<Object>} Endpoint information
   */
  async getEndpointInfo() {
    try {
      const data = await apiCall(this.baseEndpoint, {
        method: 'GET'
      })

      if (!data.success) {
        throw new Error(data.error || 'AI service not available')
      }

      return data
    } catch (error) {
      console.error('AI Service endpoint info error:', error)
      throw error
    }
  }

  /**
   * Validate a message before sending
   * @param {string} message - Message to validate
   * @returns {Object} Validation result
   */
  validateMessage(message) {
    const trimmed = message?.trim()
    
    if (!trimmed) {
      return {
        valid: false,
        error: 'Message cannot be empty'
      }
    }

    if (trimmed.length > 1000) {
      return {
        valid: false,
        error: 'Message is too long (max 1000 characters)'
      }
    }

    return {
      valid: true,
      message: trimmed
    }
  }

  /**
   * Format conversation history for API
   * @param {Array} messages - Array of message objects
   * @param {number} limit - Maximum number of messages to include
   * @returns {Array} Formatted conversation history
   */
  formatConversationHistory(messages, limit = 10) {
    if (!Array.isArray(messages)) {
      return []
    }

    return messages
      .slice(-limit) // Get last N messages
      .filter(msg => msg.role && msg.content) // Filter valid messages
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
  }

  /**
   * Generate example questions for the user
   * @returns {Array} Array of example questions
   */
  getExampleQuestions() {
    return [
      "What's Toca's background?",
      "What technologies does he work with?",
      "Tell me about his recent projects",
      "What kind of roles is he looking for?",
      "What's his experience with Vue.js?",
      "Has he worked with AI/LLM integration?",
      "What's his experience with design systems?",
      "Tell me about his startup experience",
      "What programming languages does he know?",
      "How can I contact Toca?"
    ]
  }

  /**
   * Check if the AI service is available
   * @returns {Promise<boolean>} Service availability
   */
  async checkAvailability() {
    try {
      await this.getEndpointInfo()
      return true
    } catch (error) {
      console.warn('AI Service not available:', error.message)
      return false
    }
  }
}

// Create and export a singleton instance
export const aiService = new AIService()
export default aiService
