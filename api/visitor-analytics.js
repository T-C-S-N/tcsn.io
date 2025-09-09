// API endpoint for visitor analytics
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
    
    if (req.method === 'POST') {
      const { action, eventType, data } = req.body;
      
      switch (action) {
        case 'record_event':
          const analyticsCollection = db.collection('visitor_analytics');
          
          const analyticsEvent = {
            eventType,
            data,
            timestamp: new Date(),
            createdAt: new Date()
          };
          
          const insertResult = await analyticsCollection.insertOne(analyticsEvent);
          
          res.status(201).json({
            success: true,
            eventId: insertResult.insertedId,
            message: 'Analytics event recorded successfully'
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
      const { action, sessionId, visitorId, startDate, endDate, limit = 100 } = req.query;
      
      switch (action) {
        case 'session_duration':
          const sessionEvents = await db.collection('visitor_analytics').find({
            'data.sessionId': sessionId,
            eventType: { $in: ['visitor_arrival', 'visitor_departure'] }
          }).sort({ timestamp: 1 }).toArray();
          
          let duration = 0;
          if (sessionEvents.length >= 2) {
            const arrival = sessionEvents.find(e => e.eventType === 'visitor_arrival');
            const departure = sessionEvents.find(e => e.eventType === 'visitor_departure');
            
            if (arrival && departure) {
              duration = new Date(departure.timestamp) - new Date(arrival.timestamp);
            }
          }
          
          res.status(200).json({
            success: true,
            duration,
            sessionId
          });
          break;
          
        case 'pages_visited':
          const pageEvents = await db.collection('visitor_analytics').find({
            'data.sessionId': sessionId,
            eventType: { $in: ['page_entry', 'page_exit'] }
          }).sort({ timestamp: 1 }).toArray();
          
          const pages = [...new Set(pageEvents.map(e => e.data.page))];
          
          res.status(200).json({
            success: true,
            pages,
            sessionId
          });
          break;
          
        case 'visitor_journey':
          const journeyEvents = await db.collection('visitor_analytics').find({
            'data.visitorId': visitorId
          }).sort({ timestamp: 1 }).limit(parseInt(limit)).toArray();
          
          res.status(200).json({
            success: true,
            events: journeyEvents,
            visitorId
          });
          break;
          
        case 'analytics_summary':
          const pipeline = [
            {
              $match: {
                timestamp: {
                  $gte: startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000),
                  $lte: endDate ? new Date(endDate) : new Date()
                }
              }
            },
            {
              $group: {
                _id: '$eventType',
                count: { $sum: 1 },
                latestEvent: { $last: '$timestamp' }
              }
            }
          ];
          
          const summary = await db.collection('visitor_analytics').aggregate(pipeline).toArray();
          
          res.status(200).json({
            success: true,
            summary
          });
          break;
          
        case 'active_visitors':
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          const activeVisitors = await db.collection('visitor_analytics').distinct('data.visitorId', {
            eventType: 'heartbeat',
            timestamp: { $gte: fiveMinutesAgo }
          });
          
          res.status(200).json({
            success: true,
            activeCount: activeVisitors.length,
            visitors: activeVisitors
          });
          break;
          
        case 'popular_pages':
          const pageViewsPipeline = [
            {
              $match: {
                eventType: 'page_entry',
                timestamp: {
                  $gte: startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000),
                  $lte: endDate ? new Date(endDate) : new Date()
                }
              }
            },
            {
              $group: {
                _id: '$data.page',
                views: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$data.visitorId' },
                avgTimeOnPage: { $avg: '$data.timeOnPage' }
              }
            },
            {
              $project: {
                page: '$_id',
                views: 1,
                uniqueVisitors: { $size: '$uniqueVisitors' },
                avgTimeOnPage: 1
              }
            },
            { $sort: { views: -1 } },
            { $limit: 10 }
          ];
          
          const popularPages = await db.collection('visitor_analytics').aggregate(pageViewsPipeline).toArray();
          
          res.status(200).json({
            success: true,
            pages: popularPages
          });
          break;
          
        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action'
          });
      }
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
    
  } catch (error) {
    console.error('Visitor analytics API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
