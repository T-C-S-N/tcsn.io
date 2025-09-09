# Cloudflare Deployment Guide for TCSN.io

This guide walks you through deploying the TCSN.io application to Cloudflare using Workers and Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain** (optional): You can use a custom domain or Cloudflare-provided subdomain
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`
4. **Node.js 18+**: Required for building the project

## Step 1: Initial Setup

1. **Login to Wrangler**:
```bash
wrangler login
```

2. **Clone and Setup Project**:
```bash
git clone <your-repo>
cd tcsn.io
npm install
```

## Step 2: Database Setup

1. **Create D1 Database**:
```bash
cd workers
wrangler d1 create tcsn-db
```

2. **Copy the database ID** from the output and update `workers/wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "tcsn-db"
database_id = "your-database-id-here"
```

3. **Create KV Namespace**:
```bash
wrangler kv:namespace create "CACHE"
```

4. **Update KV namespace ID** in `workers/wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

## Step 3: Deploy Worker (Backend)

1. **Deploy Worker**:
```bash
cd workers
npm install
wrangler deploy
```

2. **Deploy Database Schema**:
```bash
wrangler d1 execute tcsn-db --file=./schema.sql
```

3. **Set Environment Variables**:
```bash
wrangler secret put JWT_SECRET
# Enter a strong secret when prompted

wrangler secret put ADMIN_EMAIL
# Enter your admin email
```

## Step 4: Deploy Frontend (Pages)

1. **Build Frontend**:
```bash
cd ..  # Back to project root
npm run build
```

2. **Deploy to Cloudflare Pages**:

**Option A: Using Wrangler**:
```bash
wrangler pages deploy dist --project-name tcsn-io
```

**Option B: Using Cloudflare Dashboard**:
- Go to Cloudflare Dashboard > Pages
- Click "Create a project"
- Connect your Git repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Deploy

## Step 5: Configure Custom Domain (Optional)

1. **Add Domain to Cloudflare**:
- Go to Cloudflare Dashboard
- Add your domain
- Update nameservers

2. **Configure Pages Custom Domain**:
- Go to Pages > Your Project > Custom domains
- Add your domain

3. **Configure Worker Route**:
- Go to Workers > Your Worker > Triggers
- Add route: `api.yourdomain.com/*`

## Step 6: Environment Configuration

### Worker Environment Variables
Set these in Workers Dashboard or via Wrangler:

```bash
wrangler secret put JWT_SECRET
wrangler secret put ADMIN_EMAIL
wrangler secret put GOOGLE_CLIENT_ID  # If using Google OAuth
wrangler secret put GOOGLE_CLIENT_SECRET
```

### Pages Environment Variables
Set in Pages Dashboard:
- `VITE_API_URL`: Your worker URL (e.g., `https://tcsn-io.your-subdomain.workers.dev`)

## Step 7: Update API Configuration

Update your frontend API configuration to point to the deployed worker:

```javascript
// In your Vue app, update the API base URL
const API_BASE_URL = 'https://tcsn-io.your-subdomain.workers.dev'
```

## Step 8: Test Deployment

1. **Test Worker APIs**:
```bash
curl https://tcsn-io.your-subdomain.workers.dev/api/health
```

2. **Test Frontend**:
Visit your Pages URL or custom domain

3. **Test Full Integration**:
- Create account
- View projects
- Test analytics

## Monitoring and Maintenance

### View Logs
```bash
wrangler tail  # For worker logs
```

### Database Management
```bash
# Execute SQL queries
wrangler d1 execute tcsn-db --command "SELECT * FROM users LIMIT 5"

# Backup database
wrangler d1 export tcsn-db --output backup.sql
```

### Update Worker
```bash
cd workers
wrangler deploy
```

### Update Frontend
```bash
npm run build
wrangler pages deploy dist
```

## Performance Optimization

1. **Enable Caching**: Configure cache headers in worker responses
2. **Use KV for Frequent Data**: Store frequently accessed data in KV
3. **Optimize Images**: Use Cloudflare Image Optimization
4. **Enable Analytics**: Use Cloudflare Web Analytics

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure CORS headers are set in worker responses
   - Check API URL configuration in frontend

2. **Database Connection Issues**:
   - Verify D1 database ID in wrangler.toml
   - Check if schema was deployed correctly

3. **Authentication Problems**:
   - Verify JWT_SECRET is set correctly
   - Check token generation and verification

4. **Build Failures**:
   - Ensure Node.js 18+ is used
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Getting Help

- **Cloudflare Docs**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Discord**: Cloudflare Developers Discord
- **GitHub Issues**: Create an issue in your repository

## Cost Considerations

Cloudflare's free tier includes:
- 100,000 Worker requests/day
- 25 GB Pages bandwidth/month
- 5 GB D1 storage
- 100,000 KV reads/day

For production applications, consider upgrading to paid plans for higher limits and SLA guarantees.
