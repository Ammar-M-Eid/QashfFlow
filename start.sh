#!/bin/bash
# Frontend Development Startup Script for Unix/Linux/Mac
# This script helps you quickly start the Next.js development server

echo ""
echo "================================================"
echo "  QashFlow - Frontend Startup"
echo "================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✓ Created .env.local"
fi

echo ""
echo "🚀 Starting Next.js development server..."
echo ""
echo "Frontend will be available at:"
echo "  → http://localhost:3000"
echo ""
echo "Make sure the backend is running on port 8001!"
echo ""

# Start the dev server
npm run dev
