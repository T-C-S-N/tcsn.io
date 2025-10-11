// Vue composable for visitor tracking
import { ref, onMounted, onUnmounted } from 'vue';
import VisitorTrackingService from '../lib/VisitorTrackingService.js';
import VisitorAnalyticsService from '../lib/VisitorAnalyticsService.js';

export function useVisitorTracking() {
  const visitor = ref(null);
  const visitorName = ref('Anonymous Visitor');
  const isNewVisitor = ref(false);
  const isNewSession = ref(false);
  const isLoading = ref(true);
  const error = ref(null);
  
  let activityInterval = null;
  let analyticsInitialized = false;
  
  // Initialize visitor tracking
  const initializeTracking = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const result = await VisitorTrackingService.initializeVisitor();
      
      visitor.value = result.visitor;
      isNewVisitor.value = result.isNewVisitor;
      isNewSession.value = result.isNewSession;
      visitorName.value = result.visitor.generatedName || 
                         result.visitor.fallbackName || 
                         'Anonymous Visitor';
      
      // Initialize comprehensive analytics
      if (!analyticsInitialized && visitor.value) {
        await VisitorAnalyticsService.initializeAnalytics(
          visitor.value.visitorId,
          visitor.value.sessionId
        );
        analyticsInitialized = true;
      }
      
      // Note: Page tracking is handled by the router
      // Don't track current page here to avoid duplication
      
      // Set up activity tracking
      startActivityTracking();
      
      //console.log('🎯 Visitor tracking initialized:', {
      //  name: visitorName.value,
      //  isNew: isNewVisitor.value,
      //  newSession: isNewSession.value,
      //  analyticsEnabled: analyticsInitialized
      //});
      
    } catch (err) {
      error.value = err.message;
      console.error('Visitor tracking failed:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Track current page visit
  const trackCurrentPage = async () => {
    try {
      const path = window.location.pathname;
      const title = document.title;
      await VisitorTrackingService.trackPageVisit(path, title);
    } catch (err) {
      console.error('Page tracking failed:', err.message);
    }
  };
  
  // Track page navigation
  const trackPageChange = async (to, from) => {
    try {
      await VisitorTrackingService.trackPageVisit(to.path, to.meta?.title);
      //console.log('📄 Page tracked:', to.path);
    } catch (err) {
      console.error('Page change tracking failed:', err.message);
    }
  };
  
  // Start activity tracking
  const startActivityTracking = () => {
    // Update activity every 60 seconds (increased from 30)
    activityInterval = setInterval(() => {
      VisitorTrackingService.updateActivity();
    }, 60000);
    
    // Track activity on user interactions (throttled)
    let lastActivityUpdate = 0;
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate > 30000) { // Only update every 30 seconds
        VisitorTrackingService.updateActivity();
        lastActivityUpdate = now;
      }
    };
    
    const events = ['click', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  };
  
  // Stop activity tracking
  const stopActivityTracking = () => {
    if (activityInterval) {
      clearInterval(activityInterval);
      activityInterval = null;
    }
  };
  
  // Get visitor greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening';
    else timeGreeting = 'Good night';
    
    const name = visitorName.value;
    
    if (isNewVisitor.value) {
      return `${timeGreeting}, ${name}! Welcome to TCSN.io! 👋`;
    } else if (isNewSession.value) {
      return `${timeGreeting}, ${name}! Welcome back! 🎉`;
    } else {
      return `${timeGreeting}, ${name}! 😊`;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    initializeTracking();
  });
  
  onUnmounted(() => {
    stopActivityTracking();
    
    // Cleanup analytics tracking
    if (analyticsInitialized) {
      VisitorAnalyticsService.cleanup();
    }
  });
  
  return {
    // State
    visitor,
    visitorName,
    isNewVisitor,
    isNewSession,
    isLoading,
    error,
    
    // Methods
    initializeTracking,
    trackPageChange,
    getGreeting,
    startActivityTracking,
    stopActivityTracking,
    
    // New analytics methods
    getVisitorAnalytics: () => VisitorAnalyticsService,
    getVisitorId: () => visitor.value?.visitorId,
    getSessionId: () => visitor.value?.sessionId
  };
}
