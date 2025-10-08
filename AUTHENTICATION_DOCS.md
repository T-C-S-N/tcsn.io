# 🔐 Authentication System Documentation

## Overview

TCSN.io uses **Google OAuth 2.0** for authentication with **JWT tokens** for session management. The system is built on Cloudflare Workers and D1 database.

---

## 📍 Authentication Endpoints

**Base URL**: `https://api.tcsn.io`

### GET /auth
**Description**: List all available authentication endpoints

**Response**:
```json
{
  "success": true,
  "message": "Authentication API endpoints",
  "endpoints": [
    "GET /auth - This endpoint (lists available endpoints)",
    "POST /auth (action: google-login) - Google OAuth login",
    "POST /auth (action: verify-token) - Verify JWT token",
    "POST /auth (action: logout) - Logout user",
    "POST /auth/login - Email/password login",
    "POST /auth/register - User registration",
    "POST /auth/verify - Verify JWT token (alternative endpoint)"
  ],
  "actions": {
    "google-login": "Google OAuth authentication",
    "verify-token": "Verify existing JWT token",
    "logout": "End user session"
  }
}
```

---

## 🔑 Google OAuth Authentication

### POST /auth (action: google-login)

**Description**: Authenticate user with Google OAuth ID token

**Request**:
```json
{
  "action": "google-login",
  "idToken": "google_oauth_id_token_here"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "picture": "https://...",
    "isAdmin": true
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Invalid Google token"
}
```

**How it works**:
1. Frontend receives Google ID token from Google Sign-In
2. Sends token to `/auth` with `action: google-login`
3. Worker verifies token with Google's API
4. Creates or retrieves user from D1 database
5. Generates JWT token
6. Returns token and user info

**Admin Access**:
- Only `tomas@tcsn.io` receives `role: "admin"` and `isAdmin: true`
- All other users get `role: "user"` and `isAdmin: false`

---

## ✅ Token Verification

### POST /auth (action: verify-token)

**Description**: Verify an existing JWT token

**Request**:
```json
{
  "action": "verify-token",
  "token": "jwt_token_here"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "valid": true,
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Invalid token"
}
```

---

## 🚪 Logout

### POST /auth (action: logout)

**Description**: End user session (frontend should clear cookies/storage)

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

---

## 📧 Email/Password Authentication

### POST /auth/login

**Description**: Login with email and password

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Success Response** (200):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Response** (401):
```json
{
  "error": "Invalid credentials"
}
```

### POST /auth/register

**Description**: Register new user with email and password

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name"
}
```

**Success Response** (201):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Response** (400):
```json
{
  "error": "User already exists"
}
```

---

## 🔐 Frontend Integration

### Using the Authentication Composable

```javascript
import { useGoogleAuth } from '@/composables/useGoogleAuth'

export default {
  setup() {
    const { 
      isAuthenticated, 
      user, 
      isLoading,
      error,
      logout 
    } = useGoogleAuth()

    return {
      isAuthenticated,
      user,
      isLoading,
      error,
      logout
    }
  }
}
```

### Google Sign-In Button

```vue
<template>
  <div id="g_id_onload"
       :data-client_id="googleClientId"
       data-context="signin"
       data-ux_mode="popup"
       data-callback="handleGoogleResponse"
       data-auto_prompt="false">
  </div>
  
  <div class="g_id_signin"
       data-type="standard"
       data-shape="rectangular"
       data-theme="filled_blue"
       data-text="signin_with"
       data-size="large"
       data-logo_alignment="left">
  </div>
</template>

<script setup>
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { initGoogleAuth } = useGoogleAuth()

onMounted(() => {
  initGoogleAuth()
})
</script>
```

### Checking Admin Status

```javascript
const { user } = useGoogleAuth()

const isAdmin = computed(() => user.value?.isAdmin === true)

// In template
<div v-if="isAdmin">
  Admin-only content
</div>
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT
);
```

**Fields**:
- `id`: Auto-incrementing primary key
- `email`: Unique email address
- `name`: User's display name
- `password_hash`: Hashed password (for email/password auth)
- `role`: User role (`admin` or `user`)
- `created_at`: ISO timestamp of user creation
- `updated_at`: ISO timestamp of last update

---

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**:
```env
VITE_API_URL=https://api.tcsn.io
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Worker (Cloudflare Dashboard)**:
```env
JWT_SECRET=your_secret_key_here
ENVIRONMENT=production
```

### Google OAuth Setup

1. **Create OAuth Client**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID
   - Application type: Web application

2. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://your-domain.pages.dev
   https://api.tcsn.io
   ```

3. **Authorized redirect URIs**:
   ```
   http://localhost:5173
   https://your-domain.pages.dev
   ```

4. **Copy Client ID** to:
   - `VITE_GOOGLE_CLIENT_ID` in frontend `.env`

---

## 🔒 Security Features

### JWT Tokens
- Signed with `JWT_SECRET`
- Contains user ID, email, name, role
- Stored in HTTP-only cookies (frontend)
- Short expiration time (configurable)

### Password Hashing
- Uses bcrypt/scrypt for password hashing
- Passwords never stored in plain text
- Secure verification on login

### Google OAuth
- Tokens verified with Google's API
- No password management needed
- Leverages Google's security

### CORS Protection
- Configured CORS headers
- Restricts API access to authorized origins

### Role-Based Access
- Admin role checked on critical endpoints
- Only `tomas@tcsn.io` has admin privileges
- Users have limited access

---

## 🧪 Testing Authentication

### Test Google OAuth (Manual)
1. Go to admin login page
2. Click "Sign in with Google"
3. Complete Google authentication
4. Check browser console for token
5. Verify user object in Vue DevTools

### Test Token Verification
```bash
# Get token from login response
TOKEN="your_jwt_token_here"

# Verify token
curl -X POST https://api.tcsn.io/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify-token",
    "token": "'$TOKEN'"
  }'
```

### Test Endpoint Access
```bash
# Test auth endpoints
curl https://api.tcsn.io/auth

# Test with invalid token
curl -X POST https://api.tcsn.io/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify-token",
    "token": "invalid_token"
  }'
```

---

## 🐛 Troubleshooting

### Google Sign-In Not Loading
- **Check**: `VITE_GOOGLE_CLIENT_ID` is set correctly
- **Verify**: Google OAuth client is configured
- **Check**: Authorized origins include your domain
- **Solution**: Clear browser cache and reload

### Token Verification Failing
- **Check**: `JWT_SECRET` is set in Worker
- **Verify**: Token hasn't expired
- **Check**: Token is being sent correctly
- **Solution**: Re-login to get fresh token

### Admin Access Denied
- **Check**: Using `tomas@tcsn.io` email
- **Verify**: Google account is correct
- **Check**: User record in D1 database
- **Solution**: Clear database and re-login

### CORS Errors
- **Check**: API URL in frontend matches Worker URL
- **Verify**: CORS headers in Worker
- **Check**: Browser console for specific error
- **Solution**: Add origin to CORS configuration

---

## 📚 API Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | User created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Invalid credentials or token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Endpoint not found |
| 500 | Server Error | Internal server error |

---

## 🎯 Current Status

✅ **Google OAuth**: Fully implemented and working  
✅ **JWT Tokens**: Generated and verified  
✅ **User Management**: Auto-create users in D1  
✅ **Admin Detection**: `tomas@tcsn.io` gets admin role  
✅ **Token Verification**: Working correctly  
✅ **Logout**: Functional  

**API URL**: https://api.tcsn.io/auth  
**Deployment**: Cloudflare Workers + D1  
**Last Updated**: October 8, 2025
