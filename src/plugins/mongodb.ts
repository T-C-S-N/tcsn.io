import { mongoService } from '../lib/mongodb'

export default {
  install(app: any) {
    // Make MongoDB service available globally
    app.config.globalProperties.$mongodb = mongoService
    
    // Provide MongoDB service for composition API
    app.provide('mongodb', mongoService)
    
    // Initialize connection if in server environment
    if (typeof window === 'undefined') {
      mongoService.connect().catch((error: any) => {
        console.error('Failed to initialize MongoDB connection:', error)
      })
    }
  }
}
