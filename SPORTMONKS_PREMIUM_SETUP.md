# 🏏 SportMonks Premium Setup Guide

Complete setup guide for integrating SportMonks Premium API with Cricklytics Premium platform.

## 🎯 Why SportMonks Premium?

SportMonks Premium API provides the most comprehensive and reliable cricket data available:

### ✅ **Premium Features**
- **300 calls/minute** - High performance rate limits
- **10,000 calls/hour** - Perfect for intensive applications
- **100,000 calls/day** - Enterprise-grade usage
- **Real-time live scores** with ball-by-ball updates
- **Complete player career statistics** and analytics
- **Official tournament data** from ICC and domestic leagues
- **Weather and pitch reports** for enhanced predictions
- **Social media integration** data
- **99.9% uptime SLA** for mission-critical applications

### 🚀 **Commercial Benefits**
- **Commercial usage allowed** - Build revenue-generating applications
- **Priority support** with dedicated account management
- **Advanced filtering** and search capabilities
- **Historical data access** going back years
- **Professional documentation** and SDK support

## 🔑 Getting Your Premium API Key

### Step 1: Sign Up for Premium

1. **Visit SportMonks**: Go to [SportMonks Cricket API](https://www.sportmonks.com/cricket-api/)
2. **Choose Premium Plan**: Select the plan that fits your needs:
   - **Starter Premium**: $29/month - 10K calls/day
   - **Professional**: $99/month - 50K calls/day  
   - **Enterprise**: $299/month - 100K calls/day
3. **Complete Payment**: Process your subscription
4. **Verify Account**: Check email for verification

### Step 2: Get Your API Key

1. **Login to Dashboard**: Access your SportMonks account
2. **Navigate to API Keys**: Find your premium API key
3. **Copy Key**: Copy the full API key (usually 60 characters)
4. **Save Securely**: Store in a secure location

**Example API Key Format:**
```
5qOnVkUreOyABCDEF1234567890abcdefghijklmnopqrstuvwxyzABCDEF
```

### Step 3: Verify Premium Access

Test your premium access with curl:

```bash
curl "https://cricket.sportmonks.com/api/v2.0/teams?api_token=YOUR_PREMIUM_KEY&include=country,players,squad"
```

**Expected Response**: Comprehensive team data with players, country info, and squad details.

## ⚙️ Environment Configuration

### Backend Configuration

Create `backend/.env`:

```bash
# REQUIRED - SportMonks Premium API Key
SPORTMONKS_API_KEY=your_premium_api_key_here

# Optional Development Settings
FLASK_DEBUG=True
PORT=5001
CRICKET_DEV_MODE=false  # Set to false for production caching
LOG_LEVEL=INFO

# Optional Performance Settings
CACHE_DURATION=300      # 5 minutes cache in production
MAX_CACHE_SIZE=1000     # Maximum cached responses
```

### Frontend Configuration

Create `frontend/.env`:

```bash
# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:5001

# Optional UI Settings
REACT_APP_APP_NAME=Cricklytics Premium
REACT_APP_VERSION=2.0.0
REACT_APP_DATA_SOURCE=SportMonks Premium
```

## 🏗️ Installation & Setup

### Prerequisites

- **Node.js 16+** and npm
- **Python 3.8+** and pip
- **SportMonks Premium API Key**
- **Git** for version control

### Step 1: Install Dependencies

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

```bash
# Set your premium API key
cd backend
echo "SPORTMONKS_API_KEY=your_actual_premium_key" > .env

# Configure frontend
cd ../frontend  
echo "REACT_APP_BACKEND_URL=http://localhost:5001" > .env
```

### Step 3: Start Services

```bash
# Terminal 1 - Start Backend
cd backend
python app.py

# Terminal 2 - Start Frontend
cd ../frontend
npm start
```

### Step 4: Verify Integration

1. **Backend Health**: http://localhost:5001/health
2. **API Status**: http://localhost:5001/status
3. **Teams Data**: http://localhost:5001/teams
4. **Frontend**: http://localhost:3000

## 📊 API Usage & Monitoring

### Rate Limits

SportMonks Premium provides generous rate limits:

```bash
# Per minute: 300 calls
# Per hour: 10,000 calls  
# Per day: 100,000 calls
```

### Monitor Usage

Check real-time usage via API endpoints:

```bash
# Current usage statistics
curl http://localhost:5001/api-usage

# Service status and features
curl http://localhost:5001/status
```

**Example Response:**
```json
{
  "usage_today": {
    "calls_made": 247,
    "percentage": 0.25
  },
  "rate_limits": {
    "per_minute": 300,
    "per_hour": 10000,
    "per_day": 100000
  },
  "features": [
    "Live Scores",
    "Player Statistics", 
    "Team Data",
    "Venues",
    "Historical Data"
  ]
}
```

### Optimize Usage

The application automatically optimizes API usage:

- **Intelligent Caching**: Reduces redundant calls
- **Request Batching**: Combines multiple requests
- **Rate Limiting**: Prevents exceeding limits
- **Error Handling**: Graceful fallbacks and retries

## 🔌 Available Data & Endpoints

### Cricket Teams

```bash
# Get all teams with comprehensive data
GET /teams

# Response includes:
- Team details and rankings
- Country information  
- Founded date and logo
- Current squad (if available)
```

### Players Database

```bash
# Get players with career statistics
GET /players?team_id=1&country_id=2

# Response includes:
- Complete player profiles
- Career statistics
- Batting/bowling styles
- Team affiliations
```

### Live Matches

```bash
# Real-time live scores
GET /live-matches

# Response includes:
- Current match status
- Live scores and overs
- Team lineups
- Match progression
```

### Match History

```bash
# Player match history with detailed stats
GET /players/{name}/matches?limit=50

# Response includes:
- Detailed batting/bowling figures
- Match results and venues
- Performance analysis
- Real match data from SportMonks
```

### Advanced Analytics

```bash
# Comprehensive player analytics
GET /players/{name}/analytics?role=Batsman

# Response includes:
- Form analysis and momentum
- Situational statistics
- Phase-wise performance
- Venue-based analysis
```

### Venues

```bash
# Complete venues database
GET /venues

# Response includes:
- Venue details and capacity
- Location and coordinates
- Pitch conditions
- Historical match data
```

## 🚀 Advanced Features

### Real-time Updates

SportMonks Premium provides real-time data updates:

- **Live Scores**: Ball-by-ball updates during matches
- **Player Stats**: Real-time performance updates
- **Match Events**: Wickets, boundaries, milestones
- **Weather Data**: Live weather and pitch conditions

### Comprehensive Includes

Premium API supports comprehensive data includes:

```javascript
// All available includes for maximum data
const includes = [
  'teams', 'players', 'venue', 'toss', 'runs', 
  'scoreboards', 'batting', 'bowling', 'fielding',
  'winnerteam', 'manofmatch', 'league', 'stage',
  'season', 'weather', 'officials', 'social'
];
```

### Historical Data Access

Access years of historical cricket data:

- **Match Archives**: Complete match database
- **Player Careers**: Full career statistics
- **Tournament History**: ICC and domestic leagues
- **Performance Trends**: Long-term analysis capabilities

## 🔧 Troubleshooting

### Common Issues

#### 1. API Key Problems

**Issue**: "Invalid API key" errors

**Solutions:**
```bash
# Verify API key format (should be 60 characters)
echo $SPORTMONKS_API_KEY | wc -c

# Test API key directly
curl "https://cricket.sportmonks.com/api/v2.0/teams?api_token=$SPORTMONKS_API_KEY"

# Check environment variables
cd backend && python -c "import os; print('Key loaded:', len(os.getenv('SPORTMONKS_API_KEY', '')))"
```

#### 2. Rate Limiting

**Issue**: Rate limit exceeded errors

**Solutions:**
```bash
# Check current usage
curl http://localhost:5001/api-usage

# Monitor rate limiting in logs
tail -f backend.log | grep "rate limit"

# Adjust caching settings
export CACHE_DURATION=600  # 10 minutes
```

#### 3. Data Quality Issues

**Issue**: Missing or incomplete data

**Solutions:**
```bash
# Verify premium features are working
curl http://localhost:5001/status

# Check specific endpoints
curl http://localhost:5001/teams
curl http://localhost:5001/players

# Review logs for API errors
tail -f backend.log | grep "SportMonks"
```

### Performance Optimization

#### 1. Caching Strategy

```bash
# Production caching settings
CRICKET_DEV_MODE=false
CACHE_DURATION=300        # 5 minutes
MAX_CACHE_SIZE=1000      # 1000 cached responses
```

#### 2. Request Optimization

```bash
# Use specific includes to reduce data transfer
# Implement request queuing for burst traffic
# Enable compression for large responses
```

#### 3. Monitoring Setup

```bash
# Set up monitoring for:
# - API response times
# - Error rates  
# - Cache hit ratios
# - Usage patterns
```

## 💡 Best Practices

### 1. API Key Security

- **Never commit API keys** to version control
- **Use environment variables** for all environments
- **Rotate keys regularly** for security
- **Monitor usage** for unauthorized access

### 2. Error Handling

- **Implement graceful fallbacks** for API failures
- **Use exponential backoff** for retries
- **Log errors comprehensively** for debugging
- **Provide user-friendly error messages**

### 3. Performance

- **Cache frequently accessed data** intelligently
- **Use appropriate timeouts** for API calls
- **Implement request queuing** for high traffic
- **Monitor performance metrics** continuously

### 4. Cost Optimization

- **Use caching effectively** to minimize calls
- **Implement smart data fetching** strategies
- **Monitor usage patterns** and optimize
- **Use batch requests** when possible

## 📈 Production Deployment

### Environment Variables

For production deployment:

```bash
# Production backend .env
SPORTMONKS_API_KEY=your_premium_key
FLASK_DEBUG=False
CRICKET_DEV_MODE=false
CACHE_DURATION=300
LOG_LEVEL=WARNING

# Production frontend .env  
REACT_APP_BACKEND_URL=https://your-domain.com/api
REACT_APP_APP_NAME=Cricklytics Premium
```

### Monitoring Setup

Set up comprehensive monitoring:

```bash
# Health checks
curl https://your-domain.com/health

# Usage monitoring  
curl https://your-domain.com/api-usage

# Performance monitoring
curl -w "@curl-format.txt" https://your-domain.com/teams
```

## 🆘 Support

### SportMonks Support

- **Premium Support**: Included with subscription
- **Documentation**: https://docs.sportmonks.com/cricket/
- **Account Management**: Dedicated support team
- **Technical Issues**: Priority response times

### Application Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides available
- **Community**: Join our Discord/Slack for help
- **Professional Services**: Custom development available

---

## 🎉 Next Steps

1. **✅ Complete Setup**: Follow this guide step by step
2. **🔧 Test Integration**: Verify all endpoints work correctly
3. **📊 Monitor Usage**: Keep track of API consumption
4. **🚀 Deploy**: Follow our deployment guide for production
5. **📈 Scale**: Upgrade plan as your usage grows

**🏏 You're now ready to build amazing cricket applications with SportMonks Premium!** 