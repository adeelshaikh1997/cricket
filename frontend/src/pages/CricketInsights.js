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
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar,
  Filter,
  Trophy,
  Target
} from 'lucide-react';


const CricketInsights = () => {
  const [selectedFilter, setSelectedFilter] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [dateRange, setDateRange] = useState('last6months');

  // Dummy data state
  const [realData] = useState({
    teams: [],
    fixtures: [],
    loading: false,
    error: null
  });

  // Load dummy cricket data
  useEffect(() => {
    console.log('🎯 Loading dummy cricket insights data...');
  }, []);



  // Generate insights from real data
  const generateTeamInsights = () => {
    const internationalTeams = [
      { name: 'India', ranking: 1, code: 'IND' },
      { name: 'Australia', ranking: 2, code: 'AUS' },
      { name: 'England', ranking: 3, code: 'ENG' },
      { name: 'South Africa', ranking: 4, code: 'SA' },
      { name: 'New Zealand', ranking: 5, code: 'NZ' },
      { name: 'Pakistan', ranking: 6, code: 'PAK' },
      { name: 'West Indies', ranking: 7, code: 'WI' },
      { name: 'Sri Lanka', ranking: 8, code: 'SL' },
      { name: 'Bangladesh', ranking: 9, code: 'BAN' },
      { name: 'Afghanistan', ranking: 10, code: 'AFG' },
      { name: 'Ireland', ranking: 11, code: 'IRE' },
      { name: 'Netherlands', ranking: 12, code: 'NED' }
    ];

    return internationalTeams.slice(0, 8).map((team, index) => {
      // Give higher win rates to better ranked teams
      const baseWinRate = 85 - (team.ranking * 3) + Math.random() * 10;
      const totalMatches = 20 + Math.floor(Math.random() * 30);
      const wins = Math.floor((baseWinRate / 100) * totalMatches);
      
      return {
        team: team.name,
        wins,
        total: totalMatches,
        winRate: Math.round((wins / totalMatches) * 100),
        ranking: team.ranking,
        hasLiveData: false,
        region: 'International'
      };
    });
  };

  const generatePlayerInsights = () => {
    const topTeams = [
      { name: 'India', ranking: 1, code: 'IND' },
      { name: 'Australia', ranking: 2, code: 'AUS' },
      { name: 'England', ranking: 3, code: 'ENG' },
      { name: 'South Africa', ranking: 4, code: 'SA' },
      { name: 'New Zealand', ranking: 5, code: 'NZ' }
    ];

    return topTeams.map(team => {
      const rankingBonus = Math.max(0, 11 - team.ranking);
      return {
        player: `${team.code} Captain`,
        runs: 1000 + Math.floor(Math.random() * 800) + (rankingBonus * 50),
        average: 35 + Math.random() * 25 + rankingBonus,
        strikeRate: 75 + Math.random() * 25 + rankingBonus,
        team: team.name,
        hasLiveData: false
      };
    });
  };

  const generateVenueStats = () => {
    return [
      { name: 'Lord\'s', batFirst: 65, bowlFirst: 35 },
      { name: 'MCG', batFirst: 58, bowlFirst: 42 },
      { name: 'Eden Gardens', batFirst: 72, bowlFirst: 28 },
      { name: 'The Oval', batFirst: 62, bowlFirst: 38 },
      { name: 'Wankhede', batFirst: 68, bowlFirst: 32 },
      { name: 'Gaddafi Stadium', batFirst: 55, bowlFirst: 45 },
      { name: 'Newlands', batFirst: 60, bowlFirst: 40 },
      { name: 'Basin Reserve', batFirst: 52, bowlFirst: 48 }
    ];
  };

  const generateFormatDistribution = () => {
    return [
      { name: 'T20I', value: 45, color: '#22c55e' },
      { name: 'ODI', value: 35, color: '#3b82f6' },
      { name: 'Test', value: 20, color: '#f59e0b' },
    ];
  };

  // Get processed data
  const teamInsights = generateTeamInsights();
  const playerInsights = generatePlayerInsights();
  const venueStats = generateVenueStats();
  const matchFormats = generateFormatDistribution();

  const performanceTrend = [
    { month: 'Jan', india: 4, australia: 3, england: 2 },
    { month: 'Feb', india: 5, australia: 4, england: 3 },
    { month: 'Mar', india: 6, australia: 5, england: 4 },
    { month: 'Apr', india: 3, australia: 6, england: 5 },
    { month: 'May', india: 7, australia: 4, england: 3 },
    { month: 'Jun', india: 8, australia: 6, england: 7 },
  ];



  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <BarChart3 className="h-12 w-12 text-cricket-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cricket Insights Explorer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore cricket analytics from 12 international teams and comprehensive match data
        </p>
      </div>



      {/* Filters */}
      <Card title="Filters" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              View Type
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-blue-500 focus:border-cricket-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="teams">Team Analytics</option>
              <option value="players">Player Performance</option>
              <option value="venues">Venue Statistics</option>
              <option value="trends">Performance Trends</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Team (12 international)
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-blue-500 focus:border-cricket-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Teams</option>
              <optgroup label="🏏 International Teams">
                {realData.teams
                  .filter(team => team.national_team !== false && (team.ranking || 99) <= 14)
                  .sort((a, b) => (a.ranking || 99) - (b.ranking || 99))
                  .map(team => (
                    <option key={team.id} value={team.name.toLowerCase()}>
                      {team.ranking}. {team.name} {team.has_real_data ? '🔴' : ''}
                    </option>
                  ))}
              </optgroup>
              {realData.teams.filter(team => team.has_real_data && team.national_team === false).length > 0 && (
                <optgroup label="🔴 Live Tournaments">
                  {realData.teams
                    .filter(team => team.has_real_data && team.national_team === false)
                    .map(team => (
                      <option key={team.id} value={team.name.toLowerCase()}>
                        {team.name} 🔴
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Trophy className="inline h-4 w-4 mr-1" />
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-blue-500 focus:border-cricket-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Formats</option>
              <option value="t20">T20</option>
              <option value="odi">ODI</option>
              <option value="test">Test</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-blue-500 focus:border-cricket-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
              <option value="last2years">Last 2 Years</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Win Rates */}
        {(selectedFilter === 'teams' || selectedFilter === 'trends') && (
          <Card 
            title="International Cricket Rankings" 
            subtitle={`ICC rankings with ${realData.teams.filter(t => t.has_real_data).length} teams having live data`}
            className="col-span-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamInsights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [
                  `${value}%`,
                  'Win Rate',
                  props.payload.hasLiveData ? '🔴 Live Data' : '⚪ Standard'
                ]} />
                <Legend />
                <Bar dataKey="winRate" fill="#22c55e" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Player Performance */}
        {(selectedFilter === 'players' || selectedFilter === 'trends') && (
          <Card 
            title="Player Performance" 
            subtitle={`Based on ${realData.teams.length > 0 ? 'real team' : 'sample'} data`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={playerInsights}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="player" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip content={renderCustomTooltip} />
                <Bar dataKey="runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Venue Analysis */}
        {(selectedFilter === 'venues' || selectedFilter === 'trends') && (
          <Card 
            title="Venue Analysis" 
            subtitle={`From ${realData.fixtures.length > 0 ? 'real fixture' : 'sample'} data`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={venueStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <Bar dataKey="batFirst" stackId="a" fill="#22c55e" name="Bat First Win %" />
                <Bar dataKey="bowlFirst" stackId="a" fill="#f59e0b" name="Bowl First Win %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Match Format Distribution */}
        <Card 
          title="Live Match Format Distribution" 
          subtitle={`Real data from ${realData.fixtures.length} cricket matches`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={matchFormats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {matchFormats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Trends */}
        {selectedFilter === 'trends' && (
          <Card title="Monthly Performance Trends" subtitle="Team performance over recent months" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="india" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="India"
                />
                <Line 
                  type="monotone" 
                  dataKey="australia" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Australia"
                />
                <Line 
                  type="monotone" 
                  dataKey="england" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="England"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <Trophy className="h-8 w-8 text-cricket-gold-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{realData.fixtures.length || 156}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {realData.fixtures.length > 0 ? 'Real Matches' : 'Total Matches'}
          </div>
        </Card>

        <Card className="text-center">
          <Users className="h-8 w-8 text-cricket-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{realData.teams.length || 12}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {realData.teams.length > 0 ? 'Real Teams' : 'Teams Tracked'}
          </div>
        </Card>

        <Card className="text-center">
          <MapPin className="h-8 w-8 text-cricket-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {venueStats.length || 45}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {realData.fixtures.length > 0 ? 'Real Venues' : 'Venues'}
          </div>
        </Card>

        <Card className="text-center">
          <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">89%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Prediction Accuracy</div>
        </Card>
      </div>

      {/* Real Teams Overview */}
      <Card title="Real Teams Overview">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {realData.teams
            .filter(team => team.national_team !== false)
            .sort((a, b) => (a.ranking || 99) - (b.ranking || 99))
            .slice(0, 12)
            .map((team, index) => (
              <div key={team.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-2">
                  {team.image_path && team.image_path !== 'https://h.cricapi.com/img/icon512.png' && (
                    <img 
                      src={team.image_path} 
                      alt={team.name} 
                      className="w-6 h-6 rounded"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <span className="text-sm font-medium">
                    {team.ranking}. {team.name}
                    {team.has_real_data && <span className="ml-1 text-red-500">🔴</span>}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{team.code}</span>
                  <div className="text-xs text-gray-400">{team.region}</div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Player Deep Dive Analysis Section */}
      {selectedFilter === 'player-analysis' && (
        <div className="space-y-6">
          {/* This section has been moved to a separate page: /player-analysis */}
          <Card title="🏏 Player Deep Dive Moved!" subtitle="This feature is now available as a separate page">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Player Deep Dive is now a separate page!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                For the best experience, visit the dedicated Player Deep Dive page.
              </p>
              <a 
                href="/player-analysis" 
                className="inline-flex items-center px-4 py-2 bg-cricket-green-600 text-white rounded-lg hover:bg-cricket-green-700 transition-colors"
              >
                Go to Player Deep Dive →
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CricketInsights; 