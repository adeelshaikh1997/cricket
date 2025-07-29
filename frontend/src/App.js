import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import MatchPredictor from './pages/MatchPredictor';
import CricketInsights from './pages/CricketInsights';
import PlayerDeepDive from './pages/PlayerDeepDive';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MatchPredictor />} />
            <Route path="/insights" element={<CricketInsights />} />
            <Route path="/player-analysis" element={<PlayerDeepDive />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
