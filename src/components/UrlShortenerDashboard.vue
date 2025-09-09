<template>
  <div class="url-shortener-dashboard">
    <div class="dashboard-header">
      <h1>🔗 URL Shortener Dashboard</h1>
      <button @click="showCreateModal = true" class="create-btn">
        ➕ Create Short URL
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🔗</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalUrls }}</div>
          <div class="stat-label">Total URLs</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👆</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalClicks }}</div>
          <div class="stat-label">Total Clicks</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ uniqueVisitors }}</div>
          <div class="stat-label">Unique Visitors</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ averageCTR }}%</div>
          <div class="stat-label">Avg CTR</div>
        </div>
      </div>
    </div>

    <!-- URL List -->
    <div class="urls-section">
      <h2>📋 Your Short URLs</h2>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        Loading URLs...
      </div>
      
      <div v-else-if="urls.length === 0" class="empty-state">
        <div class="empty-icon">🔗</div>
        <h3>No URLs Created Yet</h3>
        <p>Create your first short URL to start tracking clicks and analytics.</p>
        <button @click="showCreateModal = true" class="create-btn">
          Create Short URL
        </button>
      </div>
      
      <div v-else class="urls-list">
        <div v-for="url in urls" :key="url._id" class="url-item">
          <div class="url-header">
            <div class="url-info">
              <div class="short-url">
                <span class="domain">{{ baseUrl }}/s/</span>
                <span class="code">{{ url.shortCode }}</span>
                <button @click="copyToClipboard(getShortUrl(url.shortCode))" class="copy-btn" title="Copy URL">
                  📋
                </button>
              </div>
              <div class="original-url">{{ url.originalUrl }}</div>
              <div class="url-meta">
                Created {{ formatDate(url.createdAt) }}
                <span v-if="url.description">• {{ url.description }}</span>
              </div>
            </div>
            
            <div class="url-stats">
              <div class="stat">
                <span class="stat-value">{{ url.clicks || 0 }}</span>
                <span class="stat-label">Clicks</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ url.analytics?.uniqueVisitors || 0 }}</span>
                <span class="stat-label">Visitors</span>
              </div>
            </div>
            
            <div class="url-actions">
              <button @click="viewAnalytics(url)" class="action-btn analytics-btn">
                📊 Analytics
              </button>
              <button @click="generateQR(url)" class="action-btn qr-btn">
                📱 QR Code
              </button>
            </div>
          </div>
          
          <!-- Quick Analytics Preview -->
          <div v-if="url.showPreview" class="analytics-preview">
            <div class="preview-stats">
              <div class="preview-stat">
                <span class="label">Top Referrer:</span>
                <span class="value">{{ getTopReferrer(url) }}</span>
              </div>
              <div class="preview-stat">
                <span class="label">Top Country:</span>
                <span class="value">{{ getTopCountry(url) }}</span>
              </div>
              <div class="preview-stat">
                <span class="label">Top Device:</span>
                <span class="value">{{ getTopDevice(url) }}</span>
              </div>
            </div>
            
            <div class="recent-clicks">
              <h4>Recent Clicks</h4>
              <div v-if="url.recentClicks && url.recentClicks.length > 0" class="clicks-list">
                <div v-for="click in url.recentClicks.slice(0, 5)" :key="click._id" class="click-item">
                  <span class="click-time">{{ formatTime(click.timestamp) }}</span>
                  <span class="click-referrer">{{ click.referrer || 'Direct' }}</span>
                  <span class="click-location">{{ click.location?.country || 'Unknown' }}</span>
                </div>
              </div>
              <div v-else class="no-clicks">No clicks yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create URL Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>🔗 Create Short URL</h3>
          <button @click="showCreateModal = false" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="createShortUrl" class="create-form">
          <div class="form-group">
            <label for="originalUrl">Original URL *</label>
            <input 
              type="url" 
              id="originalUrl" 
              v-model="newUrl.originalUrl" 
              placeholder="https://example.com/very/long/url"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="customCode">Custom Short Code (optional)</label>
            <input 
              type="text" 
              id="customCode" 
              v-model="newUrl.customCode" 
              placeholder="my-custom-code"
              pattern="[a-zA-Z0-9-_]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description (optional)</label>
            <input 
              type="text" 
              id="description" 
              v-model="newUrl.description" 
              placeholder="Campaign description or notes"
            />
          </div>
          
          <div class="form-group">
            <label for="campaignName">Campaign Name (optional)</label>
            <input 
              type="text" 
              id="campaignName" 
              v-model="newUrl.campaignName" 
              placeholder="Summer Sale 2025"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="source">Source</label>
              <input 
                type="text" 
                id="source" 
                v-model="newUrl.source" 
                placeholder="newsletter, social, etc."
              />
            </div>
            
            <div class="form-group">
              <label for="medium">Medium</label>
              <input 
                type="text" 
                id="medium" 
                v-model="newUrl.medium" 
                placeholder="email, cpc, organic, etc."
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="newUrl.trackingEnabled" />
              Enable detailed tracking & analytics
            </label>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" :disabled="creating" class="submit-btn">
              <span v-if="creating">Creating...</span>
              <span v-else>Create Short URL</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Analytics Modal -->
    <div v-if="showAnalyticsModal" class="modal-overlay" @click="showAnalyticsModal = false">
      <div class="modal analytics-modal" @click.stop>
        <div class="modal-header">
          <h3>📊 Analytics for {{ selectedUrl?.shortCode }}</h3>
          <button @click="showAnalyticsModal = false" class="close-btn">✕</button>
        </div>
        
        <div v-if="analyticsData" class="analytics-content">
          <!-- Analytics content will be loaded here -->
          <div class="analytics-summary">
            <div class="summary-stat">
              <div class="value">{{ analyticsData.totalClicks }}</div>
              <div class="label">Total Clicks</div>
            </div>
            <div class="summary-stat">
              <div class="value">{{ analyticsData.analytics?.uniqueVisitors || 0 }}</div>
              <div class="label">Unique Visitors</div>
            </div>
          </div>
          
          <!-- Add more detailed analytics here -->
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div v-if="showQRModal" class="modal-overlay" @click="showQRModal = false">
      <div class="modal qr-modal" @click.stop>
        <div class="modal-header">
          <h3>📱 QR Code for {{ selectedUrl?.shortCode }}</h3>
          <button @click="showQRModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="qr-content">
          <div class="qr-code">
            <img :src="qrCodeUrl" :alt="`QR Code for ${selectedUrl?.shortCode}`" />
          </div>
          <div class="qr-url">{{ getShortUrl(selectedUrl?.shortCode) }}</div>
          <button @click="downloadQR" class="download-btn">
            💾 Download QR Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UrlShortenerService from '../lib/UrlShortenerService.js';

// Reactive data
const urls = ref([]);
const loading = ref(true);
const showCreateModal = ref(false);
const showAnalyticsModal = ref(false);
const showQRModal = ref(false);
const creating = ref(false);
const selectedUrl = ref(null);
const analyticsData = ref(null);
const qrCodeUrl = ref('');

// Form data
const newUrl = ref({
  originalUrl: '',
  customCode: '',
  description: '',
  campaignName: '',
  source: '',
  medium: '',
  trackingEnabled: true
});

// Computed properties
const baseUrl = computed(() => window.location.origin);

const totalUrls = computed(() => urls.value.length);

const totalClicks = computed(() => {
  return urls.value.reduce((sum, url) => sum + (url.clicks || 0), 0);
});

const uniqueVisitors = computed(() => {
  return urls.value.reduce((sum, url) => sum + (url.analytics?.uniqueVisitors || 0), 0);
});

const averageCTR = computed(() => {
  if (totalUrls.value === 0) return 0;
  return (totalClicks.value / totalUrls.value).toFixed(1);
});

// Methods
const loadUrls = async () => {
  try {
    loading.value = true;
    const result = await UrlShortenerService.listShortUrls(50);
    
    if (result.success) {
      urls.value = result.urls;
    } else {
      console.error('Failed to load URLs:', result.error);
    }
  } catch (error) {
    console.error('Error loading URLs:', error);
  } finally {
    loading.value = false;
  }
};

const createShortUrl = async () => {
  try {
    creating.value = true;
    
    const result = await UrlShortenerService.createShortUrl(newUrl.value.originalUrl, {
      customCode: newUrl.value.customCode || null,
      description: newUrl.value.description,
      campaignName: newUrl.value.campaignName,
      source: newUrl.value.source,
      medium: newUrl.value.medium,
      trackingEnabled: newUrl.value.trackingEnabled
    });
    
    if (result.success) {
      // Reset form
      newUrl.value = {
        originalUrl: '',
        customCode: '',
        description: '',
        campaignName: '',
        source: '',
        medium: '',
        trackingEnabled: true
      };
      
      showCreateModal.value = false;
      
      // Reload URLs
      await loadUrls();
      
      // Show success message
      alert(`Short URL created successfully!\n\n${result.shortUrl}`);
      
    } else {
      alert(`Failed to create short URL: ${result.error}`);
    }
    
  } catch (error) {
    console.error('Error creating short URL:', error);
    alert('An error occurred while creating the short URL');
  } finally {
    creating.value = false;
  }
};

const viewAnalytics = async (url) => {
  try {
    selectedUrl.value = url;
    showAnalyticsModal.value = true;
    
    const result = await UrlShortenerService.getShortUrlAnalytics(url.shortCode);
    
    if (result.success) {
      analyticsData.value = result;
    } else {
      console.error('Failed to load analytics:', result.error);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
};

const generateQR = (url) => {
  selectedUrl.value = url;
  const shortUrl = getShortUrl(url.shortCode);
  qrCodeUrl.value = UrlShortenerService.generateQRCode(shortUrl);
  showQRModal.value = true;
};

const downloadQR = () => {
  const link = document.createElement('a');
  link.href = qrCodeUrl.value;
  link.download = `qr-${selectedUrl.value.shortCode}.png`;
  link.click();
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('URL copied to clipboard!');
  }
};

const getShortUrl = (shortCode) => {
  return `${baseUrl.value}/s/${shortCode}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getTopReferrer = (url) => {
  const referrers = url.analytics?.referrers || {};
  const entries = Object.entries(referrers);
  if (entries.length === 0) return 'Direct';
  
  const top = entries.reduce((a, b) => referrers[a[0]] > referrers[b[0]] ? a : b);
  return top[0];
};

const getTopCountry = (url) => {
  const countries = url.analytics?.locations || {};
  const entries = Object.entries(countries);
  if (entries.length === 0) return 'Unknown';
  
  const top = entries.reduce((a, b) => countries[a[0]] > countries[b[0]] ? a : b);
  return top[0];
};

const getTopDevice = (url) => {
  const devices = url.analytics?.devices || {};
  const entries = Object.entries(devices);
  if (entries.length === 0) return 'Unknown';
  
  const top = entries.reduce((a, b) => devices[a[0]] > devices[b[0]] ? a : b);
  return top[0];
};

// Lifecycle
onMounted(() => {
  loadUrls();
});
</script>

<style scoped>
.url-shortener-dashboard {
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

.create-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #5a67d8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.urls-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.urls-section h2 {
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 10px;
}

.empty-state p {
  color: #718096;
  margin-bottom: 30px;
}

.urls-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.url-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
  overflow: hidden;
}

.url-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
}

.url-info {
  flex: 1;
}

.short-url {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.domain {
  color: #718096;
  font-size: 0.9rem;
}

.code {
  font-weight: 600;
  color: #2d3748;
  font-family: 'Monaco', 'Menlo', monospace;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #e2e8f0;
}

.original-url {
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 4px;
  word-break: break-all;
}

.url-meta {
  color: #718096;
  font-size: 0.8rem;
}

.url-stats {
  display: flex;
  gap: 20px;
}

.stat {
  text-align: center;
}

.stat .stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat .stat-label {
  color: #718096;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.url-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f7fafc;
  transform: translateY(-1px);
}

.analytics-btn {
  border-color: #667eea;
  color: #667eea;
}

.qr-btn {
  border-color: #48bb78;
  color: #48bb78;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
}

.analytics-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f7fafc;
}

.create-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 500;
}

.form-group input[type="url"],
.form-group input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #f7fafc;
}

.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.qr-content {
  padding: 20px;
  text-align: center;
}

.qr-code img {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}

.qr-url {
  color: #4a5568;
  font-family: 'Monaco', 'Menlo', monospace;
  margin-bottom: 20px;
  word-break: break-all;
}

.download-btn {
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #38a169;
}

/* Responsive */
@media (max-width: 768px) {
  .url-shortener-dashboard {
    padding: 10px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .url-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .url-stats {
    justify-content: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
