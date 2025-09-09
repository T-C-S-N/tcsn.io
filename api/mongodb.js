// Vercel serverless function for MongoDB operations
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connection caching for better performance
let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  await client.connect()
  const db = client.db(process.env.MONGO_DB_NAME || 'tcsnio')

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    })
  }

  try {
    const { db } = await connectToDatabase()
    const { action, collection, data = {} } = req.body

    // Validate required fields
    if (!action || !collection) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: action, collection'
      })
    }

    // Security: Restrict collection names (whitelist approach)
    const allowedCollections = [
      'users', 'projects', 'test', 'test_users', 'products', 'memos'
    ]
    
    if (!allowedCollections.includes(collection)) {
      return res.status(403).json({
        success: false,
        error: `Collection '${collection}' not allowed`
      })
    }

    const mongoCollection = db.collection(collection)
    let result

    switch (action) {
      case 'find':
        const findOptions = {}
        if (data.limit) findOptions.limit = parseInt(data.limit)
        if (data.skip) findOptions.skip = parseInt(data.skip)
        if (data.sort) findOptions.sort = data.sort

        result = await mongoCollection.find(data.filter || {}, findOptions).toArray()
        break

      case 'findOne':
        result = await mongoCollection.findOne(data.filter || {})
        break

      case 'insertOne':
        if (!data.document) {
          return res.status(400).json({ success: false, error: 'Missing document' })
        }
        
        // Add timestamps
        data.document.createdAt = new Date()
        data.document.updatedAt = new Date()
        
        result = await mongoCollection.insertOne(data.document)
        break

      case 'insertMany':
        if (!data.documents || !Array.isArray(data.documents)) {
          return res.status(400).json({ success: false, error: 'Missing documents array' })
        }
        
        // Add timestamps to all documents
        const now = new Date()
        data.documents.forEach(doc => {
          doc.createdAt = now
          doc.updatedAt = now
        })
        
        result = await mongoCollection.insertMany(data.documents)
        break

      case 'updateOne':
        if (!data.filter || !data.update) {
          return res.status(400).json({ success: false, error: 'Missing filter or update' })
        }
        
        // Add timestamp
        if (!data.update.$set) data.update.$set = {}
        data.update.$set.updatedAt = new Date()
        
        result = await mongoCollection.updateOne(data.filter, data.update)
        break

      case 'updateMany':
        if (!data.filter || !data.update) {
          return res.status(400).json({ success: false, error: 'Missing filter or update' })
        }
        
        // Add timestamp
        if (!data.update.$set) data.update.$set = {}
        data.update.$set.updatedAt = new Date()
        
        result = await mongoCollection.updateMany(data.filter, data.update)
        break

      case 'deleteOne':
        if (!data.filter) {
          return res.status(400).json({ success: false, error: 'Missing filter' })
        }
        
        // Convert string _id to ObjectId if needed
        if (data.filter._id && typeof data.filter._id === 'string') {
          try {
            data.filter._id = new ObjectId(data.filter._id)
          } catch (e) {
            return res.status(400).json({ success: false, error: 'Invalid ObjectId' })
          }
        }
        
        result = await mongoCollection.deleteOne(data.filter)
        break

      case 'deleteMany':
        if (!data.filter) {
          return res.status(400).json({ success: false, error: 'Missing filter' })
        }
        result = await mongoCollection.deleteMany(data.filter)
        break

      case 'count':
        result = { count: await mongoCollection.countDocuments(data.filter || {}) }
        break

      case 'aggregate':
        if (!data.pipeline || !Array.isArray(data.pipeline)) {
          return res.status(400).json({ success: false, error: 'Missing pipeline array' })
        }
        result = await mongoCollection.aggregate(data.pipeline).toArray()
        break

      default:
        return res.status(400).json({ 
          success: false, 
          error: `Invalid action: ${action}. Supported: find, findOne, insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany, count, aggregate` 
        })
    }

    res.status(200).json({ 
      success: true, 
      data: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database operation failed:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
