# Google OAuth Fix Instructions

## The Problem
The error "Access blocked: authorisation error - Error 400: origin_mismatch" occurs because `http://localhost:3000` is not authorized in your Google Cloud Console.

## The Solution

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account

### Step 2: Find Your OAuth Client
1. Look for OAuth 2.0 Client ID: `66286687898-8heqdjcdknvu1talgskboclfipunspm3`
2. Click on it to edit

### Step 3: Add Authorized Origins
In the **Authorized JavaScript origins** section, add:
- `http://localhost:3000`
- `http://localhost:3001` (backup)
- `http://127.0.0.1:3000` (alternative)

### Step 4: Add Authorized Redirect URIs
In the **Authorized redirect URIs** section, add:
- `http://localhost:3000/admin/login`
- `http://localhost:3001/admin/login`
- `http://127.0.0.1:3000/admin/login`

### Step 5: Save and Test
1. Click **Save**
2. Wait 1-2 minutes for changes to propagate
3. Refresh http://localhost:3000/admin/login
4. Try signing in again

## Alternative Testing Method (Temporary)
If you can't access Google Cloud Console right now, you can:

1. Change the Vite dev server to run on port 3001:
   ```bash
   cd /Users/toca/TCSN/tcsn.io
   npx vite --port 3001
   ```

2. Update the proxy target in `vite.config.js` if needed

3. Access the admin login at: http://localhost:3001/admin/login

## Clock Synchronization Fix
If you still get "Token used too early" errors:

1. **Check system time**: Make sure your Mac's time is correct
2. **Sync time**: Go to System Preferences > Date & Time > Set date and time automatically
3. **Restart**: Restart the development servers

## Current Status
- ✅ Frontend server: http://localhost:3000
- ✅ API server: http://localhost:3002  
- ✅ Visitor tracking: Working
- ⚠️ Google OAuth: Needs origin authorization
- ⚠️ Clock sync: Increased tolerance to 10 minutes

## Next Steps
1. Fix Google OAuth origins (above)
2. Test admin login
3. Verify full authentication flow
4. Deploy to production with correct origins
