// Visitor Tracking Service
import NameGenerationService from './NameGenerationService.js';
import { apiCall, API_CONFIG } from './apiConfig.js';

class VisitorTrackingService {
  constructor() {
    this.apiEndpoint = API_CONFIG.ENDPOINTS.VISITORS;
    this.sessionDuration = 30 * 60 * 1000; // 30 minutes
    
    // Throttling to prevent infinite loops
    this.lastTrackingCall = 0;
    this.trackingThrottle = 2000; // 2 seconds between tracking calls
    this.isTracking = false;
  }
  
  // Generate unique visitor ID
  generateVisitorId() {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Generate session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Get or create visitor fingerprint
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Fingerprint test', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.platform,
      navigator.cookieEnabled,
      navigator.javaEnabled()
    ].join('|');
    
    return this.hashString(fingerprint);
  }
  
  // Hash string for fingerprinting
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  
  // Detect browser information
  getBrowserInfo() {
    const ua = navigator.userAgent;
    const browser = this.detectBrowser(ua);
    
    return {
      userAgent: ua,
      browser: browser.name,
      version: browser.version,
      os: this.detectOS(ua),
      device: this.detectDevice(ua),
      mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      language: navigator.language,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      javaEnabled: navigator.javaEnabled(),
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine
    };
  }
  
  detectBrowser(ua) {
    const browsers = [
      { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
      { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
      { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
      { name: 'Edge', regex: /Edge\/([0-9.]+)/ },
      { name: 'Opera', regex: /Opera\/([0-9.]+)/ },
      { name: 'Internet Explorer', regex: /MSIE ([0-9.]+)/ }
    ];
    
    for (const browser of browsers) {
      const match = ua.match(browser.regex);
      if (match) {
        return { name: browser.name, version: match[1] };
      }
    }
    
    return { name: 'Unknown', version: 'Unknown' };
  }
  
  detectOS(ua) {
    const os = [
      { name: 'Windows', regex: /Windows NT ([0-9.]+)/ },
      { name: 'Mac OS', regex: /Mac OS X ([0-9._]+)/ },
      { name: 'Linux', regex: /Linux/ },
      { name: 'Android', regex: /Android ([0-9.]+)/ },
      { name: 'iOS', regex: /OS ([0-9._]+) like Mac OS X/ }
    ];
    
    for (const system of os) {
      const match = ua.match(system.regex);
      if (match) {
        return { name: system.name, version: match[1] || 'Unknown' };
      }
    }
    
    return { name: 'Unknown', version: 'Unknown' };
  }
  
  detectDevice(ua) {
    if (/iPad/.test(ua)) return 'iPad';
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/Android/.test(ua) && /Mobile/.test(ua)) return 'Android Phone';
    if (/Android/.test(ua)) return 'Android Tablet';
    if (/Mobile/.test(ua)) return 'Mobile Device';
    return 'Desktop';
  }
  
  // Get visitor's location (IP-based)
  async getLocationInfo() {
    try {
      // Using ipapi.co for location detection
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org
      };
    } catch (error) {
      console.warn('Location detection failed:', error.message);
      return {
        ip: null,
        country: null,
        region: null,
        city: null,
        latitude: null,
        longitude: null,
        timezone: null,
        isp: null
      };
    }
  }
  
  // Get time of day
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
  
  // Check if visitor exists in localStorage
  getStoredVisitor() {
    try {
      const stored = localStorage.getItem('tcsn_visitor');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Error reading stored visitor:', error.message);
      return null;
    }
  }
  
  // Store visitor in localStorage
  storeVisitor(visitor) {
    try {
      localStorage.setItem('tcsn_visitor', JSON.stringify({
        visitorId: visitor.visitorId,
        sessionId: visitor.sessionId,
        generatedName: visitor.generatedName,
        fallbackName: visitor.fallbackName,
        fingerprint: visitor.fingerprint,
        lastActivity: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Error storing visitor:', error.message);
    }
  }
  
  // Initialize or get existing visitor
  async initializeVisitor() {
    const storedVisitor = this.getStoredVisitor();
    const fingerprint = this.generateFingerprint();
    const browserInfo = this.getBrowserInfo();
    const locationInfo = await this.getLocationInfo();
    const timeOfDay = this.getTimeOfDay();
    
    let visitor;
    let isNewVisitor = true;
    let isNewSession = true;
    
    // Check if we have a stored visitor
    if (storedVisitor && storedVisitor.fingerprint === fingerprint) {
      // Check if session is still valid (within 30 minutes)
      const lastActivity = new Date(storedVisitor.lastActivity);
      const now = new Date();
      const timeDiff = now - lastActivity;
      
      if (timeDiff < this.sessionDuration) {
        // Continue existing session
        isNewVisitor = false;
        isNewSession = false;
        
        visitor = {
          visitorId: storedVisitor.visitorId,
          sessionId: storedVisitor.sessionId,
          generatedName: storedVisitor.generatedName,
          fallbackName: storedVisitor.fallbackName,
          fingerprint: fingerprint,
          browserInfo: browserInfo,
          location: locationInfo,
          isTemporary: true
        };
      } else {
        // New session for existing visitor
        isNewVisitor = false;
        isNewSession = true;
        
        visitor = {
          visitorId: storedVisitor.visitorId,
          sessionId: this.generateSessionId(),
          generatedName: storedVisitor.generatedName,
          fallbackName: storedVisitor.fallbackName,
          fingerprint: fingerprint,
          browserInfo: browserInfo,
          location: locationInfo,
          isTemporary: true
        };
      }
    } else {
      // Completely new visitor
      const visitorId = this.generateVisitorId();
      const sessionId = this.generateSessionId();
      
      // Generate name for new visitor
      const nameContext = {
        location: locationInfo,
        browser: browserInfo,
        timeOfDay: timeOfDay,
        isReturn: false,
        sessionId: sessionId
      };
      
      const nameResult = await NameGenerationService.generateName(nameContext);
      
      visitor = {
        visitorId: visitorId,
        sessionId: sessionId,
        generatedName: nameResult.source === 'ai' ? nameResult.name : null,
        fallbackName: nameResult.source === 'fallback' ? nameResult.name : null,
        fingerprint: fingerprint,
        browserInfo: browserInfo,
        location: locationInfo,
        isTemporary: true,
        currentSession: {
          startTime: new Date(),
          lastActivity: new Date(),
          pageViews: [],
          referrer: document.referrer,
          landingPage: window.location.pathname
        }
      };
    }
    
    // Store visitor data
    this.storeVisitor(visitor);
    
    // Send visitor data to server
    try {
      await this.saveVisitorToDatabase(visitor, isNewVisitor, isNewSession);
    } catch (error) {
      console.warn('Failed to save visitor to database:', error.message);
    }
    
    return {
      visitor,
      isNewVisitor,
      isNewSession
    };
  }
  
  // Save visitor to database
  async saveVisitorToDatabase(visitor, isNewVisitor, isNewSession) {
    try {
      const response = await apiCall(this.apiEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          action: isNewVisitor ? 'create' : 'update',
          visitor: visitor.toObject(),
          isNewSession
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving visitor:', error.message);
      throw error;
    }
  }
  
  // Track page visit
  async trackPageVisit(page, title = null) {
    // Throttle tracking calls to prevent infinite loops
    const now = Date.now();
    if (this.isTracking || (now - this.lastTrackingCall) < this.trackingThrottle) {
      console.log('🚫 Page tracking throttled');
      return;
    }
    
    this.isTracking = true;
    this.lastTrackingCall = now;
    
    try {
      const storedVisitor = this.getStoredVisitor();
      if (!storedVisitor) {
        console.warn('No visitor found for page tracking');
        return;
      }
      
      const pageVisit = {
        visitorId: storedVisitor.visitorId,
        sessionId: storedVisitor.sessionId,
        page: page,
        title: title || document.title,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date()
      };
      
      const response = await apiCall(API_CONFIG.ENDPOINTS.PAGE_VISITS, {
        method: 'POST',
        body: JSON.stringify({
          action: 'create',
          pageVisit: pageVisit
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error tracking page visit:', error.message);
      throw error;
    } finally {
      this.isTracking = false;
    }
  }
  
  // Update visitor activity
  updateActivity() {
    const storedVisitor = this.getStoredVisitor();
    if (storedVisitor) {
      storedVisitor.lastActivity = new Date().toISOString();
      this.storeVisitor(storedVisitor);
    }
  }
  
  // Get current visitor name
  getCurrentVisitorName() {
    const storedVisitor = this.getStoredVisitor();
    if (storedVisitor) {
      return storedVisitor.generatedName || storedVisitor.fallbackName || 'Anonymous Visitor';
    }
    return 'Anonymous Visitor';
  }
}

export default new VisitorTrackingService();
