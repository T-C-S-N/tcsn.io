# Cloudflare Pages Quick Start

## 🚀 Deploy to Cloudflare Pages

Your TCSN.io application is ready to deploy to Cloudflare Pages!

### Quick Deploy

```bash
# Deploy everything (Worker + Pages)
./deploy.sh

# Or deploy separately:
pnpm run worker:deploy:prod   # Deploy API
pnpm run pages:deploy:prod    # Deploy frontend
```

### Setup

1. **Configure Worker URL**
   
   Update `/src/lib/apiConfig.js` with your production worker URL:
   ```javascript
   return 'https://YOUR-WORKER.workers.dev'
   ```

2. **Build for Production**
   
   ```bash
   pnpm build
   ```
   
   This creates an optimized build in the `dist/` folder.

3. **Deploy to Pages**
   
   ```bash
   wrangler pages deploy dist --project-name=tcsnio
   ```

### Automatic Git Deployment (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Connect your repository
4. Configure:
   - **Build command**: `pnpm install && pnpm build`
   - **Build output**: `dist`
   - **Node version**: 18

Cloudflare will automatically deploy on every push!

### Environment Variables

Set these in Cloudflare Dashboard → Workers & Pages:

```bash
# For Worker
wrangler secret put MONGO_URI --env production
wrangler secret put OPENAI_API_KEY --env production
wrangler secret put JWT_SECRET --env production
```

### Production URLs

- **Frontend**: https://tcsn.io (or your-project.pages.dev)
- **API**: https://tcsnio.tcsn.workers.dev
- **Worker**: Automatically handles API requests

### Features

✅ Automatic builds on Git push  
✅ Global CDN distribution  
✅ Unlimited bandwidth  
✅ Free SSL certificates  
✅ DDoS protection  
✅ Analytics included  
✅ Preview deployments  
✅ Instant rollbacks  

### Local Development

```bash
# Terminal 1: Start frontend
pnpm dev

# Terminal 2: Start worker
cd workers && pnpm dev
```

Visit http://localhost:3000

### Monitoring

Monitor your deployments at:
- https://dash.cloudflare.com/pages
- https://dash.cloudflare.com/workers

See full deployment guide in `DEPLOYMENT.md`
