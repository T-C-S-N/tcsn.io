// MongoDB Connection Test Script
const API_ENDPOINT = 'https://tcsn-isd9o0ydl-tocausans-projects.vercel.app/api/mongodb'

async function testMongoConnection() {
  console.log('🔧 Testing MongoDB connection via Vercel serverless function...')
  console.log(`📡 Endpoint: ${API_ENDPOINT}`)
  
  try {
    // Test 1: Insert a test document
    console.log('\n📝 Test 1: Inserting test document...')
    const insertResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'insertOne',
        collection: 'test',
        data: {
          document: {
            name: 'Connection Test',
            message: 'MongoDB connection successful!',
            testType: 'automated',
            timestamp: new Date().toISOString()
          }
        }
      })
    })

    if (!insertResponse.ok) {
      throw new Error(`HTTP ${insertResponse.status}: ${insertResponse.statusText}`)
    }

    const insertResult = await insertResponse.json()
    console.log('✅ Insert successful:', insertResult)

    // Test 2: Find the document we just inserted
    console.log('\n🔍 Test 2: Finding test documents...')
    const findResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'find',
        collection: 'test',
        data: {
          filter: { testType: 'automated' },
          limit: 5
        }
      })
    })

    if (!findResponse.ok) {
      throw new Error(`HTTP ${findResponse.status}: ${findResponse.statusText}`)
    }

    const findResult = await findResponse.json()
    console.log('✅ Find successful:', findResult)
    console.log(`📊 Found ${findResult.data.length} test documents`)

    // Test 3: Count documents
    console.log('\n🔢 Test 3: Counting total documents...')
    const countResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'count',
        collection: 'test',
        data: {
          filter: {}
        }
      })
    })

    if (!countResponse.ok) {
      throw new Error(`HTTP ${countResponse.status}: ${countResponse.statusText}`)
    }

    const countResult = await countResponse.json()
    console.log('✅ Count successful:', countResult)

    // Test 4: Clean up - delete test document
    if (insertResult.data.insertedId) {
      console.log('\n🧹 Test 4: Cleaning up test document...')
      const deleteResponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteOne',
          collection: 'test',
          data: {
            filter: { _id: insertResult.data.insertedId }
          }
        })
      })

      if (!deleteResponse.ok) {
        throw new Error(`HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`)
      }

      const deleteResult = await deleteResponse.json()
      console.log('✅ Cleanup successful:', deleteResult)
    }

    console.log('\n🎉 MongoDB Connection Test PASSED!')
    console.log('✅ All operations completed successfully')
    console.log('✅ Serverless function is working correctly')
    console.log('✅ MongoDB cluster is accessible')

  } catch (error) {
    console.error('\n❌ MongoDB Connection Test FAILED!')
    console.error('Error:', error.message)
    
    if (error.message.includes('fetch')) {
      console.error('💡 This might be a network or CORS issue')
    } else if (error.message.includes('500')) {
      console.error('💡 This might be a server-side MongoDB connection issue')
    } else if (error.message.includes('400')) {
      console.error('💡 This might be a request format issue')
    }
  }
}

// Run the test
testMongoConnection()
