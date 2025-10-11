# 📚 TCSN.io API Documentation

**Base URL**: `https://api.tcsn.io`  
**Version**: 1.0.0  
**Last Updated**: October 8, 2025

---

## 📍 Quick Reference

All endpoints are accessible without `/api/` prefix:

```
GET  /                      → API info & health check
GET  /auth                  → Authentication endpoints
GET  /visitors              → Visitor tracking endpoints
GET  /analytics             → Analytics endpoints
GET  /projects              → Projects endpoints
```

---

## 🔐 Authentication

### GET /auth
List all authentication endpoints

**Response**:
```json
{
  "success": true,
  "message": "Authentication API endpoints",
  "endpoints": [...],
  "actions": {
    "google-login": "Google OAuth authentication",
    "verify-token": "Verify existing JWT token",
    "logout": "End user session"
  }
}
```

### POST /auth (action: google-login)
Authenticate with Google OAuth

**Request**:
```json
{
  "action": "google-login",
  "idToken": "google_id_token"
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "isAdmin": true,
    "picture": "https://..."
  }
}
```

### POST /auth (action: verify-token)
Verify JWT token

**Request**:
```json
{
  "action": "verify-token",
  "token": "jwt_token"
}
```

**Response** (200):
```json
{
  "success": true,
  "valid": true,
  "user": {...}
}
```

### POST /auth (action: logout)
Logout user

**Request**:
```json
{
  "action": "logout"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/login
Email/password login

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response** (200):
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /auth/register
Register new user

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password",
  "name": "User Name"
}
```

**Response** (201):
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## 👥 Visitors

### GET /visitors
List visitor tracking endpoints

**Response**:
```json
{
  "success": true,
  "message": "Visitor API endpoints",
  "endpoints": [
    "GET /visitors - This endpoint",
    "POST /visitors/track - Track page visit",
    "GET /visitors/analytics - Get visitor analytics",
    "POST /visitors/name - Generate visitor name",
    "GET /visitors/get?visitorId=xxx - Get visitor details",
    "POST /visitors/interaction - Track visitor interaction"
  ]
}
```

### POST /visitors/track
Track a page visit

**Request**:
```json
{
  "page": "/home",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "timestamp": "2025-10-08T12:00:00Z",
  "sessionId": "session_id",
  "visitorId": "visitor_id",
  "country": "US",
  "city": "New York"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Visit tracked"
}
```

### GET /visitors/analytics
Get visitor analytics

**Query Parameters**:
- `days` (optional): Number of days to analyze (default: 30)

**Response** (200):
```json
{
  "totalVisitors": 1234,
  "uniqueVisitors": 567,
  "pageViews": 5678,
  "avgSessionDuration": 180,
  "topPages": [
    {"page": "/home", "views": 123},
    {"page": "/about", "views": 89}
  ],
  "topCountries": [
    {"country": "US", "visitors": 456},
    {"country": "UK", "visitors": 123}
  ]
}
```

### POST /visitors/name
Generate a unique visitor name

**Request**:
```json
{
  "visitorId": "visitor_id"
}
```

**Response** (200):
```json
{
  "success": true,
  "name": "Cosmic Wanderer",
  "visitorId": "visitor_id"
}
```

### GET /visitors/get
Get visitor details

**Query Parameters**:
- `visitorId` (required): Visitor ID to retrieve

**Response** (200):
```json
{
  "success": true,
  "visitor": {
    "id": "visitor_id",
    "name": "Cosmic Wanderer",
    "firstVisit": "2025-10-01T12:00:00Z",
    "lastVisit": "2025-10-08T12:00:00Z",
    "totalVisits": 15,
    "country": "US",
    "city": "New York"
  }
}
```

### POST /visitors/interaction
Track visitor interaction

**Request**:
```json
{
  "visitorId": "visitor_id",
  "type": "click",
  "element": "button",
  "page": "/home",
  "timestamp": "2025-10-08T12:00:00Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Interaction tracked"
}
```

---

## 📊 Analytics

### GET /analytics
List analytics endpoints

**Response**:
```json
{
  "success": true,
  "message": "Analytics API endpoints",
  "endpoints": [
    "GET /analytics - This endpoint",
    "GET /analytics/site?days=30 - Get site analytics",
    "GET /analytics/realtime - Get real-time analytics"
  ]
}
```

### GET /analytics/site
Get comprehensive site analytics

**Query Parameters**:
- `days` (optional): Number of days (default: 30)

**Response** (200):
```json
{
  "dailyViews": [
    {
      "date": "2025-10-08",
      "views": 123,
      "unique_visitors": 45
    }
  ],
  "topPages": [
    {
      "page": "/home",
      "views": 456,
      "unique_visitors": 123
    }
  ],
  "topCountries": [
    {
      "country": "US",
      "views": 789,
      "unique_visitors": 234
    }
  ],
  "topReferrers": [
    {
      "referrer": "https://google.com",
      "views": 345
    }
  ]
}
```

### GET /analytics/realtime
Get real-time analytics

**Response** (200):
```json
{
  "activeVisitors": 23,
  "activePages": [
    {"page": "/home", "visitors": 12},
    {"page": "/about", "visitors": 11}
  ],
  "recentEvents": [
    {
      "type": "pageview",
      "page": "/home",
      "timestamp": "2025-10-08T12:00:00Z",
      "visitorId": "visitor_id"
    }
  ]
}
```

---

## 🎨 Projects

### GET /projects
Get all projects

**Response** (200):
```json
[
  {
    "id": 1,
    "title": "Project Name",
    "description": "Project description",
    "image": "https://...",
    "url": "https://...",
    "tags": ["vue", "javascript"],
    "featured": true,
    "created_at": "2025-10-08T12:00:00Z"
  }
]
```

### GET /projects/:id
Get single project by ID

**Response** (200):
```json
{
  "id": 1,
  "title": "Project Name",
  "description": "Project description",
  "image": "https://...",
  "url": "https://...",
  "tags": ["vue", "javascript"],
  "featured": true,
  "created_at": "2025-10-08T12:00:00Z"
}
```

---

## 🔧 Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request",
  "details": "Specific error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication"
}
```

### 404 Not Found
```json
{
  "error": "Endpoint not found",
  "path": "/requested/path",
  "availableEndpoints": [...]
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Error description"
}
```

---

## 🌐 CORS

All endpoints support CORS with the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🔑 Authentication

Most endpoints don't require authentication, but admin-only endpoints require:

**Header**:
```
Authorization: Bearer <jwt_token>
```

Or for action-based endpoints:
```json
{
  "token": "jwt_token"
}
```

---

## 📈 Rate Limiting

Currently no rate limiting is enforced. This may be added in future versions.

---

## 🧪 Testing

### Test API Root
```bash
curl https://api.tcsn.io/
```

### Test Authentication
```bash
curl https://api.tcsn.io/auth
```

### Test Analytics
```bash
curl https://api.tcsn.io/analytics/site
```

### Test Projects
```bash
curl https://api.tcsn.io/projects
```

---

## 📝 Response Format

All JSON responses follow this pattern:

**Success**:
```json
{
  "success": true,
  "data": {...}
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional info"
}
```

---

## 🚀 Status

✅ **All endpoints operational**  
✅ **No `/api/` prefix required**  
✅ **CORS enabled**  
✅ **D1 database connected**  
✅ **KV cache connected**  

**Base URL**: https://api.tcsn.io  
**Worker Version**: e868d23e-832c-49cd-9760-1479b2bb2a1a  
**Environment**: Production

---

## 📚 Additional Documentation

- `AUTHENTICATION_DOCS.md` - Detailed authentication guide
- `ADMIN_README.md` - Admin system documentation
- `COMPLETE_MIGRATION.md` - Migration summary

**Last Updated**: October 8, 2025
