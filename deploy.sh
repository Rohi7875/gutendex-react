#!/bin/bash

# Gutendex Book Browser - Deployment Script for EC2
# This script pulls latest code, builds, and deploys

echo "🚀 Starting deployment..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

# Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed"
    exit 1
fi
echo "✅ Code updated"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Build the application
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build complete"

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
if [ $? -ne 0 ]; then
    echo "⚠️ Nginx restart failed (you may need to run with sudo)"
else
    echo "✅ Nginx restarted"
fi

echo "================================"
echo "✅ Deployment complete!"
echo ""
echo "Your app is now live at:"
echo "http://$(curl -s ifconfig.me)"
echo ""
echo "To view logs: sudo tail -f /var/log/nginx/access.log"

