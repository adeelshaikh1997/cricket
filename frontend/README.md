# 🏏 Cricklytics - Cricket Analytics Platform

A comprehensive cricket analytics platform built with React, featuring match predictions, player analysis, and statistical insights.

## ✨ Features

### 🎯 Match Predictor
- **Smart Match Predictions** using team rankings and match conditions
- **Win Probability Analysis** with confidence levels
- **Key Factors Breakdown** (team ranking, toss advantage, home advantage)
- **12 International Teams** supported
- **Multiple Match Formats** (T20, ODI, Test)

### 👤 Player Deep Dive
- **50 International Players** from 12 countries
- **Comprehensive Statistics** (batting, bowling, fielding)
- **Role-Based Analysis** (Batsmen, Bowlers, All-rounders, Wicket-keepers)
- **Performance Trends** and recent form analysis
- **Interactive Charts** and visualizations
- **Format-wise Performance** (T20I, ODI, Test)

### 🎨 Modern UI/UX
- **Dark/Light Theme** toggle
- **Responsive Design** for all devices
- **Professional Cricket Theme** with custom colors
- **Interactive Charts** using Recharts
- **Smooth Animations** and transitions

## 🚀 Live Demo

Visit the live application: [Cricklytics](https://adeelshaikh.github.io/cricket-analytics)

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Routing**: React Router DOM 7.7.1
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 3.1.0
- **Icons**: Lucide React 0.532.0
- **Build Tool**: Create React App 5.0.1

## 📊 Data Coverage

### International Teams (12)
- India, Australia, England, South Africa, New Zealand
- Pakistan, West Indies, Sri Lanka, Bangladesh, Afghanistan
- Ireland, Netherlands

### Players (50)
- **Batsmen**: Virat Kohli, Steve Smith, Joe Root, Kane Williamson, Babar Azam, etc.
- **Bowlers**: Pat Cummins, Kagiso Rabada, Shaheen Afridi, Trent Boult, etc.
- **All-rounders**: Ben Stokes, Glenn Maxwell, Shakib Al Hasan, etc.
- **Wicket-keepers**: Jos Buttler, Rishabh Pant, Quinton de Kock, etc.

### Venues
- Lord's (London), MCG (Melbourne), Eden Gardens (Kolkata)
- Wankhede Stadium (Mumbai), The Oval (London)
- Gaddafi Stadium (Lahore), Newlands (Cape Town)
- Basin Reserve (Wellington), Kensington Oval (Barbados)

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adeelshaikh/cricket-analytics.git
   cd cricket-analytics/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Card.js
│   │   └── Layout.js
│   ├── context/
│   │   └── ThemeContext.js
│   ├── pages/
│   │   ├── MatchPredictor.js
│   │   └── PlayerDeepDive.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Match Prediction Algorithm
- **Team Ranking Analysis**: Higher ranked teams get probability boost
- **Toss Advantage**: 15% boost for toss winner
- **Home Advantage**: 10% boost for home teams
- **Format Experience**: 20% base factor for international experience
- **Confidence Scoring**: 75-95% confidence range

### Player Analytics
- **Career Statistics**: Comprehensive batting and bowling stats
- **Recent Form**: Last 10 matches with detailed breakdown
- **Performance Trends**: 6-month trend analysis
- **Format Performance**: T20I, ODI, Test statistics
- **Opponent Analysis**: Performance against different teams
- **Skills Radar**: Role-specific skill assessment

## 🎨 Customization

### Theme Colors
The application uses custom cricket-themed colors defined in `tailwind.config.js`:

```javascript
'cricket-green': {
  50: '#f0fdf4',
  500: '#22c55e',
  600: '#16a34a',
  // ...
}
```

### Adding New Players
To add new players, edit the `getFallbackPlayers()` function in `PlayerDeepDive.js`:

```javascript
{
  name: 'Player Name',
  fullName: 'Player Name (Country)',
  team: 'Country',
  teamCode: 'CODE',
  role: 'Batsman/Bowler/All-rounder/Wicket-keeper',
  ranking: 1-50,
  searchTerm: 'player name country code role'
}
```

## 🚀 Deployment

### GitHub Pages
The application is configured for GitHub Pages deployment:

1. **Repository Setup**: Ensure repository is public
2. **GitHub Pages**: Enable in repository settings
3. **Deploy**: Run `npm run deploy`

### Other Platforms
- **Netlify**: Connect repository and build with `npm run build`
- **Vercel**: Import repository and auto-deploy
- **Firebase**: Use Firebase Hosting

## 📈 Performance

- **Bundle Size**: ~187KB (gzipped)
- **Load Time**: < 2 seconds
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cricket Data**: Comprehensive international cricket statistics
- **React Community**: Excellent documentation and ecosystem
- **Tailwind CSS**: Beautiful utility-first CSS framework
- **Recharts**: Powerful charting library for React

## 📞 Contact

- **Developer**: Adeel Shaikh
- **GitHub**: [@adeelshaikh](https://github.com/adeelshaikh)
- **Project**: [Cricket Analytics](https://github.com/adeelshaikh/cricket-analytics)

---

Made with 🏏 for cricket analytics enthusiasts!
