// API endpoint for visitor tracking
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
    const visitorsCollection = db.collection('visitors');
    
    // Handle GET requests differently
    let action, visitor, isNewSession;
    
    if (req.method === 'GET') {
      action = req.query.action || 'list';
    } else {
      ({ action, visitor, isNewSession } = req.body || {});
    }
    
    switch (action) {
      case 'list':
        // List all visitors (for GET requests)
        const allVisitors = await visitorsCollection.find({}).sort({ createdAt: -1 }).limit(20).toArray();
        
        return res.status(200).json({
          success: true,
          visitors: allVisitors,
          count: allVisitors.length
        });
        
      case 'create':
        // Create new visitor
        const insertResult = await visitorsCollection.insertOne({
          ...visitor,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        res.status(201).json({
          success: true,
          visitorId: insertResult.insertedId,
          message: 'Visitor created successfully'
        });
        break;
        
      case 'update':
        // Update existing visitor
        const { currentSession, totalVisits, ...visitorWithoutSessionAndTotal } = visitor;
        
        const baseUpdateData = {
          ...visitorWithoutSessionAndTotal,
          updatedAt: new Date(),
          lastVisit: new Date()
        };
        
        let updateOperation;
        
        if (isNewSession) {
          // For new sessions, replace the entire currentSession object
          updateOperation = { 
            $set: {
              ...baseUpdateData,
              currentSession: visitor.currentSession
            }, 
            $inc: { totalVisits: 1 } 
          };
        } else {
          // For existing sessions, only update specific fields
          updateOperation = { 
            $set: {
              ...baseUpdateData,
              'currentSession.lastActivity': new Date()
            }
          };
        }
        
        const updateResult = await visitorsCollection.updateOne(
          { visitorId: visitor.visitorId },
          updateOperation
        );
        
        res.status(200).json({
          success: true,
          modified: updateResult.modifiedCount,
          message: 'Visitor updated successfully'
        });
        break;
        
      case 'get':
        // Get visitor by ID
        const { visitorId } = req.query;
        const foundVisitor = await visitorsCollection.findOne({ visitorId });
        
        if (foundVisitor) {
          res.status(200).json({
            success: true,
            visitor: foundVisitor
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Visitor not found'
          });
        }
        break;
        
      case 'list':
        // List all visitors with pagination
        const { page = 1, limit = 50, sortBy = 'lastVisit' } = req.query;
        const skip = (page - 1) * limit;
        
        const visitors = await visitorsCollection
          .find({})
          .sort({ [sortBy]: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();
          
        const total = await visitorsCollection.countDocuments();
        
        res.status(200).json({
          success: true,
          visitors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        });
        break;
        
      case 'stats':
        // Get visitor statistics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats = await Promise.all([
          visitorsCollection.countDocuments(),
          visitorsCollection.countDocuments({ createdAt: { $gte: today } }),
          visitorsCollection.countDocuments({ createdAt: { $gte: thisWeek } }),
          visitorsCollection.countDocuments({ createdAt: { $gte: thisMonth } }),
          visitorsCollection.countDocuments({ isTemporary: true }),
          visitorsCollection.countDocuments({ isTemporary: false })
        ]);
        
        res.status(200).json({
          success: true,
          stats: {
            total: stats[0],
            today: stats[1],
            thisWeek: stats[2],
            thisMonth: stats[3],
            temporary: stats[4],
            registered: stats[5]
          }
        });
        break;
        
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }
    
  } catch (error) {
    console.error('Visitor API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
