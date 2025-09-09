// Enhanced Analytics Service for visitor behavior tracking
class VisitorAnalyticsService {
  constructor() {
    this.sessionHeartbeat = 30000; // 30 seconds
    this.departureThreshold = 60000; // 1 minute of inactivity = departure
    this.heartbeatInterval = null;
    this.beforeUnloadHandler = null;
    this.visibilityChangeHandler = null;
    this.idleTimer = null;
    
    // Track page interactions
    this.interactions = [];
    this.scrollDepth = 0;
    this.timeOnPage = 0;
    this.pageStartTime = Date.now();
  }

  // Initialize comprehensive visitor analytics
  async initializeAnalytics(visitorId, sessionId) {
    console.log('🔬 Initializing visitor analytics for:', visitorId);
    
    // Record visitor arrival
    await this.recordEvent('visitor_arrival', {
      visitorId,
      sessionId,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    });

    // Set up departure detection
    this.setupDepartureDetection(visitorId, sessionId);
    
    // Set up page interaction tracking
    this.setupPageInteractionTracking(visitorId, sessionId);
    
    // Set up heartbeat for activity tracking
    this.startHeartbeat(visitorId, sessionId);
  }

  // Set up departure detection mechanisms
  setupDepartureDetection(visitorId, sessionId) {
    // Method 1: beforeunload event (when user closes tab/navigates away)
    this.beforeUnloadHandler = async (event) => {
      await this.recordDeparture(visitorId, sessionId, 'beforeunload');
    };
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    // Method 2: visibility change (when user switches tabs)
    this.visibilityChangeHandler = async () => {
      if (document.hidden) {
        await this.recordEvent('tab_hidden', {
          visitorId,
          sessionId,
          timestamp: new Date(),
          page: window.location.pathname
        });
      } else {
        await this.recordEvent('tab_visible', {
          visitorId,
          sessionId,
          timestamp: new Date(),
          page: window.location.pathname
        });
      }
    };
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);

    // Method 3: idle detection (no activity for threshold period)
    this.setupIdleDetection(visitorId, sessionId);
  }

  // Set up idle detection
  setupIdleDetection(visitorId, sessionId) {
    const resetIdleTimer = () => {
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }
      
      this.idleTimer = setTimeout(async () => {
        await this.recordDeparture(visitorId, sessionId, 'idle_timeout');
      }, this.departureThreshold);
    };

    // Reset idle timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    // Initial timer setup
    resetIdleTimer();
  }

  // Record visitor departure
  async recordDeparture(visitorId, sessionId, reason) {
    const departureData = {
      visitorId,
      sessionId,
      timestamp: new Date(),
      reason, // 'beforeunload', 'idle_timeout', 'manual'
      page: window.location.pathname,
      timeOnPage: Date.now() - this.pageStartTime,
      scrollDepth: this.scrollDepth,
      interactions: this.interactions.length,
      sessionDuration: await this.getSessionDuration(sessionId)
    };

    console.log('👋 Recording visitor departure:', departureData);
    
    await this.recordEvent('visitor_departure', departureData);
    
    // Send final session summary
    await this.sendSessionSummary(visitorId, sessionId);
  }

  // Set up page interaction tracking
  setupPageInteractionTracking(visitorId, sessionId) {
    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = maxScroll;
        
        // Record milestone scrolls
        if (maxScroll > 0 && maxScroll % 25 === 0) {
          this.recordInteraction('scroll_milestone', {
            visitorId,
            sessionId,
            scrollPercent: maxScroll,
            page: window.location.pathname
          });
        }
      }
    };
    window.addEventListener('scroll', trackScroll);

    // Track clicks
    const trackClick = (event) => {
      this.recordInteraction('click', {
        visitorId,
        sessionId,
        element: event.target.tagName,
        elementId: event.target.id,
        elementClass: event.target.className,
        text: event.target.textContent?.substring(0, 50),
        page: window.location.pathname,
        x: event.clientX,
        y: event.clientY
      });
    };
    document.addEventListener('click', trackClick);

    // Track form interactions
    const trackFormInteraction = (event) => {
      this.recordInteraction('form_interaction', {
        visitorId,
        sessionId,
        formId: event.target.form?.id,
        fieldName: event.target.name,
        fieldType: event.target.type,
        page: window.location.pathname
      });
    };
    document.addEventListener('input', trackFormInteraction);
    document.addEventListener('change', trackFormInteraction);
  }

  // Record individual interaction
  async recordInteraction(type, data) {
    const interaction = {
      type,
      timestamp: new Date(),
      ...data
    };
    
    this.interactions.push(interaction);
    
    // Send interaction to server (batched)
    if (this.interactions.length >= 10) {
      await this.flushInteractions();
    }
  }

  // Flush interactions to server
  async flushInteractions() {
    if (this.interactions.length === 0) return;
    
    try {
      await fetch('/api/visitor-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_create',
          interactions: this.interactions
        })
      });
      
      this.interactions = [];
    } catch (error) {
      console.error('Failed to flush interactions:', error);
    }
  }

  // Start heartbeat for session activity
  startHeartbeat(visitorId, sessionId) {
    this.heartbeatInterval = setInterval(async () => {
      if (!document.hidden) {
        await this.recordEvent('heartbeat', {
          visitorId,
          sessionId,
          timestamp: new Date(),
          page: window.location.pathname,
          timeOnPage: Date.now() - this.pageStartTime,
          scrollDepth: this.scrollDepth
        });
      }
    }, this.sessionHeartbeat);
  }

  // Record analytics event
  async recordEvent(eventType, data) {
    try {
      const response = await fetch('/api/visitor-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          eventType,
          data
        })
      });
      
      if (!response.ok) {
        throw new Error(`Analytics error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to record analytics event:', error);
    }
  }

  // Get session duration
  async getSessionDuration(sessionId) {
    try {
      const response = await fetch(`/api/visitor-analytics?action=session_duration&sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        return data.duration;
      }
    } catch (error) {
      console.error('Failed to get session duration:', error);
    }
    return 0;
  }

  // Send session summary
  async sendSessionSummary(visitorId, sessionId) {
    const summary = {
      visitorId,
      sessionId,
      totalTimeOnSite: Date.now() - this.pageStartTime,
      maxScrollDepth: this.scrollDepth,
      totalInteractions: this.interactions.length,
      pagesVisited: await this.getPagesVisited(sessionId),
      timestamp: new Date()
    };

    await this.recordEvent('session_summary', summary);
  }

  // Get pages visited in session
  async getPagesVisited(sessionId) {
    try {
      const response = await fetch(`/api/visitor-analytics?action=pages_visited&sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        return data.pages;
      }
    } catch (error) {
      console.error('Failed to get pages visited:', error);
    }
    return [];
  }

  // Page change handler (called by router)
  onPageChange(to, from, visitorId, sessionId) {
    // Record time spent on previous page
    if (from && this.pageStartTime) {
      const timeOnPreviousPage = Date.now() - this.pageStartTime;
      this.recordEvent('page_exit', {
        visitorId,
        sessionId,
        page: from.path,
        timeOnPage: timeOnPreviousPage,
        scrollDepth: this.scrollDepth,
        interactions: this.interactions.length,
        timestamp: new Date()
      });
    }

    // Reset page-specific tracking
    this.pageStartTime = Date.now();
    this.scrollDepth = 0;
    this.interactions = [];

    // Record page entry
    this.recordEvent('page_entry', {
      visitorId,
      sessionId,
      page: to.path,
      title: to.meta?.title || document.title,
      referrer: from?.path || document.referrer,
      timestamp: new Date()
    });
  }

  // Cleanup when visitor leaves
  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
    
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    
    // Flush any remaining interactions
    this.flushInteractions();
  }
}

export default new VisitorAnalyticsService();
