# Cricklytics 🏏

A full-stack cricket analytics web application that combines match outcome prediction with comprehensive cricket insights exploration.

## Features

### 🎯 Match Outcome Predictor
- Select real-world cricket match details (teams, venue, toss, etc.)
- Uses pre-trained machine learning models to predict match winners
- Displays win probabilities and feature importance

### 📊 Cricket Insights Explorer
- Visual dashboard for historical and upcoming stats
- Team, player, and venue analytics
- Interactive charts and filters
- Live data from SportMonks Cricket API

## Tech Stack

- **Frontend**: React + Tailwind CSS, React Router, Recharts
- **Backend**: Python Flask for ML predictions and API middleware
- **Data**: SportMonks Cricket API integration
- **ML**: Pre-trained RandomForest/XGBoost models
- **Storage**: Local state + optional SQLite cache

## Project Structure

```
cricket/
├── frontend/          # React application
├── backend/          # Python Flask API
├── models/           # ML models and training scripts
├── data/             # Data files and API cache
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- SportMonks Cricket API key

### Installation

1. Clone the repository
2. Set up frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Set up backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

4. Configure API keys in `.env` files

## API Configuration

Get your SportMonks Cricket API key from [sportmonks.com](https://sportmonks.com) and add it to your environment configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 

./start.sh - script