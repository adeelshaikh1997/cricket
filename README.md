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

## 🔧 **Debugging & Fixes Applied:**

### **✅ What I Fixed:**
1. **Improved Player Generation**: Better null checking and fallbacks
2. **Added Console Logging**: To see exactly what players are generated  
3. **Added Fallback Players**: In case teams don't load properly
4. **Added Debug Info**: Shows team/player counts in the UI

### **🔍 How to Debug:**

**1. Refresh Your Browser:**
```
http://localhost:3001
```

**2. Go to Cricket Insights → Player Deep Dive:**
- Select "🏏 Player Deep Dive" from the View Type dropdown

**3. Check the Debug Info:**
You'll now see a debug box showing:
- Teams loaded: [number]
- International teams: [number]  
- Sample teams: [team names]
- Total players: [number]

**4. Check Browser Console:**
- Press `F12` → Console tab
- Look for logs like:
  - `"Generated players for India: [...]"`
  - `"Adding 5 players for India: [...]"`
  - `"Total players generated: [number]"`

**5. Test the Dropdown:**
- The player dropdown should now show proper names like:
  - "IND Captain (Captain)"
  - "AUS Star Batsman (Star Batsman)"
  - Instead of blank/dots

---

## 🎯 **What to Check:**

**If you still see dots/blanks:**
1. **Check the debug info numbers** - are they showing proper counts?
2. **Check browser console** - are the player names logging correctly?
3. **Try selecting a player anyway** - does the analysis load despite the display issue?

**If you see fallback players:**
- This means the team data isn't loading properly
- Check if the backend is running: `http://localhost:5001/teams`

**🚀 Go test it now and let me know what the debug info shows!** 

The console logs will tell us exactly what's happening with the player generation. 🏏🔍