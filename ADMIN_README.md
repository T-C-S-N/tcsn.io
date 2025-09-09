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
- **MongoDB**: User storage and visitor tracking
- **Google OAuth**: Authentication service
- **JWT**: Token management for sessions
- **OpenAI**: AI-powered visitor name generation

### Frontend Components
- **AdminLogin.vue**: Google Sign-In interface
- **AdminDashboard.vue**: Complete admin control panel
- **useGoogleAuth.js**: Vue composable for authentication
- **GoogleAuthService.js**: Authentication business logic

### API Endpoints
- `POST /api/auth` - Google token verification and login
- `GET /api/auth` - Session verification and user info
- `POST /api/visitors` - Visitor tracking and analytics
- `POST /api/mongodb` - Database operations

## 🔧 Configuration

### Environment Variables
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# MongoDB
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=tcsnio

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Admin Authorization
Only the following email has admin access:
- `tomas@tcsn.io`

To add more admins, update the authorization check in:
- `/api/auth.js` (line with email verification)

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
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Authentication**: Google OAuth 2.0 + JWT
- **AI**: OpenAI GPT-4o-mini

### Key Files
- `src/views/AdminLogin.vue` - Login interface
- `src/views/AdminDashboard.vue` - Admin control panel
- `src/composables/useGoogleAuth.js` - Auth composable
- `src/lib/GoogleAuthService.js` - Auth service
- `api/auth.js` - Authentication API

## 🚀 Production Deployment

### Vercel Configuration
1. Set all environment variables in Vercel dashboard
2. Configure Google OAuth authorized origins
3. Update MongoDB whitelist for Vercel IPs
4. Deploy with `vercel --prod`

### Google OAuth Setup
1. Add production domain to authorized origins
2. Update redirect URIs for production
3. Test authentication flow in production

## 📞 Support
For issues or questions:
- Check MongoDB Atlas connection
- Verify environment variables
- Test Google OAuth configuration
- Review server logs for errors

---
**Status**: ✅ Fully Operational - Admin authentication system is ready for production use.
