// API Configuration for development and production
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Get the API base URL based on environment
const getBaseUrl = () => {
  // Use environment variable if available
  const envApiUrl = import.meta.env.VITE_API_URL
  if (envApiUrl) {
    return envApiUrl
  }
  
  if (isDevelopment) {
    return 'http://localhost:8787'
  }
  
  if (isProduction) {
    // In production, use the custom domain
    return 'https://api.tcsn.io'
  }
  
  // Fallback for unknown environments
  return ''
}

export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: getBaseUrl(),
  
  // API endpoints
  ENDPOINTS: {
    VISITORS: '/visitors',
    VISITOR_NAME: '/visitors/name',
    VISITOR_GET: '/visitors/get',
    VISITOR_INTERACTION: '/visitors/interaction',
    VISITOR_ANALYTICS: '/visitor-analytics',
    PAGE_VISITS: '/page-visits'
  }
}

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function for API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint)
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}
