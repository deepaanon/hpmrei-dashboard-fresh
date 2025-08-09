#!/bin/bash

echo "🚀 HPMREI Vercel Deployment Setup"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the vercel-deployment directory${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

echo -e "${BLUE}🔧 Setting up environment...${NC}"
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Please edit .env.local with your settings${NC}"
fi

echo -e "${BLUE}🏗️  Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

echo -e "${BLUE}🌐 Starting development server...${NC}"
echo -e "${YELLOW}📱 Your dashboard will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}🔑 Default password: hpmrei2025${NC}"
echo ""
echo -e "${BLUE}Next steps for Vercel deployment:${NC}"
echo "1. Create GitHub repository"
echo "2. Push this code to GitHub"  
echo "3. Connect repository to Vercel"
echo "4. Configure environment variables"
echo "5. Deploy!"
echo ""
echo -e "${GREEN}Starting server...${NC}"

npm run dev
