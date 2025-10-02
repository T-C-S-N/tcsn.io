<template>
  <div class="max-w-4xl mx-auto p-5">
    <div class="text-center mb-8">
      <h2 class="text-blue-600 text-3xl font-bold mb-2">🎯 Visitor Tracking Demo</h2>
      <p class="text-gray-500 text-base">AI-Generated Names with Location & Browser Tracking</p>
    </div>
    
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="text-center py-10"
    >
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5" />
      <p>Initializing visitor tracking...</p>
    </div>
    
    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-10 bg-red-50 rounded-lg border border-red-200"
    >
      <h3 class="text-red-600 text-xl font-semibold mb-2">❌ Tracking Error</h3>
      <p class="mb-4">{{ error }}</p>
      <button
        class="bg-red-600 text-white border-none px-5 py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors"
        @click="initializeTracking"
      >
        🔄 Retry
      </button>
    </div>
    
    <!-- Success State -->
    <div v-else>
      <!-- Greeting -->
      <div class="text-center mb-5">
        <h3 class="text-2xl text-gray-800 m-0">{{ getGreeting() }}</h3>
      </div>
      
      <!-- Visitor Status -->
      <div class="flex justify-center gap-2 mb-8 flex-wrap">
        <span
          v-if="isNewVisitor"
          class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
        >🆕 New Visitor</span>
        <span
          v-else-if="isNewSession"
          class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
        >🔄 New Session</span>
        <span
          v-else
          class="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
        >✅ Active Session</span>
      </div>
      
      <!-- Visitor Details -->
      <div
        v-if="visitor"
        class="grid gap-5"
      >
        <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h4 class="m-0 mb-4 text-gray-700 text-lg font-semibold border-b-2 border-gray-100 pb-2">👤 Visitor Information</h4>
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Generated Name:</label>
              <span class="text-gray-800 text-base">{{ visitor.generatedName || visitor.fallbackName || 'Anonymous' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Visitor ID:</label>
              <span class="text-gray-500 text-xs font-mono break-all">{{ visitor.visitorId }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Session ID:</label>
              <span class="text-gray-500 text-xs font-mono break-all">{{ visitor.sessionId }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">First Visit:</label>
              <span class="text-gray-800 text-base">{{ formatDate(visitor.firstVisit) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Browser Information -->
        <div
          v-if="visitor.browserInfo"
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
        >
          <h4 class="m-0 mb-4 text-gray-700 text-lg font-semibold border-b-2 border-gray-100 pb-2">🌐 Browser & Device</h4>
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Browser:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.browser }} {{ visitor.browserInfo.version }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Operating System:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.os?.name }} {{ visitor.browserInfo.os?.version }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Device:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.device }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Screen:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.screen?.width }}x{{ visitor.browserInfo.screen?.height }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Language:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.language }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Timezone:</label>
              <span class="text-gray-800 text-base">{{ visitor.browserInfo.timezone }}</span>
            </div>
          </div>
        </div>
        
        <!-- Location Information -->
        <div
          v-if="visitor.location && visitor.location.country"
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
        >
          <h4 class="m-0 mb-4 text-gray-700 text-lg font-semibold border-b-2 border-gray-100 pb-2">📍 Location Information</h4>
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Country:</label>
              <span class="text-gray-800 text-base">{{ visitor.location.country }}</span>
            </div>
            <div
              v-if="visitor.location.region"
              class="flex flex-col gap-1"
            >
              <label class="font-semibold text-gray-500 text-sm">Region:</label>
              <span class="text-gray-800 text-base">{{ visitor.location.region }}</span>
            </div>
            <div
              v-if="visitor.location.city"
              class="flex flex-col gap-1"
            >
              <label class="font-semibold text-gray-500 text-sm">City:</label>
              <span class="text-gray-800 text-base">{{ visitor.location.city }}</span>
            </div>
            <div
              v-if="visitor.location.isp"
              class="flex flex-col gap-1"
            >
              <label class="font-semibold text-gray-500 text-sm">ISP:</label>
              <span class="text-gray-800 text-base">{{ visitor.location.isp }}</span>
            </div>
            <div
              v-if="visitor.location.latitude"
              class="flex flex-col gap-1"
            >
              <label class="font-semibold text-gray-500 text-sm">Coordinates:</label>
              <span class="text-gray-800 text-base">{{ visitor.location.latitude }}, {{ visitor.location.longitude }}</span>
            </div>
          </div>
        </div>
        
        <!-- Session Information -->
        <div
          v-if="visitor.currentSession"
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
        >
          <h4 class="m-0 mb-4 text-gray-700 text-lg font-semibold border-b-2 border-gray-100 pb-2">🕒 Current Session</h4>
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Session Start:</label>
              <span class="text-gray-800 text-base">{{ formatDate(visitor.currentSession.startTime) }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Last Activity:</label>
              <span class="text-gray-800 text-base">{{ formatDate(visitor.currentSession.lastActivity) }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-semibold text-gray-500 text-sm">Pages Viewed:</label>
              <span class="text-gray-800 text-base">{{ visitor.currentSession.pageViews?.length || 0 }}</span>
            </div>
            <div
              v-if="visitor.currentSession.referrer"
              class="flex flex-col gap-1"
            >
              <label class="font-semibold text-gray-500 text-sm">Referrer:</label>
              <span class="text-gray-500 text-xs font-mono break-all">{{ visitor.currentSession.referrer }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-center gap-4 mt-8 flex-wrap">
        <button
          class="px-6 py-3 border-none rounded-md text-base cursor-pointer transition-colors font-medium bg-blue-600 text-white hover:bg-blue-700"
          @click="refreshTracking"
        >
          🔄 Refresh Tracking
        </button>
        <button
          class="px-6 py-3 rounded-md text-base cursor-pointer transition-colors font-medium bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
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
