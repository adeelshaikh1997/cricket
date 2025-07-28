# 🏏 API Integration Guide for Cricklytics

## 🎯 Goal: Replace Mock Data with Real Cricket Data

### **Step 1: Get SportMonks API Access**

1. **Sign Up**: Go to [sportmonks.com](https://www.sportmonks.com/)
2. **Choose Plan**: Start with free tier (usually 100 requests/day)
3. **Get API Key**: Copy your API token
4. **Test Access**: Try a simple request

```bash
# Test your API key
curl "https://cricket.sportmonks.com/api/v2.0/teams?api_token=YOUR_API_KEY"
```

### **Step 2: Configure Your App**

Create environment files:

**Backend `.env`:**
```env
SPORTMONKS_API_KEY=your_actual_api_key_here
FLASK_DEBUG=True
PORT=5001
```

**Frontend `.env`:**
```env
REACT_APP_BACKEND_URL=http://localhost:5001
REACT_APP_SPORTMONKS_API_KEY=your_actual_api_key_here
```

### **Step 3: Enable Real Data (Code Already Ready!)**

Your app is already configured to use real data! Just add the API key and it will automatically switch from mock data to real data.

**Test Real Data:**
```bash
# Set your API key
export SPORTMONKS_API_KEY="your_key_here"

# Restart backend
cd backend && python app.py

# Test teams endpoint
curl http://localhost:5001/teams
```

### **Step 4: Gradual Migration Plan**

**Week 1: Teams & Venues**
- ✅ Replace mock teams with real teams
- ✅ Replace mock venues with real venues
- ✅ Keep predictions working with new data

**Week 2: Enhanced Predictions**
- 🔮 Use real team rankings/ratings
- 🔮 Add recent team form data
- 🔮 Include head-to-head history

**Week 3: Live Features**
- 🔮 Real upcoming fixtures
- 🔮 Live match scores (if available)
- 🔮 Player performance data

### **Step 5: Error Handling for Real APIs**

Add robust error handling:

```javascript
// In frontend/src/services/api.js (already implemented!)
const handleAPIError = (error) => {
  if (error.response?.status === 429) {
    return 'Rate limit exceeded - please try again later';
  }
  if (error.response?.status === 401) {
    return 'Invalid API key - please check configuration';
  }
  return 'Network error - please check connection';
};
```

### **Step 6: Fallback Strategy**

Your app already has a smart fallback:
- ✅ Try real API first
- ✅ If API fails → use mock data
- ✅ Show user which data source is active

### **Alternative APIs (If SportMonks is Too Expensive)**

1. **CricAPI** - Free tier available
2. **Cricbuzz Unofficial API** - Free but limited
3. **ESPNCricinfo** - Scraping (advanced)
4. **Custom Dataset** - Use CSV files with historical data

### **Expected Costs & Limits**

**SportMonks Free Tier:**
- 100 requests/day
- Basic team/venue data
- No commercial use

**SportMonks Paid Tier ($29/month):**
- 10,000 requests/day
- Live scores
- Historical data
- Commercial use allowed

### **Testing Your Integration**

```bash
# Test real vs mock data
curl http://localhost:5001/teams | jq '.data[0]'

# Mock response:
{"id": 1, "name": "India", "code": "IND"}

# Real API response:
{"id": 1, "name": "India", "code": "IND", "ranking": 2, "recent_form": [...]}
```

### **Monitoring API Usage**

```javascript
// Add usage tracking
let apiCallsToday = 0;
const MAX_CALLS_PER_DAY = 100;

function trackAPICall() {
  apiCallsToday++;
  if (apiCallsToday > MAX_CALLS_PER_DAY * 0.8) {
    console.warn('Approaching API limit for today');
  }
}
```

### **Success Metrics**

After integration, you should see:
- ✅ Real team names and data
- ✅ Accurate venue information  
- ✅ More realistic predictions
- ✅ Current tournament fixtures
- ✅ No more "mock data" in responses 