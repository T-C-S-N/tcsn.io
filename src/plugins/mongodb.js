import { mongoService } from '../lib/mongodb.js'

export default {
  install(app) {
    // Make MongoDB service available globally
    app.config.globalProperties.$mongodb = mongoService
    
    // Provide MongoDB service for composition API
    app.provide('mongodb', mongoService)
    
    // Initialize connection if in server environment
    if (typeof window === 'undefined') {
      mongoService.connect().catch((error) => {
        console.error('Failed to initialize MongoDB connection:', error)
      })
    }
  }
}
