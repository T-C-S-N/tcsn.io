// URL Shortener API - Handles short URL creation, tracking, and analytics
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

// MongoDB connection
let client;
let db;

async function connectToDatabase() {
  if (!client) {
    console.log('🔌 Connecting to MongoDB...');
    try {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }
  return { client, db };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { client, db } = await connectToDatabase();
    const shortUrlsCollection = db.collection('short_urls');
    const clicksCollection = db.collection('url_clicks');
    
    // Handle GET requests
    let action, shortCode, limit;
    
    if (req.method === 'GET') {
      action = req.query.action;
      shortCode = req.query.shortCode;
      limit = parseInt(req.query.limit) || 50;
    } else {
      ({ action } = req.body || {});
    }
    
    switch (action) {
      case 'create':
        return await createShortUrl(req, res, shortUrlsCollection);
      
      case 'get':
        return await getShortUrl(req, res, shortUrlsCollection, shortCode);
      
      case 'track_click':
        return await trackClick(req, res, shortUrlsCollection, clicksCollection);
      
      case 'analytics':
        return await getAnalytics(req, res, shortUrlsCollection, clicksCollection, shortCode);
      
      case 'list':
        return await listShortUrls(req, res, shortUrlsCollection, limit);
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action specified'
        });
    }

  } catch (error) {
    console.error('URL Shortener API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

// Create a new short URL
async function createShortUrl(req, res, collection) {
  try {
    const { urlData } = req.body;
    
    if (!urlData || !urlData.originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    // Validate URL
    try {
      new URL(urlData.originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Check if short code already exists
    const existing = await collection.findOne({ shortCode: urlData.shortCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Short code already exists'
      });
    }

    // Insert new short URL
    const result = await collection.insertOne({
      ...urlData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (result.insertedId) {
      return res.status(201).json({
        success: true,
        message: 'Short URL created successfully',
        shortCode: urlData.shortCode,
        id: result.insertedId
      });
    } else {
      throw new Error('Failed to insert URL data');
    }

  } catch (error) {
    console.error('Error creating short URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create short URL',
      error: error.message
    });
  }
}

// Get short URL data
async function getShortUrl(req, res, collection, shortCode) {
  try {
    if (!shortCode) {
      return res.status(400).json({
        success: false,
        message: 'Short code is required'
      });
    }

    const urlData = await collection.findOne({ shortCode });
    
    if (!urlData) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    return res.status(200).json({
      success: true,
      urlData
    });

  } catch (error) {
    console.error('Error getting short URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get short URL',
      error: error.message
    });
  }
}

// Track a click on short URL
async function trackClick(req, res, shortUrlsCollection, clicksCollection) {
  try {
    const { shortCode, clickData } = req.body;
    
    if (!shortCode || !clickData) {
      return res.status(400).json({
        success: false,
        message: 'Short code and click data are required'
      });
    }

    // Insert click record
    const clickResult = await clicksCollection.insertOne({
      shortCode,
      ...clickData,
      timestamp: new Date(clickData.timestamp)
    });

    // Update short URL analytics
    const updateResult = await shortUrlsCollection.updateOne(
      { shortCode },
      {
        $inc: { 
          clicks: 1,
          'analytics.totalClicks': 1
        },
        $set: {
          updatedAt: new Date(),
          [`analytics.referrers.${clickData.referrer}`]: 1
        }
      }
    );

    // Update analytics aggregations
    const today = new Date().toISOString().split('T')[0];
    await shortUrlsCollection.updateOne(
      { shortCode },
      {
        $inc: {
          [`analytics.clicksByDate.${today}`]: 1,
          [`analytics.locations.${clickData.location?.country || 'Unknown'}`]: 1,
          [`analytics.devices.${clickData.device?.type || 'Unknown'}`]: 1,
          [`analytics.browsers.${clickData.browser?.name || 'Unknown'}`]: 1
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      clickId: clickResult.insertedId
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track click',
      error: error.message
    });
  }
}

// Get analytics for a short URL
async function getAnalytics(req, res, shortUrlsCollection, clicksCollection, shortCode) {
  try {
    if (!shortCode) {
      return res.status(400).json({
        success: false,
        message: 'Short code is required'
      });
    }

    // Get URL data with basic analytics
    const urlData = await shortUrlsCollection.findOne({ shortCode });
    
    if (!urlData) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    // Get detailed click data
    const clicks = await clicksCollection.find({ shortCode })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    // Calculate advanced analytics
    const analytics = await calculateAdvancedAnalytics(clicksCollection, shortCode);

    return res.status(200).json({
      success: true,
      shortCode,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      totalClicks: urlData.clicks || 0,
      analytics: {
        ...urlData.analytics,
        ...analytics
      },
      recentClicks: clicks.slice(0, 10),
      allClicks: clicks.length
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
}

// List all short URLs
async function listShortUrls(req, res, collection, limit) {
  try {
    const urls = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return res.status(200).json({
      success: true,
      urls,
      count: urls.length
    });

  } catch (error) {
    console.error('Error listing short URLs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to list short URLs',
      error: error.message
    });
  }
}

// Calculate advanced analytics
async function calculateAdvancedAnalytics(clicksCollection, shortCode) {
  try {
    const pipeline = [
      { $match: { shortCode } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          countries: { $push: '$location.country' },
          devices: { $push: '$device.type' },
          browsers: { $push: '$browser.name' },
          referrers: { $push: '$referrer' },
          hours: { $push: { $hour: '$timestamp' } },
          days: { $push: { $dayOfWeek: '$timestamp' } }
        }
      },
      {
        $project: {
          totalClicks: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          topCountries: '$countries',
          topDevices: '$devices',
          topBrowsers: '$browsers',
          topReferrers: '$referrers',
          clicksByHour: '$hours',
          clicksByDay: '$days'
        }
      }
    ];

    const result = await clicksCollection.aggregate(pipeline).toArray();
    
    if (result.length === 0) {
      return {
        uniqueVisitors: 0,
        topCountries: [],
        topDevices: [],
        topBrowsers: [],
        topReferrers: [],
        clicksByHour: [],
        clicksByDay: []
      };
    }

    const analytics = result[0];
    
    // Process arrays into frequency objects
    analytics.topCountries = getTopItems(analytics.topCountries);
    analytics.topDevices = getTopItems(analytics.topDevices);
    analytics.topBrowsers = getTopItems(analytics.topBrowsers);
    analytics.topReferrers = getTopItems(analytics.topReferrers);
    analytics.clicksByHour = getFrequencyDistribution(analytics.clicksByHour, 24);
    analytics.clicksByDay = getFrequencyDistribution(analytics.clicksByDay, 7);

    return analytics;

  } catch (error) {
    console.error('Error calculating advanced analytics:', error);
    return {};
  }
}

// Helper function to get top items from array
function getTopItems(array, limit = 10) {
  const frequency = {};
  array.forEach(item => {
    if (item && item !== 'Unknown') {
      frequency[item] = (frequency[item] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item, count]) => ({ item, count }));
}

// Helper function to get frequency distribution
function getFrequencyDistribution(array, buckets) {
  const distribution = new Array(buckets).fill(0);
  array.forEach(value => {
    if (value >= 0 && value < buckets) {
      distribution[value]++;
    }
  });
  return distribution;
}
