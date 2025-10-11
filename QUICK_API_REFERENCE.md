# Quick Reference: Updated API Routes

## ⚡ Quick Facts

- ✅ `/api/` prefix removed from all routes
- ✅ Worker deployed and live
- ✅ Your `.env` file is already correct
- ⚠️ Frontend needs rebuild and redeploy

---

## 🔗 New Routes

```
https://api.tcsn.io/              → Health & API info
https://api.tcsn.io/auth/*        → Authentication
https://api.tcsn.io/projects      → Projects
https://api.tcsn.io/analytics/*   → Analytics
https://api.tcsn.io/visitors      → Visitors
```

---

## 🚀 Deploy Frontend (2 commands)

```bash
cd /Users/tcsntcsn/TCSN/tcsn.io
npm run build
npx wrangler pages deploy dist --project-name=tcsnio
```

---

## 🧪 Test Commands

```bash
# Health check
curl https://api.tcsn.io/

# Projects
curl https://api.tcsn.io/projects

# Analytics
curl https://api.tcsn.io/analytics/site
```

---

## 📝 What Changed

| Old Route | New Route |
|-----------|-----------|
| `/api/` | `/` |
| `/api/projects` | `/projects` |
| `/api/analytics/site` | `/analytics/site` |
| `/api/auth/login` | `/auth/login` |

---

See `API_ROUTES_UPDATED.md` for full documentation.
