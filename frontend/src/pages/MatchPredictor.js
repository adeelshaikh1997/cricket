import React, { useState, useEffect } from 'react';
import { Trophy, Target, TrendingUp, Users, MapPin, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import { predictMatch, getTeams, getVenues } from '../services/api';

const MatchPredictor = () => {
  const [formData, setFormData] = useState({
    teamA: '',
    teamB: '',
    venue: '',
    tossWinner: '',
    tossDecision: 'bat',
    matchType: 't20'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Real data state
  const [realData, setRealData] = useState({
    teams: [],
    venues: [],
    loading: true,
    error: null
  });

  // Load real cricket data
  useEffect(() => {
    const loadRealData = async () => {
      try {
        setRealData(prev => ({ ...prev, loading: true, error: null }));
        
        const [teamsResponse, venuesResponse] = await Promise.all([
          getTeams(),
          getVenues()
        ]);

        setRealData({
          teams: teamsResponse.data || [],
          venues: venuesResponse.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading cricket data:', error);
        setRealData(prev => ({
          ...prev,
          loading: false,
          error: 'Unable to load real cricket data. Using sample data for demonstration.'
        }));
      }
    };

    loadRealData();
  }, []);

  // Generate mock venues if no real data
  const generateMockVenues = () => [
    { id: 1, name: 'Melbourne Cricket Ground (MCG)' },
    { id: 2, name: 'Lord\'s Cricket Ground' },
    { id: 3, name: 'Eden Gardens' },
    { id: 4, name: 'Wankhede Stadium' },
    { id: 5, name: 'Sydney Cricket Ground (SCG)' },
    { id: 6, name: 'The Oval' },
    { id: 7, name: 'Old Trafford' },
    { id: 8, name: 'Newlands' }
  ];

  // Get available teams and venues
  const availableTeams = realData.teams.length > 0 ? realData.teams : [
    { id: 1, name: 'India', code: 'IND' },
    { id: 2, name: 'Australia', code: 'AUS' },
    { id: 3, name: 'England', code: 'ENG' },
    { id: 4, name: 'New Zealand', code: 'NZ' },
    { id: 5, name: 'South Africa', code: 'SA' },
    { id: 6, name: 'Pakistan', code: 'PAK' },
    { id: 7, name: 'West Indies', code: 'WI' },
    { id: 8, name: 'Sri Lanka', code: 'SL' }
  ];

  // Sort teams by ranking for better UX
  const sortedTeams = availableTeams.sort((a, b) => {
    const rankingA = a.ranking || 99;
    const rankingB = b.ranking || 99;
    return rankingA - rankingB;
  });

  // Group teams by status
  const internationalTeams = sortedTeams.filter(team => team.national_team !== false && (team.ranking || 99) <= 14);
  const liveDataTeams = sortedTeams.filter(team => team.has_real_data && !internationalTeams.includes(team));

  const availableVenues = realData.venues.length > 0 ? realData.venues : generateMockVenues();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear prediction when form changes
    if (prediction) {
      setPrediction(null);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    if (!formData.teamA || !formData.teamB) {
      setError('Please select both teams');
      return;
    }

    if (formData.teamA === formData.teamB) {
      setError('Please select different teams');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predictMatch(formData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (realData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-cricket-green" />
          <span className="text-lg text-gray-600 dark:text-gray-300">Loading real cricket data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Target className="h-12 w-12 text-cricket-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Match Outcome Predictor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Predict cricket match outcomes using {availableTeams.length} real teams and advanced ML models
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
              ✅ Real cricket data loaded: {availableTeams.length} teams, {availableVenues.length} venues from CricketData.org API
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <Card title="Match Details" subtitle="Select teams and match conditions for prediction">
          <form onSubmit={handlePredict} className="space-y-6">
            {/* Teams Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Team A ({internationalTeams.length} international teams)
                </label>
                <select
                  value={formData.teamA}
                  onChange={(e) => handleInputChange('teamA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Team A</option>
                  <optgroup label="🏏 International Cricket Teams">
                    {internationalTeams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.ranking}. {team.name} ({team.code}) {team.has_real_data ? '🔴' : ''}
                      </option>
                    ))}
                  </optgroup>
                  {liveDataTeams.length > 0 && (
                    <optgroup label="🔴 Live Tournament Teams">
                      {liveDataTeams.map(team => (
                        <option key={team.id} value={team.name}>
                          {team.name} ({team.code}) 🔴
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Team B
                </label>
                <select
                  value={formData.teamB}
                  onChange={(e) => handleInputChange('teamB', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Team B</option>
                  <optgroup label="🏏 International Cricket Teams">
                    {internationalTeams.filter(team => team.name !== formData.teamA).map(team => (
                      <option key={team.id} value={team.name}>
                        {team.ranking}. {team.name} ({team.code}) {team.has_real_data ? '🔴' : ''}
                      </option>
                    ))}
                  </optgroup>
                  {liveDataTeams.length > 0 && (
                    <optgroup label="🔴 Live Tournament Teams">
                      {liveDataTeams.filter(team => team.name !== formData.teamA).map(team => (
                        <option key={team.id} value={team.name}>
                          {team.name} ({team.code}) 🔴
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>

            {/* Venue Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Venue ({availableVenues.length} available)
              </label>
              <select
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Venue</option>
                {availableVenues.map(venue => (
                  <option key={venue.id} value={venue.name}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toss Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toss Winner
                </label>
                <select
                  value={formData.tossWinner}
                  onChange={(e) => handleInputChange('tossWinner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Toss Winner</option>
                  {formData.teamA && <option value={formData.teamA}>{formData.teamA}</option>}
                  {formData.teamB && <option value={formData.teamB}>{formData.teamB}</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toss Decision
                </label>
                <select
                  value={formData.tossDecision}
                  onChange={(e) => handleInputChange('tossDecision', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="bat">Bat First</option>
                  <option value="bowl">Bowl First</option>
                </select>
              </div>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Match Type
              </label>
              <select
                value={formData.matchType}
                onChange={(e) => handleInputChange('matchType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="t20">T20</option>
                <option value="odi">ODI</option>
                <option value="test">Test</option>
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.teamA || !formData.teamB}
              className="w-full bg-cricket-green-600 hover:bg-cricket-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Predict Match Outcome
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <Card 
            title="Prediction Results" 
            subtitle={`Analysis for ${formData.teamA} vs ${formData.teamB}`}
          >
            <div className="space-y-6">
              {/* Winner */}
              <div className="text-center">
                <div className="bg-cricket-green-50 dark:bg-cricket-green-900/20 rounded-lg p-6">
                  <Trophy className="h-12 w-12 text-cricket-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-cricket-green-800 dark:text-cricket-green-300 mb-2">
                    Predicted Winner
                  </h3>
                  <p className="text-3xl font-bold text-cricket-green-900 dark:text-cricket-green-100">
                    {prediction.winner}
                  </p>
                  <p className="text-lg text-cricket-green-700 dark:text-cricket-green-400 mt-2">
                    {prediction.probability}% probability
                  </p>
                  <p className="text-sm text-cricket-green-600 dark:text-cricket-green-500">
                    Confidence: {prediction.confidence}
                  </p>
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Key Factors
                </h4>
                <div className="space-y-3">
                  {prediction.factors?.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {factor.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-cricket-green-600 h-2 rounded-full"
                            style={{ width: `${factor.impact}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                          {factor.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Model Information
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Model Version: {prediction.model_version}</p>
                  <p>Prediction Time: {new Date(prediction.prediction_time).toLocaleString()}</p>
                  <p>Using {realData.teams.length > 0 ? 'Real' : 'Sample'} Team Data</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchPredictor; 