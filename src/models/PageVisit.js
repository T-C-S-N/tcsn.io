// PageVisit model for tracking user visits
class PageVisit {
  constructor(data) {
    this._id = data._id;
    this.sessionId = data.sessionId; // Unique session identifier
    this.userId = data.userId || null; // If user is logged in
    this.page = data.page; // Current page path
    this.title = data.title; // Page title
    this.referrer = data.referrer; // Where they came from
    this.timestamp = data.timestamp || new Date();
    
    // Browser information
    this.browser = {
      userAgent: data.browser?.userAgent,
      name: data.browser?.name,
      version: data.browser?.version,
      platform: data.browser?.platform,
      language: data.browser?.language,
      cookieEnabled: data.browser?.cookieEnabled,
      javaEnabled: data.browser?.javaEnabled,
      screen: {
        width: data.browser?.screen?.width,
        height: data.browser?.screen?.height,
        colorDepth: data.browser?.screen?.colorDepth,
        pixelRatio: data.browser?.screen?.pixelRatio
      },
      viewport: {
        width: data.browser?.viewport?.width,
        height: data.browser?.viewport?.height
      },
      timezone: data.browser?.timezone,
      onlineStatus: data.browser?.onlineStatus
    };
    
    // Location information
    this.location = {
      ip: data.location?.ip,
      country: data.location?.country,
      region: data.location?.region,
      city: data.location?.city,
      latitude: data.location?.latitude,
      longitude: data.location?.longitude,
      timezone: data.location?.timezone,
      isp: data.location?.isp,
      coordinates: data.location?.coordinates || null // [longitude, latitude] for MongoDB geospatial queries
    };
    
    // Performance data
    this.performance = {
      loadTime: data.performance?.loadTime,
      domContentLoaded: data.performance?.domContentLoaded,
      firstPaint: data.performance?.firstPaint,
      firstContentfulPaint: data.performance?.firstContentfulPaint
    };
    
    // Additional tracking data
    this.duration = data.duration || 0; // Time spent on page (updated on page leave)
    this.interactions = data.interactions || 0; // Click/scroll count
    this.isBot = data.isBot || false; // Bot detection
    this.isReturningVisitor = data.isReturningVisitor || false;
  }
  
  // Convert to MongoDB document
  toDocument() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      page: this.page,
      title: this.title,
      referrer: this.referrer,
      timestamp: this.timestamp,
      browser: this.browser,
      location: this.location,
      performance: this.performance,
      duration: this.duration,
      interactions: this.interactions,
      isBot: this.isBot,
      isReturningVisitor: this.isReturningVisitor
    };
  }
}

export default PageVisit;
