import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { apiCall, API_CONFIG } from '@/lib/apiConfig.js';
import NameGenerationService from '@/lib/NameGenerationService.js';

export const useVisitorStore = defineStore('visitor', () => {
  // Generate unique visitor ID
  const generateVisitorId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `visitor_${timestamp}_${random}`;
  };

  // Get time of day for name generation
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };
  // Reactive state
  const visitor = reactive({
    id: '',
    name: '',
    generatedName: '',
    fallbackName: '',
    sessionStart: null,
    sessionEnd: null,
    totalTimeSpent: 0,
    visitCount: 0,
    lastVisit: null,
    browserData: {
      userAgent: '',
      language: '',
      languages: [],
      platform: '',
      cookieEnabled: false,
      onLine: false,
      screenWidth: 0,
      screenHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
      colorDepth: 0,
      pixelDepth: 0,
      timezone: '',
      localTime: '',
      doNotTrack: '',
      hardwareConcurrency: 0,
      deviceMemory: 0,
      connectionType: '',
      connectionDownlink: 0,
      connectionEffectiveType: '',
      webgl: {
        vendor: '',
        renderer: ''
      }
    },
    preferences: {
      theme: 'default',
      soundEnabled: true,
      animationsEnabled: true
    },
    interactions: []
  });

  const isReturningVisitor = ref(false);
  const sessionDuration = ref(0);

  // Collect comprehensive browser data
  const collectBrowserData = () => {
    const nav = navigator;
    const screen = window.screen;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    visitor.browserData = {
      userAgent: nav.userAgent,
      language: nav.language,
      languages: nav.languages ? Array.from(nav.languages) : [],
      platform: nav.platform,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localTime: new Date().toISOString(),
      doNotTrack: nav.doNotTrack || 'unspecified',
      hardwareConcurrency: nav.hardwareConcurrency || 0,
      deviceMemory: nav.deviceMemory || 0,
      connectionType: connection?.type || 'unknown',
      connectionDownlink: connection?.downlink || 0,
      connectionEffectiveType: connection?.effectiveType || 'unknown'
    };

    // Collect WebGL info if available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          visitor.browserData.webgl = {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          };
        }
      }
    } catch (e) {
      console.warn('Could not collect WebGL info:', e);
    }
  };

  // Load visitor data from localStorage
  const loadVisitorFromStorage = () => {
    try {
      const stored = localStorage.getItem('tcsn_visitor');
      if (stored) {
        const data = JSON.parse(stored);
        Object.assign(visitor, data);
        isReturningVisitor.value = true;
        visitor.visitCount += 1;
        visitor.lastVisit = new Date().toISOString();
        return true;
      }
    } catch (error) {
      console.error('Error loading visitor from localStorage:', error);
    }
    return false;
  };

  // Save visitor data to localStorage
  const saveVisitorToStorage = () => {
    try {
      const dataToStore = {
        ...visitor,
        sessionEnd: new Date().toISOString()
      };
      localStorage.setItem('tcsn_visitor', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving visitor to localStorage:', error);
    }
  };

  // Initialize visitor session
  const initializeVisitor = async () => {
    visitor.sessionStart = new Date().toISOString();

    // Try to load existing visitor
    if (!loadVisitorFromStorage()) {
      // New visitor - generate name
      visitor.id = generateVisitorId();
      visitor.visitCount = 1;
      visitor.lastVisit = visitor.sessionStart;
      isReturningVisitor.value = false;
      
      // Generate visitor name
      try {
        const nameContext = {
          browser: visitor.browserData,
          timeOfDay: getTimeOfDay(),
          isReturn: false,
          sessionId: 'session_' + Date.now()
        };
        
        const nameResult = await NameGenerationService.generateName(nameContext);
        
        if (nameResult.source === 'ai') {
          visitor.generatedName = nameResult.name;
          visitor.name = nameResult.name;
        } else {
          visitor.fallbackName = nameResult.name;
          visitor.name = nameResult.name;
        }
      } catch (error) {
        console.warn('Failed to generate visitor name:', error);
        visitor.name = 'Anonymous Visitor';
        visitor.fallbackName = 'Anonymous Visitor';
      }
    } else {
      // Existing visitor - use stored name
      visitor.name = visitor.generatedName || visitor.fallbackName || 'Anonymous Visitor';
    }

    // Ensure visitor ID is always set
    if (!visitor.id) {
      visitor.id = generateVisitorId();
    }

    // Always collect fresh browser data
    collectBrowserData();

    // Start session tracking
    startSessionTracking();

    // Save initial state
    saveVisitorToStorage();
  };

  // Set visitor name
  const setVisitorName = async (name) => {
    const previousName = visitor.name;
    visitor.name = name.trim();

    // Add interaction record
    addInteraction('name_set', {
      previousName,
      newName: visitor.name,
      timestamp: new Date().toISOString()
    });

    // Save to localStorage
    saveVisitorToStorage();

    // Save to database
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.VISITOR_NAME, {
        method: 'POST',
        body: JSON.stringify({
          visitorId: visitor.id,
          name: visitor.name,
          browserData: visitor.browserData,
          visitCount: visitor.visitCount,
          isReturningVisitor: isReturningVisitor.value
        })
      });

      if (!response.ok) {
        console.error('Failed to save visitor name to database');
      }
    } catch (error) {
      console.error('Error saving visitor name to database:', error);
    }
  };

  // Add interaction tracking
  const addInteraction = async (type, data = {}) => {
    const interaction = {
      type,
      timestamp: new Date().toISOString(),
      sessionTime: getSessionDuration(),
      data
    };

    visitor.interactions.push(interaction);

    // Keep only last 100 interactions in memory
    if (visitor.interactions.length > 100) {
      visitor.interactions = visitor.interactions.slice(-100);
    }

    saveVisitorToStorage();
  };

  // Track page visit
  const trackPageVisit = async (path, title = '') => {
    try {
      // Add to local interactions
      await addInteraction('page_visit', {
        page: path,
        title: title,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });

      // Send to server for analytics
      const response = await apiCall('/visitors/track', {
        method: 'POST',
        body: JSON.stringify({
          visitorId: visitor.id,
          sessionId: 'session_' + Date.now(), // Generate session ID
          page: path,
          title: title,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.success) {
        console.warn('Failed to track page visit:', response.error);
      }
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  };

  // Session tracking
  let sessionInterval = null;
  let sessionStartTime = Date.now();

  const startSessionTracking = () => {
    sessionStartTime = Date.now();

    // Update session duration every second
    sessionInterval = setInterval(() => {
      sessionDuration.value = Math.floor((Date.now() - sessionStartTime) / 1000);
    }, 1000);

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        addInteraction('page_hidden');
      } else {
        addInteraction('page_visible');
      }
    });

    // Track beforeunload to save final session data
    window.addEventListener('beforeunload', () => {
      endSession();
    });
  };

  const endSession = () => {
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }

    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    visitor.totalTimeSpent += sessionTime;
    visitor.sessionEnd = new Date().toISOString();

    addInteraction('session_end', {
      sessionDuration: sessionTime,
      totalTimeSpent: visitor.totalTimeSpent
    });

    saveVisitorToStorage();
  };

  // Get session duration in seconds
  const getSessionDuration = () => {
    return Math.floor((Date.now() - sessionStartTime) / 1000);
  };

  // Computed properties
  const displayName = computed(() => {
    return visitor.generatedName || visitor.fallbackName || visitor.name || 'guest';
  });
  const promptText = computed(() => {
    return `${displayName.value}@root:~$`;
  });
  const sessionTimeFormatted = computed(() => {
    const duration = sessionDuration.value;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  });

  const totalTimeFormatted = computed(() => {
    const total = visitor.totalTimeSpent;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  });

  // Get visitor summary for analytics
  const getVisitorSummary = () => {
    return {
      id: visitor.id,
      name: visitor.name,
      isReturningVisitor: isReturningVisitor.value,
      visitCount: visitor.visitCount,
      sessionDuration: getSessionDuration(),
      totalTimeSpent: visitor.totalTimeSpent,
      interactionCount: visitor.interactions.length,
      browserData: visitor.browserData,
      lastVisit: visitor.lastVisit
    };
  };

  // Clear visitor data (for testing or reset)
  const clearVisitorData = () => {
    localStorage.removeItem('tcsn_visitor');
    visitor.id = '';
    visitor.name = '';
    visitor.interactions = [];
    visitor.visitCount = 0;
    visitor.totalTimeSpent = 0;
    isReturningVisitor.value = false;
  };

  return {
    // State
    visitor,
    isReturningVisitor,
    sessionDuration,

    // Actions
    initializeVisitor,
    setVisitorName,
    addInteraction,
    trackPageVisit,
    endSession,
    clearVisitorData,

    // Computed
    displayName,
    promptText,
    sessionTimeFormatted,
    totalTimeFormatted,

    // Getters
    getSessionDuration,
    getVisitorSummary
  };
});
