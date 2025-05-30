#!/bin/bash

# WhatsApp Tech News Bot Setup Script
# This script automates the setup process for the Tech News Bot

set -e  # Exit on any error

echo "🚀 Setting up WhatsApp Tech News Bot..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Create project directory if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create auth directory
mkdir -p src/auth
echo "✅ Auth directory created"

# Create public directory if it doesn't exist
mkdir -p public
echo "✅ Public directory ready"

# Check if all required files exist
REQUIRED_FILES=(
    "src/server.js"
    "src/services/whatsappService.js"
    "src/services/newsService.js"
    "src/services/schedulerService.js"
    "public/index.html"
    ".env"
)

echo "🔍 Checking required files..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done

# Display configuration instructions
echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your configuration:"
echo "   - Set WHATSAPP_TARGET (your WhatsApp ID)"
echo "   - Optional: Add NEWS_API_KEY for better news source"
echo "   - Optional: Customize CRON_SCHEDULE for automatic delivery"
echo ""
echo "2. Start the application:"
echo "   npm start"
echo ""
echo "3. Scan QR code with WhatsApp mobile app"
echo ""
echo "4. Open web interface:"
echo "   http://localhost:3000"
echo ""
echo "📖 Configuration Examples:"
echo "   WHATSAPP_TARGET=919876543210@c.us  (Individual)"
echo "   WHATSAPP_TARGET=120363042123@g.us  (Group)"
echo "   NEWS_API_KEY=your_api_key_from_newsapi.org"
echo "   CRON_SCHEDULE=0 8 * * *  (8 AM daily)"
echo ""
echo "🆘 Need help? Check README.md for detailed instructions"
echo ""

# Ask if user wants to start the application
read -p "🚀 Do you want to start the application now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Starting Tech News Bot..."
    npm start
else
    echo "✅ Setup complete. Run 'npm start' when ready!"
fi