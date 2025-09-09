// Google Authentication API endpoint
import { MongoClient } from 'mongodb';
import GoogleAuthService from '../src/lib/GoogleAuthService.js';
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

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { action, idToken, token } = req.body;

    switch (action) {
      case 'google-login':
        // Verify Google ID token
        const verificationResult = await GoogleAuthService.verifyGoogleToken(idToken);
        
        if (!verificationResult.success) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Google token',
            error: verificationResult.error
          });
        }

        const { user } = verificationResult;

        // Check if user is authorized admin
        if (!GoogleAuthService.isAuthorizedAdmin(user.email)) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You are not authorized to access the admin panel.',
            email: user.email
          });
        }

        // Connect to database
        const client = await connectToDatabase();
        const db = client.db(dbName);
        const adminsCollection = db.collection('admins');

        // Create or update admin user
        const adminUser = await GoogleAuthService.createOrUpdateAdminUser(user);
        
        // Separate fields that should only be set on insert vs always updated
        const { createdAt, updatedAt, lastLogin, ...baseAdminData } = adminUser;
        
        await adminsCollection.updateOne(
          { googleId: user.googleId },
          { 
            $set: {
              ...baseAdminData,
              updatedAt: new Date(),
              lastLogin: new Date()
            },
            $setOnInsert: {
              createdAt: new Date()
            }
          },
          { upsert: true }
        );

        // Generate JWT
        const jwtToken = GoogleAuthService.generateJWT(user);

        res.status(200).json({
          success: true,
          message: 'Login successful',
          token: jwtToken,
          user: {
            id: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: 'admin'
          }
        });
        break;

      case 'verify-token':
        // Verify JWT token
        const jwtResult = GoogleAuthService.verifyJWT(token);
        
        if (!jwtResult.success) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: jwtResult.error
          });
        }

        res.status(200).json({
          success: true,
          user: jwtResult.user
        });
        break;

      case 'logout':
        // For logout, we just need to clear the token on client side
        res.status(200).json({
          success: true,
          message: 'Logged out successfully'
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
