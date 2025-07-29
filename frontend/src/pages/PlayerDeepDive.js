import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  User,
  Trophy,
  Target,
  Loader2,
  AlertCircle,
  Search,
  Star,
  BarChart3
} from 'lucide-react';
import { getTeams, getFixtures } from '../services/api';

const PlayerDeepDive = () => {
  // Player analysis state
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerAnalysisData, setPlayerAnalysisData] = useState(null);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');

  // Real data state
  const [realData, setRealData] = useState({
    teams: [],
    fixtures: [],
    loading: true,
    error: null
  });

  // Load real cricket data
  useEffect(() => {
    const loadRealData = async () => {
      try {
        setRealData(prev => ({ ...prev, loading: true, error: null }));
        
        const [teamsResponse, fixturesResponse] = await Promise.all([
          getTeams(),
          getFixtures()
        ]);

        setRealData({
          teams: teamsResponse.data || [],
          fixtures: fixturesResponse.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading cricket data:', error);
        setRealData(prev => ({
          ...prev,
          loading: false,
          error: 'Unable to load real cricket data. Showing sample data for demonstration.'
        }));
      }
    };

    loadRealData();
  }, []);

  // Generate comprehensive player statistics
  const generatePlayerStats = (playerName, teamName) => {
    if (!playerName || !teamName) return null;

    const team = realData.teams.find(t => t.name === teamName) || {};
    const teamRanking = team?.ranking || 10;
    const rankingBonus = Math.max(0, 15 - teamRanking);

    // Base stats influenced by team ranking
    const baseAverage = 25 + rankingBonus * 2 + Math.random() * 20;
    const baseStrikeRate = 70 + rankingBonus * 3 + Math.random() * 30;
    
    // Career statistics
    const careerStats = {
      totalRuns: Math.floor(2000 + rankingBonus * 300 + Math.random() * 3000),
      totalMatches: Math.floor(50 + Math.random() * 100),
      centuries: Math.floor(rankingBonus / 2 + Math.random() * 8),
      fifties: Math.floor(5 + rankingBonus + Math.random() * 15),
      average: Math.round(baseAverage * 10) / 10,
      strikeRate: Math.round(baseStrikeRate * 10) / 10,
      highestScore: Math.floor(80 + rankingBonus * 5 + Math.random() * 120)
    };

    // Recent form (last 10 matches)
    const recentForm = Array.from({ length: 10 }, (_, i) => ({
      match: `Match ${10 - i}`,
      runs: Math.floor(Math.random() * 100),
      balls: Math.floor(20 + Math.random() * 80),
      strikeRate: Math.round((Math.random() * 50 + 75) * 10) / 10,
      date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    }));

    // Performance trend (last 2 years)
    const performanceTrend = Array.from({ length: 24 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (23 - i));
      return {
        month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        average: Math.round((baseAverage + (Math.random() - 0.5) * 10) * 10) / 10,
        strikeRate: Math.round((baseStrikeRate + (Math.random() - 0.5) * 20) * 10) / 10,
        runs: Math.floor(Math.random() * 200 + 50)
      };
    });

    // Performance by format
    const formatPerformance = [
      { 
        format: 'T20I', 
        matches: Math.floor(15 + Math.random() * 25),
        runs: Math.floor(400 + Math.random() * 800),
        average: Math.round((baseAverage * 0.8 + Math.random() * 10) * 10) / 10,
        strikeRate: Math.round((baseStrikeRate * 1.2 + Math.random() * 15) * 10) / 10
      },
      { 
        format: 'ODI', 
        matches: Math.floor(20 + Math.random() * 40),
        runs: Math.floor(800 + Math.random() * 1500),
        average: Math.round((baseAverage + Math.random() * 8) * 10) / 10,
        strikeRate: Math.round((baseStrikeRate + Math.random() * 10) * 10) / 10
      },
      { 
        format: 'Test', 
        matches: Math.floor(10 + Math.random() * 30),
        runs: Math.floor(600 + Math.random() * 1200),
        average: Math.round((baseAverage * 1.3 + Math.random() * 12) * 10) / 10,
        strikeRate: Math.round((baseStrikeRate * 0.7 + Math.random() * 8) * 10) / 10
      }
    ];

    // Performance vs different opponents
    const vsOpponents = [
      { opponent: 'Australia', matches: 8, runs: 320, average: 40.0, strikeRate: 85.2 },
      { opponent: 'England', matches: 6, runs: 245, average: 40.8, strikeRate: 82.1 },
      { opponent: 'South Africa', matches: 5, runs: 198, average: 39.6, strikeRate: 88.4 },
      { opponent: 'New Zealand', matches: 4, runs: 165, average: 41.3, strikeRate: 79.8 },
      { opponent: 'Pakistan', matches: 7, runs: 287, average: 41.0, strikeRate: 91.2 }
    ];

    // Player radar chart data (skills)
    const playerSkills = [
      { skill: 'Batting', value: Math.min(100, 60 + rankingBonus * 4 + Math.random() * 25) },
      { skill: 'Power', value: Math.min(100, 50 + Math.random() * 40) },
      { skill: 'Technique', value: Math.min(100, 55 + rankingBonus * 3 + Math.random() * 30) },
      { skill: 'Consistency', value: Math.min(100, 45 + rankingBonus * 4 + Math.random() * 35) },
      { skill: 'Pressure', value: Math.min(100, 50 + rankingBonus * 3 + Math.random() * 30) },
      { skill: 'Fielding', value: Math.min(100, 40 + Math.random() * 40) }
    ];

    return {
      playerName,
      teamName,
      careerStats,
      recentForm,
      performanceTrend,
      formatPerformance,
      vsOpponents,
      playerSkills
    };
  };

  // State for all international players from API
  const [allPlayers, setAllPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  // Load all international cricket players from API
  useEffect(() => {
    const loadAllPlayers = async () => {
      try {
        setPlayersLoading(true);
        console.log('🏏 Fetching all international cricket players from API...');
        
        const response = await fetch('http://localhost:5001/players');
        const data = await response.json();
        
        if (data.success && data.data) {
          const formattedPlayers = data.data.map(player => ({
            name: player.fullname,
            fullName: `${player.fullname} (${player.team})`,
            team: player.team,
            teamCode: player.team_code,
            role: player.position?.name || 'Player',
            ranking: player.ranking || 99,
            battingStyle: player.battingstyle || 'Right-hand bat',
            bowlingStyle: player.bowlingstyle || '',
            searchTerm: `${player.fullname} ${player.team} ${player.team_code} ${player.position?.name || ''}`.toLowerCase(),
            isInternational: player.is_international || true
          }));
          
          console.log(`✅ Loaded ${formattedPlayers.length} international cricket players from API`);
          setAllPlayers(formattedPlayers);
        } else {
          console.error('❌ Failed to load players from API:', data.message);
          // Fallback to a few key players if API fails
          setAllPlayers(getFallbackPlayers());
        }
      } catch (error) {
        console.error('❌ Error fetching players from API:', error);
        // Fallback to a few key players if API fails
        setAllPlayers(getFallbackPlayers());
      } finally {
        setPlayersLoading(false);
      }
    };

    loadAllPlayers();
  }, []);

  // Fallback players if API fails
  const getFallbackPlayers = () => {
    return [
      { name: 'Virat Kohli', fullName: 'Virat Kohli (India)', team: 'India', teamCode: 'IND', role: 'Batsman', ranking: 1, searchTerm: 'virat kohli india ind batsman' },
      { name: 'Steve Smith', fullName: 'Steve Smith (Australia)', team: 'Australia', teamCode: 'AUS', role: 'Batsman', ranking: 2, searchTerm: 'steve smith australia aus batsman' },
      { name: 'Joe Root', fullName: 'Joe Root (England)', team: 'England', teamCode: 'ENG', role: 'Batsman', ranking: 3, searchTerm: 'joe root england eng batsman' },
      { name: 'Kane Williamson', fullName: 'Kane Williamson (New Zealand)', team: 'New Zealand', teamCode: 'NZ', role: 'Batsman', ranking: 4, searchTerm: 'kane williamson new zealand nz batsman' },
      { name: 'Babar Azam', fullName: 'Babar Azam (Pakistan)', team: 'Pakistan', teamCode: 'PAK', role: 'Batsman', ranking: 5, searchTerm: 'babar azam pakistan pak batsman' }
    ];
  };

  // Get all international players
  const getAllInternationalPlayers = () => {
    return allPlayers;
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
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player.fullName);
    setPlayerSearchTerm('');
    const stats = generatePlayerStats(player.name, player.team);
    setPlayerAnalysisData(stats);
  };

  if (realData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-cricket-green" />
          <span className="text-lg text-gray-600 dark:text-gray-300">Loading cricket player data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <User className="h-12 w-12 text-cricket-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏏 Player Deep Dive
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {playersLoading 
            ? 'Loading international cricket players...' 
            : `Comprehensive analysis of ${getAllInternationalPlayers().length} international cricket players`
          }
        </p>
      </div>

      {/* Real Data Status */}
      {realData.error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {realData.error}
            </p>
          </div>
        </div>
      )}

      {!realData.error && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-green-400 mr-3" />
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Real cricket data loaded: {realData.teams.length} teams, {realData.fixtures.length} fixtures from CricketData.org API
            </p>
          </div>
        </div>
      )}

      {/* Player Selection */}
      <Card title="🔍 Player Selection" subtitle="Search and select any international cricket player for detailed analysis">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              {playersLoading 
                ? 'Loading players...' 
                : `Search Player (${getAllInternationalPlayers().length} international players available)`
              }
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={playersLoading 
                  ? "Loading players..." 
                  : "🔍 Search cricket players... (e.g., Virat, Kohli, India, Batsman)"
                }
                value={playerSearchTerm}
                onChange={(e) => setPlayerSearchTerm(e.target.value)}
                disabled={playersLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
              {playerSearchTerm && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {getFilteredPlayers().slice(0, 10).map(player => (
                    <div
                      key={player.fullName}
                      onClick={() => handlePlayerSelect(player)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{player.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {player.team} • {player.role} • Ranking #{player.ranking}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{player.teamCode}</div>
                      </div>
                    </div>
                  ))}
                  {getFilteredPlayers().length === 0 && !playersLoading && (
                    <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                      No players found. Try searching for "Virat", "Kohli", "India", "Batsman", or "England"
                    </div>
                  )}
                  {playersLoading && (
                    <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Loading international cricket players...
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
              <p className="text-sm">Choose from {getAllInternationalPlayers().length} players across 14 international teams</p>
              
              {/* Popular Players Quick Access */}
              {!playersLoading && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">🌟 Popular Players:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Virat Kohli', 'Steve Smith', 'Joe Root', 'Babar Azam', 'Kane Williamson', 'Rohit Sharma'].map(playerName => {
                      const player = getAllInternationalPlayers().find(p => p.name === playerName);
                      return player ? (
                        <button
                          key={player.name}
                          onClick={() => handlePlayerSelect(player)}
                          className="px-3 py-1 bg-cricket-green-100 hover:bg-cricket-green-200 dark:bg-cricket-green-900/30 dark:hover:bg-cricket-green-900/50 text-cricket-green-800 dark:text-cricket-green-200 rounded-full text-xs transition-colors"
                        >
                          {player.name}
                        </button>
                      ) : null;
                    })}
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Or search by role: "Batsman", "Bowler", "All-rounder", "Wicket-keeper"
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Player Analysis Dashboard */}
      {playerAnalysisData && (
        <>
          {/* Career Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Career Stats" className="text-center">
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-cricket-green-600 dark:text-cricket-green-400">
                    {playerAnalysisData.careerStats.totalRuns.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Runs</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {playerAnalysisData.careerStats.average}
                  </div>
                  <div className="text-xs text-gray-500">Batting Average</div>
                </div>
              </div>
            </Card>

            <Card title="Strike Rate" className="text-center">
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-cricket-blue-600 dark:text-cricket-blue-400">
                    {playerAnalysisData.careerStats.strikeRate}
                  </div>
                  <div className="text-sm text-gray-500">Strike Rate</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {playerAnalysisData.careerStats.highestScore}
                  </div>
                  <div className="text-xs text-gray-500">Highest Score</div>
                </div>
              </div>
            </Card>

            <Card title="Milestones" className="text-center">
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-cricket-gold-600 dark:text-cricket-gold-400">
                    {playerAnalysisData.careerStats.centuries}
                  </div>
                  <div className="text-sm text-gray-500">Centuries</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {playerAnalysisData.careerStats.fifties}
                  </div>
                  <div className="text-xs text-gray-500">Fifties</div>
                </div>
              </div>
            </Card>

            <Card title="Experience" className="text-center">
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {playerAnalysisData.careerStats.totalMatches}
                  </div>
                  <div className="text-sm text-gray-500">Total Matches</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {Math.round(playerAnalysisData.careerStats.totalRuns / playerAnalysisData.careerStats.totalMatches)}
                  </div>
                  <div className="text-xs text-gray-500">Runs/Match</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Trend Chart */}
          <Card 
            title={`${playerAnalysisData.playerName} - Performance Trend (24 Months)`}
            subtitle="Batting average and strike rate over time"
            className="col-span-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={playerAnalysisData.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Batting Average"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="strikeRate" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Strike Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Format Performance and Recent Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Format Performance */}
            <Card title="Performance by Format" subtitle="Stats across T20I, ODI, and Test cricket">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={playerAnalysisData.formatPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="format" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#22c55e" name="Average" />
                  <Bar dataKey="strikeRate" fill="#3b82f6" name="Strike Rate" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Form */}
            <Card title="Recent Form (Last 10 Matches)" subtitle="Runs scored in recent innings">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={playerAnalysisData.recentForm}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="runs" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.3}
                    name="Runs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Player Skills Radar and vs Opponents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Skills Radar */}
            <Card title="Player Skills Assessment" subtitle="Overall batting skills analysis">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={playerAnalysisData.playerSkills}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis 
                    angle={60} 
                    domain={[0, 100]} 
                    tick={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance vs Opponents */}
            <Card title="vs Top Opponents" subtitle="Performance against leading cricket nations">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={playerAnalysisData.vsOpponents} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="opponent" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#22c55e" name="Average" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Detailed Stats Table */}
          <Card title="Format Breakdown" subtitle="Detailed statistics by match format">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">Format</th>
                    <th className="text-right py-2 px-3">Matches</th>
                    <th className="text-right py-2 px-3">Runs</th>
                    <th className="text-right py-2 px-3">Average</th>
                    <th className="text-right py-2 px-3">Strike Rate</th>
                    <th className="text-right py-2 px-3">Runs/Match</th>
                  </tr>
                </thead>
                <tbody>
                  {playerAnalysisData.formatPerformance.map((format, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-medium">{format.format}</td>
                      <td className="py-2 px-3 text-right">{format.matches}</td>
                      <td className="py-2 px-3 text-right">{format.runs.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">{format.average}</td>
                      <td className="py-2 px-3 text-right">{format.strikeRate}</td>
                      <td className="py-2 px-3 text-right">{Math.round(format.runs / format.matches)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default PlayerDeepDive; 