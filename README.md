# tcsn

<a href="https://tcsn.io" style="color: black; text-decoration: underline;text-decoration-style: dotted;">tcsn.io</a>

## Description
Landing page - A modern Vue 3 application with Cloudflare Workers backend for high performance and global edge deployment.

## Technology Stack
- **Frontend**: Vue 3 (Composition API), Vite, Vue Router, Tailwind CSS
- **Backend**: Cloudflare Workers (serverless)
- **Database**: Cloudflare D1 (SQLite at edge)
- **Storage**: Cloudflare KV (key-value cache)
- **Deployment**: Cloudflare Pages (frontend) + Cloudflare Workers (backend)
- **Analytics**: Built-in visitor tracking system
- **Features**: Contact forms, project showcase, visitor analytics

## Features
- Home page with modern design
- Contact page with form handling
- Projects showcase with detailed pages
- Admin panel for content management
- User management and authentication
- Edge-optimized performance with built-in analytics
- Global CDN deployment

## Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- Cloudflare account (for deployment)
- Wrangler CLI installed globally: `npm install -g wrangler`

### Local Development

#### Option 1: Development with Production API (Recommended)
```bash
# Install dependencies
npm install

# Start frontend (uses production API by default)
npm run dev
# Accessible at http://localhost:5001
```

#### Option 2: Full Local Development with Worker
```bash
# Terminal 1: Start Cloudflare Worker locally
cd workers
npm install
npm run dev
# Worker runs on http://localhost:8787

# Terminal 2: Start frontend (update .env to use local API)
# Change VITE_API_URL to http://localhost:8787
npm run dev
# Frontend runs on http://localhost:5001
```

**Note**: The Vite dev server proxies `/api` requests to the Worker (port 8787) for local development.

### Cloudflare Setup

1. **Install Wrangler CLI**:
```bash
npm install -g wrangler
```

2. **Login to Cloudflare**:
```bash
wrangler login
```

3. **Create D1 Database**:
```bash
cd workers
wrangler d1 create tcsn-db
```

4. **Update wrangler.toml** with your database ID from the previous step

5. **Deploy database schema**:
```bash
npm run worker:deploy
wrangler d1 execute tcsn-db --file=./schema.sql
```

### Deployment

#### Deploy Worker (Backend)
```bash
# Deploy to staging
npm run worker:deploy:staging

# Deploy to production
npm run worker:deploy:production
```

#### Deploy Pages (Frontend)
```bash
# Build and deploy to Cloudflare Pages
npm run pages:build
npm run pages:deploy
```

#### Full Deployment
```bash
# Deploy everything
npm run cf:setup
```

## Project Structure
```
├── src/                    # Vue.js frontend source
├── workers/               # Cloudflare Workers backend
│   ├── src/
│   │   ├── index.js      # Main worker entry
│   │   ├── routes/       # API route handlers
│   │   └── utils/        # Utility functions
│   ├── schema.sql        # Database schema
│   └── wrangler.toml     # Worker configuration
├── public/               # Static assets
├── dist/                 # Built frontend files
└── wrangler.toml         # Main Cloudflare configuration
```

## Environment Variables
Set these in your Cloudflare Worker settings:
- `JWT_SECRET`: Secret for JWT token signing
- `ADMIN_EMAIL`: Admin user email
- `MONGODB_URI`: (if using MongoDB fallback)

## API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/visitors/track` - Track page visits
- `GET /api/analytics/site` - Get site analytics

## Performance Features
- **Edge Computing**: API runs on Cloudflare's global edge network
- **Static Site Generation**: Frontend served from CDN
- **Database at Edge**: D1 provides low-latency database access
- **Caching**: KV storage for frequently accessed data
- **Analytics**: Real-time visitor tracking without third-party services