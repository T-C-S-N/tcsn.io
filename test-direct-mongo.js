import { MongoClient } from 'mongodb';

// MongoDB connection string (should match your .env)
const uri = "mongodb+srv://app:DmxKu5X6b2ZbTKPR@tcsnio-cluster-0.q7vltyd.mongodb.net/?retryWrites=true&w=majority&appName=tcsnio-cluster-0";
const dbName = "tcsnio";

async function testMongoConnection() {
  console.log('🧪 Testing direct MongoDB connection...\n');
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get database
    const db = client.db(dbName);
    console.log(`✅ Using database: ${dbName}`);
    
    // List collections
    console.log('\n2. Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name));
    
    // Test read operation
    console.log('\n3. Testing read operation...');
    const testCollection = db.collection('test');
    const documents = await testCollection.find({}).limit(5).toArray();
    console.log('📄 Found documents:', documents.length);
    if (documents.length > 0) {
      console.log('📄 Sample document:', JSON.stringify(documents[0], null, 2));
    }
    
    // Test write operation
    console.log('\n4. Testing write operation...');
    const testDoc = {
      name: 'Connection Test',
      timestamp: new Date(),
      status: 'success'
    };
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Insert result:', insertResult.insertedId);
    
    // Test update operation
    console.log('\n5. Testing update operation...');
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true, updatedAt: new Date() } }
    );
    console.log('✅ Update result:', updateResult.modifiedCount, 'document(s) modified');
    
    // Test delete operation
    console.log('\n6. Testing delete operation...');
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Delete result:', deleteResult.deletedCount, 'document(s) deleted');
    
    console.log('\n🎉 All MongoDB operations completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  } finally {
    // Close connection
    await client.close();
    console.log('\n🔒 Connection closed');
  }
}

testMongoConnection();
