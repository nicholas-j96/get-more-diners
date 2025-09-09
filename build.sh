#!/bin/bash

# Production deployment script for Get More Diners
echo "🚀 Starting production deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
echo "✅ Frontend built successfully"

# Build backend
echo "📦 Installing backend dependencies..."
cd ../backend
npm install --production
echo "✅ Backend dependencies installed"

echo "🎉 Production build complete!"
