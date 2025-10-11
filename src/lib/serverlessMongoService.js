// Frontend service for serverless MongoDB operations
class ServerlessMongoService {
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error('Serverless MongoDB operation failed:', error)
      throw error
    }
  }

  // Find documents
  async find(collection, filter = {}) {
    return this.makeRequest('find', collection, { filter })
  }

  // Find one document
  async findOne(collection, filter = {}) {
    return this.makeRequest('findOne', collection, { filter })
  }

  // Insert document
  async insertOne(collection, document) {
    return this.makeRequest('insertOne', collection, { document })
  }

  // Update document
  async updateOne(collection, filter, update) {
    return this.makeRequest('updateOne', collection, { filter, update })
  }

  // Delete document
  async deleteOne(collection, filter) {
    return this.makeRequest('deleteOne', collection, { filter })
  }
}

export const serverlessMongoService = new ServerlessMongoService()
export default serverlessMongoService
