# TCSN.io Admin Authentication System

## Overview
Complete Google OAuth authentication system for admin access to TCSN.io with visitor tracking and analytics.

## 🔐 Admin Authentication Features

### Login System
- **Google OAuth 2.0**: Secure login with Google accounts only
- **JWT Tokens**: Secure session management with HTTP-only cookies
- **Admin Authorization**: Only tomas@tcsn.io has admin access
- **Auto-Redirect**: Non-admin users are automatically redirected
- **Session Persistence**: Login state persists across browser sessions

### Security Features
- **Token Verification**: Server-side JWT validation
- **MongoDB Integration**: User data stored securely in MongoDB
- **Role-Based Access**: Admin-only routes and functionality
- **Cookie Security**: HTTP-only cookies prevent XSS attacks
- **Google API Integration**: Leverages Google's secure authentication

## 🌐 Routes

### Public Routes
- `/` - Home page
- `/contact` - Contact page
- `/projects` - Projects gallery
- `/visitor-demo` - Visitor tracking demo
- `/visitor-dashboard` - Public visitor analytics

### Admin Routes (Protected)
- `/admin/login` - Google OAuth login page
- `/admin` - Admin dashboard with analytics and controls

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Admin Login
Navigate to: `http://localhost:3001/admin/login`

### 3. Login with Google
- Click "Sign in with Google" button
- Use tomas@tcsn.io Google account
- You'll be redirected to admin dashboard

### 4. Admin Dashboard Features
- **System Overview**: Real-time visitor statistics
- **Admin Tools**: Access to visitor analytics and tracking demo
- **Recent Activity**: Log of admin actions and system events
- **Quick Actions**: Export data, view system info, manage visitors

## 🛠️ Technical Implementation

### Backend Services
- **Cloudflare D1**: User storage and data persistence
- **Cloudflare Workers**: Serverless API endpoints
- **Google OAuth**: Authentication service
- **JWT**: Token management for sessions

### Frontend Components
- **Auth.vue**: Google Sign-In interface (in `/src/views/admin/`)
- **Dashboard.vue**: Complete admin control panel (in `/src/views/admin/`)
- **useGoogleAuth.js**: Vue composable for authentication
- **apiConfig.js**: API configuration and utilities

### API Endpoints
- `GET /auth` - List authentication endpoints
- `POST /auth (action: google-login)` - Google OAuth login
- `POST /auth (action: verify-token)` - Session verification
- `POST /auth (action: logout)` - User logout
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `POST /visitors` - Visitor tracking and analytics
- `GET /projects` - Project data
- `GET /analytics/*` - Analytics endpoints

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_URL=https://api.tcsn.io

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Worker Environment (Cloudflare)
JWT_SECRET=your_jwt_secret
ENVIRONMENT=production
```

### Admin Authorization
Only the following email has admin access:
- `tomas@tcsn.io`

To add more admins, update the authorization check in:
- `/workers/src/routes/auth.js` (line with `email === 'tomas@tcsn.io'`)

## 📊 Analytics & Tracking

### Visitor Tracking
- **Automatic**: Every page visit is tracked
- **AI Names**: Visitors get AI-generated names
- **Browser Data**: User agent, screen resolution, referrer
- **Location**: IP-based location detection
- **Session Management**: Unique visitor identification

### Admin Analytics
- **Total Visitors**: Lifetime visitor count
- **Page Views**: Total page view analytics
- **Today's Visitors**: Daily visitor tracking
- **Active Users**: Real-time user monitoring

## 🔒 Security Best Practices

### Authentication
- Google OAuth prevents password vulnerabilities
- JWT tokens expire automatically
- Server-side token verification
- MongoDB password hashing (if applicable)

### Data Protection
- Environment variables for sensitive data
- HTTP-only cookies prevent client-side access
- CORS configuration for API security
- Input validation on all endpoints

## 🐛 Troubleshooting

### Common Issues
1. **Google Sign-In Not Working**
   - Check VITE_GOOGLE_CLIENT_ID in .env
   - Verify Google OAuth client configuration
   - Ensure localhost:3001 is in authorized origins

2. **Admin Access Denied**
   - Verify you're using tomas@tcsn.io
   - Check MongoDB connection
   - Verify JWT_SECRET is set

3. **Visitor Tracking Not Working**
   - Check MongoDB connection
   - Verify OpenAI API key
   - Check browser console for errors

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 📝 Development Notes

### Architecture
- **Frontend**: Vue 3 + Vite + Pinia
- **Backend**: Cloudflare Workers (Serverless)
- **Database**: Cloudflare D1 (SQLite-based)
- **Authentication**: Google OAuth 2.0 + JWT
- **CDN**: Cloudflare Pages

### Key Files
- `src/views/admin/Auth.vue` - Login interface
- `src/views/admin/Dashboard.vue` - Admin control panel
- `src/composables/useGoogleAuth.js` - Auth composable
- `src/lib/apiConfig.js` - API configuration
- `workers/src/routes/auth.js` - Authentication API
- `workers/src/index.js` - Main Worker entry point

## 🚀 Production Deployment

### Cloudflare Configuration
1. Set environment variables in Cloudflare dashboard (Workers & Pages)
2. Configure Google OAuth authorized origins
3. Set JWT_SECRET in Worker environment variables
4. Deploy Worker: `cd workers && npx wrangler deploy`
5. Deploy Pages: `npx wrangler pages deploy dist --project-name=tcsnio`

### Google OAuth Setup
1. Add production domain to authorized origins
2. Update redirect URIs for production
3. Test authentication flow in production

### Environment Variables (Cloudflare Worker)
- `JWT_SECRET` - Secret key for JWT tokens
- `ENVIRONMENT` - Set to "production"

## 📞 Support
For issues or questions:
- Check Cloudflare D1 database connection
- Verify environment variables in Worker settings
- Test Google OAuth configuration
- Review Worker logs in Cloudflare dashboard

---
**Status**: ✅ Fully Operational - Admin authentication system migrated to Cloudflare Workers + D1.  
**API**: https://api.tcsn.io  
**Frontend**: https://0bd12f54.tcsnio.pages.dev
