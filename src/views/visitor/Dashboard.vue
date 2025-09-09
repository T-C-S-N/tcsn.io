<template>
  <div class="visitor-dashboard">
    <div class="header">
      <h1>🎯 Visitor Analytics Dashboard</h1>
      <p>Real-time visitor tracking and analytics</p>
    </div>
    
    <!-- Stats Overview -->
    <div
      v-if="stats"
      class="stats-grid"
    >
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.total }}
        </div>
        <div class="stat-label">
          Total Visitors
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.today }}
        </div>
        <div class="stat-label">
          Today
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.thisWeek }}
        </div>
        <div class="stat-label">
          This Week
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {{ stats.thisMonth }}
        </div>
        <div class="stat-label">
          This Month
        </div>
      </div>
    </div>
    
    <!-- Recent Visitors -->
    <div class="section">
      <h2>👥 Recent Visitors</h2>
      <div
        v-if="visitors.length"
        class="visitor-list"
      >
        <div
          v-for="visitor in visitors"
          :key="visitor._id"
          class="visitor-item"
        >
          <div class="visitor-avatar">
            {{ getInitials(visitor.generatedName || visitor.fallbackName) }}
          </div>
          <div class="visitor-details">
            <div class="visitor-name">
              {{ visitor.generatedName || visitor.fallbackName || 'Anonymous' }}
            </div>
            <div class="visitor-info">
              {{ visitor.location?.city }}, {{ visitor.location?.country }} • 
              {{ visitor.browserInfo?.browser }} • 
              {{ formatDate(visitor.createdAt) }}
            </div>
          </div>
          <div class="visitor-stats">
            <span class="stat">{{ visitor.totalPageViews }} pages</span>
            <span class="stat">{{ visitor.totalVisits }} visits</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-state"
      >
        <p>No visitors yet. Start browsing to see visitor data!</p>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="actions">
      <button
        class="refresh-btn"
        :disabled="loading"
        @click="refreshData"
      >
        <span v-if="loading">🔄 Loading...</span>
        <span v-else>🔄 Refresh Data</span>
      </button>
      <router-link
        to="/visitor-demo"
        class="demo-btn"
      >
        🧪 View Demo
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref(null);
const visitors = ref([]);
const loading = ref(false);

// Fetch visitor statistics
const fetchStats = async () => {
  try {
    const response = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' })
    });
    
    if (response.ok) {
      const result = await response.json();
      stats.value = result.stats;
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// Fetch recent visitors
const fetchVisitors = async () => {
  try {
    const response = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', limit: 10 })
    });
    
    if (response.ok) {
      const result = await response.json();
      visitors.value = result.visitors || [];
    }
  } catch (error) {
    console.error('Failed to fetch visitors:', error);
  }
};

// Refresh all data
const refreshData = async () => {
  loading.value = true;
  try {
    await Promise.all([fetchStats(), fetchVisitors()]);
  } finally {
    loading.value = false;
  }
};

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.visitor-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #2563eb;
  margin-bottom: 10px;
}

.header p {
  color: #6b7280;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 8px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section h2 {
  margin: 0 0 20px 0;
  color: #374151;
}

.visitor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visitor-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.visitor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.visitor-details {
  flex: 1;
}

.visitor-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.visitor-info {
  color: #6b7280;
  font-size: 14px;
}

.visitor-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
}

.stat {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.refresh-btn, .demo-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.refresh-btn {
  background: #2563eb;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  display: inline-block;
}

.demo-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .visitor-item {
    flex-direction: column;
    text-align: center;
  }
  
  .visitor-stats {
    text-align: center;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
