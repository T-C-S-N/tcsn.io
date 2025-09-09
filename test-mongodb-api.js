import fetch from 'node-fetch';

async function testMongoAPI() {
  try {
    console.log('🧪 Testing MongoDB API connection...\n');
    
    // Test health check first
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.text();
    console.log('✅ Health check:', healthData);
    
    // Test MongoDB connection
    console.log('\n2. Testing MongoDB connection...');
    const mongoResponse = await fetch('http://localhost:3001/api/mongodb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'find',
        collection: 'test',
        data: {
          filter: {},
          limit: 1
        }
      })
    });
    
    const mongoData = await mongoResponse.json();
    console.log('✅ MongoDB response:', JSON.stringify(mongoData, null, 2));
    
    // Test insert operation
    console.log('\n3. Testing MongoDB insert...');
    const insertResponse = await fetch('http://localhost:3001/api/mongodb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'insertOne',
        collection: 'test',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          timestamp: new Date().toISOString()
        }
      })
    });
    
    const insertData = await insertResponse.json();
    console.log('✅ Insert response:', JSON.stringify(insertData, null, 2));
    
    console.log('\n🎉 MongoDB API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing MongoDB API:', error.message);
  }
}

testMongoAPI();
