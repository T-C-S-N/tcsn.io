// MongoDB Realm/Atlas App Services
import * as Realm from "realm-web"

class MongoRealmService {
  constructor() {
    this.appId = import.meta.env.VITE_REALM_APP_ID
    this.app = new Realm.App({ id: this.appId })
    this.user = null
    this.mongodb = null
    this.database = null
  }

  // Authenticate user (anonymous, email/password, etc.)
  async authenticateAnonymously() {
    try {
      this.user = await this.app.logIn(Realm.Credentials.anonymous())
      this.mongodb = this.user.mongoClient("mongodb-atlas")
      this.database = this.mongodb.db(import.meta.env.VITE_MONGODB_DATABASE || 'tcsnio')
      return this.user
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error
    }
  }

  // Authenticate with email/password
  async authenticateWithEmailPassword(email, password) {
    try {
      this.user = await this.app.logIn(Realm.Credentials.emailPassword(email, password))
      this.mongodb = this.user.mongoClient("mongodb-atlas")
      this.database = this.mongodb.db(import.meta.env.VITE_MONGODB_DATABASE || 'tcsnio')
      return this.user
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error
    }
  }

  // Get collection
  getCollection(collectionName) {
    if (!this.database) {
      throw new Error('Not authenticated. Call authenticate() first.')
    }
    return this.database.collection(collectionName)
  }

  // Find documents with proper authentication
  async findMany(collectionName, filter = {}, options = {}) {
    const collection = this.getCollection(collectionName)
    return await collection.find(filter, options)
  }

  // Insert document
  async insertOne(collectionName, document) {
    const collection = this.getCollection(collectionName)
    return await collection.insertOne(document)
  }

  // Update document
  async updateOne(collectionName, filter, update) {
    const collection = this.getCollection(collectionName)
    return await collection.updateOne(filter, update)
  }

  // Delete document
  async deleteOne(collectionName, filter) {
    const collection = this.getCollection(collectionName)
    return await collection.deleteOne(filter)
  }

  // Logout
  async logout() {
    if (this.user) {
      await this.user.logOut()
      this.user = null
      this.mongodb = null
      this.database = null
    }
  }

  // Check if authenticated
  isAuthenticated() {
    return this.user && this.user.isLoggedIn
  }
}

export const realmService = new MongoRealmService()
export default realmService
