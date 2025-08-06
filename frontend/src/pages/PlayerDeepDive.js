import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  User,
  Target,
  Loader2,
  Search,
  Trophy
} from 'lucide-react';

const PlayerDeepDive = () => {
  // Player analysis state
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerAnalysisData, setPlayerAnalysisData] = useState(null);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [loadingPlayerStats, setLoadingPlayerStats] = useState(false);

  // Load dummy cricket data
  useEffect(() => {
    console.log('🎯 Loading dummy cricket data...');
    // Simulate loading delay
    setTimeout(() => {
      console.log('✅ Dummy data ready!');
    }, 1000);
  }, []);

  // Generate role-specific career statistics
  const generateRoleSpecificStats = (playerRole, baseAverage, baseStrikeRate, rankingBonus) => {
    const isBowler = playerRole === 'Bowler';
    const isAllRounder = playerRole === 'All-rounder';
    const isWicketKeeper = playerRole === 'Wicket-keeper';
    
    if (isBowler) {
      // Bowler-focused statistics
      return {
        // Primary bowling stats
        totalWickets: Math.floor(150 + rankingBonus * 50 + Math.random() * 200),
        totalMatches: Math.floor(80 + Math.random() * 120),
        bowlingAverage: Number((20 + Math.random() * 15).toFixed(1)),
        economyRate: Number((3.5 + Math.random() * 2.5).toFixed(1)),
        strikeRate: Number((18 + Math.random() * 12).toFixed(1)), // Bowling SR (balls per wicket)
        bestFigures: `${Math.floor(4 + Math.random() * 6)}/${Math.floor(15 + Math.random() * 35)}`,
        fiveWicketHauls: Math.floor(rankingBonus / 3 + Math.random() * 8),
        // Secondary batting stats (many bowlers can bat)
        totalRuns: Math.floor(500 + Math.random() * 1500),
        battingAverage: Number((15 + Math.random() * 20).toFixed(1)),
        highestScore: Math.floor(30 + Math.random() * 70)
      };
    } else if (isAllRounder) {
      // All-rounder balanced statistics
      return {
        // Batting stats
        totalRuns: Math.floor(3000 + rankingBonus * 400 + Math.random() * 4000),
        totalMatches: Math.floor(80 + Math.random() * 120),
        centuries: Math.floor(rankingBonus / 3 + Math.random() * 6),
        fifties: Math.floor(8 + rankingBonus + Math.random() * 15),
        average: Number((35 + Math.random() * 15).toFixed(1)),
        strikeRate: Number(baseStrikeRate.toFixed(1)),
        highestScore: Math.floor(120 + rankingBonus * 3 + Math.random() * 80),
        // Bowling stats
        totalWickets: Math.floor(80 + rankingBonus * 20 + Math.random() * 120),
        bowlingAverage: Number((25 + Math.random() * 15).toFixed(1)),
        economyRate: Number((4.0 + Math.random() * 2.0).toFixed(1)),
        fiveWicketHauls: Math.floor(Math.random() * 4)
      };
    } else if (isWicketKeeper) {
      // Wicket-keeper statistics
      return {
        // Batting stats
        totalRuns: Math.floor(2500 + rankingBonus * 350 + Math.random() * 3500),
        totalMatches: Math.floor(70 + Math.random() * 100),
        centuries: Math.floor(rankingBonus / 3 + Math.random() * 7),
        fifties: Math.floor(6 + rankingBonus + Math.random() * 12),
        average: Number(baseAverage.toFixed(1)),
        strikeRate: Number(baseStrikeRate.toFixed(1)),
        highestScore: Math.floor(80 + rankingBonus * 4 + Math.random() * 100),
        // Wicket-keeping stats
        totalDismissals: Math.floor(200 + rankingBonus * 30 + Math.random() * 250),
        catches: Math.floor(150 + rankingBonus * 25 + Math.random() * 200),
        stumpings: Math.floor(20 + rankingBonus * 2 + Math.random() * 30)
      };
    } else {
      // Default batsman statistics
      return {
        totalRuns: Math.floor(4000 + rankingBonus * 500 + Math.random() * 5000),
        totalMatches: Math.floor(80 + Math.random() * 120),
        centuries: Math.floor(rankingBonus / 2 + Math.random() * 12),
        fifties: Math.floor(10 + rankingBonus + Math.random() * 20),
        average: Number(baseAverage.toFixed(1)),
        strikeRate: Number(baseStrikeRate.toFixed(1)),
        highestScore: Math.floor(120 + rankingBonus * 5 + Math.random() * 150)
      };
    }
  };

  // Generate role-specific skills
  const generateRoleSpecificSkills = (playerRole, rankingBonus) => {
    const bonus = rankingBonus * 2; // Convert ranking bonus to skill bonus
    
    if (playerRole === 'Bowler') {
      return [
        { skill: 'Pace/Spin', value: Math.floor(65 + bonus + Math.random() * 30) },
        { skill: 'Accuracy', value: Math.floor(70 + bonus + Math.random() * 25) },
        { skill: 'Swing/Turn', value: Math.floor(60 + bonus + Math.random() * 35) },
        { skill: 'Variations', value: Math.floor(55 + bonus + Math.random() * 40) },
        { skill: 'Pressure Bowling', value: Math.floor(50 + bonus + Math.random() * 45) },
        { skill: 'Death Bowling', value: Math.floor(45 + bonus + Math.random() * 50) }
      ];
    } else if (playerRole === 'All-rounder') {
      return [
        { skill: 'Batting Technique', value: Math.floor(60 + bonus + Math.random() * 30) },
        { skill: 'Power Hitting', value: Math.floor(55 + bonus + Math.random() * 35) },
        { skill: 'Bowling Accuracy', value: Math.floor(58 + bonus + Math.random() * 32) },
        { skill: 'Fielding', value: Math.floor(65 + bonus + Math.random() * 30) },
        { skill: 'Match Awareness', value: Math.floor(70 + bonus + Math.random() * 25) },
        { skill: 'Versatility', value: Math.floor(75 + bonus + Math.random() * 20) }
      ];
    } else if (playerRole === 'Wicket-keeper') {
      return [
        { skill: 'Keeping Skills', value: Math.floor(75 + bonus + Math.random() * 20) },
        { skill: 'Batting Technique', value: Math.floor(60 + bonus + Math.random() * 30) },
        { skill: 'Reflexes', value: Math.floor(80 + bonus + Math.random() * 15) },
        { skill: 'Leadership', value: Math.floor(65 + bonus + Math.random() * 30) },
        { skill: 'Match Reading', value: Math.floor(70 + bonus + Math.random() * 25) },
        { skill: 'Agility', value: Math.floor(75 + bonus + Math.random() * 20) }
      ];
    } else {
      // Default batsman skills
      return [
        { skill: 'Power Hitting', value: Math.floor(60 + bonus + Math.random() * 35) },
        { skill: 'Timing', value: Math.floor(65 + bonus + Math.random() * 30) },
        { skill: 'Placement', value: Math.floor(55 + bonus + Math.random() * 40) },
        { skill: 'Running', value: Math.floor(70 + bonus + Math.random() * 25) },
        { skill: 'Pressure Handling', value: Math.floor(50 + bonus + Math.random() * 45) },
        { skill: 'Consistency', value: Math.floor(60 + bonus + Math.random() * 35) }
      ];
    }
  };

  // Analyze recent form for hot/cold streaks
  const analyzeRecentForm = (recentMatches, playerRole) => {
    if (!recentMatches || recentMatches.length === 0) return null;
    
    const isBowler = playerRole === 'Bowler';
    const last5 = recentMatches.slice(-5);
    
    if (isBowler) {
      // For bowlers: analyze economy and wickets
      const avgEconomy = last5.reduce((sum, m) => sum + (m.economy || 6.0), 0) / 5;
      const totalWickets = last5.reduce((sum, m) => sum + (m.wickets || 0), 0);
      
      const streak = avgEconomy < 6.5 && totalWickets >= 3 ? 'hot' : 
                    avgEconomy > 8.0 ? 'cold' : 'steady';
      
      return {
        streak,
        summary: streak === 'hot' ? `🔥 Hot form: ${totalWickets} wickets in last 5, Economy ${avgEconomy.toFixed(1)}` :
                streak === 'cold' ? `❄️ Cold streak: High economy rate ${avgEconomy.toFixed(1)}` :
                `➡️ Steady form: Consistent performance`,
        momentumScore: Math.min(100, Math.max(20, 100 - (avgEconomy * 10) + (totalWickets * 5)))
      };
    } else {
      // For batsmen: analyze runs and strike rate
      const avgRuns = last5.reduce((sum, m) => sum + m.runs, 0) / 5;
      const avgSR = last5.reduce((sum, m) => sum + m.strikeRate, 0) / 5;
      const scores30Plus = last5.filter(m => m.runs >= 30).length;
      
      const streak = avgRuns >= 35 && scores30Plus >= 3 ? 'hot' : 
                    avgRuns < 20 ? 'cold' : 'steady';
      
      return {
        streak,
        summary: streak === 'hot' ? `🔥 Hot form: Avg ${avgRuns.toFixed(0)} runs, ${scores30Plus}/5 scores 30+` :
                streak === 'cold' ? `❄️ Cold streak: Low avg ${avgRuns.toFixed(0)} runs` :
                `➡️ Steady form: Consistent ${avgRuns.toFixed(0)} avg`,
        momentumScore: Math.min(100, Math.max(20, (avgRuns * 1.5) + (avgSR * 0.3)))
      };
    }
  };

  // Generate situational performance stats
  const generateSituationalStats = (playerName, playerRole, nameHash) => {
    const isBowler = playerRole === 'Bowler';
    
    // Use name hash for consistent stats
    const factor = nameHash % 100;
    
    if (isBowler) {
      return {
        defending: {
          economy: (5.2 + (factor % 15) / 10).toFixed(1),
          strikeRate: (18 + (factor % 12)).toFixed(1),
          average: (22 + (factor % 18)).toFixed(1)
        },
        chasing: {
          economy: (6.1 + (factor % 20) / 10).toFixed(1),
          strikeRate: (21 + (factor % 15)).toFixed(1),
          average: (25 + (factor % 15)).toFixed(1)
        },
        pressure: {
          deathOversEconomy: (7.8 + (factor % 25) / 10).toFixed(1),
          powerplayWickets: Math.floor(8 + (factor % 12)),
          successRate: Math.floor(65 + (factor % 25))
        }
      };
    } else {
      return {
        chasing: {
          average: (38 + (factor % 25)).toFixed(1),
          strikeRate: (89 + (factor % 35)).toFixed(1),
          successRate: Math.floor(68 + (factor % 25))
        },
        defending: {
          average: (35 + (factor % 20)).toFixed(1),
          strikeRate: (78 + (factor % 30)).toFixed(1),
          successRate: Math.floor(72 + (factor % 20))
        },
        pressure: {
          lastTenOvers: (82 + (factor % 30)).toFixed(1),
          boundaries: Math.floor(12 + (factor % 8)),
          clutchScore: Math.floor(67 + (factor % 28))
        }
      };
    }
  };

  // Generate phase-wise performance
  const generatePhasePerformance = (playerRole, nameHash) => {
    const factor = nameHash % 100;
    const isBowler = playerRole === 'Bowler';
    
    if (isBowler) {
      return [
        {
          phase: 'Powerplay (1-6)',
          economy: (5.8 + (factor % 15) / 10).toFixed(1),
          strikeRate: (16 + (factor % 8)).toFixed(1),
          wickets: Math.floor(12 + (factor % 18))
        },
        {
          phase: 'Middle (7-15)', 
          economy: (4.9 + (factor % 12) / 10).toFixed(1),
          strikeRate: (19 + (factor % 10)).toFixed(1),
          wickets: Math.floor(25 + (factor % 25))
        },
        {
          phase: 'Death (16-20)',
          economy: (8.2 + (factor % 20) / 10).toFixed(1),
          strikeRate: (14 + (factor % 8)).toFixed(1),
          wickets: Math.floor(8 + (factor % 12))
        }
      ];
    } else {
      return [
        {
          phase: 'Powerplay (1-6)',
          average: (28 + (factor % 15)).toFixed(1),
          strikeRate: (135 + (factor % 40)).toFixed(1),
          runs: Math.floor(850 + (factor % 400))
        },
        {
          phase: 'Middle (7-15)',
          average: (42 + (factor % 20)).toFixed(1),
          strikeRate: (89 + (factor % 25)).toFixed(1),
          runs: Math.floor(1200 + (factor % 600))
        },
        {
          phase: 'Death (16-20)',
          average: (31 + (factor % 18)).toFixed(1),
          strikeRate: (167 + (factor % 45)).toFixed(1),
          runs: Math.floor(720 + (factor % 350))
        }
      ];
    }
  };

  // Generate home vs away performance
  const generateHomeAwayStats = (nameHash, teamName) => {
    const factor = nameHash % 100;
    
    return {
      home: {
        matches: Math.floor(35 + (factor % 25)),
        average: (45 + (factor % 20)).toFixed(1),
        strikeRate: (88 + (factor % 25)).toFixed(1),
        runs: Math.floor(1800 + (factor % 800))
      },
      away: {
        matches: Math.floor(28 + (factor % 20)),
        average: (38 + (factor % 18)).toFixed(1),
        strikeRate: (82 + (factor % 20)).toFixed(1),
        runs: Math.floor(1200 + (factor % 600))
      },
      neutral: {
        matches: Math.floor(15 + (factor % 12)),
        average: (41 + (factor % 16)).toFixed(1),
        strikeRate: (85 + (factor % 22)).toFixed(1),
        runs: Math.floor(650 + (factor % 300))
      },
      bestVenues: [
        { venue: 'Lord\'s, London', average: (52 + (factor % 20)).toFixed(1), matches: Math.floor(6 + (factor % 8)) },
        { venue: 'MCG, Melbourne', average: (48 + (factor % 25)).toFixed(1), matches: Math.floor(4 + (factor % 6)) },
        { venue: `Home Ground, ${teamName}`, average: (55 + (factor % 15)).toFixed(1), matches: Math.floor(8 + (factor % 10)) }
      ]
    };
  };

  // Generate comprehensive player statistics (now with real data!)
  const generatePlayerStats = async (playerName, teamName, playerRole = 'Batsman') => {
    console.log(`🏏 Generating ${playerRole} stats for ${playerName} from ${teamName}`);
    
    // Simple team ranking based on name
    const teamRanking = Math.floor(Math.random() * 10) + 1;
    const rankingBonus = Math.max(0, 15 - teamRanking);

    // Base stats influenced by team ranking
    const baseAverage = 25 + rankingBonus * 2 + Math.random() * 20;
    const baseStrikeRate = 70 + rankingBonus * 3 + Math.random() * 30;
    
    // Role-specific career statistics
    const careerStats = generateRoleSpecificStats(playerRole, baseAverage, baseStrikeRate, rankingBonus);

    // Generate recent form
    const recentForm = generateFallbackMatches(playerName);

    // Performance trend (last 6 months)
    const performanceTrend = generateTrendData(playerName);

    // Format-wise performance
    const formatPerformance = generateFormatData(playerName);

    // Performance vs different opponents
    const vsOpponents = generateOpponentData(playerName);

    // Role-specific player skills assessment
    const playerSkills = generateRoleSpecificSkills(playerRole, rankingBonus);

    // Create name hash for consistent analytics
    const nameHash = playerName.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    
    // Advanced Analytics
    const recentFormAnalysis = analyzeRecentForm(recentForm, playerRole);
    const situationalStats = generateSituationalStats(playerName, playerRole, nameHash);
    const phasePerformance = generatePhasePerformance(playerRole, nameHash);
    const homeAwayStats = generateHomeAwayStats(nameHash, teamName);

    return {
      playerName,
      teamName,
      playerRole,
      hasRealData: false,
      dataSources: ['dummy_data'],
      careerStats,
      recentForm,
      recentFormAnalysis,
      situationalStats,
      phasePerformance,
      homeAwayStats,
      performanceTrend,
      formatPerformance,
      vsOpponents,
      playerSkills
    };
  };



    // Utility functions for consistent data generation
    const generateTrendData = (playerName) => {
      const nameHash = playerName.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.slice(-6).map((month, index) => ({
        month,
        average: Number((35 + (nameHash + index * 3) % 25).toFixed(1)),
        strikeRate: Number((85 + (nameHash + index * 5) % 40).toFixed(1))
      }));
    };

    const generateFormatData = (playerName) => {
      const nameHash = playerName.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
      const formats = ['T20I', 'ODI', 'Test'];
      return formats.map((format, index) => {
        const matches = 45 + (nameHash + index * 7) % 30;
        const average = 35 + (nameHash + index * 4) % 20;
        return {
          format,
          matches,
          average: Number(average.toFixed(1)),
          strikeRate: Number((80 + (nameHash + index * 6) % 35).toFixed(1)),
          runs: Math.floor(average * matches)
        };
      });
    };

    const generateOpponentData = (playerName) => {
      const nameHash = playerName.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
      const opponents = ['Australia', 'England', 'India', 'South Africa', 'New Zealand', 'Pakistan', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan'];
      return opponents.map((opponent, index) => ({
        opponent,
        matches: 8 + (nameHash + index * 3) % 12,
        average: Number((30 + (nameHash + index * 5) % 25).toFixed(1)),
        runs: 180 + (nameHash + index * 20) % 300
      }));
    };

  // Fallback function for when API data is not available
  const generateFallbackMatches = (playerName) => {
    console.log(`🔄 Generating consistent fallback data for ${playerName}`);
    
    // Create a simple hash from player name for consistency
    const nameHash = playerName.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    
    // Player-specific characteristics based on name hash
    const isAggressive = (nameHash % 3) === 0;  // 33% are aggressive
    const isConsistent = (nameHash % 4) === 0;  // 25% are very consistent
    
    // Base stats influenced by player type
    const baseSR = isAggressive ? 85 : (isConsistent ? 70 : 78);
    
    const matches = [];
    const opponents = ['Australia', 'England', 'India', 'Pakistan', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan', 'Ireland', 'Netherlands'];
    const venues = ['MCG Melbourne', 'Lords London', 'Eden Gardens Kolkata', 'Wankhede Mumbai', 'SCG Sydney', 'The Oval London', 'Gaddafi Stadium Lahore', 'Newlands Cape Town', 'Basin Reserve Wellington', 'Kensington Oval Barbados'];
    const formats = ['ODI', 'T20I', 'Test'];
    
    for (let i = 0; i < 10; i++) {
      // Use hash + match number for consistent results per player
      const matchSeed = (nameHash + i * 1000) % 10000;
      
      // Realistic runs based on player type
      let runs;
      if (isConsistent) {
        runs = 25 + (matchSeed % 40);  // 25-65 consistent range
      } else if (isAggressive) {
        runs = (matchSeed % 4) === 0 ? (50 + (matchSeed % 50)) : (matchSeed % 90);  // Boom or bust
      } else {
        runs = 10 + (matchSeed % 70);  // 10-80 normal range
      }
      
      const balls = Math.max(20, Math.floor(runs * (100/baseSR) + (matchSeed % 20) - 10));
      const fours = Math.max(0, Math.floor(runs / 25 + (matchSeed % 6)));
      const sixes = Math.max(0, Math.floor(runs / 40 + (matchSeed % 3)));
      const strikeRate = balls > 0 ? Number(((runs / balls) * 100).toFixed(1)) : 0;
      
      // Match date (going backwards from today)
      const matchDate = new Date(Date.now() - (i * 10 + (matchSeed % 7)) * 24 * 60 * 60 * 1000);
      
      matches.push({
        matchNumber: 10 - i,
        opponent: opponents[matchSeed % opponents.length],
        venue: venues[matchSeed % venues.length],
        format: formats[matchSeed % formats.length],
        date: matchDate.toISOString().split('T')[0],
        dateFormatted: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        runs: runs,
        balls: balls,
        fours: fours,
        sixes: sixes,
        strikeRate: strikeRate,
        result: (matchSeed % 3) !== 0 ? 'Won' : ((matchSeed % 5) !== 0 ? 'Lost' : 'Tied'),
        notOut: (matchSeed % 7) === 0,  // ~14% not out
        milestone: runs >= 100 ? 'Century' : (runs >= 50 ? 'Fifty' : null)
      });
    }
    
    console.log(`✅ Generated ${matches.length} consistent matches for ${playerName} (aggressive=${isAggressive}, consistent=${isConsistent})`);
    return matches;
  };

  // Helper functions for role-specific UI display
  const getPrimaryStatTitle = (role) => {
    const titles = {
      'Bowler': 'Bowling Stats',
      'All-rounder': 'Batting Stats',
      'Wicket-keeper': 'Batting Stats',
      default: 'Career Stats'
    };
    return titles[role] || titles.default;
  };

  const getPrimaryStatValue = (stats, role) => {
    // Handle real career stats from API
    if (stats?.batting && stats?.bowling) {
      if (role === 'Bowler') return stats.bowling.totalWickets || stats.bowling.wickets || 0;
      return (stats.batting.totalRuns || stats.batting.runs_scored || 0).toLocaleString();
    }
    // Handle fallback stats
    if (role === 'Bowler') return stats.totalWickets || 0;
    return (stats.totalRuns || 0).toLocaleString();
  };

  const getPrimaryStatLabel = (role) => {
    return role === 'Bowler' ? 'Total Wickets' : 'Total Runs';
  };

  const getSecondaryStatValue = (stats, role) => {
    // Handle real career stats from API
    if (stats?.batting && stats?.bowling) {
      if (role === 'Bowler') return stats.bowling.average || 0;
      return stats.batting.average || 0;
    }
    // Handle fallback stats
    if (role === 'Bowler') return stats.bowlingAverage || 0;
    return stats.average || 0;
  };

  const getSecondaryStatLabel = (role) => {
    return role === 'Bowler' ? 'Bowling Average' : 'Batting Average';
  };

  const getPerformanceTitle = (role) => {
    return role === 'Bowler' ? 'Economy & Strike' : 'Strike Rate';
  };

  const getPerformanceStatValue = (stats, role) => {
    // Handle real career stats from API
    if (stats?.batting && stats?.bowling) {
      if (role === 'Bowler') return stats.bowling.economy || 0;
      return stats.batting.strike_rate || 0;
    }
    // Handle fallback stats
    if (role === 'Bowler') return stats.economyRate || 0;
    return stats.strikeRate || 0;
  };

  const getPerformanceStatLabel = (role) => {
    return role === 'Bowler' ? 'Economy Rate' : 'Strike Rate';
  };

  const getPerformanceSecondaryValue = (stats, role) => {
    // Handle real career stats from API
    if (stats?.batting && stats?.bowling) {
      if (role === 'Bowler') return stats.bowling.strike_rate || 0;
      return stats.batting.highest_score || 0;
    }
    // Handle fallback stats
    if (role === 'Bowler') return stats.strikeRate || 0;
    return stats.highestScore || 0;
  };

  const getPerformanceSecondaryLabel = (role) => {
    return role === 'Bowler' ? 'Bowling SR' : 'Highest Score';
  };

  const getAchievementValue = (stats, role) => {
    if (role === 'Bowler') return stats.fiveWicketHauls || 0;
    if (role === 'Wicket-keeper') return stats.totalDismissals || 0;
    if (role === 'All-rounder') return stats.centuries || 0;
    return stats.centuries || 0;
  };

  const getAchievementLabel = (role) => {
    if (role === 'Bowler') return '5-Wicket Hauls';
    if (role === 'Wicket-keeper') return 'Total Dismissals';
    return 'Centuries';
  };

  const getAchievementSecondaryValue = (stats, role) => {
    if (role === 'Bowler') return stats.bestFigures || '-';
    if (role === 'Wicket-keeper') return stats.catches || 0;
    if (role === 'All-rounder') return stats.totalWickets || 0;
    return stats.fifties || 0;
  };

  const getAchievementSecondaryLabel = (role) => {
    if (role === 'Bowler') return 'Best Figures';
    if (role === 'Wicket-keeper') return 'Catches';
    if (role === 'All-rounder') return 'Wickets';
    return 'Fifties';
  };

  // State for all international players from API





  // International players data
  const getFallbackPlayers = () => {
    return [
      // India
      { name: 'Virat Kohli', fullName: 'Virat Kohli (India)', team: 'India', teamCode: 'IND', role: 'Batsman', ranking: 1, searchTerm: 'virat kohli india ind batsman' },
      { name: 'Rohit Sharma', fullName: 'Rohit Sharma (India)', team: 'India', teamCode: 'IND', role: 'Batsman', ranking: 2, searchTerm: 'rohit sharma india ind batsman' },
      { name: 'KL Rahul', fullName: 'KL Rahul (India)', team: 'India', teamCode: 'IND', role: 'Batsman', ranking: 3, searchTerm: 'kl rahul india ind batsman' },
      { name: 'Jasprit Bumrah', fullName: 'Jasprit Bumrah (India)', team: 'India', teamCode: 'IND', role: 'Bowler', ranking: 4, searchTerm: 'jasprit bumrah india ind bowler' },
      { name: 'Ravindra Jadeja', fullName: 'Ravindra Jadeja (India)', team: 'India', teamCode: 'IND', role: 'All-rounder', ranking: 5, searchTerm: 'ravindra jadeja india ind all-rounder' },
      { name: 'Rishabh Pant', fullName: 'Rishabh Pant (India)', team: 'India', teamCode: 'IND', role: 'Wicket-keeper', ranking: 6, searchTerm: 'rishabh pant india ind wicket-keeper' },
      
      // Australia
      { name: 'Steve Smith', fullName: 'Steve Smith (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Batsman', ranking: 7, searchTerm: 'steve smith australia aus batsman' },
      { name: 'David Warner', fullName: 'David Warner (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Batsman', ranking: 8, searchTerm: 'david warner australia aus batsman' },
      { name: 'Marnus Labuschagne', fullName: 'Marnus Labuschagne (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Batsman', ranking: 9, searchTerm: 'marnus labuschagne australia aus batsman' },
      { name: 'Pat Cummins', fullName: 'Pat Cummins (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Bowler', ranking: 10, searchTerm: 'pat cummins australia aus bowler' },
      { name: 'Mitchell Starc', fullName: 'Mitchell Starc (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Bowler', ranking: 11, searchTerm: 'mitchell starc australia aus bowler' },
      { name: 'Glenn Maxwell', fullName: 'Glenn Maxwell (Australia)', team: 'Australia', teamCode: 'AUS', role: 'All-rounder', ranking: 12, searchTerm: 'glenn maxwell australia aus all-rounder' },
      
      // England
      { name: 'Joe Root', fullName: 'Joe Root (England)', team: 'England', teamCode: 'ENG', role: 'Batsman', ranking: 13, searchTerm: 'joe root england eng batsman' },
      { name: 'Ben Stokes', fullName: 'Ben Stokes (England)', team: 'England', teamCode: 'ENG', role: 'All-rounder', ranking: 14, searchTerm: 'ben stokes england eng all-rounder' },
      { name: 'Jos Buttler', fullName: 'Jos Buttler (England)', team: 'England', teamCode: 'ENG', role: 'Wicket-keeper', ranking: 15, searchTerm: 'jos buttler england eng wicket-keeper' },
      { name: 'Jonny Bairstow', fullName: 'Jonny Bairstow (England)', team: 'England', teamCode: 'ENG', role: 'Wicket-keeper', ranking: 16, searchTerm: 'jonny bairstow england eng wicket-keeper' },
      { name: 'James Anderson', fullName: 'James Anderson (England)', team: 'England', teamCode: 'ENG', role: 'Bowler', ranking: 17, searchTerm: 'james anderson england eng bowler' },
      { name: 'Stuart Broad', fullName: 'Stuart Broad (England)', team: 'England', teamCode: 'ENG', role: 'Bowler', ranking: 18, searchTerm: 'stuart broad england eng bowler' },
      
      // Pakistan
      { name: 'Babar Azam', fullName: 'Babar Azam (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Batsman', ranking: 19, searchTerm: 'babar azam pakistan pak batsman' },
      { name: 'Shaheen Afridi', fullName: 'Shaheen Afridi (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Bowler', ranking: 20, searchTerm: 'shaheen afridi pakistan pak bowler' },
      { name: 'Mohammad Rizwan', fullName: 'Mohammad Rizwan (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Wicket-keeper', ranking: 21, searchTerm: 'mohammad rizwan pakistan pak wicket-keeper' },
      { name: 'Fakhar Zaman', fullName: 'Fakhar Zaman (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Batsman', ranking: 22, searchTerm: 'fakhar zaman pakistan pak batsman' },
      { name: 'Haris Rauf', fullName: 'Haris Rauf (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Bowler', ranking: 23, searchTerm: 'haris rauf pakistan pak bowler' },
      
      // New Zealand
      { name: 'Kane Williamson', fullName: 'Kane Williamson (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Batsman', ranking: 24, searchTerm: 'kane williamson new zealand nz batsman' },
      { name: 'Trent Boult', fullName: 'Trent Boult (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Bowler', ranking: 25, searchTerm: 'trent boult new zealand nz bowler' },
      { name: 'Tim Southee', fullName: 'Tim Southee (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Bowler', ranking: 26, searchTerm: 'tim southee new zealand nz bowler' },
      { name: 'Devon Conway', fullName: 'Devon Conway (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Batsman', ranking: 27, searchTerm: 'devon conway new zealand nz batsman' },
      { name: 'Tom Latham', fullName: 'Tom Latham (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Wicket-keeper', ranking: 28, searchTerm: 'tom latham new zealand nz wicket-keeper' },
      
      // South Africa
      { name: 'Kagiso Rabada', fullName: 'Kagiso Rabada (South Africa)', team: 'South Africa', teamCode: 'SA', role: 'Bowler', ranking: 29, searchTerm: 'kagiso rabada south africa sa bowler' },
      { name: 'Quinton de Kock', fullName: 'Quinton de Kock (South Africa)', team: 'South Africa', teamCode: 'SA', role: 'Wicket-keeper', ranking: 30, searchTerm: 'quinton de kock south africa sa wicket-keeper' },
      { name: 'Aiden Markram', fullName: 'Aiden Markram (South Africa)', team: 'South Africa', teamCode: 'SA', role: 'Batsman', ranking: 31, searchTerm: 'aiden markram south africa sa batsman' },
      { name: 'Keshav Maharaj', fullName: 'Keshav Maharaj (South Africa)', team: 'South Africa', teamCode: 'SA', role: 'Bowler', ranking: 32, searchTerm: 'keshav maharaj south africa sa bowler' },
      
      // West Indies
      { name: 'Shai Hope', fullName: 'Shai Hope (West Indies)', team: 'West Indies', teamCode: 'WI', role: 'Batsman', ranking: 33, searchTerm: 'shai hope west indies wi batsman' },
      { name: 'Nicholas Pooran', fullName: 'Nicholas Pooran (West Indies)', team: 'West Indies', teamCode: 'WI', role: 'Wicket-keeper', ranking: 34, searchTerm: 'nicholas pooran west indies wi wicket-keeper' },
      { name: 'Andre Russell', fullName: 'Andre Russell (West Indies)', team: 'West Indies', teamCode: 'WI', role: 'All-rounder', ranking: 35, searchTerm: 'andre russell west indies wi all-rounder' },
      { name: 'Jason Holder', fullName: 'Jason Holder (West Indies)', team: 'West Indies', teamCode: 'WI', role: 'All-rounder', ranking: 36, searchTerm: 'jason holder west indies wi all-rounder' },
      
      // Sri Lanka
      { name: 'Kusal Mendis', fullName: 'Kusal Mendis (Sri Lanka)', team: 'Sri Lanka', teamCode: 'SL', role: 'Batsman', ranking: 37, searchTerm: 'kusal mendis sri lanka sl batsman' },
      { name: 'Wanindu Hasaranga', fullName: 'Wanindu Hasaranga (Sri Lanka)', team: 'Sri Lanka', teamCode: 'SL', role: 'All-rounder', ranking: 38, searchTerm: 'wanindu hasaranga sri lanka sl all-rounder' },
      { name: 'Dushmantha Chameera', fullName: 'Dushmantha Chameera (Sri Lanka)', team: 'Sri Lanka', teamCode: 'SL', role: 'Bowler', ranking: 39, searchTerm: 'dushmantha chameera sri lanka sl bowler' },
      
      // Bangladesh
      { name: 'Shakib Al Hasan', fullName: 'Shakib Al Hasan (Bangladesh)', team: 'Bangladesh', teamCode: 'BAN', role: 'All-rounder', ranking: 40, searchTerm: 'shakib al hasan bangladesh ban all-rounder' },
      { name: 'Mushfiqur Rahim', fullName: 'Mushfiqur Rahim (Bangladesh)', team: 'Bangladesh', teamCode: 'BAN', role: 'Wicket-keeper', ranking: 41, searchTerm: 'mushfiqur rahim bangladesh ban wicket-keeper' },
      { name: 'Tamim Iqbal', fullName: 'Tamim Iqbal (Bangladesh)', team: 'Bangladesh', teamCode: 'BAN', role: 'Batsman', ranking: 42, searchTerm: 'tamim iqbal bangladesh ban batsman' },
      { name: 'Mustafizur Rahman', fullName: 'Mustafizur Rahman (Bangladesh)', team: 'Bangladesh', teamCode: 'BAN', role: 'Bowler', ranking: 43, searchTerm: 'mustafizur rahman bangladesh ban bowler' },
      
      // Afghanistan
      { name: 'Rashid Khan', fullName: 'Rashid Khan (Afghanistan)', team: 'Afghanistan', teamCode: 'AFG', role: 'Bowler', ranking: 44, searchTerm: 'rashid khan afghanistan afg bowler' },
      { name: 'Mohammad Nabi', fullName: 'Mohammad Nabi (Afghanistan)', team: 'Afghanistan', teamCode: 'AFG', role: 'All-rounder', ranking: 45, searchTerm: 'mohammad nabi afghanistan afg all-rounder' },
      { name: 'Rahmanullah Gurbaz', fullName: 'Rahmanullah Gurbaz (Afghanistan)', team: 'Afghanistan', teamCode: 'AFG', role: 'Wicket-keeper', ranking: 46, searchTerm: 'rahmanullah gurbaz afghanistan afg wicket-keeper' },
      
      // Ireland
      { name: 'Paul Stirling', fullName: 'Paul Stirling (Ireland)', team: 'Ireland', teamCode: 'IRE', role: 'Batsman', ranking: 47, searchTerm: 'paul stirling ireland ire batsman' },
      { name: 'Andy Balbirnie', fullName: 'Andy Balbirnie (Ireland)', team: 'Ireland', teamCode: 'IRE', role: 'Batsman', ranking: 48, searchTerm: 'andy balbirnie ireland ire batsman' },
      
      // Netherlands
      { name: 'Max O\'Dowd', fullName: 'Max O\'Dowd (Netherlands)', team: 'Netherlands', teamCode: 'NED', role: 'Batsman', ranking: 49, searchTerm: 'max odowd netherlands ned batsman' },
      { name: 'Bas de Leede', fullName: 'Bas de Leede (Netherlands)', team: 'Netherlands', teamCode: 'NED', role: 'All-rounder', ranking: 50, searchTerm: 'bas de leede netherlands ned all-rounder' }
    ];
  };

  // Get all dummy players
  const getAllInternationalPlayers = () => {
    return getFallbackPlayers();
  };

  // Get filtered players based on search
  const getFilteredPlayers = () => {
    const allPlayers = getAllInternationalPlayers();
    if (!playerSearchTerm) return allPlayers;
    
    return allPlayers.filter(player => 
      player.searchTerm.includes(playerSearchTerm.toLowerCase())
    );
  };

  // Handle player selection
  const handlePlayerSelect = async (player) => {
    setSelectedPlayer(player.name);
    setPlayerSearchTerm('');
    setLoadingPlayerStats(true);
    setPlayerAnalysisData(null); // Clear previous data
    
    try {
      console.log(`🎯 Selected player: ${player.name} (${player.role}) from ${player.team}`);
      const stats = await generatePlayerStats(player.name, player.team, player.role);
      setPlayerAnalysisData(stats);
    } catch (error) {
      console.error('Error generating player stats:', error);
      setPlayerAnalysisData(null);
    } finally {
      setLoadingPlayerStats(false);
    }
  };



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <User className="h-12 w-12 text-cricket-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏏 Player Deep Dive - Cricket Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Comprehensive analysis of {getAllInternationalPlayers().length} international cricket players
        </p>
      </div>



      {/* Welcome Section - Show when no player is selected */}
      {!selectedPlayer && !loadingPlayerStats && (
        <Card title="🏏 Welcome to Player Analytics" subtitle="Explore comprehensive statistics for international cricket players">
          <div className="text-center py-8">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-cricket-green-100 dark:bg-cricket-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-cricket-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">50 Players</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">International stars</p>
                </div>
                <div className="text-center">
                  <div className="bg-cricket-blue-100 dark:bg-cricket-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-cricket-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4 Roles</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Batsmen, Bowlers, All-rounders, Wicket-keepers</p>
                </div>
                <div className="text-center">
                  <div className="bg-cricket-gold-100 dark:bg-cricket-gold-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-cricket-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find players instantly</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deep Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive stats</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cricket-green-50 to-cricket-blue-50 dark:from-cricket-green-900/20 dark:to-cricket-blue-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📊 What You'll Get</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>• <strong>Career Statistics:</strong> Batting & bowling averages</div>
                  <div>• <strong>Recent Form:</strong> Last 10 matches analysis</div>
                  <div>• <strong>Performance Trends:</strong> 6-month trend charts</div>
                  <div>• <strong>Format Performance:</strong> T20I, ODI, Test stats</div>
                  <div>• <strong>Opponent Analysis:</strong> Performance vs different teams</div>
                  <div>• <strong>Skills Radar:</strong> Role-specific skill assessment</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-cricket-green-100 dark:bg-cricket-green-900/30 text-cricket-green-800 dark:text-cricket-green-200 rounded-full text-sm">
                  🇮🇳 India (6 players)
                </span>
                <span className="px-3 py-1 bg-cricket-blue-100 dark:bg-cricket-blue-900/30 text-cricket-blue-800 dark:text-cricket-blue-200 rounded-full text-sm">
                  🇦🇺 Australia (6 players)
                </span>
                <span className="px-3 py-1 bg-cricket-gold-100 dark:bg-cricket-gold-900/30 text-cricket-gold-800 dark:text-cricket-gold-200 rounded-full text-sm">
                  🏴󠁧󠁢󠁥󠁮󠁧󠁿 England (6 players)
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  🇵🇰 Pakistan (5 players)
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Player Selection */}
      <Card title="🔍 Player Selection" subtitle="Search and select any international cricket player for detailed analysis">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search Player ({getAllInternationalPlayers().length} international players available)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search cricket players... (e.g., Virat, Kohli, India, Batsman)"
                value={playerSearchTerm}
                onChange={(e) => setPlayerSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
              />
              {playerSearchTerm && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {getFilteredPlayers().slice(0, 10).map(player => (
                    <div
                      key={player.name}
                      onClick={() => handlePlayerSelect(player)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{player.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {player.team} • {player.role} • {player.battingStyle}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{player.teamCode}</div>
                      </div>
                    </div>
                  ))}
                  {getFilteredPlayers().length === 0 && (
                    <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                      No players found. Try searching for "Virat", "Kohli", "India", "Batsman", or "England"
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedPlayer && (
              <div className="mt-2 p-3 bg-cricket-green-50 dark:bg-cricket-green-900/20 border border-cricket-green-200 dark:border-cricket-green-800 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-cricket-green-800 dark:text-cricket-green-200">Selected: {selectedPlayer}</div>
                    <div className="text-sm text-cricket-green-600 dark:text-cricket-green-300">Analysis ready below</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlayer('');
                      setPlayerAnalysisData(null);
                    }}
                    className="text-cricket-green-600 hover:text-cricket-green-800 dark:text-cricket-green-400 dark:hover:text-cricket-green-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {!selectedPlayer && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a player to see detailed statistics</p>
                              <p className="text-sm">Choose from {getAllInternationalPlayers().length} premium players with comprehensive analytics</p>
              
              {/* Popular Players Quick Access */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">🌟 Popular Players:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {getAllInternationalPlayers().slice(0, 6).map(player => {
                    return (
                      <button
                        key={player.name}
                        onClick={() => handlePlayerSelect(player)}
                        className="px-3 py-1 bg-cricket-green-100 hover:bg-cricket-green-200 dark:bg-cricket-green-900/30 dark:hover:bg-cricket-green-900/50 text-cricket-green-800 dark:text-cricket-green-200 rounded-full text-xs transition-colors"
                      >
                        {player.name}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  Or search by role: "Batsman", "Bowler", "All-rounder", "Wicket-keeper"
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {loadingPlayerStats && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                              Loading {selectedPlayer} statistics from SportMonks Premium...
            </span>
          </div>
        </div>
      )}

      {/* Player Analysis Dashboard */}
      {!loadingPlayerStats && playerAnalysisData && playerAnalysisData.careerStats && (
        <>


          {/* Role-Specific Career Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title={getPrimaryStatTitle(playerAnalysisData.playerRole)} className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/50">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getPrimaryStatValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">{getPrimaryStatLabel(playerAnalysisData.playerRole)}</div>
                </div>
                <div className="pt-3 border-t border-blue-200 dark:border-blue-700/50">
                  <div className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                    {getSecondaryStatValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">{getSecondaryStatLabel(playerAnalysisData.playerRole)}</div>
                </div>
              </div>
            </Card>

            <Card title={getPerformanceTitle(playerAnalysisData.playerRole)} className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700/50">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {getPerformanceStatValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">{getPerformanceStatLabel(playerAnalysisData.playerRole)}</div>
                </div>
                <div className="pt-3 border-t border-green-200 dark:border-green-700/50">
                  <div className="text-xl font-semibold text-green-800 dark:text-green-200">
                    {getPerformanceSecondaryValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">{getPerformanceSecondaryLabel(playerAnalysisData.playerRole)}</div>
                </div>
              </div>
            </Card>

            <Card title="Achievements" className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700/50">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {getAchievementValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-sm font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">{getAchievementLabel(playerAnalysisData.playerRole)}</div>
                </div>
                <div className="pt-3 border-t border-orange-200 dark:border-orange-700/50">
                  <div className="text-xl font-semibold text-orange-800 dark:text-orange-200">
                    {getAchievementSecondaryValue(playerAnalysisData.careerStats, playerAnalysisData.playerRole)}
                  </div>
                  <div className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">{getAchievementSecondaryLabel(playerAnalysisData.playerRole)}</div>
                </div>
              </div>
            </Card>

            <Card title="Career Matches" className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {playerAnalysisData.careerStats?.batting?.matches || 0}
                  </div>
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">Total Matches</div>
                </div>
                <div className="pt-3 border-t border-purple-200 dark:border-purple-700/50">
                  <div className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                    {playerAnalysisData.careerStats?.batting?.innings || 0}
                  </div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Innings</div>
                </div>
              </div>
            </Card>

            <Card title="Experience" className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {playerAnalysisData.careerStats.totalMatches}
                  </div>
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">Total Matches</div>
                </div>
                <div className="pt-3 border-t border-purple-200 dark:border-purple-700/50">
                  <div className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                    {playerAnalysisData.playerRole}
                  </div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Player Role</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Real API Data Dashboard */}
          {playerAnalysisData.hasRealData && (
            <Card title="🌐 Real Career Statistics Dashboard" subtitle="Comprehensive data from SportMonks Premium API" className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Batting Statistics */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-cricket-green" />
                    Batting Career
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {playerAnalysisData.careerStats?.batting?.runs_scored ? 
                          Number(playerAnalysisData.careerStats.batting.runs_scored).toLocaleString() : 
                          playerAnalysisData.careerStats?.batting?.totalRuns ? 
                          Number(playerAnalysisData.careerStats.batting.totalRuns).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Total Runs</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700/50">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {playerAnalysisData.careerStats?.batting?.average ? 
                          Number(playerAnalysisData.careerStats.batting.average).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Batting Average</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {playerAnalysisData.careerStats?.batting?.strike_rate ? 
                          Number(playerAnalysisData.careerStats.batting.strike_rate).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Strike Rate</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700/50">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {playerAnalysisData.careerStats?.batting?.highest_score ? 
                          Number(playerAnalysisData.careerStats.batting.highest_score).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Highest Score</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700/50">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {playerAnalysisData.careerStats?.batting?.fours ? 
                          Number(playerAnalysisData.careerStats.batting.fours).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">Fours</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {playerAnalysisData.careerStats?.batting?.sixes ? 
                          Number(playerAnalysisData.careerStats.batting.sixes).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">Sixes</div>
                    </div>
                  </div>
                </div>

                {/* Bowling Statistics */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-cricket-green" />
                    Bowling Career
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {playerAnalysisData.careerStats?.bowling?.wickets ? 
                          Number(playerAnalysisData.careerStats.bowling.wickets).toLocaleString() : 
                          playerAnalysisData.careerStats?.bowling?.totalWickets ? 
                          Number(playerAnalysisData.careerStats.bowling.totalWickets).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Total Wickets</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700/50">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {playerAnalysisData.careerStats?.bowling?.average ? 
                          Number(playerAnalysisData.careerStats.bowling.average).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Bowling Average</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {playerAnalysisData.careerStats?.bowling?.economy ? 
                          Number(playerAnalysisData.careerStats.bowling.economy).toFixed(1) : 
                          playerAnalysisData.careerStats?.bowling?.economyRate ? 
                          Number(playerAnalysisData.careerStats.bowling.economyRate).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Economy Rate</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700/50">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {playerAnalysisData.careerStats?.bowling?.matches ? 
                          Number(playerAnalysisData.careerStats.bowling.matches).toLocaleString() : 
                          playerAnalysisData.careerStats?.bowling?.totalMatches ? 
                          Number(playerAnalysisData.careerStats.bowling.totalMatches).toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Bowling Matches</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Form Analysis */}
          {playerAnalysisData.recentFormAnalysis && (
            <Card title="🔥 Current Form" subtitle="Performance momentum over last 5 matches" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {playerAnalysisData.recentFormAnalysis.streak === 'hot' ? '🔥' : 
                     playerAnalysisData.recentFormAnalysis.streak === 'cold' ? '❄️' : '➡️'}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {playerAnalysisData.recentFormAnalysis.streak === 'hot' ? 'Hot Form' : 
                     playerAnalysisData.recentFormAnalysis.streak === 'cold' ? 'Cold Streak' : 'Steady Form'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {playerAnalysisData.recentFormAnalysis.summary}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {Math.round(playerAnalysisData.recentFormAnalysis.momentumScore)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Momentum Score
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                      className={`h-2 rounded-full ${
                        playerAnalysisData.recentFormAnalysis.momentumScore >= 70 ? 'bg-green-500' :
                        playerAnalysisData.recentFormAnalysis.momentumScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${playerAnalysisData.recentFormAnalysis.momentumScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Next Match Outlook</div>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    playerAnalysisData.recentFormAnalysis.streak === 'hot' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    playerAnalysisData.recentFormAnalysis.streak === 'cold' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {playerAnalysisData.recentFormAnalysis.streak === 'hot' ? 'High confidence' :
                     playerAnalysisData.recentFormAnalysis.streak === 'cold' ? 'Needs improvement' : 'Stable performance'}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Situational Performance */}
          <Card title="🎯 Situational Analysis" subtitle="Performance in different match scenarios" className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chasing vs Defending */}
              <div>
                <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">Match Situation</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800 dark:text-blue-200">🏃 Chasing Targets</span>
                      <span className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                        {playerAnalysisData.situationalStats.chasing.successRate}% Success
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Average:</span>
                        <span className="font-medium ml-2 text-blue-800 dark:text-blue-200">
                          {playerAnalysisData.situationalStats.chasing.average}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Strike Rate:</span>
                        <span className="font-medium ml-2 text-blue-800 dark:text-blue-200">
                          {playerAnalysisData.situationalStats.chasing.strikeRate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800 dark:text-green-200">🛡️ Defending Totals</span>
                      <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                        {playerAnalysisData.situationalStats.defending.successRate}% Success
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Average:</span>
                        <span className="font-medium ml-2 text-green-800 dark:text-green-200">
                          {playerAnalysisData.situationalStats.defending.average}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Strike Rate:</span>
                        <span className="font-medium ml-2 text-green-800 dark:text-green-200">
                          {playerAnalysisData.situationalStats.defending.strikeRate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pressure Situations */}
              <div>
                <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">Pressure Performance</h4>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700/50">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Clutch Score:</span>
                      <span className="font-bold text-orange-800 dark:text-orange-200">
                        {playerAnalysisData.situationalStats.pressure.clutchScore || playerAnalysisData.situationalStats.pressure.successRate}/100
                      </span>
                    </div>
                    {playerAnalysisData.playerRole === 'Bowler' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Death Overs Economy:</span>
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            {playerAnalysisData.situationalStats.pressure.deathOversEconomy}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Powerplay Wickets:</span>
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            {playerAnalysisData.situationalStats.pressure.powerplayWickets}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last 10 Overs SR:</span>
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            {playerAnalysisData.situationalStats.pressure.lastTenOvers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Boundaries/Match:</span>
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            {playerAnalysisData.situationalStats.pressure.boundaries}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Phase Performance */}
          <Card title="⏱️ Phase-wise Performance" subtitle="Breakdown by match phases" className="mb-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={playerAnalysisData.phasePerformance || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barCategoryGap="25%"
              >
                <defs>
                  <linearGradient id="phaseBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="#F2F2F7" 
                  strokeOpacity={0.5}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="phase" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                  labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                />
                <Bar 
                  dataKey={playerAnalysisData.playerRole === 'Bowler' ? 'economy' : 'strikeRate'} 
                  fill="url(#phaseBarGradient)" 
                  name={playerAnalysisData.playerRole === 'Bowler' ? 'Economy Rate' : 'Strike Rate'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Home vs Away Performance */}
          <Card title="🏠 Venue Performance" subtitle="Home, away & neutral venue analysis" className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                <div className="text-2xl mb-2">🏠</div>
                <div className="font-semibold text-green-800 dark:text-green-200 mb-2">Home</div>
                <div className="space-y-1 text-sm">
                  <div>Avg: <span className="font-medium">{playerAnalysisData.homeAwayStats.home.average}</span></div>
                  <div>SR: <span className="font-medium">{playerAnalysisData.homeAwayStats.home.strikeRate}</span></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {playerAnalysisData.homeAwayStats.home.matches} matches
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                <div className="text-2xl mb-2">✈️</div>
                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Away</div>
                <div className="space-y-1 text-sm">
                  <div>Avg: <span className="font-medium">{playerAnalysisData.homeAwayStats.away.average}</span></div>
                  <div>SR: <span className="font-medium">{playerAnalysisData.homeAwayStats.away.strikeRate}</span></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {playerAnalysisData.homeAwayStats.away.matches} matches
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">🌍</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Neutral</div>
                <div className="space-y-1 text-sm">
                  <div>Avg: <span className="font-medium">{playerAnalysisData.homeAwayStats.neutral.average}</span></div>
                  <div>SR: <span className="font-medium">{playerAnalysisData.homeAwayStats.neutral.strikeRate}</span></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {playerAnalysisData.homeAwayStats.neutral.matches} matches
                  </div>
                </div>
              </div>
            </div>
            
            {/* Best Venues */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Favorite Venues</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playerAnalysisData.homeAwayStats.bestVenues.map((venue, index) => (
                  <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                    <div className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-1">{venue.venue}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Avg {venue.average} ({venue.matches} matches)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Performance Trend Chart */}
          <Card 
            title={`${playerAnalysisData.playerName} Performance`}
            subtitle="24-month trend analysis"
            className="col-span-full"
          >
            <ResponsiveContainer width="100%" height={340}>
              <LineChart 
                data={playerAnalysisData.performanceTrend || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="strikeRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="#F2F2F7" 
                  strokeOpacity={0.5}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  dx={-10}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  dx={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name
                  ]}
                  labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#007AFF" 
                  strokeWidth={3}
                  dot={{ fill: '#007AFF', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#007AFF', strokeWidth: 2, fill: '#FFFFFF' }}
                  name="Batting Average"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="strikeRate" 
                  stroke="#34C759" 
                  strokeWidth={3}
                  dot={{ fill: '#34C759', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#34C759', strokeWidth: 2, fill: '#FFFFFF' }}
                  name="Strike Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Format Performance and Recent Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Format Performance */}
            <Card title="🌐 Real Format Performance" subtitle="Performance across formats from SportMonks Premium API">
              {playerAnalysisData.hasRealData && playerAnalysisData.careerStats?.formats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(playerAnalysisData.careerStats.formats).map(([format, data]) => (
                      <div key={format} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                        <div className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">{format}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Matches:</span>
                            <span className="font-medium text-blue-800 dark:text-blue-200">{data.batting?.matches || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Runs:</span>
                            <span className="font-medium text-blue-800 dark:text-blue-200">{data.batting?.runs?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Average:</span>
                            <span className="font-medium text-blue-800 dark:text-blue-200">{data.batting?.average?.toFixed(2) || '0.00'}</span>
                          </div>
                          {data.bowling?.wickets > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-sm text-green-700 dark:text-green-300">Wickets:</span>
                                <span className="font-medium text-green-800 dark:text-green-200">{data.bowling?.wickets || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-green-700 dark:text-green-300">Bowling Avg:</span>
                                <span className="font-medium text-green-800 dark:text-green-200">{data.bowling?.average?.toFixed(2) || '0.00'}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart 
                    data={playerAnalysisData.formatPerformance || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barCategoryGap="20%"
                  >
                    <defs>
                      <linearGradient id="averageBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="strikeRateBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34C759" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#34C759" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="2 2" 
                      stroke="#F2F2F7" 
                      strokeOpacity={0.5}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="format" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#8E8E93' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#8E8E93' }}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                    />
                    <Bar 
                      dataKey="average" 
                      fill="url(#averageBarGradient)" 
                      name="Average"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="strikeRate" 
                      fill="url(#strikeRateBarGradient)" 
                      name="Strike Rate"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Last 10 Games Stats - Enhanced */}
          <Card title="📊 Last 10 Games Stats" subtitle="Detailed match-by-match performance analysis">
            <div className="space-y-6">
              
              {/* Quick Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {playerAnalysisData.recentForm.reduce((sum, match) => sum + match.runs, 0)}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {Math.round(playerAnalysisData.recentForm.reduce((sum, match) => sum + match.strikeRate, 0) / 10)}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avg Strike Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {playerAnalysisData.recentForm.filter(match => match.milestone).length}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">50+ Scores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {Math.round((playerAnalysisData.recentForm.filter(match => match.result === 'Won').length / 10) * 100)}%
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Win Rate</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Runs Progression Chart */}
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">Runs Progression</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart 
                      data={playerAnalysisData.recentForm || []}
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="runsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="2 2" 
                        stroke="#F2F2F7" 
                        strokeOpacity={0.3}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="matchNumber" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#8E8E93' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#8E8E93' }}
                        width={35}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                          fontSize: '13px'
                        }}
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `Match ${label}`}
                        labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="runs" 
                        stroke="#FF6B35" 
                        strokeWidth={3}
                        dot={{ fill: '#FF6B35', strokeWidth: 0, r: 5 }}
                        activeDot={{ r: 7, stroke: '#FF6B35', strokeWidth: 2, fill: '#FFFFFF' }}
                        name="Runs"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Strike Rate Chart */}
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">Strike Rate Trend</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart 
                      data={playerAnalysisData.recentForm || []}
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="strikeRateModernGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5856D6" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#5856D6" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="2 2" 
                        stroke="#F2F2F7" 
                        strokeOpacity={0.3}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="matchNumber" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#8E8E93' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#8E8E93' }}
                        width={35}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                          fontSize: '13px'
                        }}
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `Match ${label}`}
                        labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                      />
                      <Bar 
                        dataKey="strikeRate" 
                        fill="url(#strikeRateModernGradient)" 
                        name="Strike Rate"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Simplified Match Table */}
              <div>
                <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">Match-by-Match Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-800 dark:text-gray-200">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-800 dark:text-gray-200">vs</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-gray-200">Runs</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-gray-200">SR</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-gray-200">Milestone</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-gray-200">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {playerAnalysisData.recentForm.map((match, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-800 dark:text-gray-200">{match.dateFormatted}</div>
                            <div className="text-xs mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                match.format === 'T20I' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                match.format === 'ODI' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {match.format}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{match.opponent}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{match.venue}</div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
                              {match.runs}{match.notOut ? '*' : ''}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {match.balls}b • {match.fours}×4 • {match.sixes}×6
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                              {match.strikeRate.toFixed(1)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {match.milestone ? (
                              <span className="text-2xl">🏆</span>
                            ) : (
                              <span className="text-gray-400 text-xl">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                              match.result === 'Won' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              match.result === 'Lost' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {match.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">📈 Recent Form Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Best Performance:</span>
                    <div className="text-blue-600 dark:text-blue-400">
                      {Math.max(...playerAnalysisData.recentForm.map(m => m.runs))} runs 
                      (Match {playerAnalysisData.recentForm.find(m => m.runs === Math.max(...playerAnalysisData.recentForm.map(x => x.runs)))?.matchNumber})
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Consistency:</span>
                    <div className="text-blue-600 dark:text-blue-400">
                      {playerAnalysisData.recentForm.filter(m => m.runs >= 30).length}/10 matches with 30+ runs
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Boundary Rate:</span>
                    <div className="text-blue-600 dark:text-blue-400">
                      {Math.round(playerAnalysisData.recentForm.reduce((sum, m) => sum + m.fours + m.sixes, 0) / 10)} boundaries/match
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Player Skills Radar and vs Opponents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Skills Radar */}
            <Card title={`${playerAnalysisData.playerRole} Skills`} subtitle={`Performance assessment across key areas`}>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart 
                  data={playerAnalysisData.playerSkills || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="skillsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AF52DE" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#AF52DE" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <PolarGrid 
                    stroke="#F2F2F7" 
                    strokeOpacity={0.6}
                    strokeWidth={1}
                  />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fontSize: 11, fill: '#8E8E93' }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false}
                    tickCount={5}
                    stroke="#F2F2F7"
                    strokeOpacity={0.3}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#AF52DE"
                    fill="url(#skillsGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#AF52DE', strokeWidth: 0, r: 4 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                      fontSize: '13px'
                    }}
                    labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance vs Opponents */}
            <Card title="vs Top Opponents" subtitle="Performance against leading nations">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={playerAnalysisData.vsOpponents || []} 
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="opponentsGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#FF9500" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#FF9500" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="2 2" 
                    stroke="#F2F2F7" 
                    strokeOpacity={0.5}
                    horizontal={false}
                    vertical={true}
                  />
                  <XAxis 
                    type="number" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#8E8E93' }}
                  />
                  <YAxis 
                    dataKey="opponent" 
                    type="category" 
                    width={70} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#8E8E93' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                      fontSize: '13px'
                    }}
                    labelStyle={{ color: '#1D1D1F', fontWeight: '600' }}
                  />
                  <Bar 
                    dataKey="average" 
                    fill="url(#opponentsGradient)" 
                    name="Average"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>


        </>
      )}
    </div>
  );
};

export default PlayerDeepDive; 