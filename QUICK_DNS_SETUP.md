# Quick DNS Setup for api.tcsn.io

## 🎯 Goal
Attach custom domain `api.tcsn.io` to your Cloudflare Worker

---

## ⚡ 3-Minute Setup

### Method 1: Dashboard (Easiest) ✅

1. **Open Worker Settings**
   ```
   https://dash.cloudflare.com
   → Workers & Pages
   → tcsnio-api
   → Settings
   → Triggers
   ```

2. **Add Custom Domain**
   - Find "Custom Domains" section
   - Click "Add Custom Domain"
   - Enter: `api.tcsn.io`
   - Click "Add Custom Domain"
   - ✅ Done! DNS + SSL automatic

3. **Wait & Test** (1-5 min)
   ```bash
   curl https://api.tcsn.io/api/
   ```

---

### Method 2: Manual DNS (If Method 1 Fails)

1. **Add DNS Record**
   ```
   Dashboard → tcsn.io domain → DNS → Records
   
   Click "Add record":
   - Type: CNAME
   - Name: api
   - Target: tcsnio-api.tcsn.workers.dev
   - Proxy: ON (orange cloud)
   - TTL: Auto
   ```

2. **Add Worker Route**
   ```
   Workers & Pages → tcsnio-api → Settings → Triggers
   
   Click "Add route":
   - Route: api.tcsn.io/*
   - Zone: tcsn.io
   ```

3. **Test**
   ```bash
   curl https://api.tcsn.io/api/
   ```

---

## 📝 After DNS Setup

### Update Frontend Environment

```bash
# Update .env file
echo "VITE_API_URL=https://api.tcsn.io" > .env

# Rebuild frontend
npm run build

# Redeploy to Pages
npx wrangler pages deploy dist --project-name=tcsnio
```

---

## ✅ Verification Checklist

- [ ] DNS record created (CNAME: api → worker)
- [ ] Worker route added (api.tcsn.io/*)
- [ ] SSL certificate active (https works)
- [ ] Health check working: `curl https://api.tcsn.io/api/`
- [ ] Frontend updated with new API URL
- [ ] Frontend rebuilt and redeployed

---

## 🔍 Test Commands

```bash
# Check DNS
dig api.tcsn.io

# Test health check
curl https://api.tcsn.io/api/

# Test all endpoints
curl https://api.tcsn.io/
curl https://api.tcsn.io/api/projects
curl https://api.tcsn.io/api/analytics/site
```

---

## 🎉 Final URLs

| Service | Old URL | New URL |
|---------|---------|---------|
| API | tcsnio-api.tcsn.workers.dev | **api.tcsn.io** ✅ |
| Frontend | 85266538.tcsnio.pages.dev | (can add tcsn.io later) |

---

## ⚠️ Troubleshooting

**DNS not working?**
- Wait 5 minutes for propagation
- Check DNS record exists in dashboard
- Try: `dig api.tcsn.io +short`

**SSL error?**
- Wait for certificate (1-5 min)
- Ensure proxy is ON (orange cloud)
- Check SSL mode is "Flexible" or "Full"

**404 error?**
- Check worker route exists
- Verify pattern: `api.tcsn.io/*`
- Redeploy worker if needed

---

## 📚 Full Documentation

See `CUSTOM_DOMAIN_SETUP.md` for complete guide.
