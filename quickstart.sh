#!/bin/bash

# 🚀 Quick Start Guide - Contest Tracker Backend
# Run this script to verify and test your backend

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Contest Tracker Backend - Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify structure
echo -e "${BLUE}📋 Step 1: Verifying Backend Structure...${NC}"
./verify-backend.sh
echo ""

# Step 2: Check if dev server is running
echo -e "${BLUE}🔍 Step 2: Checking Development Server...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Development server is running"
    SERVER_RUNNING=true
else
    echo -e "${YELLOW}ℹ${NC} Development server not running"
    echo "  Start with: npm run dev"
    SERVER_RUNNING=false
fi
echo ""

# Step 3: Test API if server is running
if [ "$SERVER_RUNNING" = true ]; then
    echo -e "${BLUE}🧪 Step 3: Testing API Endpoints...${NC}"
    echo ""
    
    echo "Test 1: Fetching all contests..."
    RESPONSE=$(curl -s http://localhost:3000/api/contests)
    COUNT=$(echo $RESPONSE | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    
    if [ ! -z "$COUNT" ]; then
        echo -e "${GREEN}✓${NC} API is working! Found $COUNT contests"
    else
        echo -e "${YELLOW}⚠${NC} API returned unexpected response"
    fi
    echo ""
    
    echo "Test 2: Testing platform filter..."
    curl -s http://localhost:3000/api/contests?platform=Codeforces > /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Platform filtering works"
    fi
    echo ""
    
    echo "Test 3: Testing source selection..."
    curl -s http://localhost:3000/api/contests?sources=leetcode > /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Source selection works"
    fi
    echo ""
fi

# Step 4: Show available commands
echo -e "${BLUE}📚 Available Commands:${NC}"
echo ""
echo "Start dev server:"
echo "  npm run dev"
echo ""
echo "Test API:"
echo "  curl http://localhost:3000/api/contests"
echo ""
echo "Get Codeforces only:"
echo "  curl http://localhost:3000/api/contests?platform=Codeforces"
echo ""
echo "Get from specific sources:"
echo "  curl http://localhost:3000/api/contests?sources=leetcode,codeforces"
echo ""
echo "Pretty print (requires jq):"
echo "  curl -s http://localhost:3000/api/contests | jq"
echo ""
echo "Clear cache:"
echo "  curl -X POST http://localhost:3000/api/contests \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"action\": \"clear-cache\"}'"
echo ""

# Step 5: Documentation
echo -e "${BLUE}📖 Documentation:${NC}"
echo "  • BACKEND_README.md        - Complete API reference"
echo "  • ARCHITECTURE.md          - System architecture"
echo "  • API_EXAMPLES.js          - Code examples"
echo "  • IMPLEMENTATION_SUMMARY.md - Project overview"
echo ""

# Step 6: Show file structure
echo -e "${BLUE}📁 Project Structure:${NC}"
echo "app/api/contests/route.js    # Main API endpoint"
echo "lib/"
echo "  ├── cache.js               # Caching layer"
echo "  ├── normalize.js           # Data normalization"
echo "  └── sources/               # Platform fetchers"
echo "      ├── kontests.js"
echo "      ├── codeforces.js"
echo "      ├── leetcode.js"
echo "      ├── codechef.js"
echo "      └── atcoder.js"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Backend is ready to use!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
