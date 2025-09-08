#!/bin/bash

# Stadium Eats Setup Script
echo "🏟️  Setting up Stadium Eats..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Stadium Eats Environment Variables
NEXT_PUBLIC_APP_NAME=Stadium Eats
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock API Configuration
MOCK_API_ENABLED=true
POLLING_INTERVAL=10000

# Stadium Configuration
STADIUM_NAME=Sample Stadium
STADIUM_SECTIONS=101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120
EOF
    echo "✅ .env.local created"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
