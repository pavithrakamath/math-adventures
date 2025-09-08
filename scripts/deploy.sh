#!/bin/bash

# Math Adventures Deployment Script
# This script builds and deploys the Math Adventures application

set -e  # Exit on any error

echo "🚀 Starting Math Adventures deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the project
echo "🏗️ Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Optional: Deploy to GitHub Pages (uncomment if needed)
# echo "🚀 Deploying to GitHub Pages..."
# npx gh-pages -d dist

echo "🎉 Deployment completed successfully!"
echo "📁 Built files are in the 'dist' directory"
echo "🌐 You can preview the build with: npm run preview"

