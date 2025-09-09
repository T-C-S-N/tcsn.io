<template>
  <div class="visitor-tracking-demo">
    <div class="header">
      <h2>🎯 Visitor Tracking Demo</h2>
      <p>AI-Generated Names with Location & Browser Tracking</p>
    </div>
    
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="loading"
    >
      <div class="spinner" />
      <p>Initializing visitor tracking...</p>
    </div>
    
    <!-- Error State -->
    <div
      v-else-if="error"
      class="error"
    >
      <h3>❌ Tracking Error</h3>
      <p>{{ error }}</p>
      <button
        class="retry-btn"
        @click="initializeTracking"
      >
        🔄 Retry
      </button>
    </div>
    
    <!-- Success State -->
    <div
      v-else
      class="visitor-info"
    >
      <!-- Greeting -->
      <div class="greeting">
        <h3>{{ getGreeting() }}</h3>
      </div>
      
      <!-- Visitor Status -->
      <div class="status-badges">
        <span
          v-if="isNewVisitor"
          class="badge new-visitor"
        >🆕 New Visitor</span>
        <span
          v-else-if="isNewSession"
          class="badge returning"
        >🔄 New Session</span>
        <span
          v-else
          class="badge active"
        >✅ Active Session</span>
      </div>
      
      <!-- Visitor Details -->
      <div
        v-if="visitor"
        class="visitor-details"
      >
        <div class="detail-card">
          <h4>👤 Visitor Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Generated Name:</label>
              <span class="value">{{ visitor.generatedName || visitor.fallbackName || 'Anonymous' }}</span>
            </div>
            <div class="detail-item">
              <label>Visitor ID:</label>
              <span class="value small">{{ visitor.visitorId }}</span>
            </div>
            <div class="detail-item">
              <label>Session ID:</label>
              <span class="value small">{{ visitor.sessionId }}</span>
            </div>
            <div class="detail-item">
              <label>First Visit:</label>
              <span class="value">{{ formatDate(visitor.firstVisit) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Browser Information -->
        <div
          v-if="visitor.browserInfo"
          class="detail-card"
        >
          <h4>🌐 Browser & Device</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Browser:</label>
              <span class="value">{{ visitor.browserInfo.browser }} {{ visitor.browserInfo.version }}</span>
            </div>
            <div class="detail-item">
              <label>Operating System:</label>
              <span class="value">{{ visitor.browserInfo.os?.name }} {{ visitor.browserInfo.os?.version }}</span>
            </div>
            <div class="detail-item">
              <label>Device:</label>
              <span class="value">{{ visitor.browserInfo.device }}</span>
            </div>
            <div class="detail-item">
              <label>Screen:</label>
              <span class="value">{{ visitor.browserInfo.screen?.width }}x{{ visitor.browserInfo.screen?.height }}</span>
            </div>
            <div class="detail-item">
              <label>Language:</label>
              <span class="value">{{ visitor.browserInfo.language }}</span>
            </div>
            <div class="detail-item">
              <label>Timezone:</label>
              <span class="value">{{ visitor.browserInfo.timezone }}</span>
            </div>
          </div>
        </div>
        
        <!-- Location Information -->
        <div
          v-if="visitor.location && visitor.location.country"
          class="detail-card"
        >
          <h4>📍 Location Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Country:</label>
              <span class="value">{{ visitor.location.country }}</span>
            </div>
            <div
              v-if="visitor.location.region"
              class="detail-item"
            >
              <label>Region:</label>
              <span class="value">{{ visitor.location.region }}</span>
            </div>
            <div
              v-if="visitor.location.city"
              class="detail-item"
            >
              <label>City:</label>
              <span class="value">{{ visitor.location.city }}</span>
            </div>
            <div
              v-if="visitor.location.isp"
              class="detail-item"
            >
              <label>ISP:</label>
              <span class="value">{{ visitor.location.isp }}</span>
            </div>
            <div
              v-if="visitor.location.latitude"
              class="detail-item"
            >
              <label>Coordinates:</label>
              <span class="value">{{ visitor.location.latitude }}, {{ visitor.location.longitude }}</span>
            </div>
          </div>
        </div>
        
        <!-- Session Information -->
        <div
          v-if="visitor.currentSession"
          class="detail-card"
        >
          <h4>🕒 Current Session</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Session Start:</label>
              <span class="value">{{ formatDate(visitor.currentSession.startTime) }}</span>
            </div>
            <div class="detail-item">
              <label>Last Activity:</label>
              <span class="value">{{ formatDate(visitor.currentSession.lastActivity) }}</span>
            </div>
            <div class="detail-item">
              <label>Pages Viewed:</label>
              <span class="value">{{ visitor.currentSession.pageViews?.length || 0 }}</span>
            </div>
            <div
              v-if="visitor.currentSession.referrer"
              class="detail-item"
            >
              <label>Referrer:</label>
              <span class="value small">{{ visitor.currentSession.referrer }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="actions">
        <button
          class="action-btn"
          @click="refreshTracking"
        >
          🔄 Refresh Tracking
        </button>
        <button
          class="action-btn secondary"
          @click="clearVisitorData"
        >
          🗑️ Clear Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVisitorTracking } from '../composables/useVisitorTracking.js';

const {
  visitor,
  visitorName,
  isNewVisitor,
  isNewSession,
  isLoading,
  error,
  initializeTracking,
  getGreeting
} = useVisitorTracking();

// Format date for display
const formatDate = (date) => {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleString();
};

// Refresh tracking data
const refreshTracking = () => {
  initializeTracking();
};

// Clear visitor data (for testing)
const clearVisitorData = () => {
  localStorage.removeItem('tcsn_visitor');
  location.reload();
};
</script>

<style scoped>
.visitor-tracking-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  color: #2563eb;
  margin-bottom: 10px;
}

.header p {
  color: #6b7280;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.error h3 {
  color: #dc2626;
  margin-bottom: 10px;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
}

.retry-btn:hover {
  background: #b91c1c;
}

.greeting {
  text-align: center;
  margin-bottom: 20px;
}

.greeting h3 {
  font-size: 24px;
  color: #1f2937;
  margin: 0;
}

.status-badges {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.badge.new-visitor {
  background: #dcfce7;
  color: #166534;
}

.badge.returning {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.active {
  background: #fef3c7;
  color: #92400e;
}

.visitor-details {
  display: grid;
  gap: 20px;
}

.detail-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.detail-card h4 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 18px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 10px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
}

.detail-item .value {
  color: #1f2937;
  font-size: 15px;
}

.detail-item .value.small {
  font-size: 12px;
  font-family: monospace;
  color: #6b7280;
  word-break: break-all;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.action-btn:not(.secondary) {
  background: #2563eb;
  color: white;
}

.action-btn:not(.secondary):hover {
  background: #1d4ed8;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
