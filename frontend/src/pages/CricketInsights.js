import React, { useState } from 'react';
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

  // Mock data for demonstration
  const teamWinRates = [
    { name: 'India', wins: 85, total: 100, winRate: 85 },
    { name: 'Australia', wins: 78, total: 95, winRate: 82 },
    { name: 'England', wins: 72, total: 90, winRate: 80 },
    { name: 'New Zealand', wins: 65, total: 85, winRate: 76 },
    { name: 'South Africa', wins: 58, total: 80, winRate: 73 },
    { name: 'Pakistan', wins: 55, total: 85, winRate: 65 },
  ];

  const playerStats = [
    { name: 'V. Kohli', runs: 1250, matches: 25, average: 50.0 },
    { name: 'B. Azam', runs: 1180, matches: 28, average: 42.1 },
    { name: 'J. Root', runs: 1150, matches: 24, average: 47.9 },
    { name: 'S. Smith', runs: 1100, matches: 22, average: 50.0 },
    { name: 'K. Williamson', runs: 980, matches: 20, average: 49.0 },
  ];

  const venueStats = [
    { name: 'Lord\'s', batFirst: 65, bowlFirst: 35 },
    { name: 'MCG', batFirst: 58, bowlFirst: 42 },
    { name: 'Eden Gardens', batFirst: 72, bowlFirst: 28 },
    { name: 'The Oval', batFirst: 62, bowlFirst: 38 },
    { name: 'Wankhede', batFirst: 68, bowlFirst: 32 },
  ];

  const matchFormats = [
    { name: 'T20', value: 45, color: '#22c55e' },
    { name: 'ODI', value: 35, color: '#3b82f6' },
    { name: 'Test', value: 20, color: '#f59e0b' },
  ];

  const performanceTrend = [
    { month: 'Jan', india: 4, australia: 3, england: 2 },
    { month: 'Feb', india: 5, australia: 4, england: 3 },
    { month: 'Mar', india: 6, australia: 5, england: 4 },
    { month: 'Apr', india: 3, australia: 6, england: 5 },
    { month: 'May', india: 7, australia: 4, england: 3 },
    { month: 'Jun', india: 8, australia: 6, england: 7 },
  ];

  const teams = [
    'India', 'Australia', 'England', 'New Zealand', 'South Africa', 'Pakistan'
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
          Explore comprehensive cricket analytics and performance metrics
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
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-blue-500 focus:border-cricket-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
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
          <Card title="Team Win Rates" subtitle="Win percentage across all formats">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamWinRates}>
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
                <Bar dataKey="winRate" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Player Performance */}
        {(selectedFilter === 'players' || selectedFilter === 'trends') && (
          <Card title="Top Batsmen" subtitle="Leading run scorers this season">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={playerStats}>
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
                <Bar dataKey="runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Venue Analysis */}
        {(selectedFilter === 'venues' || selectedFilter === 'trends') && (
          <Card title="Venue Analysis" subtitle="Bat first vs Bowl first advantage">
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
        <Card title="Match Format Distribution" subtitle="Distribution of matches by format">
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
          <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Matches</div>
        </Card>

        <Card className="text-center">
          <Users className="h-8 w-8 text-cricket-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Teams Tracked</div>
        </Card>

        <Card className="text-center">
          <MapPin className="h-8 w-8 text-cricket-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">45</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Venues</div>
        </Card>

        <Card className="text-center">
          <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">89%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Prediction Accuracy</div>
        </Card>
      </div>
    </div>
  );
};

export default CricketInsights; 