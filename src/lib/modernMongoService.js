// Updated MongoDB service without deprecated Data API
class ModernMongoService {
  constructor() {
    this.apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '/api/mongodb'
  }

  async makeRequest(action, collection, data = {}) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          collection,
          data
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred')
      }

      return result.data
    } catch (error) {
      console.error('MongoDB operation failed:', error)
      throw error
    }
  }

  // Test connection
  async testConnection() {
    try {
      const result = await this.makeRequest('ping', 'test', {})
      return { success: true, message: 'Connected successfully', data: result }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // CRUD Operations
  async find(collection, filter = {}, options = {}) {
    return this.makeRequest('find', collection, { filter, options })
  }

  async findOne(collection, filter = {}) {
    return this.makeRequest('findOne', collection, { filter })
  }

  async insertOne(collection, document) {
    return this.makeRequest('insertOne', collection, { document })
  }

  async insertMany(collection, documents) {
    return this.makeRequest('insertMany', collection, { documents })
  }

  async updateOne(collection, filter, update) {
    return this.makeRequest('updateOne', collection, { filter, update })
  }

  async updateMany(collection, filter, update) {
    return this.makeRequest('updateMany', collection, { filter, update })
  }

  async deleteOne(collection, filter) {
    return this.makeRequest('deleteOne', collection, { filter })
  }

  async deleteMany(collection, filter) {
    return this.makeRequest('deleteMany', collection, { filter })
  }

  async countDocuments(collection, filter = {}) {
    return this.makeRequest('countDocuments', collection, { filter })
  }

  async aggregate(collection, pipeline) {
    return this.makeRequest('aggregate', collection, { pipeline })
  }
}

export const modernMongoService = new ModernMongoService()
export default modernMongoService
