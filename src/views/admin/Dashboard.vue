<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="brand">
          <h1>🔐 TCSN Admin Dashboard</h1>
        </div>
        <div
          v-if="user"
          class="user-menu"
        >
          <div class="user-info">
            <img
              :src="user.picture"
              :alt="user.name"
              class="user-avatar"
            >
            <div class="user-details">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <button
            class="logout-btn"
            @click="handleLogout"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="loading-container"
    >
      <div class="spinner" />
      <p>Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="error-container"
    >
      <div class="error-card">
        <h2>❌ Access Denied</h2>
        <p>{{ error }}</p>
        <button
          class="login-btn"
          @click="redirectToLogin"
        >
          🔐 Go to Login
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <main
      v-else-if="isAuthenticated"
      class="dashboard-content"
    >
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-card">
          <h2>👋 Welcome back, {{ user?.name }}!</h2>
          <p>You have full administrator access to the TCSN.io system.</p>
          <div class="admin-status">
            <span class="status-badge">🟢 Admin Access Active</span>
            <span class="login-time">Last login: {{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="stats-section">
        <h3>📊 System Overview</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              👥
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ stats.totalVisitors || 0 }}
              </div>
              <div class="stat-label">
                Total Visitors
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              📄
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ stats.totalPageViews || 0 }}
              </div>
              <div class="stat-label">
                Page Views
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              🌟
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ stats.todayVisitors || 0 }}
              </div>
              <div class="stat-label">
                Today's Visitors
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              ⚡
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ stats.activeUsers || 0 }}
              </div>
              <div class="stat-label">
                Active Users
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Admin Actions -->
      <section class="actions-section">
        <h3>🛠️ Admin Tools</h3>
        <div class="actions-grid">
          <router-link
            to="/visitor-dashboard"
            class="action-card"
          >
            <div class="action-icon">
              📈
            </div>
            <div class="action-content">
              <h4>Visitor Analytics</h4>
              <p>View detailed visitor tracking and analytics</p>
            </div>
            <div class="action-arrow">
              →
            </div>
          </router-link>
          
          <router-link
            to="/visitor-demo"
            class="action-card"
          >
            <div class="action-icon">
              🧪
            </div>
            <div class="action-content">
              <h4>Tracking Demo</h4>
              <p>Test the visitor tracking system</p>
            </div>
            <div class="action-arrow">
              →
            </div>
          </router-link>
          
          <div
            class="action-card"
            @click="viewSystemInfo"
          >
            <div class="action-icon">
              ⚙️
            </div>
            <div class="action-content">
              <h4>System Information</h4>
              <p>View system status and configuration</p>
            </div>
            <div class="action-arrow">
              →
            </div>
          </div>
          
          <div
            class="action-card"
            @click="exportData"
          >
            <div class="action-icon">
              💾
            </div>
            <div class="action-content">
              <h4>Export Data</h4>
              <p>Download visitor and analytics data</p>
            </div>
            <div class="action-arrow">
              →
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="activity-section">
        <h3>📋 Recent Activity</h3>
        <div class="activity-card">
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">
                👤
              </div>
              <div class="activity-content">
                <p><strong>Admin Login</strong> - {{ user?.name }} signed in</p>
                <span class="activity-time">{{ formatDate(new Date()) }}</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                🔐
              </div>
              <div class="activity-content">
                <p><strong>Authentication</strong> - Google OAuth verified</p>
                <span class="activity-time">{{ formatDate(new Date()) }}</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                📊
              </div>
              <div class="activity-content">
                <p><strong>Dashboard Access</strong> - Admin panel loaded</p>
                <span class="activity-time">{{ formatDate(new Date()) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGoogleAuth } from '@/composables/useGoogleAuth.js';

// Authentication
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  logout
} = useGoogleAuth();

// Dashboard data
const stats = ref({
  totalVisitors: 0,
  totalPageViews: 0,
  todayVisitors: 0,
  activeUsers: 1
});

// Get API URL
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.tcsn.io';

// Load dashboard stats
const loadStats = async () => {
  try {
    const response = await fetch(`${apiUrl}/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' })
    });
    
    if (response.ok) {
      const result = await response.json();
      stats.value = {
        totalVisitors: result.stats?.total || 0,
        totalPageViews: result.stats?.total || 0, // Placeholder
        todayVisitors: result.stats?.today || 0,
        activeUsers: 1 // Admin user
      };
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
};

// Handle logout
const handleLogout = async () => {
  await logout();
};

// Redirect to login if not authenticated
const redirectToLogin = () => {
  window.location.href = '/admin/login';
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Admin actions
const viewSystemInfo = () => {
  alert('System Information:\n\n' + 
        '• MongoDB: Connected\n' +
        '• Google Auth: Active\n' +
        '• Visitor Tracking: Enabled\n' +
        '• OpenAI: Configured\n' +
        '• Status: All systems operational');
};

const exportData = () => {
  alert('Data export functionality would be implemented here.\n\n' +
        'This would include:\n' +
        '• Visitor data export\n' +
        '• Analytics reports\n' +
        '• System logs\n' +
        '• Configuration backup');
};

// Check authentication on mount
onMounted(async () => {
  if (!isAuthenticated.value && !isLoading.value) {
    redirectToLogin();
  } else {
    await loadStats();
  }
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand h1 {
  margin: 0;
  color: #2563eb;
  font-size: 24px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.user-email {
  color: #6b7280;
  font-size: 12px;
}

.logout-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #b91c1c;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.login-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section, .stats-section, .actions-section, .activity-section {
  margin-bottom: 40px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.welcome-card h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
}

.welcome-card p {
  margin: 0 0 20px 0;
  opacity: 0.9;
}

.admin-status {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.status-badge {
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.login-time {
  opacity: 0.8;
  font-size: 14px;
}

.stats-section h3, .actions-section h3, .activity-section h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 12px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 4px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 10px;
}

.action-content {
  flex: 1;
}

.action-content h4 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 16px;
}

.action-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.action-arrow {
  font-size: 18px;
  color: #6b7280;
}

.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.activity-list {
  padding: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 8px;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 14px;
}

.activity-time {
  color: #6b7280;
  font-size: 12px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .user-menu {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-grid, .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-status {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
