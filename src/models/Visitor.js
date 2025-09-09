// Visitor model for temporary users and page tracking
export class Visitor {
  constructor(data = {}) {
    this._id = data._id;
    this.visitorId = data.visitorId; // Unique identifier for the visitor
    this.sessionId = data.sessionId; // Current session ID
    this.isTemporary = data.isTemporary !== undefined ? data.isTemporary : true;
    this.generatedName = data.generatedName || null;
    this.fallbackName = data.fallbackName || null;
    this.actualName = data.actualName || null;
    this.email = data.email || null;
    this.role = data.role || 'visitor';
    
    // Browser & Device Information
    this.browserInfo = {
      userAgent: data.browserInfo?.userAgent || null,
      browser: data.browserInfo?.browser || null,
      version: data.browserInfo?.version || null,
      os: data.browserInfo?.os || null,
      device: data.browserInfo?.device || null,
      mobile: data.browserInfo?.mobile || false,
      screen: data.browserInfo?.screen || null,
      language: data.browserInfo?.language || null,
      timezone: data.browserInfo?.timezone || null,
      cookiesEnabled: data.browserInfo?.cookiesEnabled || false,
      javaEnabled: data.browserInfo?.javaEnabled || false
    };
    
    // Location Information
    this.location = {
      ip: data.location?.ip || null,
      country: data.location?.country || null,
      region: data.location?.region || null,
      city: data.location?.city || null,
      latitude: data.location?.latitude || null,
      longitude: data.location?.longitude || null,
      timezone: data.location?.timezone || null,
      isp: data.location?.isp || null
    };
    
    // Visit Information
    this.firstVisit = data.firstVisit || new Date();
    this.lastVisit = data.lastVisit || new Date();
    this.totalVisits = data.totalVisits || 1;
    this.totalPageViews = data.totalPageViews || 0;
    this.totalTimeSpent = data.totalTimeSpent || 0; // in seconds
    
    // Current Session
    this.currentSession = {
      startTime: data.currentSession?.startTime || new Date(),
      lastActivity: data.currentSession?.lastActivity || new Date(),
      pageViews: data.currentSession?.pageViews || [],
      referrer: data.currentSession?.referrer || null,
      landingPage: data.currentSession?.landingPage || null,
      exitPage: data.currentSession?.exitPage || null,
      duration: data.currentSession?.duration || 0
    };
    
    // Tracking
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastIp = data.lastIp || null;
    this.fingerprint = data.fingerprint || null;
  }
  
  // Convert to plain object for database storage
  toObject() {
    return {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      isTemporary: this.isTemporary,
      generatedName: this.generatedName,
      fallbackName: this.fallbackName,
      actualName: this.actualName,
      email: this.email,
      role: this.role,
      browserInfo: this.browserInfo,
      location: this.location,
      firstVisit: this.firstVisit,
      lastVisit: this.lastVisit,
      totalVisits: this.totalVisits,
      totalPageViews: this.totalPageViews,
      totalTimeSpent: this.totalTimeSpent,
      currentSession: this.currentSession,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastIp: this.lastIp,
      fingerprint: this.fingerprint
    };
  }
}

export class PageVisit {
  constructor(data = {}) {
    this._id = data._id;
    this.visitorId = data.visitorId; // Reference to visitor
    this.sessionId = data.sessionId;
    this.page = data.page || null;
    this.title = data.title || null;
    this.url = data.url || null;
    this.referrer = data.referrer || null;
    this.timestamp = data.timestamp || new Date();
    this.duration = data.duration || 0; // Time spent on page in seconds
    this.scrollDepth = data.scrollDepth || 0; // Percentage scrolled
    this.clicks = data.clicks || 0;
    this.interactions = data.interactions || [];
    this.exitPage = data.exitPage || false;
    this.bounced = data.bounced || false;
  }
  
  toObject() {
    return {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      page: this.page,
      title: this.title,
      url: this.url,
      referrer: this.referrer,
      timestamp: this.timestamp,
      duration: this.duration,
      scrollDepth: this.scrollDepth,
      clicks: this.clicks,
      interactions: this.interactions,
      exitPage: this.exitPage,
      bounced: this.bounced
    };
  }
}
