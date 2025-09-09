// URL Shortener Service with Advanced Visitor Tracking
import VisitorTrackingService from './VisitorTrackingService.js';
import VisitorAnalyticsService from './VisitorAnalyticsService.js';

class UrlShortenerService {
  constructor() {
    this.baseUrl = window.location.origin;
    this.shortUrlPrefix = '/s/';
  }

  /**
   * Create a shortened URL with tracking
   */
  async createShortUrl(originalUrl, options = {}) {
    try {
      const {
        customCode = null,
        trackingEnabled = true,
        description = '',
        campaignName = '',
        source = '',
        medium = '',
        utmParams = {}
      } = options;

      // Generate short code
      const shortCode = customCode || this.generateShortCode();
      
      // Prepare URL data
      const urlData = {
        shortCode,
        originalUrl,
        createdAt: new Date(),
        createdBy: this.getCurrentUser(),
        trackingEnabled,
        description,
        campaign: {
          name: campaignName,
          source,
          medium,
          utmParams
        },
        clicks: 0,
        visitors: [],
        analytics: {
          totalClicks: 0,
          uniqueVisitors: 0,
          referrers: {},
          locations: {},
          devices: {},
          browsers: {},
          clicksByDate: {}
        }
      };

      // Store in database
      const response = await fetch('/api/url-shortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          urlData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create short URL');
      }

      const result = await response.json();
      
      if (result.success) {
        const shortUrl = `${this.baseUrl}${this.shortUrlPrefix}${shortCode}`;
        
        return {
          success: true,
          shortUrl,
          shortCode,
          originalUrl,
          trackingEnabled,
          analytics: urlData.analytics
        };
      } else {
        throw new Error(result.message || 'Failed to create short URL');
      }

    } catch (error) {
      console.error('Error creating short URL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle click on shortened URL
   */
  async handleShortUrlClick(shortCode, referrer = '') {
    try {
      console.log(`🔗 Short URL clicked: ${shortCode}`);
      
      // Get visitor information from localStorage or create new
      const visitorData = this.getOrCreateVisitorData();
      
      // Get URL data
      const urlResponse = await fetch(`/api/url-shortener?action=get&shortCode=${shortCode}`);
      
      if (!urlResponse.ok) {
        throw new Error('Short URL not found');
      }

      const urlResult = await urlResponse.json();
      
      if (!urlResult.success) {
        throw new Error(urlResult.message || 'Short URL not found');
      }

      const urlData = urlResult.urlData;
      
      // Create click tracking data
      const clickData = {
        shortCode,
        visitorId: visitorData.visitorId,
        sessionId: visitorData.sessionId,
        timestamp: new Date(),
        referrer: referrer || document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        ipAddress: await this.getClientIP(),
        location: await this.getLocationData(),
        device: this.getDeviceInfo(),
        browser: this.getBrowserInfo(),
        utm: this.extractUtmParams(),
        isReturningVisitor: visitorData.isReturning
      };

      // Track the click
      await this.trackClick(shortCode, clickData);
      
      // Update visitor data
      this.updateVisitorData(visitorData, clickData);
      
      // Track in analytics system if enabled
      if (urlData.trackingEnabled) {
        await this.trackInAnalytics(clickData, urlData);
      }

      console.log('🎯 Short URL click tracked successfully');
      
      // Redirect to original URL
      return {
        success: true,
        originalUrl: urlData.originalUrl,
        clickData
      };

    } catch (error) {
      console.error('Error handling short URL click:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get or create visitor data from localStorage
   */
  getOrCreateVisitorData() {
    const STORAGE_KEY = 'tcsn_visitor_data';
    let visitorData = null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        visitorData = JSON.parse(stored);
        
        // Check if session is still valid (24 hours)
        const sessionAge = new Date() - new Date(visitorData.lastActivity);
        const isSessionValid = sessionAge < (24 * 60 * 60 * 1000);
        
        if (isSessionValid) {
          // Returning visitor with valid session
          visitorData.isReturning = true;
          visitorData.visitCount = (visitorData.visitCount || 1) + 1;
          visitorData.lastActivity = new Date();
        } else {
          // Create new session for returning visitor
          visitorData.sessionId = this.generateSessionId();
          visitorData.isReturning = true;
          visitorData.visitCount = (visitorData.visitCount || 1) + 1;
          visitorData.lastActivity = new Date();
          visitorData.sessionStartTime = new Date();
        }
      }
    } catch (error) {
      console.warn('Error reading visitor data from localStorage:', error);
    }

    // Create new visitor if none exists or data is corrupted
    if (!visitorData) {
      visitorData = {
        visitorId: this.generateVisitorId(),
        sessionId: this.generateSessionId(),
        isReturning: false,
        visitCount: 1,
        firstVisit: new Date(),
        lastActivity: new Date(),
        sessionStartTime: new Date(),
        shortUrlClicks: [],
        referrers: [],
        totalClicks: 0
      };
    }

    // Save updated data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
    
    return visitorData;
  }

  /**
   * Update visitor data with new click information
   */
  updateVisitorData(visitorData, clickData) {
    const STORAGE_KEY = 'tcsn_visitor_data';
    
    // Add click to history
    visitorData.shortUrlClicks.push({
      shortCode: clickData.shortCode,
      timestamp: clickData.timestamp,
      referrer: clickData.referrer
    });
    
    // Update referrers
    if (clickData.referrer && clickData.referrer !== 'Direct') {
      if (!visitorData.referrers.includes(clickData.referrer)) {
        visitorData.referrers.push(clickData.referrer);
      }
    }
    
    // Update counters
    visitorData.totalClicks++;
    visitorData.lastActivity = new Date();
    
    // Keep only last 50 clicks to manage storage
    if (visitorData.shortUrlClicks.length > 50) {
      visitorData.shortUrlClicks = visitorData.shortUrlClicks.slice(-50);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
  }

  /**
   * Track click in database
   */
  async trackClick(shortCode, clickData) {
    try {
      const response = await fetch('/api/url-shortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'track_click',
          shortCode,
          clickData
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        console.warn('Failed to track click in database:', result.message);
      }

      return result;

    } catch (error) {
      console.error('Error tracking click:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Track in main analytics system
   */
  async trackInAnalytics(clickData, urlData) {
    try {
      // Track as external referral visit
      await VisitorAnalyticsService.recordEvent('external_referral', clickData.visitorId, clickData.sessionId, {
        shortCode: clickData.shortCode,
        originalUrl: urlData.originalUrl,
        referrer: clickData.referrer,
        campaign: urlData.campaign,
        utm: clickData.utm,
        location: clickData.location,
        device: clickData.device,
        browser: clickData.browser
      });

      console.log('📊 Short URL click tracked in analytics');

    } catch (error) {
      console.warn('Failed to track in analytics system:', error);
    }
  }

  /**
   * Get analytics for a short URL
   */
  async getShortUrlAnalytics(shortCode) {
    try {
      const response = await fetch(`/api/url-shortener?action=analytics&shortCode=${shortCode}`);
      
      if (!response.ok) {
        throw new Error('Failed to get analytics');
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error getting analytics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all short URLs (admin function)
   */
  async listShortUrls(limit = 50) {
    try {
      const response = await fetch(`/api/url-shortener?action=list&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to list URLs');
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error listing URLs:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility methods
  generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateVisitorId() {
    return 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateSessionId() {
    return 'ses_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUser() {
    // Return current user if authenticated, otherwise anonymous
    return 'anonymous';
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  async getLocationData() {
    try {
      const ip = await this.getClientIP();
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      return {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        timezone: data.timezone || 'Unknown'
      };
    } catch (error) {
      return {
        country: 'Unknown',
        countryCode: 'XX',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'Unknown'
      };
    }
  }

  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'Desktop';
    
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad/i.test(userAgent)) {
        deviceType = 'Tablet';
      } else {
        deviceType = 'Mobile';
      }
    }
    
    return {
      type: deviceType,
      userAgent: userAgent,
      platform: navigator.platform || 'Unknown',
      language: navigator.language || 'Unknown'
    };
  }

  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
      version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
      version = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
    }
    
    return {
      name: browser,
      version: version,
      userAgent: userAgent
    };
  }

  extractUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });
    
    return utmParams;
  }

  /**
   * Create a trackable URL with UTM parameters
   */
  createTrackableUrl(originalUrl, utmParams = {}) {
    const url = new URL(originalUrl);
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  }

  /**
   * Generate QR Code URL for short link
   */
  generateQRCode(shortUrl) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/`;
    const params = new URLSearchParams({
      size: '200x200',
      data: shortUrl,
      format: 'png'
    });
    
    return `${qrApiUrl}?${params.toString()}`;
  }
}

export default new UrlShortenerService();
