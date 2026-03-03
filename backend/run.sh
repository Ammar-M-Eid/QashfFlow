#!/bin/bash
# Backend Startup Script for Unix/Linux/Mac
# This script helps you quickly start the FastAPI backend

echo ""
echo "================================================"
echo "  QashFlow - Backend Startup"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env from template..."
    cp .env.example .env
    echo "✓ Created .env"
    echo ""
    echo "❗ IMPORTANT: Edit .env with your model paths!"
    echo "   - MODEL_CHECKPOINT_PATH"
    echo "   - SCALER_PATH"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and configure..."
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🚀 Starting FastAPI server..."
echo ""
echo "Backend will be available at:"
echo "  → http://localhost:8001"
echo ""
echo "API Documentation:"
echo "  → http://localhost:8001/docs"
echo ""

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
