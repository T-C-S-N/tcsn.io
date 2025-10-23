<template>
  <div class="visitor-analytics w-full">
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="text-lg font-semibold text-primary">
          Your Personal Analytics
        </div>
        <div class="text-xs text-primary/70">
          Showing your personal visit and activity data (ID: {{ visitorStore.visitor.id?.slice(-8) || 'unknown' }})
          <span 
            v-if="lastUpdated" 
            class="ml-2"
          >
            • Last updated: {{ formatLastUpdated(lastUpdated) }}
            <span 
              v-if="isBackgroundRefreshing" 
              class="inline-flex items-center ml-1"
            >
              <div class="w-2 h-2 border border-primary/30 border-t-primary rounded-full animate-spin mr-1" />
              <span class="text-xs text-primary/60">Updating...</span>
            </span>
          </span>
        </div>
      </div>
      <!--<div class="flex gap-2">
        <button
          class="px-3 py-1 text-xs border border-primary/20 rounded hover:bg-primary/10 transition-colors flex items-center gap-1"
          title="Refresh data immediately"
          :disabled="isLoading"
          @click="smartRefresh"
        >
          <div 
            v-if="isLoading || isBackgroundRefreshing" 
            class="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin"
          />
          <span>{{ isLoading ? 'Refreshing...' : '↻ Refresh' }}</span>
        </button>
        <button
          class="px-3 py-1 text-xs border border-primary/20 rounded hover:bg-primary/10 transition-colors"
          :class="{ 'bg-primary/10': autoRefresh }"
          :title="`Auto-refresh every ${REFRESH_INTERVAL_MS/1000}s`"
          @click="toggleAutoRefresh"
        >
          Auto: {{ autoRefresh ? 'ON' : 'OFF' }}
        </button>
      </div>-->
    </div>
    
    <!-- Update Notification -->
    <div 
      v-if="showUpdateNotification"
      class="mb-4 p-2 bg-primary-500/10 border border-primary-500/20 rounded text-xs text-primary-400 text-center animate-pulse"
    >
      📊 Analytics updated with new data!
    </div>
    
    <!-- Loading State -->
    <div 
      v-if="isLoading" 
      class="flex justify-center items-center p-8"
    >
      <div class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span class="ml-2 text-primary/70">
        Loading analytics...
      </span>
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error" 
      class="text-center p-4 text-red-400"
    >
      <div class="text-sm">
        {{ error }}
      </div>
      <button 
        class="mt-2 px-3 py-1 border border-primary/20 rounded text-xs hover:bg-primary/10 transition-colors"
        @click="loadAnalytics"
      >
        Retry
      </button>
    </div>

    <!-- Charts -->
    <!-- Charts -->
    <div 
      v-else 
      class="flex flex-col gap-6"
    >
      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="border border-primary/20 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-primary">
            {{ totalVisits }}
          </div>
          <div class="text-xs text-primary/70">
            Your Total Visits
          </div>
        </div>
        <div class="border border-primary/20 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-primary">
            {{ totalAIRequests }}
          </div>
          <div class="text-xs text-primary/70">
            Your AI Requests
          </div>
        </div>
        <div class="border border-primary/20 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-primary">
            {{ todayVisits }}
          </div>
          <div class="text-xs text-primary/70">
            Today's Visits
          </div>
        </div>
        <div class="border border-primary/20 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-primary">
            {{ todayAIRequests }}
          </div>
          <div class="text-xs text-primary/70">
            Today's AI Requests
          </div>
        </div>
      </div>

      <!-- Visits Over Time Chart -->
      <div class="border border-primary/20 rounded-lg p-4">
        <div class="text-md font-semibold mb-3 text-primary">
          Your Visits Over Time (Last 7 Days)
        </div>
        <div 
          v-if="chartsReady"
          ref="visitsChart" 
          class="w-full h-48 border border-primary-500/20 bg-primary-500/5 transition-all duration-300"
          :class="{ 'ring-2 ring-primary-500/30': isBackgroundRefreshing }"
        >
          <!-- D3.js chart will be inserted here -->
        </div>
        <div 
          v-else
          class="w-full h-48 border border-primary-500/20 bg-primary-500/5 flex items-center justify-center"
        >
          <div class="flex items-center gap-2 text-primary-400/60 text-sm">
            <div class="w-4 h-4 border border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
            <span>Preparing chart...</span>
          </div>
        </div>
      </div>

      <!-- AI Requests Over Time Chart -->
      <div class="border border-primary/20 rounded-lg p-4">
        <div class="text-md font-semibold mb-3 text-primary">
          Your AI Requests Over Time (Last 7 Days)
        </div>
        <div 
          v-if="chartsReady"
          ref="aiChart" 
          class="w-full h-48 border border-primary-500/20 bg-primary-500/5 transition-all duration-300"
          :class="{ 'ring-2 ring-primary-500/30': isBackgroundRefreshing }"
        >
          <!-- D3.js chart will be inserted here -->
        </div>
        <div 
          v-else
          class="w-full h-48 border border-primary-500/20 bg-primary-500/5 flex items-center justify-center"
        >
          <div class="flex items-center gap-2 text-primary-400/60 text-sm">
            <div class="w-4 h-4 border border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
            <span>Preparing chart...</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="border border-primary/20 rounded-lg p-4">
        <div class="text-md font-semibold mb-3 text-primary">
          Recent Activity
        </div>
        <div class="flex flex-col gap-2 max-h-32 overflow-y-auto">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="flex justify-between items-center text-xs border-b border-primary/10 pb-1"
          >
            <span class="text-primary/80">
              {{ activity.type }}
            </span>
            <span class="text-primary/60">
              {{ formatTime(activity.timestamp) }}
            </span>
          </div>
          <div 
            v-if="recentActivity.length === 0" 
            class="text-xs text-primary/50 text-center py-2"
          >
            No recent activity
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import * as d3 from 'd3'
import { apiCall, API_CONFIG } from '@/lib/apiConfig.js'
import { useVisitorStore } from '@/stores/visitorStore.js'

// Ensure D3 is properly loaded
console.log('D3 import check:', { d3, version: d3?.version, select: typeof d3?.select })

// Store
const visitorStore = useVisitorStore()

// Computed visitor data
const visitorData = computed(() => ({
  visitorId: visitorStore.visitor.id,
  sessionId: visitorStore.currentSessionId
}))

// Reactive data
const isLoading = ref(true)
const error = ref(null)
const visitsChart = ref(null)
const aiChart = ref(null)

// Analytics data
const totalVisits = ref(0)
const totalAIRequests = ref(0)
const todayVisits = ref(0)
const todayAIRequests = ref(0)
const visitsData = ref([])
const aiRequestsData = ref([])
const recentActivity = ref([])

// Real-time update state
const lastUpdated = ref(null)
const autoRefresh = ref(true)
const refreshInterval = ref(null)
const isBackgroundRefreshing = ref(false)
const showUpdateNotification = ref(false)
const previousDataHash = ref(null)
const chartsReady = ref(false)
const REFRESH_INTERVAL_MS = 30000 // 30 seconds for more responsive updates

// Chart dimensions
const getChartDimensions = () => {
  const containerWidth = visitsChart.value?.clientWidth || 600
  const margin = { top: 20, right: 30, bottom: 40, left: 50 }
  const width = containerWidth - margin.left - margin.right
  const height = 180 - margin.bottom - margin.top
  
  console.log('Chart dimensions:', {
    containerWidth,
    calculatedWidth: width,
    calculatedHeight: height,
    margin
  })
  
  return { margin, width, height }
}

// Load analytics data
const loadAnalytics = async (showLoading = true) => {
  try {
    // Reset charts ready state
    if (showLoading) {
      chartsReady.value = false
      isLoading.value = true
    } else {
      isBackgroundRefreshing.value = true
    }
    error.value = null

    // Always use visitor-specific analytics
    if (!visitorStore.visitor.id) {
      throw new Error('Visitor ID is required for personal analytics')
    }

    console.log('Loading analytics for visitor:', visitorStore.visitor.id)

    const apiUrl = `${API_CONFIG.ENDPOINTS.VISITOR_ANALYTICS}?visitorId=${visitorStore.visitor.id}`

    // Get visitor analytics
    const response = await apiCall(apiUrl, {
      method: 'GET'
    })

    if (response) {
      const oldTotalVisits = totalVisits.value
      const oldTotalAI = totalAIRequests.value
      
      processAnalyticsData(response)
      
      // Add delay to ensure data is properly processed
      await nextTick()
      
      // Wait a bit more to ensure DOM updates
      setTimeout(async () => {
        chartsReady.value = true
        await nextTick()
        await createCharts()
        lastUpdated.value = new Date()
      }, 300) // 300ms delay
      
      // Show notification if data changed and this was a background refresh
      if (!showLoading && (totalVisits.value !== oldTotalVisits || totalAIRequests.value !== oldTotalAI)) {
        showUpdateNotification.value = true
        setTimeout(() => {
          showUpdateNotification.value = false
        }, 3000) // Hide notification after 3 seconds
      }
    } else {
      throw new Error('No analytics data received from API')
    }
  } catch (err) {
    console.error('Analytics loading error:', err)
    
    // On initial load, show error
    if (showLoading) {
      error.value = 'Failed to load analytics data'
      throw err
    }
  } finally {
    if (showLoading) {
      isLoading.value = false
    } else {
      isBackgroundRefreshing.value = false
    }
  }
}

// Manual refresh function
const refreshAnalytics = async () => {
  await loadAnalytics(true)
}

// Toggle auto-refresh
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// Start auto-refresh interval
const startAutoRefresh = () => {
  stopAutoRefresh() // Clear any existing interval
  refreshInterval.value = setInterval(() => {
    loadAnalytics(false) // Silent refresh (no loading spinner)
  }, REFRESH_INTERVAL_MS)
}

// Stop auto-refresh interval
const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// Format last updated time
const formatLastUpdated = (timestamp) => {
  const now = new Date()
  const diff = Math.floor((now - timestamp) / 1000) // seconds
  
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return timestamp.toLocaleTimeString()
}

// External trigger for immediate refresh (can be called by other components)
const triggerRefresh = async () => {
  await loadAnalytics(false) // Silent refresh
}

// Intelligent refresh - triggers immediate update and resets interval
const smartRefresh = async () => {
  await loadAnalytics(false) // Silent refresh
  
  // Reset auto-refresh interval to prevent immediate double refresh
  if (autoRefresh.value) {
    stopAutoRefresh()
    startAutoRefresh()
  }
}

// Expose refresh methods for external components
defineExpose({
  triggerRefresh,
  smartRefresh,
  loadAnalytics,
  refreshAnalytics
})

// Process real analytics data
const processAnalyticsData = (data) => {
  // Create a simple hash of the important data to detect changes
  const dataHash = JSON.stringify({
    totalVisits: data.visits?.reduce((sum, v) => sum + v.count, 0) || 0,
    totalAI: data.totalAIRequests || 0,
    visitCount: data.visits?.length || 0,
    aiCount: data.aiRequests?.length || 0
  })
  
  // Check if data has changed and show notification
  if (previousDataHash.value && previousDataHash.value !== dataHash && !isLoading.value) {
    showUpdateNotification.value = true
    setTimeout(() => {
      showUpdateNotification.value = false
    }, 3000) // Hide notification after 3 seconds
  }
  previousDataHash.value = dataHash
  
  // Process visits data - group by date
  const visitsByDate = {}
  data.visits?.forEach(visit => {
    const date = visit.date // Already in YYYY-MM-DD format
    visitsByDate[date] = (visitsByDate[date] || 0) + visit.count
  })

  // Process AI requests - group by date
  const aiRequestsByDate = {}
  data.aiRequests?.forEach(request => {
    const date = request.date // Already in YYYY-MM-DD format
    aiRequestsByDate[date] = (aiRequestsByDate[date] || 0) + request.count
  })

  // Generate data for last 7 days
  const last7Days = []
  const visitsLast7Days = []
  const aiRequestsLast7Days = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    const dayData = {
      date: date,
      dateStr: dateStr,
      visits: visitsByDate[dateStr] || 0,
      aiRequests: aiRequestsByDate[dateStr] || 0
    }
    
    last7Days.push(dayData)
    
    // Separate arrays for each chart
    visitsLast7Days.push({
      date: date,
      dateStr: dateStr,
      visits: visitsByDate[dateStr] || 0
    })
    
    aiRequestsLast7Days.push({
      date: date,
      dateStr: dateStr,
      aiRequests: aiRequestsByDate[dateStr] || 0
    })
  }

  visitsData.value = visitsLast7Days
  aiRequestsData.value = aiRequestsLast7Days

  // Debugging: If no real data, ensure we have minimal data for testing
  if (visitsData.value.every(d => d.visits === 0)) {
    console.warn('No visits data found, ensuring at least one data point for chart visibility')
    if (visitsData.value.length > 0) {
      visitsData.value[visitsData.value.length - 1].visits = Math.max(1, totalVisits.value)
    }
  }
  
  if (aiRequestsData.value.every(d => d.aiRequests === 0)) {
    console.warn('No AI requests data found, ensuring at least one data point for chart visibility')
    if (aiRequestsData.value.length > 0 && totalAIRequests.value > 0) {
      aiRequestsData.value[aiRequestsData.value.length - 1].aiRequests = totalAIRequests.value
    }
  }

  console.log('Chart data points:', last7Days) // Debug log

  // Calculate totals from API response
  totalVisits.value = data.visits?.reduce((sum, v) => sum + v.count, 0) || 0
  totalAIRequests.value = data.totalAIRequests || 0
  
  // Today's data
  const today = new Date().toISOString().split('T')[0]
  todayVisits.value = visitsByDate[today] || 0
  todayAIRequests.value = aiRequestsByDate[today] || 0

  // Create recent activity from visits and AI requests
  const recentVisitActivity = data.visits?.slice(-5).map(v => ({
    id: `visit-${v.date}-${v.page}`,
    type: `Page Visit: ${v.page}`,
    timestamp: new Date(v.date + 'T12:00:00Z') // Approximate time
  })) || []

  const recentAIActivity = data.aiRequests?.slice(-5).map(r => ({
    id: `ai-${r.date}-${r.visitor_id}`,
    type: 'AI Request',
    timestamp: new Date(r.created_at || r.date + 'T12:00:00Z')
  })) || []

  recentActivity.value = [...recentVisitActivity, ...recentAIActivity]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8)

  console.log('Processed data:', {
    totalVisits: totalVisits.value,
    totalAIRequests: totalAIRequests.value,
    todayVisits: todayVisits.value,
    todayAIRequests: todayAIRequests.value,
    chartData: last7Days
  })
}

// Create charts
const createCharts = async () => {
  console.log('Creating charts with data:', {
    visitsData: visitsData.value,
    aiRequestsData: aiRequestsData.value,
    visitsChartRef: visitsChart.value,
    aiChartRef: aiChart.value,
    chartsReady: chartsReady.value
  })
  
  // Test D3.js availability
  console.log('D3.js version:', d3.version)
  console.log('Chart containers available:', {
    visitsChart: !!visitsChart.value,
    aiChart: !!aiChart.value
  })
  
  // Wait for chart containers to be ready
  let retries = 0
  const maxRetries = 10
  
  while ((!visitsChart.value || !aiChart.value) && retries < maxRetries) {
    console.warn(`Chart containers not available yet, retry ${retries + 1}/${maxRetries}...`)
    await new Promise(resolve => setTimeout(resolve, 100)) // Wait 100ms
    await nextTick()
    retries++
  }
  
  if (!visitsChart.value || !aiChart.value) {
    console.error('Chart containers still not available after all retries')
    return
  }

  // Ensure we have data
  if (!visitsData.value.length || !aiRequestsData.value.length) {
    console.warn('No data available for charts, but proceeding with empty charts')
    // Don't return - still try to create the chart structure
  }

  try {
    createVisitsChart()
    createAIChart()
    console.log('Both charts created successfully')
  } catch (chartError) {
    console.error('Error creating charts:', chartError)
  }
}

// Create visits chart
const createVisitsChart = () => {
  console.log('Creating visits chart with data:', visitsData.value)
  console.log('Visits data length:', visitsData.value.length)
  console.log('First few data points with details:', visitsData.value.slice(0, 3).map(d => ({
    date: d.date,
    dateStr: d.dateStr,
    visits: d.visits,
    aiRequests: d.aiRequests
  })))
  
  // Check if we have data
  if (!visitsData.value || visitsData.value.length === 0) {
    console.warn('No visits data available for chart')
    return
  }
  
  // Clear previous chart
  d3.select(visitsChart.value).selectAll("*").remove()
  
  // Test D3 basic functionality
  console.log('Testing D3 selection:', d3.select(visitsChart.value).node())

  const { margin, width, height } = getChartDimensions()
  
  console.log('Chart dimensions:', { margin, width, height })

  const svg = d3.select(visitsChart.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  console.log('SVG created:', svg.node())

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(visitsData.value, d => d.date))
    .range([0, width])

  const maxVisits = d3.max(visitsData.value, d => d.visits) || 1 // Ensure minimum of 1 for scale
  const yScale = d3.scaleLinear()
    .domain([0, maxVisits])
    .range([height, 0])

  console.log('Visits chart scales:', {
    xDomain: d3.extent(visitsData.value, d => d.date),
    yDomain: [0, maxVisits],
    dataPoints: visitsData.value.length,
    maxVisits,
    sampleYValues: visitsData.value.map(d => ({ visits: d.visits, yPos: yScale(d.visits) }))
  })

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.visits))
    .curve(d3.curveMonotoneX)

  // Add X axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
    .attr("class", "text-primary/60 text-xs")

  // Add Y axis with better formatting and labels
  const yAxis = g.append("g")
    .call(d3.axisLeft(yScale)
      .tickFormat(d3.format("d")) // Integer format
      .ticks(Math.min(5, maxVisits)) // Maximum 5 ticks, or fewer if maxVisits is small
    )
    .attr("class", "text-primary/60 text-xs")
  
  // Add Y axis label
  yAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "rgba(255,182,121, 0.8)")
    .style("font-size", "11px")
    .text("Visits")

  // Add the line
  const pathElement = g.append("path")
    .datum(visitsData.value)
    .attr("fill", "none")
    .attr("stroke", "rgba(255,182,121, 0.8)")
    .attr("stroke-width", 2)
    .attr("d", line)
    
  console.log('Line path d attribute:', pathElement.attr('d'))

  // Add dots
  const dots = g.selectAll(".dot")
    .data(visitsData.value)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.visits))
    .attr("r", 4)
    .attr("fill", "rgba(255,182,121, 0.8)")
    .on("mouseover", function(event, d) {
      // Tooltip on hover
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000")

      tooltip.html(`${d.visits} visits on ${d.date.toLocaleDateString()}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
    })
    .on("mouseout", function() {
      d3.selectAll(".tooltip").remove()
    })
    
  console.log('Number of dots created:', dots.size())
  console.log('Dot positions:', visitsData.value.map((d, i) => ({
    index: i,
    visits: d.visits, 
    x: xScale(d.date),
    y: yScale(d.visits)
  })))
  console.log('Visits chart created successfully')
}

// Create AI requests chart
const createAIChart = () => {
  console.log('Creating AI chart with data:', aiRequestsData.value)
  console.log('AI data length:', aiRequestsData.value.length)
  console.log('First few AI data points:', aiRequestsData.value.slice(0, 3))
  
  // Check if we have data
  if (!aiRequestsData.value || aiRequestsData.value.length === 0) {
    console.warn('No AI requests data available for chart')
    return
  }
  
  // Clear previous chart
  d3.select(aiChart.value).selectAll("*").remove()

  const { margin, width, height } = getChartDimensions()

  const svg = d3.select(aiChart.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(aiRequestsData.value, d => d.date))
    .range([0, width])

  const maxAI = d3.max(aiRequestsData.value, d => d.aiRequests) || 1 // Ensure minimum of 1 for scale
  const yScale = d3.scaleLinear()
    .domain([0, maxAI])
    .range([height, 0])

  console.log('AI chart scales:', {
    xDomain: d3.extent(aiRequestsData.value, d => d.date),
    yDomain: [0, maxAI],
    dataPoints: aiRequestsData.value.length
  })

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.aiRequests))
    .curve(d3.curveMonotoneX)

  // Add X axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
    .attr("class", "text-primary-400/60 text-xs")

  // Add Y axis with better formatting and labels
  const yAxis = g.append("g")
    .call(d3.axisLeft(yScale)
      .tickFormat(d3.format("d")) // Integer format
      .ticks(Math.min(5, maxAI)) // Maximum 5 ticks, or fewer if maxAI is small
    )
    .attr("class", "text-primary-400/60 text-xs")
  
  // Add Y axis label
  yAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "rgba(255,182,121, 0.8)")
    .style("font-size", "11px")
    .text("AI Requests")

  // Add the line
  const pathElement = g.append("path")
    .datum(aiRequestsData.value)
    .attr("fill", "none")
    .attr("stroke", "rgba(255,182,121, 0.8)")
    .attr("stroke-width", 2)
    .attr("d", line)
    
  console.log('AI line path d attribute:', pathElement.attr('d'))

  // Add dots
  const dots = g.selectAll(".dot")
    .data(aiRequestsData.value)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.aiRequests))
    .attr("r", 4)
    .attr("fill", "rgba(255,182,121, 0.8)")
    .on("mouseover", function(event, d) {
      // Tooltip on hover
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000")

      tooltip.html(`${d.aiRequests} AI requests on ${d.date.toLocaleDateString()}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
    })
    .on("mouseout", function() {
      d3.selectAll(".tooltip").remove()
    })
    
  console.log('Number of AI dots created:', dots.size())
  console.log('AI chart created successfully')
}

// Format time for recent activity
const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return time.toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  console.log('VisitorAnalytics mounted, starting initial load...')
  
  // Wait for DOM to be fully ready
  await nextTick()
  
  // Always wait a bit on initial mount to ensure everything is ready
  setTimeout(async () => {
    await loadAnalytics()
    
    // Start auto-refresh if enabled
    if (autoRefresh.value) {
      startAutoRefresh()
    }
  }, 500) // 500ms initial delay on page load
  
  // Listen for AI request completion events to trigger immediate refresh
  const handleAIRequestCompleted = () => {
    console.log('AI request completed, triggering analytics refresh...')
    smartRefresh()
  }
  
  window.addEventListener('ai-request-completed', handleAIRequestCompleted)
  
  // Store cleanup function
  window._cleanupAIListener = () => {
    window.removeEventListener('ai-request-completed', handleAIRequestCompleted)
  }
})

// Watch for visitor ID changes (in case it loads after component mount)
watch(() => visitorStore.visitor.id, (newVisitorId, oldVisitorId) => {
  if (newVisitorId && newVisitorId !== oldVisitorId) {
    console.log('Visitor ID became available, reloading analytics:', newVisitorId)
    loadAnalytics()
  }
}, { immediate: false })

onUnmounted(() => {
  // Clean up auto-refresh interval
  stopAutoRefresh()
  
  // Clean up any tooltips
  d3.selectAll(".tooltip").remove()
  
  // Clean up AI request event listener
  if (window._cleanupAIListener) {
    window._cleanupAIListener()
    delete window._cleanupAIListener
  }
})
</script>

<style scoped>
/* D3 chart styling */
:deep(.tick text) {
  fill: rgba(var(--color-primary), 0.6);
  font-size: 11px;
}

:deep(.tick line) {
  stroke: rgba(var(--color-primary), 0.2);
}

:deep(.domain) {
  stroke: rgba(var(--color-primary), 0.3);
}

.visitor-analytics {
  font-family: inherit;
}
</style>
