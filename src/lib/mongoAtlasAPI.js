// MongoDB Atlas Data API service
class MongoAtlasAPI {
  constructor() {
    this.baseURL = 'https://data.mongodb-api.com/app/data-app-id/endpoint/data/v1'
    this.apiKey = import.meta.env.VITE_MONGODB_DATA_API_KEY
    this.dataSource = import.meta.env.VITE_MONGODB_DATA_SOURCE || 'tcsnio-cluster-0'
    this.database = import.meta.env.VITE_MONGODB_DATABASE || 'tcsnio'
  }

  async makeRequest(action, collection, data = {}) {
    const url = `${this.baseURL}/action/${action}`
    
    const payload = {
      dataSource: this.dataSource,
      database: this.database,
      collection: collection,
      ...data
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('MongoDB Atlas API error:', error)
      throw error
    }
  }

  // Find documents
  async findMany(collection, filter = {}, options = {}) {
    return this.makeRequest('find', collection, {
      filter,
      ...options
    })
  }

  // Find one document
  async findOne(collection, filter = {}) {
    return this.makeRequest('findOne', collection, {
      filter
    })
  }

  // Insert one document
  async insertOne(collection, document) {
    return this.makeRequest('insertOne', collection, {
      document
    })
  }

  // Insert many documents
  async insertMany(collection, documents) {
    return this.makeRequest('insertMany', collection, {
      documents
    })
  }

  // Update one document
  async updateOne(collection, filter, update) {
    return this.makeRequest('updateOne', collection, {
      filter,
      update
    })
  }

  // Update many documents
  async updateMany(collection, filter, update) {
    return this.makeRequest('updateMany', collection, {
      filter,
      update
    })
  }

  // Delete one document
  async deleteOne(collection, filter) {
    return this.makeRequest('deleteOne', collection, {
      filter
    })
  }

  // Delete many documents
  async deleteMany(collection, filter) {
    return this.makeRequest('deleteMany', collection, {
      filter
    })
  }

  // Aggregate pipeline
  async aggregate(collection, pipeline) {
    return this.makeRequest('aggregate', collection, {
      pipeline
    })
  }
}

export const mongoAPI = new MongoAtlasAPI()
export default mongoAPI
