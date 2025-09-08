import { mongoService } from '../lib/mongodb.js'

// Test connection API
export async function testConnection() {
  try {
    await mongoService.connect()
    const isHealthy = await mongoService.healthCheck()
    
    return {
      success: true,
      connected: mongoService.getConnectionStatus(),
      healthy: isHealthy,
      message: 'Database connection test completed'
    }
  } catch (error) {
    return {
      success: false,
      connected: false,
      healthy: false,
      message: error.message,
      error: error.toString()
    }
  }
}

// Get database info
export async function getDatabaseInfo() {
  try {
    if (!mongoService.getConnectionStatus()) {
      await mongoService.connect()
    }

    const connection = mongoService.getConnection()
    const dbName = connection.db.databaseName
    const collections = await connection.db.listCollections().toArray()
    
    return {
      success: true,
      database: dbName,
      collections: collections.map(col => col.name),
      connectionState: connection.readyState
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    await mongoService.connect()
    const connection = mongoService.getConnection()
    
    // Create a test collection with sample data
    const testCollection = connection.db.collection('test')
    
    // Check if test data already exists
    const existingData = await testCollection.findOne({ type: 'sample' })
    
    if (!existingData) {
      await testCollection.insertOne({
        type: 'sample',
        message: 'Database initialized successfully',
        timestamp: new Date(),
        version: '1.0.0'
      })
    }
    
    return {
      success: true,
      message: 'Database initialized successfully',
      alreadyInitialized: !!existingData
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
