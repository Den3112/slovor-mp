#!/bin/bash
# scripts/setup.sh - Basic Project Setup

set -e

echo "🚀 Starting Slovor Marketplace Setup..."

# Copy environment variables
if [ ! -f .env.local ]; then
    echo "📄 Creating .env.local from .env.example..."
    cp .env.example .env.local
else
    echo "✅ .env.local already exists."
fi

# Install dependencies if node_modules don't exist
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed."
fi

echo "✨ Setup complete! You can now run 'npm run dev' or 'docker-compose up -d --build'."
