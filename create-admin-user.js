import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

// MongoDB connection details
const uri = "mongodb+srv://app:DmxKu5X6b2ZbTKPR@tcsnio-cluster-0.q7vltyd.mongodb.net/?retryWrites=true&w=majority&appName=tcsnio-cluster-0";
const dbName = "tcsnio";

async function createAdminUser() {
  console.log('🔐 Creating Admin User...\n');
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    console.log('\n🔍 Checking if admin user already exists...');
    const existingAdmin = await usersCollection.findOne({ email: 'tomas@tcsn.io' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📋 Existing admin user:', {
        _id: existingAdmin._id,
        email: existingAdmin.email,
        firstname: existingAdmin.firstname,
        lastname: existingAdmin.lastname,
        role: existingAdmin.role,
        verified: existingAdmin.verified,
        createdAt: existingAdmin.createdAt
      });
      return existingAdmin;
    }
    
    // Hash password for admin user
    console.log('🔒 Generating secure password...');
    const plainPassword = 'admin123!'; // You should change this after first login
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    // Create admin user object
    const adminUser = {
      firstname: 'Tomas',
      lastname: 'Admin',
      email: 'tomas@tcsn.io',
      password: hashedPassword,
      role: 'admin',
      verified: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      accessToken: null,
      accessTokenExpiry: null,
      emailToken: null
    };
    
    // Insert admin user
    console.log('👤 Creating admin user...');
    const insertResult = await usersCollection.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    
    // Fetch the created user
    const createdUser = await usersCollection.findOne({ _id: insertResult.insertedId });
    
    console.log('\n🎉 Admin User Details:');
    console.log('📧 Email:', createdUser.email);
    console.log('👤 Name:', `${createdUser.firstname} ${createdUser.lastname}`);
    console.log('🔑 Role:', createdUser.role);
    console.log('✅ Verified:', createdUser.verified);
    console.log('🆔 ID:', createdUser._id);
    console.log('📅 Created:', createdUser.createdAt);
    
    console.log('\n🔐 Login Credentials:');
    console.log('📧 Email: tomas@tcsn.io');
    console.log('🔑 Password: admin123!');
    console.log('⚠️  Please change the password after first login!');
    
    return createdUser;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔒 Connection closed');
  }
}

// Also test general database connection
async function testDatabaseConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🧪 Testing Database Connection...\n');
    
    await client.connect();
    const db = client.db(dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));
    
    // Check users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('👥 Total users in database:', userCount);
    
    console.log('✅ Database connection test successful!\n');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the tests
async function main() {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    // Create admin user
    await createAdminUser();
    
    console.log('\n🎉 All operations completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

main();
