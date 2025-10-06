# TCSN.io - Cloudflare Deployment Guide

## Overview
This is a Vue 3 + Vite application deployed on Cloudflare infrastructure:
- **Cloudflare Pages**: Static site hosting for the Vue.js frontend
- **Cloudflare Workers**: API backend (tcsnio) 
- **Cloudflare D1**: SQLite edge database (tcsnio)
- **Cloudflare KV**: Cache storage

## Project Stack
- Vue 3.4 + Vite 5.4
- JavaScript with comprehensive visitor tracking
- Tailwind CSS + SCSS for CRT terminal styling
- Font Awesome icons
- Pinia state management with localStorage persistence
- Vue Router with SPA configuration

## Prerequisites
1. Node.js 20+ and npm
2. Cloudflare account
3. Wrangler CLI installed (`npm install -g wrangler`)
4. Authenticated with Cloudflare (`wrangler login`)

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create D1 Database
```bash
# Production database
wrangler d1 create tcsnio

# Development database
wrangler d1 create tcsnio-dev
```

Copy the database IDs from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "tcsnio"
database_id = "your-production-database-id"

[env.development.d1_databases]
database_name = "tcsnio-dev"
database_id = "your-development-database-id"
```

### 3. Apply Database Migrations
```bash
# Production
wrangler d1 migrations apply tcsnio

# Development
wrangler d1 migrations apply tcsnio-dev --env development
```

### 4. Create KV Namespace (Optional)
```bash
# Production
wrangler kv:namespace create "CACHE"

# Development
wrangler kv:namespace create "CACHE" --preview
```

Update `wrangler.toml` with the KV namespace IDs.

### 5. Set Environment Secrets
```bash
# MongoDB connection string (if using external MongoDB)
wrangler secret put MONGO_URI

# OpenAI API key
wrangler secret put OPENAI_API_KEY

# Google OAuth client ID
wrangler secret put GOOGLE_CLIENT_ID

# JWT secret for authentication
wrangler secret put JWT_SECRET
```

## Local Development

### Option 1: Full Stack (Recommended)
Run both the Vite dev server and Cloudflare Worker:

**Terminal 1 - Worker:**
```bash
npm run worker:dev
# Or: wrangler dev workers/index.js
```

**Terminal 2 - Vue App:**
```bash
npm run dev
# Or: vite
```

The Vue app will be available at `http://localhost:5173` and will proxy API requests to the Worker at `http://localhost:8787`.

### Option 2: Worker Only
```bash
npm run worker:dev
```
Access the Worker directly at `http://localhost:8787`.

### Option 3: Frontend Only
```bash
npm run dev
```
Note: API calls will fail unless the Worker is running.

## Testing D1 Database

### Query Database
```bash
# Production
wrangler d1 execute tcsnio --command "SELECT * FROM visitors LIMIT 5"

# Development
wrangler d1 execute tcsnio-dev --command "SELECT * FROM visitors LIMIT 5" --env development
```

### Create Migration
```bash
npm run d1:migrations:create "migration_name"
```

## Deployment

### Deploy Worker
```bash
# Production
npm run worker:deploy
# Or: wrangler deploy workers/index.js

# Development
wrangler deploy workers/index.js --env development
```

### Deploy Pages
```bash
npm run cf:deploy
# Or: npm run build && wrangler pages deploy dist
```

### Automatic Deployment (CI/CD)
Connect your GitHub repository to Cloudflare Pages:
1. Go to Cloudflare Dashboard > Pages
2. Click "Create a project" > "Connect to Git"
3. Select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**: Add your secrets (MONGO_URI, OPENAI_API_KEY, etc.)

Cloudflare will automatically deploy on every push to the main branch.

## Project Structure

```
tcsn.io/
├── workers/
│   └── index.js              # Cloudflare Worker (API backend)
├── migrations/
│   └── 0001_init.sql         # D1 database schema
├── src/
│   ├── main.js               # Vue app entry point
│   ├── components/           # Vue components
│   ├── pages/                # Vue pages
│   ├── styles/
│   │   ├── variables.scss    # SCSS variables
│   │   └── globals.css       # Global styles
│   └── utils/                # Utility functions
├── public/
│   ├── _headers              # Cloudflare Pages headers
│   └── _redirects            # Cloudflare Pages redirects
├── wrangler.toml             # Cloudflare Worker config
├── .pages.toml               # Cloudflare Pages config
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build Vue app for production
- `npm run preview` - Preview production build locally
- `npm run worker:dev` - Start Cloudflare Worker locally
- `npm run worker:deploy` - Deploy Worker to Cloudflare
- `npm run cf:deploy` - Build and deploy to Cloudflare Pages
- `npm run d1:create` - Create D1 database
- `npm run d1:query` - Query D1 database
- `npm run d1:migrations:create` - Create new migration

## API Endpoints

The Worker provides the following API endpoints:

### Visitors
- `GET /api/visitors` - List all visitors
- `POST /api/visitors` - Create new visitor
- `GET /api/visitors/:id` - Get visitor by ID

### Analytics
- `GET /api/visitor-analytics/summary` - Get analytics summary
- `GET /api/visitor-analytics/popular-pages` - Get popular pages
- `GET /api/visitor-analytics/active-visitors` - Get active visitors

### URL Shortener
- `GET /api/url-shortener` - List all short URLs
- `POST /api/url-shortener` - Create short URL
- `GET /api/url-shortener/:code` - Get original URL by short code
- `DELETE /api/url-shortener/:code` - Delete short URL

### Authentication
- `POST /api/auth/google` - Verify Google OAuth token

### MongoDB Proxy (Optional)
- `POST /api/mongodb` - Proxy requests to MongoDB Data API

## Environment Variables

### Worker Secrets (set via `wrangler secret put`)
- `MONGO_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `JWT_SECRET` - JWT signing secret

### Cloudflare Bindings (configured in wrangler.toml)
- `DB` - D1 database binding
- `CACHE` - KV namespace binding

## Troubleshooting

### Issue: Worker fails to start
**Solution**: Ensure `nodejs_compat` is enabled in `wrangler.toml`

### Issue: D1 database not found
**Solution**: Run `wrangler d1 create tcsnio` and update database_id in `wrangler.toml`

### Issue: API calls return CORS errors
**Solution**: Check Worker CORS headers in `workers/index.js`

### Issue: Build fails with SCSS errors
**Solution**: Ensure `sass` is installed: `npm install sass`

### Issue: Font Awesome icons not showing
**Solution**: Check icon imports in `src/main.js`

### Issue: Environment variables not working
**Solution**: Use `wrangler secret put` for sensitive values, not environment variables

## Production Checklist

- [ ] D1 database created and migrated
- [ ] Environment secrets configured
- [ ] Worker deployed and tested
- [ ] Pages deployed and accessible
- [ ] Custom domain configured (optional)
- [ ] SSL/TLS certificate active
- [ ] Analytics enabled
- [ ] Monitoring alerts configured

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## License

MIT
