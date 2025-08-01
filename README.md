# 🏏 Cricklytics Premium

> **Advanced Cricket Analytics Platform powered by SportMonks Premium API**

A comprehensive cricket analytics platform that provides real-time scores, player statistics, match predictions, and advanced analytics using **SportMonks Premium API** for the most accurate and up-to-date cricket data.

## ✨ Features

### 🔴 Live Cricket Data
- **Real-time live scores** and match updates
- **Ball-by-ball commentary** and match progression
- **Live match statistics** and player performances

### 📊 Advanced Analytics
- **Comprehensive player statistics** with career data
- **Situational performance analysis** (chasing vs defending)
- **Phase-wise performance** (powerplay, middle, death overs)
- **Venue-based performance analysis**
- **Form analysis and momentum tracking**

### 🎯 Match Predictions
- **AI-powered match predictions** using machine learning
- **Team strength analysis** and head-to-head comparisons  
- **Venue impact assessment** and toss advantage analysis
- **Real-time prediction updates** during matches

### 🏆 Premium Data Coverage
- **All international cricket teams** and players
- **Comprehensive venue database** with pitch conditions
- **Official tournament data** from ICC and domestic leagues
- **Weather and pitch reports** for enhanced predictions
- **Historical match database** for trend analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ with pip
- **SportMonks Premium API key** (required)

### 1. Get SportMonks Premium API Key

1. **Sign up** at [SportMonks Cricket API](https://www.sportmonks.com/cricket-api/)
2. **Choose Premium Plan** for full access to all features
3. **Copy your API key** from the dashboard

### 2. Environment Setup

Create environment files:

**Backend `.env`:**
```bash
SPORTMONKS_API_KEY=your_premium_api_key_here
FLASK_DEBUG=True
PORT=5001
```

**Frontend `.env`:**
```bash
REACT_APP_BACKEND_URL=http://localhost:5001
```

### 3. Installation & Run

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Start backend (Terminal 1)
cd ../backend
python app.py

# Start frontend (Terminal 2)
cd ../frontend
npm start
```

Visit **http://localhost:3000** to access the application.

## 🏛️ Architecture

### Backend (Python/Flask)
- **SportMonks Premium Service**: Complete API integration
- **Prediction Engine**: ML-based match prediction system
- **Data Processing**: Real-time data transformation and caching
- **Rate Limiting**: Intelligent API usage optimization

### Frontend (React)
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Updates**: Live match data and score updates
- **Interactive Charts**: Player performance visualizations
- **Progressive Web App**: Offline support and mobile optimization

## 📊 API Endpoints

### Cricket Data
- `GET /teams` - All cricket teams
- `GET /players` - Player database with statistics
- `GET /venues` - Cricket venues worldwide
- `GET /live-matches` - Live matches with real-time scores
- `GET /fixtures` - Upcoming matches and fixtures

### Player Analytics  
- `GET /players/{name}/matches` - Match history
- `GET /players/{name}/analytics` - Advanced analytics
- `GET /status` - Service status and API usage

### Predictions
- `POST /predict` - Match outcome predictions

## 💎 SportMonks Premium Benefits

### High Performance
- **300 calls/minute** rate limit
- **10,000 calls/hour** for intensive usage  
- **100,000 calls/day** for enterprise needs

### Comprehensive Data
- **Real-time live scores** with ball-by-ball updates
- **Complete player career statistics**
- **Official tournament and league data**
- **Weather and pitch condition reports**
- **Social media integration data**

### Professional Features
- **Commercial usage allowed**
- **Priority support** and dedicated account management
- **99.9% uptime SLA** for mission-critical applications
- **Advanced filtering and search capabilities**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPORTMONKS_API_KEY` | Premium API key from SportMonks | ✅ Yes |
| `FLASK_DEBUG` | Enable debug mode | No |
| `PORT` | Backend server port | No |
| `CRICKET_DEV_MODE` | Development mode settings | No |

### Rate Limiting

The application automatically manages SportMonks Premium rate limits:
- **Intelligent caching** to minimize API calls
- **Request queuing** to prevent rate limit exceeded errors
- **Automatic retries** with exponential backoff
- **Usage monitoring** and optimization recommendations

## 🚀 Deployment

### Production Setup

1. **Set production environment variables**
2. **Configure reverse proxy** (nginx recommended)
3. **Enable SSL/TLS** for secure connections
4. **Set up monitoring** for API usage and performance

### Docker Deployment

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d
```

## 📈 Monitoring & Analytics

### API Usage Tracking
- **Real-time usage monitoring** via `/api-usage` endpoint
- **Daily, hourly, and minute-level** usage statistics
- **Automated alerts** for approaching rate limits
- **Cost optimization** recommendations

### Performance Metrics
- **Response time monitoring**
- **Cache hit rates** and efficiency
- **Error rate tracking** and alerting
- **User engagement analytics**

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements  
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **SportMonks Cricket API**: https://www.sportmonks.com/cricket-api/
- **Documentation**: Comprehensive API documentation available
- **Support**: Premium support included with subscription

---

**Built with ❤️ for cricket enthusiasts worldwide**

*Powered by SportMonks Premium API for the most accurate and comprehensive cricket data available.*