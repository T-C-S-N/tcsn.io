import { ref, reactive } from 'vue'
import { mongoAPI } from '../lib/mongoAtlasAPI.js'
import { realmService } from '../lib/mongoRealmService.js'
import { serverlessMongoService } from '../lib/serverlessMongoService.js'

export function useMongoConnection() {
  const state = reactive({
    currentMethod: 'atlas-api', // 'atlas-api', 'realm', 'serverless'
    isConnected: false,
    isConnecting: false,
    error: null,
    user: null
  })

  const connectionMethods = ref([
    {
      id: 'serverless',
      name: 'Serverless Functions (Recommended)',
      description: 'API endpoints deployed to Vercel with secure MongoDB connections',
      pros: ['Full MongoDB access', 'Custom business logic', 'Secure connection string', 'Free on Vercel'],
      cons: ['Requires deployment', 'Small cold start latency'],
      security: 'High - Server-side only, connection strings hidden'
    },
    {
      id: 'realm',
      name: 'MongoDB Atlas App Services',
      description: 'Full-featured MongoDB access with authentication (Realm Web SDK deprecated but App Services active)',
      pros: ['User authentication', 'Rule-based access control', 'Real-time sync', 'Serverless functions'],
      cons: ['More complex setup', 'Learning curve for App Services', 'Realm Web SDK being phased out'],
      security: 'High - User authentication and rules'
    }
  ])

  // Atlas Data API methods
  const connectWithAtlasAPI = async () => {
    state.isConnecting = true
    state.error = null
    
    try {
      // Test connection by trying to fetch a document
      const result = await mongoAPI.findOne('test', {})
      state.isConnected = true
      state.currentMethod = 'atlas-api'
      return { success: true, method: 'Atlas Data API', result }
    } catch (error) {
      state.error = error.message
      state.isConnected = false
      throw error
    } finally {
      state.isConnecting = false
    }
  }

  // Realm methods
  const connectWithRealm = async (useAnonymous = true, email = '', password = '') => {
    state.isConnecting = true
    state.error = null
    
    try {
      let user
      if (useAnonymous) {
        user = await realmService.authenticateAnonymously()
      } else {
        user = await realmService.authenticateWithEmailPassword(email, password)
      }
      
      state.user = user
      state.isConnected = true
      state.currentMethod = 'realm'
      return { success: true, method: 'MongoDB Realm', user: user.id }
    } catch (error) {
      state.error = error.message
      state.isConnected = false
      throw error
    } finally {
      state.isConnecting = false
    }
  }

  // Serverless methods
  const connectWithServerless = async () => {
    state.isConnecting = true
    state.error = null
    
    try {
      // Test connection by trying to fetch a document
      const result = await serverlessMongoService.findOne('test', {})
      state.isConnected = true
      state.currentMethod = 'serverless'
      return { success: true, method: 'Serverless Function', result }
    } catch (error) {
      state.error = error.message
      state.isConnected = false
      throw error
    } finally {
      state.isConnecting = false
    }
  }

  // Generic CRUD operations
  const findDocuments = async (collection, filter = {}) => {
    if (!state.isConnected) {
      throw new Error('Not connected to MongoDB')
    }

    switch (state.currentMethod) {
      case 'atlas-api':
        return await mongoAPI.findMany(collection, filter)
      case 'realm':
        return await realmService.findMany(collection, filter)
      case 'serverless':
        return await serverlessMongoService.find(collection, filter)
      default:
        throw new Error('No connection method selected')
    }
  }

  const insertDocument = async (collection, document) => {
    if (!state.isConnected) {
      throw new Error('Not connected to MongoDB')
    }

    switch (state.currentMethod) {
      case 'atlas-api':
        return await mongoAPI.insertOne(collection, document)
      case 'realm':
        return await realmService.insertOne(collection, document)
      case 'serverless':
        return await serverlessMongoService.insertOne(collection, document)
      default:
        throw new Error('No connection method selected')
    }
  }

  const updateDocument = async (collection, filter, update) => {
    if (!state.isConnected) {
      throw new Error('Not connected to MongoDB')
    }

    switch (state.currentMethod) {
      case 'atlas-api':
        return await mongoAPI.updateOne(collection, filter, update)
      case 'realm':
        return await realmService.updateOne(collection, filter, update)
      case 'serverless':
        return await serverlessMongoService.updateOne(collection, filter, update)
      default:
        throw new Error('No connection method selected')
    }
  }

  const deleteDocument = async (collection, filter) => {
    if (!state.isConnected) {
      throw new Error('Not connected to MongoDB')
    }

    switch (state.currentMethod) {
      case 'atlas-api':
        return await mongoAPI.deleteOne(collection, filter)
      case 'realm':
        return await realmService.deleteOne(collection, filter)
      case 'serverless':
        return await serverlessMongoService.deleteOne(collection, filter)
      default:
        throw new Error('No connection method selected')
    }
  }

  const disconnect = async () => {
    if (state.currentMethod === 'realm' && state.user) {
      await realmService.logout()
    }
    
    state.isConnected = false
    state.user = null
    state.error = null
  }

  return {
    state,
    connectionMethods,
    connectWithAtlasAPI,
    connectWithRealm,
    connectWithServerless,
    findDocuments,
    insertDocument,
    updateDocument,
    deleteDocument,
    disconnect
  }
}
