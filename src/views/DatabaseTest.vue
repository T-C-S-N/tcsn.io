<template>
  <div class="database-test-page">
    <div class="container">
      <h1>MongoDB Connection Test</h1>
      
      <!-- Database Status Component -->
      <DatabaseStatus />
      
      <!-- API Test Section -->
      <div class="api-tests">
        <h2>API Tests</h2>
        
        <div class="test-section">
          <h3>Connection Test</h3>
          <button @click="testConnection" :disabled="isTestingConnection">
            {{ isTestingConnection ? 'Testing...' : 'Test Connection' }}
          </button>
          <pre v-if="connectionResult" class="result">{{ JSON.stringify(connectionResult, null, 2) }}</pre>
        </div>
        
        <div class="test-section">
          <h3>Database Info</h3>
          <button @click="getDatabaseInfo" :disabled="isGettingInfo">
            {{ isGettingInfo ? 'Loading...' : 'Get Database Info' }}
          </button>
          <pre v-if="databaseInfo" class="result">{{ JSON.stringify(databaseInfo, null, 2) }}</pre>
        </div>
        
        <div class="test-section">
          <h3>Initialize Database</h3>
          <button @click="initializeDatabase" :disabled="isInitializing">
            {{ isInitializing ? 'Initializing...' : 'Initialize Database' }}
          </button>
          <pre v-if="initResult" class="result">{{ JSON.stringify(initResult, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- Model Examples -->
      <div class="model-examples">
        <h2>Model Examples</h2>
        
        <div class="example-section">
          <h3>User Model Test</h3>
          <button @click="testUserModel" :disabled="isTestingUser">
            {{ isTestingUser ? 'Testing...' : 'Test User Operations' }}
          </button>
          <pre v-if="userResult" class="result">{{ JSON.stringify(userResult, null, 2) }}</pre>
        </div>
        
        <div class="example-section">
          <h3>Project Model Test</h3>
          <button @click="testProjectModel" :disabled="isTestingProject">
            {{ isTestingProject ? 'Testing...' : 'Test Project Operations' }}
          </button>
          <pre v-if="projectResult" class="result">{{ JSON.stringify(projectResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import DatabaseStatus from '../components/DatabaseStatus.vue'
import { testConnection as apiTestConnection, getDatabaseInfo as apiGetDatabaseInfo, initializeDatabase as apiInitializeDatabase } from '../api/database.js'
import { mongoService } from '../lib/mongodb.js'
import User from '../models/User.js'
import Project from '../models/Project.js'

export default {
  name: 'DatabaseTest',
  components: {
    DatabaseStatus
  },
  setup() {
    // API test states
    const isTestingConnection = ref(false)
    const connectionResult = ref(null)
    
    const isGettingInfo = ref(false)
    const databaseInfo = ref(null)
    
    const isInitializing = ref(false)
    const initResult = ref(null)
    
    // Model test states
    const isTestingUser = ref(false)
    const userResult = ref(null)
    
    const isTestingProject = ref(false)
    const projectResult = ref(null)

    // API test methods
    const testConnection = async () => {
      isTestingConnection.value = true
      try {
        connectionResult.value = await apiTestConnection()
      } catch (error) {
        connectionResult.value = { error: error.message }
      } finally {
        isTestingConnection.value = false
      }
    }

    const getDatabaseInfo = async () => {
      isGettingInfo.value = true
      try {
        databaseInfo.value = await apiGetDatabaseInfo()
      } catch (error) {
        databaseInfo.value = { error: error.message }
      } finally {
        isGettingInfo.value = false
      }
    }

    const initializeDatabase = async () => {
      isInitializing.value = true
      try {
        initResult.value = await apiInitializeDatabase()
      } catch (error) {
        initResult.value = { error: error.message }
      } finally {
        isInitializing.value = false
      }
    }

    // Model test methods
    const testUserModel = async () => {
      isTestingUser.value = true
      try {
        await mongoService.connect()
        
        // Create a test user
        const testUser = new User({
          firstname: 'Test',
          lastname: 'User',
          email: `test${Date.now()}@example.com`,
          password: 'testpassword123',
          role: 'user'
        })
        
        const savedUser = await testUser.save()
        
        // Find the user
        const foundUser = await User.findByEmail(savedUser.email)
        
        // Delete the test user
        await User.findByIdAndDelete(savedUser._id)
        
        userResult.value = {
          created: savedUser,
          found: foundUser,
          deleted: true,
          message: 'User model test completed successfully'
        }
      } catch (error) {
        userResult.value = { error: error.message }
      } finally {
        isTestingUser.value = false
      }
    }

    const testProjectModel = async () => {
      isTestingProject.value = true
      try {
        await mongoService.connect()
        
        // Create a test project
        const testProject = new Project({
          display: true,
          type: 'web',
          title: `Test Project ${Date.now()}`,
          titleColor: '#3498db',
          description: 'This is a test project created for MongoDB connection testing',
          details: [
            { key: 'Technology', value: 'Vue.js + MongoDB' },
            { key: 'Status', value: 'Testing' }
          ],
          url: 'https://example.com',
          tags: ['test', 'mongodb', 'vue'],
          isOnline: true
        })
        
        const savedProject = await testProject.save()
        
        // Find projects by tag
        const projectsByTag = await Project.findByTag('test')
        
        // Delete the test project
        await Project.findByIdAndDelete(savedProject._id)
        
        projectResult.value = {
          created: savedProject,
          foundByTag: projectsByTag.length,
          deleted: true,
          message: 'Project model test completed successfully'
        }
      } catch (error) {
        projectResult.value = { error: error.message }
      } finally {
        isTestingProject.value = false
      }
    }

    return {
      // API tests
      isTestingConnection,
      connectionResult,
      testConnection,
      
      isGettingInfo,
      databaseInfo,
      getDatabaseInfo,
      
      isInitializing,
      initResult,
      initializeDatabase,
      
      // Model tests
      isTestingUser,
      userResult,
      testUserModel,
      
      isTestingProject,
      projectResult,
      testProjectModel
    }
  }
}
</script>

<style scoped>
.database-test-page {
  padding: 20px;
  max-width: 1200px;
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

h3 {
  color: #666;
  margin: 20px 0 10px 0;
}

.api-tests, .model-examples {
  margin: 30px 0;
}

.test-section, .example-section {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f9;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.result {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style>
