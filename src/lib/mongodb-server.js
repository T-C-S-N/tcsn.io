// Server-side MongoDB connection service
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

class ServerMongoDBService {
  constructor() {
    this.isConnected = false
    this.connectionPromise = null
  }

  static getInstance() {
    if (!ServerMongoDBService.instance) {
      ServerMongoDBService.instance = new ServerMongoDBService()
    }
    return ServerMongoDBService.instance
  }

  async connect() {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    const config = this.getConnectionConfig()
    
    this.connectionPromise = this.performConnection(config)
    return this.connectionPromise
  }

  getConnectionConfig() {
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME || 'tcsnio'

    if (!uri) {
      throw new Error('MongoDB URI is not defined. Please set MONGO_URI environment variable.')
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
      console.log('🔌 Connecting to MongoDB...')
      
      const connection = await mongoose.connect(config.uri, config.options)
      
      this.isConnected = true
      console.log(`✅ MongoDB connected successfully to database: ${config.dbName}`)
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected')
        this.isConnected = true
      })

      return connection
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      this.isConnected = false
      this.connectionPromise = null
      throw error
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      this.isConnected = false
      this.connectionPromise = null
      console.log('📴 MongoDB disconnected')
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1
  }

  getConnection() {
    if (!this.isConnected) {
      throw new Error('MongoDB is not connected. Call connect() first.')
    }
    return mongoose.connection
  }

  async healthCheck() {
    try {
      const admin = mongoose.connection.db?.admin()
      if (admin) {
        await admin.ping()
        return true
      }
      return false
    } catch (error) {
      console.error('❌ MongoDB health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const serverMongoService = ServerMongoDBService.getInstance()

// Export the connect function for convenience
export const connectToDatabase = () => serverMongoService.connect()

// Export default for compatibility
export default serverMongoService
