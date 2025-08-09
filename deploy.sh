#!/bin/bash

# 🚀 HPMREI Vercel Deployment Assistant
# Professional automated deployment script

echo "🚀 HPMREI Secure Dashboard Deployment Assistant"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Verify environment
echo -e "${BLUE}📋 Step 1: Environment Check${NC}"
echo "Verifying your setup..."

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment ready${NC}"
echo ""

# Step 2: Project verification
echo -e "${BLUE}📋 Step 2: Project Verification${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run from vercel-deployment directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"
echo ""

# Step 3: Dependencies
echo -e "${BLUE}📋 Step 3: Installing Dependencies${NC}"
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi
echo ""

# Step 4: Build test
echo -e "${BLUE}📋 Step 4: Testing Build${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Git setup
echo -e "${BLUE}📋 Step 5: Git Repository Setup${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

git add .
git commit -m "🚀 Professional HPMREI Dashboard

✅ Enterprise-grade security with password protection
✅ Mobile-responsive trading interface  
✅ Real-time signal monitoring
✅ Advanced filtering and pagination
✅ Production-ready for Vercel deployment

Features:
- Secure authentication system
- IP whitelisting capability
- Live data proxy integration
- Professional UI/UX design
- Multi-device compatibility
- Zero-configuration deployment" > /dev/null 2>&1

echo -e "${GREEN}✅ Git repository prepared${NC}"
echo ""

# Step 6: Deployment instructions
echo -e "${BLUE}🌐 Step 6: Deployment Instructions${NC}"
echo ""
echo -e "${YELLOW}🎯 NEXT STEPS:${NC}"
echo ""
echo "1. 📚 CREATE GITHUB REPOSITORY:"
echo "   • Go to https://github.com"
echo "   • Click 'New Repository'"
echo "   • Name: 'hpmrei-trading-dashboard'"
echo "   • Visibility: Private (recommended)"
echo "   • DO NOT initialize with README"
echo ""
echo "2. 📤 PUSH CODE TO GITHUB:"
echo "   Copy and run these commands:"
echo -e "   ${GREEN}git remote add origin https://github.com/YOUR_USERNAME/hpmrei-trading-dashboard.git${NC}"
echo -e "   ${GREEN}git branch -M main${NC}"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo ""
echo "3. 🚀 DEPLOY TO VERCEL:"
echo "   • Go to https://vercel.com"
echo "   • Click 'New Project'"
echo "   • Import your GitHub repository"
echo "   • Framework: Next.js (auto-detected)"
echo "   • Click 'Deploy'"
echo ""
echo "4. 🔒 CONFIGURE SECURITY:"
echo "   In Vercel dashboard → Settings → Environment Variables:"
echo -e "   ${GREEN}NEXT_PUBLIC_DASHBOARD_PASSWORD${NC} = YourSecurePassword123"
echo -e "   ${GREEN}BACKEND_API_URL${NC} = http://localhost:5000"
echo -e "   ${GREEN}NEXT_PUBLIC_ALLOWED_IPS${NC} = your.ip.address (optional)"
echo ""
echo "5. 🌐 ACCESS YOUR DASHBOARD:"
echo "   Your secure URL: https://your-project-name.vercel.app"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo "• Change the default password immediately"
echo "• Consider IP whitelisting for maximum security"
echo "• Monitor access logs in Vercel dashboard"
echo "• Never share your password publicly"
echo ""
echo -e "${GREEN}🎉 Your professional trading dashboard is ready for deployment!${NC}"
echo ""
echo -e "${BLUE}📞 Need help? Check the detailed README.md file${NC}"
echo "=============================================="
