// Local development server for MongoDB API
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Import the MongoDB handler
import mongoHandler from './api/mongodb.js'

// Create a mock req/res wrapper for our Vercel function
async function createMockHandler(req, res) {
  // Create a mock response object that mimics Vercel's response
  const mockRes = {
    status: (code) => {
      res.status(code)
      return mockRes
    },
    json: (data) => {
      res.json(data)
      return mockRes
    },
    setHeader: (name, value) => {
      res.setHeader(name, value)
      return mockRes
    },
    end: () => {
      res.end()
      return mockRes
    }
  }

  try {
    await mongoHandler(req, mockRes)
  } catch (error) {
    console.error('Handler error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// MongoDB API endpoint
app.all('/api/mongodb', createMockHandler)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Local MongoDB API server is running',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local MongoDB API server running on http://localhost:${PORT}`)
  console.log(`📡 MongoDB endpoint: http://localhost:${PORT}/api/mongodb`)
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  console.log('')
  console.log('To test the connection, run:')
  console.log(`curl -X POST http://localhost:${PORT}/api/mongodb \\`)
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d \'{"action":"find","collection":"test","data":{"filter":{},"limit":1}}\'')
})

export default app
