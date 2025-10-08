# Setting Up api.tcsn.io Custom Domain for Cloudflare Worker

## Overview
This guide will help you attach the custom domain `api.tcsn.io` to your Cloudflare Worker (`tcsnio-api`).

---

## Prerequisites
✅ Domain `tcsn.io` must be added to Cloudflare (already done if you're using Cloudflare)
✅ Worker `tcsnio-api` is deployed and working
✅ You have access to the Cloudflare dashboard

---

## Method 1: Using Cloudflare Dashboard (Easiest)

### Step 1: Add Custom Domain to Worker

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select your account

2. **Open Workers & Pages**
   - Click on "Workers & Pages" in the left sidebar
   - Find and click on your worker: `tcsnio-api`

3. **Go to Settings > Triggers**
   - Click on the "Settings" tab
   - Click on "Triggers" in the sidebar

4. **Add Custom Domain**
   - Scroll to "Custom Domains" section
   - Click "Add Custom Domain"
   - Enter: `api.tcsn.io`
   - Click "Add Custom Domain"

5. **DNS Record Created Automatically**
   - Cloudflare will automatically create the DNS record
   - The subdomain will be pointed to your Worker
   - SSL certificate will be provisioned automatically

### Step 2: Verify DNS Record

1. **Check DNS Records**
   - Go to your domain: `tcsn.io`
   - Click on "DNS" > "Records"
   - You should see a new record:
     - Type: `CNAME` or `A`
     - Name: `api`
     - Target: Worker route (managed by Cloudflare)
     - Proxy status: Proxied (orange cloud)

2. **Wait for DNS Propagation**
   - Usually takes 1-5 minutes
   - Can take up to 24 hours in rare cases

---

## Method 2: Using Wrangler CLI

### Step 1: Add Route to wrangler.toml

```toml
# Add to /Users/tcsntcsn/TCSN/tcsn.io/workers/wrangler.toml

name = "tcsnio-api"
main = "src/index.js"
compatibility_date = "2024-09-25"

# Add custom domain route
routes = [
  { pattern = "api.tcsn.io/*", custom_domain = true }
]

# ... rest of your config
```

### Step 2: Deploy with Custom Domain

```bash
cd /Users/tcsntcsn/TCSN/tcsn.io/workers
npx wrangler deploy
```

### Step 3: Add DNS Record Manually (if needed)

If the DNS record isn't created automatically:

```bash
# Using Wrangler
npx wrangler domains add api.tcsn.io

# Or use Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "api",
    "content": "tcsnio-api.tcsn.workers.dev",
    "ttl": 1,
    "proxied": true
  }'
```

---

## Method 3: Manual DNS Setup

### Step 1: Create DNS Record in Cloudflare

1. **Go to DNS Management**
   - Dashboard > Select `tcsn.io` domain
   - Click "DNS" > "Records"

2. **Add New Record**
   - Click "Add record"
   - **Type**: CNAME
   - **Name**: api
   - **Target**: tcsnio-api.tcsn.workers.dev
   - **Proxy status**: Proxied (orange cloud) ✅
   - **TTL**: Auto
   - Click "Save"

### Step 2: Configure Worker Route

1. **Go to Workers Routes**
   - Dashboard > Workers & Pages
   - Click on `tcsnio-api`
   - Settings > Triggers
   - Click "Add route"

2. **Add Route**
   - Route: `api.tcsn.io/*`
   - Zone: `tcsn.io`
   - Click "Add route"

---

## Verification Steps

### 1. Check DNS Resolution

```bash
# Check DNS is resolving
dig api.tcsn.io

# Or use nslookup
nslookup api.tcsn.io

# Or use curl to check
curl -I https://api.tcsn.io/api/
```

### 2. Test API Endpoints

```bash
# Health check
curl https://api.tcsn.io/api/

# Expected response:
# {
#   "status": "healthy",
#   "message": "TCSN.io API is running",
#   ...
# }

# Root API info
curl https://api.tcsn.io/

# Test projects endpoint
curl https://api.tcsn.io/api/projects

# Test analytics endpoint
curl https://api.tcsn.io/api/analytics/site
```

### 3. Check SSL Certificate

```bash
# Verify SSL is working
curl -v https://api.tcsn.io/api/ 2>&1 | grep "SSL certificate"

# Or open in browser
open https://api.tcsn.io/api/
```

---

## Update Frontend to Use Custom Domain

### Update .env File

```bash
# /Users/tcsntcsn/TCSN/tcsn.io/.env
VITE_API_URL=https://api.tcsn.io
```

### Rebuild and Redeploy Frontend

```bash
cd /Users/tcsntcsn/TCSN/tcsn.io

# Build with new API URL
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=tcsnio
```

---

## Common Issues & Solutions

### Issue 1: DNS Not Resolving
**Solution**: 
- Wait 5-10 minutes for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` (macOS)
- Check DNS record exists in Cloudflare dashboard

### Issue 2: SSL Certificate Error
**Solution**:
- Wait for SSL certificate to provision (usually 1-5 minutes)
- Ensure proxy is enabled (orange cloud) in DNS record
- Check Cloudflare SSL/TLS settings are "Flexible" or "Full"

### Issue 3: 522 Connection Timed Out
**Solution**:
- Worker might be taking too long to respond
- Check Worker logs in dashboard
- Verify Worker is deployed and running

### Issue 4: Worker Route Not Working
**Solution**:
- Verify route pattern is correct: `api.tcsn.io/*`
- Check route is added in Worker settings
- Redeploy worker: `npx wrangler deploy`

---

## Security Best Practices

1. **Enable HTTPS Only**
   - Go to SSL/TLS settings
   - Enable "Always Use HTTPS"

2. **Configure CORS Properly**
   - Update CORS headers in Worker if needed
   - Restrict origins in production

3. **Rate Limiting** (Optional)
   - Consider enabling Cloudflare Rate Limiting
   - Protect API from abuse

4. **API Authentication** (Future)
   - Implement API keys
   - Add authentication middleware

---

## Final Configuration

### Current URLs:
- **Old URL**: https://tcsnio-api.tcsn.workers.dev
- **New URL**: https://api.tcsn.io ✅

### Frontend:
- **Pages URL**: https://85266538.tcsnio.pages.dev
- **Custom Domain** (optional): https://tcsn.io

### API Endpoints:
- Health: `https://api.tcsn.io/api/`
- Projects: `https://api.tcsn.io/api/projects`
- Analytics: `https://api.tcsn.io/api/analytics/site`
- Auth: `https://api.tcsn.io/api/auth/*`

---

## Next Steps

1. ✅ Set up custom domain `api.tcsn.io`
2. ✅ Verify DNS and SSL
3. ✅ Update frontend `.env` file
4. ✅ Rebuild and redeploy frontend
5. ✅ Test all API endpoints
6. 🔜 (Optional) Set up custom domain for frontend: `tcsn.io`

---

## Quick Commands

```bash
# Test DNS resolution
dig api.tcsn.io

# Test API health check
curl https://api.tcsn.io/api/

# Update environment variable
echo "VITE_API_URL=https://api.tcsn.io" > /Users/tcsntcsn/TCSN/tcsn.io/.env

# Rebuild frontend
cd /Users/tcsntcsn/TCSN/tcsn.io && npm run build

# Redeploy frontend
cd /Users/tcsntcsn/TCSN/tcsn.io && npx wrangler pages deploy dist --project-name=tcsnio
```
