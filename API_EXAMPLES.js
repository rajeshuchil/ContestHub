/**
 * 🧪 Backend Testing Examples
 * 
 * This file demonstrates how to test the multi-platform contest API
 * Run these tests after starting your development server (npm run dev)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📡 BASIC USAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Fetch all contests from all platforms
fetch('http://localhost:3000/api/contests')
  .then(res => res.json())
  .then(data => {
    console.log('Total contests:', data.count);
    console.log('Sources used:', data.sources);
    console.log('Platform stats:', data.platformStats);
    console.log('First contest:', data.contests[0]);
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 FILTERING BY PLATFORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 2. Get only Codeforces contests
fetch('http://localhost:3000/api/contests?platform=Codeforces')
  .then(res => res.json())
  .then(data => {
    console.log('Codeforces contests:', data.count);
  });

// 3. Get only LeetCode contests
fetch('http://localhost:3000/api/contests?platform=LeetCode')
  .then(res => res.json())
  .then(data => {
    console.log('LeetCode contests:', data.count);
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 SELECTING SPECIFIC SOURCES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 4. Fetch from specific sources only
fetch('http://localhost:3000/api/contests?sources=leetcode,codeforces')
  .then(res => res.json())
  .then(data => {
    console.log('Contests from selected sources:', data.count);
    console.log('Sources:', data.sources);
  });

// 5. Fetch from a single source
fetch('http://localhost:3000/api/contests?sources=kontests')
  .then(res => res.json())
  .then(data => {
    console.log('Kontests only:', data.count);
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 CACHE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 6. Clear cache
fetch('http://localhost:3000/api/contests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'clear-cache' })
})
  .then(res => res.json())
  .then(data => {
    console.log('Cache cleared:', data.message);
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 ADVANCED USAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 7. Get upcoming contests only (filter in code)
fetch('http://localhost:3000/api/contests')
  .then(res => res.json())
  .then(data => {
    const upcoming = data.contests.filter(c => c.status === 'upcoming');
    console.log('Upcoming contests:', upcoming.length);
  });

// 8. Group contests by platform
fetch('http://localhost:3000/api/contests')
  .then(res => res.json())
  .then(data => {
    const byPlatform = data.contests.reduce((acc, contest) => {
      if (!acc[contest.platform]) acc[contest.platform] = [];
      acc[contest.platform].push(contest);
      return acc;
    }, {});
    console.log('Contests by platform:', byPlatform);
  });

// 9. Get next 5 contests
fetch('http://localhost:3000/api/contests')
  .then(res => res.json())
  .then(data => {
    const next5 = data.contests
      .filter(c => c.status === 'upcoming')
      .slice(0, 5);
    console.log('Next 5 contests:', next5);
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧪 CURL COMMANDS (for terminal testing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
# Get all contests
curl http://localhost:3000/api/contests

# Get Codeforces contests only
curl http://localhost:3000/api/contests?platform=Codeforces

# Get from specific sources
curl http://localhost:3000/api/contests?sources=leetcode,codechef

# Pretty print JSON
curl http://localhost:3000/api/contests | jq

# Clear cache
curl -X POST http://localhost:3000/api/contests \
  -H "Content-Type: application/json" \
  -d '{"action": "clear-cache"}'

# Save response to file
curl http://localhost:3000/api/contests > contests.json

# Get contest count
curl -s http://localhost:3000/api/contests | jq '.count'

# List all platforms
curl -s http://localhost:3000/api/contests | jq '.platformStats | keys'

# Get platform statistics
curl -s http://localhost:3000/api/contests | jq '.platformStats'
*/

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 EXPECTED RESPONSE FORMAT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const exampleResponse = {
  "contests": [
    {
      "id": "codeforces-1234",
      "platform": "Codeforces",
      "name": "Codeforces Round #123",
      "startTime": "2026-01-27T14:35:00.000Z",
      "duration": 7200,
      "url": "https://codeforces.com/contest/1234",
      "status": "upcoming"
    },
    {
      "id": "leetcode-weekly-123",
      "platform": "LeetCode",
      "name": "Weekly Contest 123",
      "startTime": "2026-01-28T02:30:00.000Z",
      "duration": 5400,
      "url": "https://leetcode.com/contest/weekly-123",
      "status": "upcoming"
    }
  ],
  "cached": false,
  "count": 42,
  "sources": ["kontests", "codeforces", "leetcode", "codechef", "atcoder"],
  "platformStats": {
    "Codeforces": { "total": 10, "upcoming": 8, "ongoing": 1, "ended": 1 },
    "LeetCode": { "total": 8, "upcoming": 8, "ongoing": 0, "ended": 0 },
    "CodeChef": { "total": 5, "upcoming": 4, "ongoing": 1, "ended": 0 }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ ERROR HANDLING EXAMPLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// The API gracefully handles failures
// Even if some platforms fail, you'll still get data from successful ones

// Example error response (when ALL sources fail):
const errorResponse = {
  "error": "Failed to fetch contest data",
  "message": "All data sources failed to fetch",
  "contests": []
};

// Partial failure is handled gracefully:
// - Codeforces fails → Still get LeetCode, CodeChef, etc.
// - Only returns 500 if ALL sources fail

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 INTEGRATION EXAMPLE (React)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
// In your React component:
import { useEffect, useState } from 'react';

function ContestList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then(data => {
        setContests(data.contests);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch contests:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading contests...</div>;

  return (
    <div>
      {contests.map(contest => (
        <div key={contest.id}>
          <h3>{contest.name}</h3>
          <p>Platform: {contest.platform}</p>
          <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
          <p>Duration: {contest.duration / 3600} hours</p>
          <p>Status: {contest.status}</p>
          <a href={contest.url} target="_blank">Register</a>
        </div>
      ))}
    </div>
  );
}
*/

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 DEPLOYMENT CHECKLIST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
✅ All platform fetchers implemented
✅ Normalization logic working
✅ Caching enabled
✅ Error handling in place
✅ API route properly configured
✅ Ready for Vercel deployment

Deploy command:
  vercel deploy

Test after deployment:
  curl https://your-domain.vercel.app/api/contests
*/

const examples = {
  exampleResponse,
  errorResponse
};

export default examples;
