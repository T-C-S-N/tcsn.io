// Note: This is a client-side compatible MongoDB service
// For actual database operations, you should use server-side APIs

class MongoDBService {
  constructor() {
    this.isConnected = false
    this.connectionPromise = null
    this.mockConnection = false
  }

  static getInstance() {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService()
    }
    return MongoDBService.instance
  }

  async connect() {
    if (this.isConnected) {
      return this
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    const config = this.getConnectionConfig()
    
    this.connectionPromise = this.performConnection(config)
    return this.connectionPromise
  }

  getConnectionConfig() {
    const uri = import.meta.env.VITE_MONGO_URI
    const dbName = import.meta.env.VITE_MONGO_DB_NAME || 'tcsnio'

    if (!uri) {
      console.warn('MongoDB URI is not defined. Please set VITE_MONGO_URI environment variable.')
      console.warn('Running in mock mode for client-side testing.')
    }

    return {
      uri,
      dbName,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      }
    }
  }

  async performConnection(config) {
    try {      
      // In a browser environment, we can't directly connect to MongoDB
      // This is a mock connection for client-side testing
      if (typeof window !== 'undefined') {
        this.mockConnection = true
        this.isConnected = true
        return this
      }
      
      // Server-side connection would go here
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 100))
      
      this.isConnected = true
      
      return this
    } catch (error) {
      console.error('❌ MongoDB service initialization failed:', error)
      this.isConnected = false
      this.connectionPromise = null
      throw error
    }
  }

  async disconnect() {
    try {
      if (this.mockConnection) {
        console.error('🔌 Disconnecting mock MongoDB service')
      } else {
        console.error('🔌 Disconnecting MongoDB service')
      }
      
      this.isConnected = false
      this.connectionPromise = null
      this.mockConnection = false
      console.log('📴 MongoDB service disconnected')
    } catch (error) {
      console.error('❌ Error disconnecting MongoDB service:', error)
      throw error
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }

  getConnection() {
    if (!this.isConnected) {
      throw new Error('MongoDB service is not connected. Call connect() first.')
    }
    
    if (this.mockConnection) {
      console.log('🔗 Using mock connection')
      return { mock: true, connected: true }
    }
    
    return { connected: true }
  }

  // Health check method
  async healthCheck() {
    try {
      if (this.mockConnection) {
        console.log('💓 Mock health check - OK')
        return true
      }
      
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 50))
      return this.isConnected
    } catch (error) {
      console.error('❌ MongoDB health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const mongoService = MongoDBService.getInstance()

// Export the connect function for convenience
export const connectToDatabase = () => mongoService.connect()

// Export default for compatibility
export default mongoService