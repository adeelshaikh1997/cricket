import React, { useState, useEffect } from 'react';
import { Trophy, Target, TrendingUp, Users, MapPin, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';


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
  
  // Dummy data state
  const [realData] = useState({
    teams: [],
    venues: [],
    loading: false,
    error: null
  });

  // Load dummy cricket data
  useEffect(() => {
    console.log('🎯 Loading dummy cricket prediction data...');
  }, []);

  // International teams data
  const availableTeams = [
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

  // Sort teams by ranking for better UX
  const sortedTeams = availableTeams.sort((a, b) => a.ranking - b.ranking);

  // All teams are international
  const internationalTeams = sortedTeams;

  const availableVenues = [
    'Lord\'s, London',
    'MCG, Melbourne',
    'Eden Gardens, Kolkata',
    'Wankhede Stadium, Mumbai',
    'The Oval, London',
    'Gaddafi Stadium, Lahore',
    'Newlands, Cape Town',
    'Basin Reserve, Wellington',
    'Kensington Oval, Barbados',
    'R. Premadasa Stadium, Colombo'
  ];

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
    setPrediction(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dummy prediction based on team rankings
      const teamA = internationalTeams.find(t => t.name === formData.teamA);
      const teamB = internationalTeams.find(t => t.name === formData.teamB);
      
      if (!teamA || !teamB) {
        setError('Invalid team selection');
        return;
      }

      // Calculate win probability based on rankings
      const rankingDiff = teamB.ranking - teamA.ranking;
      const baseProbA = 50 + (rankingDiff * 3);
      const probA = Math.max(20, Math.min(80, baseProbA));
      const probB = 100 - probA;

      // Determine winner
      const winner = probA > probB ? teamA.name : teamB.name;
      const winnerProbability = probA > probB ? probA : probB;
      const loser = probA > probB ? teamB.name : teamA.name;
      const loserProbability = probA > probB ? probB : probA;

      const prediction = {
        winner: winner,
        probability: winnerProbability,
        loser: loser,
        loserProbability: loserProbability,
        confidence: Math.round(75 + Math.random() * 20),
        model_version: 'v2.1',
        prediction_time: new Date().toISOString(),
        factors: [
          {
            name: 'Team Ranking',
            impact: Math.abs(rankingDiff) * 5
          },
          {
            name: 'Toss Advantage',
            impact: formData.tossWinner === winner ? 15 : 0
          },
          {
            name: 'Home Advantage',
            impact: (formData.venue.includes('India') && winner === 'India') ||
                   (formData.venue.includes('Australia') && winner === 'Australia') ||
                   (formData.venue.includes('England') && winner === 'England') ? 10 : 0
          },
          {
            name: 'Format Experience',
            impact: 20
          }
        ].filter(factor => factor.impact > 0),
        matchDetails: {
          venue: formData.venue,
          format: formData.matchType.toUpperCase(),
          tossWinner: formData.tossWinner,
          tossDecision: formData.tossDecision
        }
      };

      setPrediction(prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };



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
          Predict cricket match outcomes using 12 international teams and advanced analytics
        </p>
      </div>

      {/* Welcome Section - Show when no prediction */}
      {!prediction && !loading && (
        <Card title="🏏 Welcome to Cricklytics Predictor" subtitle="Get started by selecting teams and match conditions">
          <div className="text-center py-8">
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-cricket-green-100 dark:bg-cricket-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-cricket-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Select Teams</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose from 12 international cricket teams</p>
                </div>
                <div className="text-center">
                  <div className="bg-cricket-blue-100 dark:bg-cricket-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-8 w-8 text-cricket-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pick Venue</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Select from famous cricket stadiums</p>
                </div>
                <div className="text-center">
                  <div className="bg-cricket-gold-100 dark:bg-cricket-gold-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-8 w-8 text-cricket-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Prediction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive AI-powered match predictions</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cricket-green-50 to-cricket-blue-50 dark:from-cricket-green-900/20 dark:to-cricket-blue-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <strong>Team Ranking:</strong> Higher ranked teams get probability boost
                  </div>
                  <div>
                    <strong>Toss Advantage:</strong> 15% boost for toss winner
                  </div>
                  <div>
                    <strong>Home Advantage:</strong> 10% boost for home teams
                  </div>
                  <div>
                    <strong>Format Experience:</strong> 20% base factor for international experience
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3 py-1 bg-cricket-green-100 dark:bg-cricket-green-900/30 text-cricket-green-800 dark:text-cricket-green-200 rounded-full text-sm">
                  🏆 12 International Teams
                </span>
                <span className="px-3 py-1 bg-cricket-blue-100 dark:bg-cricket-blue-900/30 text-cricket-blue-800 dark:text-cricket-blue-200 rounded-full text-sm">
                  🏟️ 10 Famous Venues
                </span>
                <span className="px-3 py-1 bg-cricket-gold-100 dark:bg-cricket-gold-900/30 text-cricket-gold-800 dark:text-cricket-gold-200 rounded-full text-sm">
                  📊 Smart Analytics
                </span>
              </div>
            </div>
          </div>
        </Card>
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
                      <option key={team.code} value={team.name}>
                        {team.ranking}. {team.name} ({team.code})
                      </option>
                    ))}
                  </optgroup>
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
                  <option key={venue} value={venue}>
                    {venue}
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
                    🏆 Predicted Winner
                  </h3>
                  <p className="text-3xl font-bold text-cricket-green-900 dark:text-cricket-green-100">
                    {prediction.winner}
                  </p>
                  <p className="text-lg text-cricket-green-700 dark:text-cricket-green-400 mt-2">
                    {prediction.probability}% win probability
                  </p>
                  <p className="text-sm text-cricket-green-600 dark:text-cricket-green-500">
                    Confidence: {prediction.confidence}%
                  </p>
                </div>
              </div>

              {/* Team Comparison */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Win Probability Comparison
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${prediction.winner === formData.teamA ? 'text-cricket-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      {formData.teamA}
                    </div>
                    <div className={`text-2xl font-bold ${prediction.winner === formData.teamA ? 'text-cricket-green-700' : 'text-gray-500'}`}>
                      {prediction.winner === formData.teamA ? prediction.probability : prediction.loserProbability}%
                    </div>
                    {prediction.winner === formData.teamA && (
                      <div className="text-xs text-cricket-green-600 mt-1">🏆 WINNER</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${prediction.winner === formData.teamB ? 'text-cricket-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      {formData.teamB}
                    </div>
                    <div className={`text-2xl font-bold ${prediction.winner === formData.teamB ? 'text-cricket-green-700' : 'text-gray-500'}`}>
                      {prediction.winner === formData.teamB ? prediction.probability : prediction.loserProbability}%
                    </div>
                    {prediction.winner === formData.teamB && (
                      <div className="text-xs text-cricket-green-600 mt-1">🏆 WINNER</div>
                    )}
                  </div>
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