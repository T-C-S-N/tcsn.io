// API endpoint for page visit tracking
import { MongoClient } from 'mongodb';

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
    const pageVisitsCollection = db.collection('pageVisits');
    const visitorsCollection = db.collection('visitors');
    
    const { action, pageVisit, visitorId, sessionId } = req.body;
    
    switch (action) {
      case 'create':
        // Create new page visit
        const insertResult = await pageVisitsCollection.insertOne({
          ...pageVisit,
          createdAt: new Date()
        });
        
        // Update visitor's page view count
        await visitorsCollection.updateOne(
          { visitorId: pageVisit.visitorId },
          { 
            $inc: { totalPageViews: 1 },
            $push: { 'currentSession.pageViews': {
              page: pageVisit.page,
              timestamp: pageVisit.timestamp,
              url: pageVisit.url
            }},
            $set: { 
              'currentSession.lastActivity': new Date(),
              updatedAt: new Date()
            }
          }
        );
        
        res.status(201).json({
          success: true,
          pageVisitId: insertResult.insertedId,
          message: 'Page visit tracked successfully'
        });
        break;
        
      case 'update':
        // Update page visit (e.g., duration, scroll depth)
        const { pageVisitId, updates } = req.body;
        
        const updateResult = await pageVisitsCollection.updateOne(
          { _id: pageVisitId },
          { $set: { ...updates, updatedAt: new Date() } }
        );
        
        res.status(200).json({
          success: true,
          modified: updateResult.modifiedCount,
          message: 'Page visit updated successfully'
        });
        break;
        
      case 'get':
        // Get page visits for a visitor
        const { visitorId: queryVisitorId, page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;
        
        const visits = await pageVisitsCollection
          .find({ visitorId: queryVisitorId })
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();
          
        res.status(200).json({
          success: true,
          visits,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit)
          }
        });
        break;
        
      case 'analytics':
        // Get page visit analytics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Popular pages
        const popularPages = await pageVisitsCollection.aggregate([
          { $match: { timestamp: { $gte: thisWeek } } },
          { $group: { _id: '$page', visits: { $sum: 1 }, unique: { $addToSet: '$visitorId' } } },
          { $project: { page: '$_id', visits: 1, uniqueVisitors: { $size: '$unique' } } },
          { $sort: { visits: -1 } },
          { $limit: 10 }
        ]).toArray();
        
        // Hourly distribution
        const hourlyDistribution = await pageVisitsCollection.aggregate([
          { $match: { timestamp: { $gte: today } } },
          { $group: { 
            _id: { $hour: '$timestamp' }, 
            visits: { $sum: 1 } 
          }},
          { $sort: { '_id': 1 } }
        ]).toArray();
        
        // Browser statistics
        const browserStats = await visitorsCollection.aggregate([
          { $group: { 
            _id: '$browserInfo.browser', 
            count: { $sum: 1 } 
          }},
          { $sort: { count: -1 } }
        ]).toArray();
        
        // Location statistics
        const locationStats = await visitorsCollection.aggregate([
          { $group: { 
            _id: '$location.country', 
            count: { $sum: 1 } 
          }},
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).toArray();
        
        res.status(200).json({
          success: true,
          analytics: {
            popularPages,
            hourlyDistribution,
            browserStats,
            locationStats
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
    console.error('Page visits API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
