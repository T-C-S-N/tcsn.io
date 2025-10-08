<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <h1>📊 Visitor Analytics Dashboard</h1>
      <div
        class="real-time-indicator"
        :class="{ active: isRealTime }"
      >
        <span class="indicator-dot" />
        Real-time {{ isRealTime ? 'ON' : 'OFF' }}
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-icon">
          👥
        </div>
        <div class="card-content">
          <h3>Active Visitors</h3>
          <div class="card-value">
            {{ activeVisitors.count }}
          </div>
          <div class="card-subtitle">
            Currently online
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          📄
        </div>
        <div class="card-content">
          <h3>Page Views Today</h3>
          <div class="card-value">
            {{ summary.pageViews || 0 }}
          </div>
          <div class="card-subtitle">
            Total page views
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          🔥
        </div>
        <div class="card-content">
          <h3>New Visitors</h3>
          <div class="card-value">
            {{ summary.newVisitors || 0 }}
          </div>
          <div class="card-subtitle">
            First time visitors
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          ⏱️
        </div>
        <div class="card-content">
          <h3>Avg. Session Time</h3>
          <div class="card-value">
            {{ formatDuration(summary.avgSessionTime) }}
          </div>
          <div class="card-subtitle">
            Time on site
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Pages -->
    <div class="analytics-section">
      <h2>📈 Popular Pages</h2>
      <div class="popular-pages">
        <div
          v-if="popularPages.length === 0"
          class="empty-state"
        >
          No page data available yet. Visit some pages to see analytics!
        </div>
        <div
          v-for="page in popularPages"
          :key="page.page"
          class="page-item"
        >
          <div class="page-info">
            <div class="page-path">
              {{ page.page }}
            </div>
            <div class="page-stats">
              <span class="stat">{{ page.views }} views</span>
              <span class="stat">{{ page.uniqueVisitors }} unique</span>
              <span class="stat">{{ formatDuration(page.avgTimeOnPage) }} avg time</span>
            </div>
          </div>
          <div class="page-bar">
            <div
              class="page-progress"
              :style="{ width: (page.views / maxViews * 100) + '%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="analytics-section">
      <h2>🕒 Recent Activity</h2>
      <div class="activity-feed">
        <div
          v-if="recentEvents.length === 0"
          class="empty-state"
        >
          No recent activity to display.
        </div>
        <div
          v-for="event in recentEvents"
          :key="event._id"
          class="activity-item"
        >
          <div class="activity-icon">
            {{ getEventIcon(event.eventType) }}
          </div>
          <div class="activity-content">
            <div class="activity-title">
              {{ getEventTitle(event.eventType) }}
            </div>
            <div class="activity-details">
              {{ getEventDetails(event) }}
            </div>
            <div class="activity-time">
              {{ formatTime(event.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visitor Journey -->
    <div
      v-if="selectedVisitor"
      class="analytics-section"
    >
      <h2>🗺️ Visitor Journey: {{ selectedVisitor.name }}</h2>
      <div class="journey-timeline">
        <div
          v-for="event in visitorJourney"
          :key="event._id"
          class="timeline-item"
        >
          <div class="timeline-marker" />
          <div class="timeline-content">
            <div class="timeline-event">
              {{ getEventTitle(event.eventType) }}
            </div>
            <div class="timeline-details">
              {{ getEventDetails(event) }}
            </div>
            <div class="timeline-time">
              {{ formatTime(event.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="dashboard-controls">
      <button
        class="refresh-btn"
        :disabled="isLoading"
        @click="refreshData"
      >
        <span v-if="isLoading">🔄</span>
        <span v-else>🔄</span>
        Refresh Data
      </button>
      
      <button
        class="realtime-btn"
        @click="toggleRealTime"
      >
        <span v-if="isRealTime">⏸️</span>
        <span v-else>▶️</span>
        {{ isRealTime ? 'Pause' : 'Start' }} Real-time
      </button>
      
      <button
        class="export-btn"
        @click="exportData"
      >
        📊 Export Data
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Reactive data
const activeVisitors = ref({ count: 0, visitors: [] });
const summary = ref({});
const popularPages = ref([]);
const recentEvents = ref([]);
const visitorJourney = ref([]);
const selectedVisitor = ref(null);
const isLoading = ref(false);
const isRealTime = ref(false);

// Real-time update interval
let realTimeInterval = null;

// Computed
const maxViews = computed(() => {
  return Math.max(...popularPages.value.map(p => p.views), 1);
});

// Get API URL
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.tcsn.io';

// Methods
const fetchAnalyticsData = async () => {
  try {
    isLoading.value = true;
    
    // Fetch active visitors
    const activeResponse = await fetch(`${apiUrl}/visitor-analytics?action=active_visitors`);
    if (activeResponse.ok) {
      activeVisitors.value = await activeResponse.json();
    }
    
    // Fetch analytics summary
    const summaryResponse = await fetch(`${apiUrl}/visitor-analytics?action=analytics_summary`);
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      summary.value = processSummaryData(summaryData.summary);
    }
    
    // Fetch popular pages
    const pagesResponse = await fetch(`${apiUrl}/visitor-analytics?action=popular_pages`);
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      popularPages.value = pagesData.pages || [];
    }
    
    // Fetch recent events (limit to 20)
    const eventsResponse = await fetch(`${apiUrl}/visitor-analytics?action=visitor_journey&limit=20`);
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      recentEvents.value = eventsData.events || [];
    }
    
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
  } finally {
    isLoading.value = false;
  }
};

const processSummaryData = (summaryArray) => {
  const processed = {};
  
  summaryArray.forEach(item => {
    switch (item._id) {
      case 'visitor_arrival':
        processed.newVisitors = item.count;
        break;
      case 'page_entry':
        processed.pageViews = item.count;
        break;
      case 'session_summary':
        processed.avgSessionTime = 300000; // Default 5 minutes, should calculate from data
        break;
    }
  });
  
  return processed;
};

const refreshData = () => {
  fetchAnalyticsData();
};

const toggleRealTime = () => {
  isRealTime.value = !isRealTime.value;
  
  if (isRealTime.value) {
    realTimeInterval = setInterval(() => {
      fetchAnalyticsData();
    }, 10000); // Update every 10 seconds
  } else {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      realTimeInterval = null;
    }
  }
};

const exportData = async () => {
  try {
    // Create CSV data
    const csvData = [
      ['Event Type', 'Visitor ID', 'Page', 'Timestamp'],
      ...recentEvents.value.map(event => [
        event.eventType,
        event.data.visitorId || '',
        event.data.page || '',
        new Date(event.timestamp).toISOString()
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export data:', error);
  }
};

// Utility functions
const getEventIcon = (eventType) => {
  const icons = {
    'visitor_arrival': '🚪',
    'visitor_departure': '👋',
    'page_entry': '📄',
    'page_exit': '↗️',
    'click': '👆',
    'scroll_milestone': '📜',
    'form_interaction': '📝',
    'heartbeat': '💓',
    'tab_hidden': '👁️',
    'tab_visible': '👀'
  };
  
  return icons[eventType] || '📊';
};

const getEventTitle = (eventType) => {
  const titles = {
    'visitor_arrival': 'Visitor Arrived',
    'visitor_departure': 'Visitor Left',
    'page_entry': 'Page Viewed',
    'page_exit': 'Page Left',
    'click': 'Element Clicked',
    'scroll_milestone': 'Scroll Milestone',
    'form_interaction': 'Form Interaction',
    'heartbeat': 'Activity Heartbeat',
    'tab_hidden': 'Tab Hidden',
    'tab_visible': 'Tab Visible'
  };
  
  return titles[eventType] || eventType;
};

const getEventDetails = (event) => {
  const data = event.data;
  
  switch (event.eventType) {
    case 'visitor_arrival':
      return `${data.landingPage} from ${data.referrer || 'Direct'}`;
    case 'page_entry':
    case 'page_exit':
      return data.page;
    case 'click':
      return `${data.element} on ${data.page}`;
    case 'scroll_milestone':
      return `${data.scrollPercent}% on ${data.page}`;
    default:
      return data.page || 'Site activity';
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const formatDuration = (ms) => {
  if (!ms) return '0s';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Lifecycle
onMounted(() => {
  fetchAnalyticsData();
});

onUnmounted(() => {
  if (realTimeInterval) {
    clearInterval(realTimeInterval);
  }
});
</script>

<style scoped>
.analytics-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.dashboard-header h1 {
  margin: 0;
  color: #2d3748;
  font-size: 2rem;
}

.real-time-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: #fed7d7;
  color: #c53030;
  font-weight: 500;
  font-size: 0.9rem;
}

.real-time-indicator.active {
  background: #c6f6d5;
  color: #38a169;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.card-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.card-content h3 {
  margin: 0 0 8px 0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.card-subtitle {
  color: #718096;
  font-size: 0.8rem;
}

.analytics-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.analytics-section h2 {
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.empty-state {
  text-align: center;
  color: #718096;
  padding: 40px;
  font-style: italic;
}

.popular-pages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
}

.page-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-path {
  font-weight: 600;
  color: #2d3748;
}

.page-stats {
  display: flex;
  gap: 16px;
}

.stat {
  color: #718096;
  font-size: 0.9rem;
}

.page-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.page-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
}

.activity-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.activity-details {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.activity-time {
  color: #a0aec0;
  font-size: 0.8rem;
}

.journey-timeline {
  position: relative;
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 14px;
  width: 1px;
  height: calc(100% - 8px);
  background: #e2e8f0;
}

.timeline-event {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.timeline-details {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.timeline-time {
  color: #a0aec0;
  font-size: 0.8rem;
}

.dashboard-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
}

.dashboard-controls button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn {
  background: #667eea;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.realtime-btn {
  background: #48bb78;
  color: white;
}

.realtime-btn:hover {
  background: #38a169;
}

.export-btn {
  background: #ed8936;
  color: white;
}

.export-btn:hover {
  background: #dd6b20;
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 10px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
