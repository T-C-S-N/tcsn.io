// API endpoint for visitor interactions
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const interactionsCollection = db.collection('visitor_interactions');
    
    if (req.method === 'POST') {
      const { action, interactions, interaction } = req.body;
      
      switch (action) {
        case 'batch_create':
          // Insert multiple interactions
          const batchInteractions = interactions.map(int => ({
            ...int,
            createdAt: new Date()
          }));
          
          const batchResult = await interactionsCollection.insertMany(batchInteractions);
          
          res.status(201).json({
            success: true,
            insertedCount: batchResult.insertedCount,
            insertedIds: batchResult.insertedIds,
            message: 'Batch interactions recorded successfully'
          });
          break;
          
        case 'create':
          // Insert single interaction
          const singleInteraction = {
            ...interaction,
            createdAt: new Date()
          };
          
          const singleResult = await interactionsCollection.insertOne(singleInteraction);
          
          res.status(201).json({
            success: true,
            interactionId: singleResult.insertedId,
            message: 'Interaction recorded successfully'
          });
          break;
          
        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action'
          });
      }
    }
    else if (req.method === 'GET') {
      const { visitorId, sessionId, type, startDate, endDate, limit = 100 } = req.query;
      
      // Build query
      let query = {};
      
      if (visitorId) query.visitorId = visitorId;
      if (sessionId) query.sessionId = sessionId;
      if (type) query.type = type;
      
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }
      
      const interactions = await interactionsCollection
        .find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .toArray();
      
      res.status(200).json({
        success: true,
        interactions,
        count: interactions.length
      });
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
    
  } catch (error) {
    console.error('Visitor interactions API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
