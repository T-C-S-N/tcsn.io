<template>
  <div class="mongo-frontend-demo">
    <div class="container">
      <h1>MongoDB Frontend Connection Methods</h1>
      
      <div class="method-selector">
        <h2>Choose Connection Method</h2>
        <div class="methods-grid">
          <div 
            v-for="method in connectionMethods" 
            :key="method.id"
            class="method-card"
            :class="{ active: state.currentMethod === method.id }"
          >
            <h3>{{ method.name }}</h3>
            <p>{{ method.description }}</p>
            
            <div class="pros-cons">
              <div class="pros">
                <strong>Pros:</strong>
                <ul>
                  <li v-for="pro in method.pros" :key="pro">{{ pro }}</li>
                </ul>
              </div>
              <div class="cons">
                <strong>Cons:</strong>
                <ul>
                  <li v-for="con in method.cons" :key="con">{{ con }}</li>
                </ul>
              </div>
            </div>
            
            <div class="security-level">
              <strong>Security:</strong> {{ method.security }}
            </div>
            
            <div class="method-actions">
              <button 
                v-if="method.id === 'atlas-api'"
                @click="testAtlasAPI"
                :disabled="state.isConnecting"
              >
                {{ state.isConnecting ? 'Connecting...' : 'Test Atlas Data API' }}
              </button>
              
              <button 
                v-if="method.id === 'realm'"
                @click="testRealm"
                :disabled="state.isConnecting"
              >
                {{ state.isConnecting ? 'Connecting...' : 'Test Realm (Anonymous)' }}
              </button>
              
              <button 
                v-if="method.id === 'serverless'"
                @click="testServerless"
                :disabled="state.isConnecting"
              >
                {{ state.isConnecting ? 'Connecting...' : 'Test Serverless Function' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="connection-status" v-if="state.isConnected || state.error">
        <div v-if="state.isConnected" class="status-success">
          ✅ Connected via {{ getCurrentMethodName() }}
          <span v-if="state.user">(User: {{ state.user.id }})</span>
        </div>
        <div v-if="state.error" class="status-error">
          ❌ Connection failed: {{ state.error }}
        </div>
      </div>

      <!-- CRUD Operations Demo -->
      <div v-if="state.isConnected" class="crud-demo">
        <h2>CRUD Operations Demo</h2>
        
        <div class="operation-section">
          <h3>Insert Document</h3>
          <div class="form-group">
            <input v-model="newDocument.name" placeholder="Name" />
            <input v-model="newDocument.email" placeholder="Email" />
            <button @click="insertTestDocument" :disabled="isOperating">
              {{ isOperating ? 'Inserting...' : 'Insert Document' }}
            </button>
          </div>
        </div>

        <div class="operation-section">
          <h3>Find Documents</h3>
          <button @click="findTestDocuments" :disabled="isOperating">
            {{ isOperating ? 'Loading...' : 'Load Documents' }}
          </button>
          
          <div v-if="documents.length > 0" class="documents-list">
            <h4>Found Documents ({{ documents.length }}):</h4>
            <div v-for="doc in documents" :key="doc._id" class="document-item">
              <span>{{ doc.name }} - {{ doc.email }}</span>
              <button @click="deleteTestDocument(doc._id)" class="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div class="operation-section">
          <button @click="disconnect" class="disconnect-btn">
            Disconnect
          </button>
        </div>
      </div>

      <!-- Setup Instructions -->
      <div class="setup-instructions">
        <h2>Setup Instructions</h2>
        
        <div class="instruction-section">
          <h3>1. MongoDB Atlas Data API</h3>
          <ol>
            <li>Go to your MongoDB Atlas dashboard</li>
            <li>Navigate to "Data API" section</li>
            <li>Enable Data API and create an API key</li>
            <li>Add the API key to your .env file: <code>VITE_MONGODB_DATA_API_KEY=your_key</code></li>
            <li>Configure allowed IP addresses (or use 0.0.0.0/0 for development)</li>
          </ol>
        </div>

        <div class="instruction-section">
          <h3>2. MongoDB Realm/Atlas App Services</h3>
          <ol>
            <li>Create a new Realm app in MongoDB Atlas</li>
            <li>Enable anonymous authentication or email/password</li>
            <li>Set up database rules for your collections</li>
            <li>Get your App ID and add to .env: <code>VITE_REALM_APP_ID=your_app_id</code></li>
            <li>Install realm-web: <code>npm install realm-web</code></li>
          </ol>
        </div>

        <div class="instruction-section">
          <h3>3. Serverless Functions</h3>
          <ol>
            <li>Deploy the API function to Vercel/Netlify/AWS Lambda</li>
            <li>Set environment variables on your hosting platform</li>
            <li>Update VITE_API_ENDPOINT in .env to point to your deployed function</li>
            <li>Test the endpoint with proper CORS headers</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useMongoConnection } from '../composables/useMongoConnection.js'

export default {
  name: 'MongoFrontendDemo',
  setup() {
    const {
      state,
      connectionMethods,
      connectWithAtlasAPI,
      connectWithRealm,
      connectWithServerless,
      findDocuments,
      insertDocument,
      deleteDocument,
      disconnect
    } = useMongoConnection()

    const isOperating = ref(false)
    const documents = ref([])
    const newDocument = reactive({
      name: '',
      email: ''
    })

    const getCurrentMethodName = () => {
      const method = connectionMethods.value.find(m => m.id === state.currentMethod)
      return method ? method.name : 'Unknown'
    }

    const testAtlasAPI = async () => {
      try {
        await connectWithAtlasAPI()
      } catch (error) {
        console.error('Atlas API connection failed:', error)
      }
    }

    const testRealm = async () => {
      try {
        await connectWithRealm(true) // Use anonymous authentication
      } catch (error) {
        console.error('Realm connection failed:', error)
      }
    }

    const testServerless = async () => {
      try {
        await connectWithServerless()
      } catch (error) {
        console.error('Serverless connection failed:', error)
      }
    }

    const insertTestDocument = async () => {
      if (!newDocument.name || !newDocument.email) {
        alert('Please fill in both name and email')
        return
      }

      isOperating.value = true
      try {
        const doc = {
          name: newDocument.name,
          email: newDocument.email,
          createdAt: new Date(),
          method: state.currentMethod
        }

        await insertDocument('test_users', doc)
        
        // Clear form
        newDocument.name = ''
        newDocument.email = ''
        
        // Refresh documents list
        await findTestDocuments()
        
        alert('Document inserted successfully!')
      } catch (error) {
        alert('Failed to insert document: ' + error.message)
      } finally {
        isOperating.value = false
      }
    }

    const findTestDocuments = async () => {
      isOperating.value = true
      try {
        const result = await findDocuments('test_users', {})
        documents.value = Array.isArray(result) ? result : (result.documents || [])
      } catch (error) {
        alert('Failed to find documents: ' + error.message)
        documents.value = []
      } finally {
        isOperating.value = false
      }
    }

    const deleteTestDocument = async (docId) => {
      if (!confirm('Are you sure you want to delete this document?')) {
        return
      }

      try {
        await deleteDocument('test_users', { _id: docId })
        await findTestDocuments() // Refresh list
        alert('Document deleted successfully!')
      } catch (error) {
        alert('Failed to delete document: ' + error.message)
      }
    }

    return {
      state,
      connectionMethods,
      isOperating,
      documents,
      newDocument,
      getCurrentMethodName,
      testAtlasAPI,
      testRealm,
      testServerless,
      insertTestDocument,
      findTestDocuments,
      deleteTestDocument,
      disconnect
    }
  }
}
</script>

<style scoped>
.mongo-frontend-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  color: #555;
  margin: 30px 0 20px 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.method-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.method-card.active {
  border-color: #007bff;
  background: #e7f3ff;
}

.method-card h3 {
  margin-top: 0;
  color: #333;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.pros ul, .cons ul {
  margin: 5px 0;
  padding-left: 20px;
}

.pros li {
  color: #28a745;
}

.cons li {
  color: #dc3545;
}

.security-level {
  margin: 10px 0;
  font-weight: bold;
  color: #666;
}

.method-actions {
  margin-top: 15px;
}

.connection-status {
  margin: 20px 0;
  padding: 15px;
  border-radius: 6px;
}

.status-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.crud-demo {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}

.operation-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
}

.form-group {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.form-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.documents-list {
  margin-top: 15px;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #c82333;
}

.disconnect-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.disconnect-btn:hover {
  background: #545b62;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.setup-instructions {
  margin: 40px 0;
}

.instruction-section {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f9fa;
}

.instruction-section ol {
  padding-left: 20px;
}

.instruction-section li {
  margin: 8px 0;
}

code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: #e83e8c;
}
</style>
