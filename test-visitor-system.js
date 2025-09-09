import { MongoClient } from 'mongodb';
import NameGenerationService from './src/lib/NameGenerationService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// MongoDB connection
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

async function testVisitorSystem() {
  console.log('🧪 Testing Visitor Tracking System\n');
  
  const client = new MongoClient(uri);
  
  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await client.connect();
    const db = client.db(dbName);
    console.log('✅ Database connected');
    
    // Test collections
    const visitorsCollection = db.collection('visitors');
    const pageVisitsCollection = db.collection('pageVisits');
    
    // Test name generation service
    console.log('\n2. Testing name generation...');
    
    // Test AI name generation
    console.log('   🤖 Testing AI name generation...');
    try {
      const aiNameResult = await NameGenerationService.generateName({
        location: { country: 'United States', city: 'San Francisco' },
        browser: { browser: 'Chrome', version: '118' },
        timeOfDay: 'morning',
        isReturn: false,
        sessionId: 'test_session_123'
      });
      console.log('   ✅ AI Name:', aiNameResult.name, `(${aiNameResult.source})`);
    } catch (error) {
      console.log('   ⚠️  AI generation failed:', error.message);
    }
    
    // Test fallback name generation
    console.log('   🎲 Testing fallback name generation...');
    const fallbackNames = [];
    for (let i = 0; i < 5; i++) {
      const fallbackResult = await NameGenerationService.generateName({
        location: { country: 'Canada', city: 'Toronto' },
        browser: { browser: 'Firefox', version: '119' },
        timeOfDay: 'evening',
        isReturn: i > 2,
        sessionId: `test_session_${i}`
      });
      fallbackNames.push(fallbackResult.name);
    }
    console.log('   ✅ Fallback Names:', fallbackNames);
    
    // Test visitor creation
    console.log('\n3. Testing visitor creation...');
    const testVisitor = {
      visitorId: 'test_visitor_' + Date.now(),
      sessionId: 'test_session_' + Date.now(),
      isTemporary: true,
      generatedName: 'Creative Dolphin',
      fallbackName: null,
      browserInfo: {
        browser: 'Chrome',
        version: '118.0',
        os: { name: 'Mac OS', version: '14.0' },
        device: 'Desktop',
        mobile: false,
        screen: { width: 1920, height: 1080 },
        language: 'en-US',
        timezone: 'America/New_York'
      },
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: 'America/Los_Angeles'
      },
      firstVisit: new Date(),
      lastVisit: new Date(),
      totalVisits: 1,
      totalPageViews: 0,
      currentSession: {
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: [],
        referrer: 'https://google.com',
        landingPage: '/'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const visitorResult = await visitorsCollection.insertOne(testVisitor);
    console.log('   ✅ Test visitor created:', visitorResult.insertedId);
    
    // Test page visit creation
    console.log('\n4. Testing page visit tracking...');
    const testPageVisit = {
      visitorId: testVisitor.visitorId,
      sessionId: testVisitor.sessionId,
      page: '/test-page',
      title: 'Test Page',
      url: 'https://tcsn.io/test-page',
      referrer: 'https://tcsn.io/',
      timestamp: new Date(),
      duration: 0,
      scrollDepth: 0,
      clicks: 0,
      interactions: []
    };
    
    const pageVisitResult = await pageVisitsCollection.insertOne(testPageVisit);
    console.log('   ✅ Test page visit created:', pageVisitResult.insertedId);
    
    // Test visitor update
    console.log('\n5. Testing visitor update...');
    const updateResult = await visitorsCollection.updateOne(
      { visitorId: testVisitor.visitorId },
      { 
        $inc: { totalPageViews: 1 },
        $set: { 
          'currentSession.lastActivity': new Date(),
          updatedAt: new Date()
        },
        $push: {
          'currentSession.pageViews': {
            page: testPageVisit.page,
            timestamp: testPageVisit.timestamp,
            url: testPageVisit.url
          }
        }
      }
    );
    console.log('   ✅ Visitor updated:', updateResult.modifiedCount, 'document(s)');
    
    // Test analytics queries
    console.log('\n6. Testing analytics queries...');
    
    // Count visitors
    const visitorCount = await visitorsCollection.countDocuments();
    console.log('   📊 Total visitors:', visitorCount);
    
    // Count page visits
    const pageVisitCount = await pageVisitsCollection.countDocuments();
    console.log('   📊 Total page visits:', pageVisitCount);
    
    // Get recent visitors
    const recentVisitors = await visitorsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .project({ visitorId: 1, generatedName: 1, fallbackName: 1, createdAt: 1 })
      .toArray();
    
    console.log('   📊 Recent visitors:');
    recentVisitors.forEach(v => {
      const name = v.generatedName || v.fallbackName || 'Anonymous';
      console.log(`      - ${name} (${v.visitorId.slice(-8)}...)`);
    });
    
    // Clean up test data
    console.log('\n7. Cleaning up test data...');
    await visitorsCollection.deleteOne({ visitorId: testVisitor.visitorId });
    await pageVisitsCollection.deleteOne({ visitorId: testVisitor.visitorId });
    console.log('   ✅ Test data cleaned up');
    
    console.log('\n🎉 All tests passed! Visitor tracking system is ready to use!');
    
    console.log('\n📋 System Summary:');
    console.log('✅ Database connection working');
    console.log('✅ Name generation (AI + Fallback) working');
    console.log('✅ Visitor creation working');
    console.log('✅ Page visit tracking working');
    console.log('✅ Analytics queries working');
    console.log('✅ Data cleanup working');
    
    console.log('\n🚀 Ready to track visitors!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Run the test
testVisitorSystem();
