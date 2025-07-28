# 🆓 Free Cricket Data Options

## Option 1: CricAPI (Free Tier)
- **URL**: https://cricapi.com/
- **Free Tier**: 100 requests/day
- **Pros**: Simple, reliable
- **Cons**: Limited historical data

```javascript
// Easy to integrate - just change the base URL
const CRICAPI_BASE_URL = 'https://cricapi.com/api';
```

## Option 2: CSV Dataset Integration
- **Download**: Historical cricket data from Kaggle
- **Pros**: No API limits, works offline
- **Cons**: Not live/current data

```python
# Add to your backend
import pandas as pd

def load_cricket_dataset():
    # Download from: https://www.kaggle.com/datasets/jaykay12/cricket-match-dataset
    df = pd.read_csv('data/cricket_matches.csv')
    return df.to_dict('records')
```

## Option 3: GitHub Cricket Data
- **Source**: Community-maintained datasets
- **Pros**: Free, collaborative
- **Example**: https://github.com/cricsheet/cricsheet

## Option 4: Build Your Own Scraper (Advanced)
```python
# Scrape ESPNCricinfo (educational purposes)
import requests
from bs4 import BeautifulSoup

def get_team_rankings():
    # Implementation here
    pass
```

## Quick Implementation (5 minutes)

1. **Download Sample Data**: 
   ```bash
   curl https://raw.githubusercontent.com/cricsheet/cricsheet/master/csv/all_players.csv > data/players.csv
   ```

2. **Update Backend**:
   ```python
   # In cricket_service.py
   def get_teams_from_csv():
       df = pd.read_csv('data/teams.csv')
       return df.to_dict('records')
   ```

3. **Test**: Your app now uses real historical data!

## Recommended Learning Path:
1. Start with CSV data (immediate, free)
2. Try CricAPI free tier (learn API concepts)  
3. Upgrade to SportMonks (professional features)
4. Build custom scraper (advanced skills) 