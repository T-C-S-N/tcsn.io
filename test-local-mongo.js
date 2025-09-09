// Local MongoDB Connection Test
import { MongoClient } from 'mongodb'

async function testLocalMongoConnection() {
  console.log('🔧 Testing MongoDB connection locally...')
  
  const uri = 'mongodb+srv://app:DmxKu5X6b2ZbTKPR@tcsnio-cluster-0.q7vltyd.mongodb.net/?retryWrites=true&w=majority&appName=tcsnio-cluster-0'
  const dbName = 'tcsnio'
  
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  try {
    console.log('📡 Connecting to MongoDB Atlas...')
    await client.connect()
    
    console.log('✅ Connected successfully!')
    
    const db = client.db(dbName)
    const testCollection = db.collection('test')
    
    // Test insert
    console.log('📝 Testing insert...')
    const insertResult = await testCollection.insertOne({
      name: 'Local Test',
      message: 'Local MongoDB connection successful!',
      timestamp: new Date()
    })
    console.log('✅ Insert successful:', insertResult.insertedId)
    
    // Test find
    console.log('🔍 Testing find...')
    const documents = await testCollection.find({ name: 'Local Test' }).toArray()
    console.log('✅ Find successful:', documents.length, 'documents found')
    
    // Test delete
    console.log('🧹 Cleaning up...')
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId })
    console.log('✅ Cleanup successful:', deleteResult.deletedCount, 'documents deleted')
    
    console.log('\n🎉 Local MongoDB Connection Test PASSED!')
    console.log('✅ Your MongoDB connection credentials are working correctly')
    console.log('✅ The issue is likely with Vercel deployment protection')
    
  } catch (error) {
    console.error('\n❌ Local MongoDB Connection Test FAILED!')
    console.error('Error:', error.message)
    
    if (error.message.includes('Authentication failed')) {
      console.error('💡 Check your username/password in the connection string')
    } else if (error.message.includes('IP')) {
      console.error('💡 Check MongoDB Atlas IP allowlist settings')
    } else if (error.message.includes('timeout')) {
      console.error('💡 Check your network connection or MongoDB Atlas status')
    }
  } finally {
    await client.close()
    console.log('📴 Connection closed')
  }
}

testLocalMongoConnection()
