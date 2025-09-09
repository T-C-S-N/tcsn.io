// Development server for API endpoints
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import API handlers
const importHandler = async (path) => {
  try {
    console.log(`📥 Importing handler: ${path}`);
    const module = await import(join(__dirname, 'api', path));
    console.log(`✅ Handler imported successfully: ${path}`);
    return module.default || module;
  } catch (error) {
    console.error(`❌ Failed to import ${path}:`, error.message);
    return (req, res) => {
      console.error(`Handler error for ${path}:`, error.message);
      res.status(500).json({ error: 'API handler not found', details: error.message });
    };
  }
};

// API Routes
app.all('/api/mongodb', async (req, res) => {
  try {
    console.log(`📞 MongoDB API called: ${req.method} ${req.url}`);
    const handler = await importHandler('mongodb.js');
    return handler(req, res);
  } catch (error) {
    console.error('MongoDB API error:', error);
    res.status(500).json({ error: 'MongoDB API error', details: error.message });
  }
});

app.all('/api/visitors', async (req, res) => {
  try {
    console.log(`📞 Visitors API called: ${req.method} ${req.url}`);
    const handler = await importHandler('visitors.js');
    return handler(req, res);
  } catch (error) {
    console.error('Visitor API error:', error);
    res.status(500).json({ error: 'Visitor API error', details: error.message });
  }
});

app.all('/api/page-visits', async (req, res) => {
  try {
    console.log(`📞 Page visits API called: ${req.method} ${req.url}`);
    // Redirect to visitors endpoint since they handle the same data
    const handler = await importHandler('visitors.js');
    return handler(req, res);
  } catch (error) {
    console.error('Page visits API error:', error);
    res.status(500).json({ error: 'Page visits API error', details: error.message });
  }
});

app.all('/api/auth', async (req, res) => {
  try {
    console.log(`📞 Auth API called: ${req.method} ${req.url}`);
    const handler = await importHandler('auth.js');
    return handler(req, res);
  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({ error: 'Auth API error', details: error.message });
  }
});

app.all('/api/visitor-analytics', async (req, res) => {
  try {
    console.log(`📞 Visitor Analytics API called: ${req.method} ${req.url}`);
    const handler = await importHandler('visitor-analytics.js');
    return handler(req, res);
  } catch (error) {
    console.error('Visitor Analytics API error:', error);
    res.status(500).json({ error: 'Visitor Analytics API error', details: error.message });
  }
});

app.all('/api/visitor-interactions', async (req, res) => {
  try {
    console.log(`📞 Visitor Interactions API called: ${req.method} ${req.url}`);
    const handler = await importHandler('visitor-interactions.js');
    return handler(req, res);
  } catch (error) {
    console.error('Visitor Interactions API error:', error);
    res.status(500).json({ error: 'Visitor Interactions API error', details: error.message });
  }
});

app.all('/api/url-shortener', async (req, res) => {
  try {
    console.log(`📞 URL Shortener API called: ${req.method} ${req.url}`);
    const handler = await importHandler('url-shortener.js');
    return handler(req, res);
  } catch (error) {
    console.error('URL Shortener API error:', error);
    res.status(500).json({ error: 'URL Shortener API error', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at:`);
  console.log(`   - http://localhost:${PORT}/api/mongodb`);
  console.log(`   - http://localhost:${PORT}/api/visitors`);
  console.log(`   - http://localhost:${PORT}/api/auth`);
  console.log(`   - http://localhost:${PORT}/api/visitor-analytics`);
  console.log(`   - http://localhost:${PORT}/api/visitor-interactions`);
  console.log(`   - http://localhost:${PORT}/api/url-shortener`);
  console.log(`🔗 Environment check:`);
  console.log(`   - MONGO_URI: ${process.env.MONGO_URI ? 'Loaded ✅' : 'Missing ❌'}`);
  console.log(`   - MONGO_DB_NAME: ${process.env.MONGO_DB_NAME || 'Missing ❌'}`);
});

export default app;
