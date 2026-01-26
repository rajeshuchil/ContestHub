#!/bin/bash

# 🧪 Backend Structure Verification Script
# Verifies that all required files are in place

echo "🔍 Verifying Contest Tracker Backend Structure..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1 (missing)"
    return 1
  fi
}

# Track results
total=0
passed=0

# Core API
echo -e "${BLUE}📡 API Routes:${NC}"
check_file "app/api/contests/route.js" && ((passed++))
((total++))
echo ""

# Utility modules
echo -e "${BLUE}🛠️  Utility Modules:${NC}"
check_file "lib/cache.js" && ((passed++))
((total++))
check_file "lib/normalize.js" && ((passed++))
((total++))
echo ""

# Platform sources
echo -e "${BLUE}🌐 Platform Fetchers:${NC}"
check_file "lib/sources/kontests.js" && ((passed++))
((total++))
check_file "lib/sources/codeforces.js" && ((passed++))
((total++))
check_file "lib/sources/leetcode.js" && ((passed++))
((total++))
check_file "lib/sources/codechef.js" && ((passed++))
((total++))
check_file "lib/sources/atcoder.js" && ((passed++))
((total++))
echo ""

# Documentation
echo -e "${BLUE}📚 Documentation:${NC}"
check_file "BACKEND_README.md" && ((passed++))
((total++))
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $passed -eq $total ]; then
  echo -e "${GREEN}✓ All files verified! ($passed/$total)${NC}"
  echo ""
  echo "🚀 Backend is ready!"
  echo ""
  echo "To start the development server:"
  echo "  npm run dev"
  echo ""
  echo "To test the API:"
  echo "  curl http://localhost:3000/api/contests"
else
  echo -e "${RED}✗ Some files are missing ($passed/$total)${NC}"
  exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
