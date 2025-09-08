import { reactive } from 'vue'
import { mongoService } from '../lib/mongodb.js'

export function useDatabase() {
  const state = reactive({
    isConnected: false,
    isConnecting: false,
    error: null,
    connectionAttempts: 0
  })

  const connect = async () => {
    if (state.isConnecting) return

    state.isConnecting = true
    state.error = null
    state.connectionAttempts++

    try {
      await mongoService.connect()
      state.isConnected = true
      console.log('✅ Database connected successfully')
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown connection error'
      state.isConnected = false
      console.error('❌ Database connection failed:', error)
    } finally {
      state.isConnecting = false
    }
  }

  const disconnect = async () => {
    try {
      await mongoService.disconnect()
      state.isConnected = false
      state.error = null
      console.log('📴 Database disconnected')
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown disconnection error'
      console.error('❌ Database disconnection failed:', error)
    }
  }

  const healthCheck = async (): Promise<boolean> => {
    try {
      const isHealthy = await mongoService.healthCheck()
      state.isConnected = isHealthy
      return isHealthy
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Health check failed'
      state.isConnected = false
      return false
    }
  }

  const getConnectionStatus = () => {
    const status = mongoService.getConnectionStatus()
    state.isConnected = status
    return status
  }

  // Auto-check connection status on mount
  const checkInitialConnection = () => {
    state.isConnected = mongoService.getConnectionStatus()
  }

  return {
    state,
    connect,
    disconnect,
    healthCheck,
    getConnectionStatus,
    checkInitialConnection,
    mongoService
  }
}
