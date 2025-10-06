#!/bin/bash

# TCSN.io Cloudflare Deployment Script
# Deploys both Worker (API) and Pages (Frontend) to production

set -e

echo "🚀 Starting TCSN.io deployment to Cloudflare..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "wrangler login"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Building frontend..."
pnpm run build

echo "🌐 Deploying Worker (API)..."
cd workers
pnpm run deploy:prod
cd ..

echo "📄 Deploying Pages (Frontend)..."
pnpm run pages:deploy:prod

echo "✅ Deployment complete!"
echo ""
echo "🌍 Your application is now live at:"
echo "   Frontend: https://tcsn.io"
echo "   API: https://tcsnio.tcsn.workers.dev"
echo ""
echo "📊 Monitor your deployment at:"
echo "   https://dash.cloudflare.com"
