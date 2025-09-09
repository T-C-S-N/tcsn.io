// Test analytics system
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Analytics System...');

// Test data
const testVisitorId = 'test-visitor-123';
const testSessionId = 'test-session-456';

// Test analytics events
const testEvents = [
  {
    eventType: 'visitor_arrival',
    visitorId: testVisitorId,
    sessionId: testSessionId,
    data: {
      landingPage: '/',
      referrer: 'Direct',
      userAgent: 'Test Agent',
      location: { country: 'Test', city: 'Test' }
    }
  },
  {
    eventType: 'page_entry',
    visitorId: testVisitorId,
    sessionId: testSessionId,
    data: {
      page: '/',
      title: 'Home - Test'
    }
  },
  {
    eventType: 'click',
    visitorId: testVisitorId,
    sessionId: testSessionId,
    data: {
      page: '/',
      element: 'button',
      selector: '.test-button'
    }
  }
];

async function testAnalytics() {
  try {
    console.log('📤 Sending test events...');
    
    for (const event of testEvents) {
      const response = await fetch('http://localhost:3002/api/visitor-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'record_event',
          ...event
        })
      });
      
      const result = await response.json();
      console.log(`✅ Event ${event.eventType}:`, result.success ? 'Success' : 'Failed');
    }
    
    // Wait a moment then check results
    console.log('\n📊 Checking analytics results...');
    
    setTimeout(async () => {
      // Check analytics summary
      const summaryResponse = await fetch('http://localhost:3002/api/visitor-analytics?action=analytics_summary');
      const summaryData = await summaryResponse.json();
      console.log('📈 Analytics Summary:', JSON.stringify(summaryData, null, 2));
      
      // Check visitor journey
      const journeyResponse = await fetch(`http://localhost:3002/api/visitor-analytics?action=visitor_journey&visitorId=${testVisitorId}`);
      const journeyData = await journeyResponse.json();
      console.log('🗺️ Visitor Journey:', JSON.stringify(journeyData, null, 2));
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAnalytics();
