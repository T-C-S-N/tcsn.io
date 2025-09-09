<template>
  <div class="database-status">
    <h3>Database Connection Status</h3>
    
    <div class="status-indicator">
      <span 
        :class="{ 
          'connected': dbState.isConnected, 
          'disconnected': !dbState.isConnected,
          'connecting': dbState.isConnecting 
        }"
      >
        {{ getStatusText() }}
      </span>
    </div>

    <div class="connection-info">
      <p>Connection Attempts: {{ dbState.connectionAttempts }}</p>
      <p
        v-if="dbState.error"
        class="error"
      >
        Error: {{ dbState.error }}
      </p>
    </div>

    <div class="actions">
      <button 
        :disabled="dbState.isConnecting || dbState.isConnected" 
        @click="handleConnect"
      >
        Connect
      </button>
      
      <button 
        :disabled="dbState.isConnecting || !dbState.isConnected" 
        @click="handleDisconnect"
      >
        Disconnect
      </button>
      
      <button @click="handleHealthCheck">
        Health Check
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useDatabase } from '../composables/useDatabase.js'

export default {
  name: 'DatabaseStatus',
  setup() {
    const { 
      state: dbState, 
      connect, 
      disconnect, 
      healthCheck, 
      checkInitialConnection 
    } = useDatabase()

    const handleConnect = async () => {
      await connect()
    }

    const handleDisconnect = async () => {
      await disconnect()
    }

    const handleHealthCheck = async () => {
      const isHealthy = await healthCheck()
      console.log('Health check result:', isHealthy)
    }

    const getStatusText = () => {
      if (dbState.isConnecting) return 'Connecting...'
      if (dbState.isConnected) return 'Connected'
      return 'Disconnected'
    }

    onMounted(() => {
      checkInitialConnection()
    })

    return {
      dbState,
      handleConnect,
      handleDisconnect,
      handleHealthCheck,
      getStatusText
    }
  }
}
</script>

<style scoped>
.database-status {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
}

.status-indicator {
  margin: 15px 0;
  text-align: center;
}

.status-indicator span {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
}

.connected {
  background-color: #d4edda;
  color: #155724;
}

.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.connecting {
  background-color: #fff3cd;
  color: #856404;
}

.connection-info {
  margin: 15px 0;
}

.error {
  color: #721c24;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.actions button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.actions button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
