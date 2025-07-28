# Cricklytics Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- SportMonks Cricket API key (optional for demo)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd cricket
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -c "from models.match_predictor import train_and_save_model; train_and_save_model()"
python app.py
```

The backend will start on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
FLASK_DEBUG=True
PORT=5001
SPORTMONKS_API_KEY=your_api_key_here
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5001
REACT_APP_SPORTMONKS_API_KEY=your_api_key_here
```

## 📁 Project Structure

```
cricket/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API integration
│   │   └── context/       # React context (theme)
│   └── public/
├── backend/               # Python Flask API
│   ├── services/          # Business logic services
│   ├── models/           # ML models
│   └── app.py            # Main Flask application
├── models/               # Trained ML models storage
├── data/                 # Data files and cache
└── README.md
```

## 🎯 Features

### ✅ Match Outcome Predictor
- Team selection dropdowns
- Venue, toss, and match type configuration
- ML-powered predictions with confidence scores
- Feature importance visualization

### ✅ Cricket Insights Explorer
- Interactive charts and visualizations
- Team performance analytics
- Player statistics dashboard
- Venue analysis and trends

### ✅ UI/UX Features
- Dark/light mode toggle
- Mobile-responsive design
- Cricket-themed color scheme
- Smooth animations and transitions

## 🔌 API Endpoints

### Backend API

- `GET /health` - Health check
- `POST /predict` - Match prediction
- `GET /model/info` - Model information
- `GET /teams` - List of teams
- `GET /venues` - List of venues
- `GET /fixtures` - Match fixtures
- `GET /players/{id}` - Player statistics
- `GET /teams/{id}/stats` - Team statistics

## 🧠 Machine Learning Model

### Model Details
- **Algorithm**: Random Forest Classifier
- **Features**: Team ratings, venue factors, toss advantage, match type
- **Training Accuracy**: ~95%
- **Test Accuracy**: ~76%
- **Model File**: `models/cricket_predictor.joblib`

### Retraining the Model

```bash
cd backend
python models/match_predictor.py
```

## 🎨 Customization

### Adding New Teams
Update the mock data in `backend/services/cricket_service.py` or integrate with live SportMonks API.

### Styling Changes
Modify `frontend/tailwind.config.js` for color schemes and theme customizations.

### Chart Types
Add new visualizations in `frontend/src/pages/CricketInsights.js` using Recharts components.

## 🐛 Troubleshooting

### Backend Issues
- **Model not loading**: Run the model training script
- **API errors**: Check API key configuration
- **Port 5000 conflicts (AirPlay)**: Backend now uses port 5001 by default to avoid macOS AirPlay conflicts
- **Port conflicts**: Change PORT in `.env` to use a different port

### Frontend Issues
- **Build errors**: Clear node_modules and reinstall
- **API connection**: Verify backend URL in `.env`
- **Chart rendering**: Check Recharts installation

### Common Solutions

```bash
# Backend dependency issues
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend dependency issues
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Development Workflow

1. **Backend Changes**:
   - Modify services in `backend/services/`
   - Update API endpoints in `backend/app.py`
   - Test with `python app.py`

2. **Frontend Changes**:
   - Update components in `frontend/src/components/`
   - Modify pages in `frontend/src/pages/`
   - Test with `npm start`

3. **Model Updates**:
   - Retrain model with new data
   - Update prediction logic in `services/prediction_service.py`

## 📦 Production Deployment

### Backend (Heroku/Railway)

```bash
# Add Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
# Build for production
npm run build

# Deploy build folder
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

```dockerfile
# Frontend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
```

## 🔒 Security Notes

- Keep API keys in environment variables
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Regular dependency updates

## 📈 Performance Optimization

- Enable Redis caching for API responses
- Implement lazy loading for charts
- Optimize bundle size with code splitting
- Use CDN for static assets
- Database indexing for team/player queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 