import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { 
  Target, 
  Trophy, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const MatchPredictor = () => {
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    teamA: '',
    teamB: '',
    venue: '',
    tossWinner: '',
    tossDecision: 'bat',
    matchType: 'T20'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, using mock data since SportMonks API requires authentication
      const mockTeams = [
        { id: 1, name: 'India', code: 'IND' },
        { id: 2, name: 'Australia', code: 'AUS' },
        { id: 3, name: 'England', code: 'ENG' },
        { id: 4, name: 'Pakistan', code: 'PAK' },
        { id: 5, name: 'South Africa', code: 'SA' },
        { id: 6, name: 'New Zealand', code: 'NZ' },
        { id: 7, name: 'West Indies', code: 'WI' },
        { id: 8, name: 'Sri Lanka', code: 'SL' },
        { id: 9, name: 'Bangladesh', code: 'BAN' },
        { id: 10, name: 'Afghanistan', code: 'AFG' },
      ];

      const mockVenues = [
        { id: 1, name: 'Lord\'s', city: 'London', country: 'England' },
        { id: 2, name: 'Eden Gardens', city: 'Kolkata', country: 'India' },
        { id: 3, name: 'MCG', city: 'Melbourne', country: 'Australia' },
        { id: 4, name: 'The Oval', city: 'London', country: 'England' },
        { id: 5, name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' },
        { id: 6, name: 'Sydney Cricket Ground', city: 'Sydney', country: 'Australia' },
        { id: 7, name: 'Newlands', city: 'Cape Town', country: 'South Africa' },
        { id: 8, name: 'Basin Reserve', city: 'Wellington', country: 'New Zealand' },
      ];

      setTeams(mockTeams);
      setVenues(mockVenues);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    try {
      setLoading(true);
      setError(null);
      
      // Mock prediction for demo (replace with actual API call)
      const mockPrediction = {
        winner: Math.random() > 0.5 ? formData.teamA : formData.teamB,
        probability: Math.round((Math.random() * 0.4 + 0.5) * 100), // 50-90%
        confidence: 'High',
        factors: [
          { name: 'Team Form', impact: Math.round(Math.random() * 30 + 20) },
          { name: 'Venue Advantage', impact: Math.round(Math.random() * 25 + 10) },
          { name: 'Toss Factor', impact: Math.round(Math.random() * 15 + 5) },
          { name: 'Head to Head', impact: Math.round(Math.random() * 20 + 10) },
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPrediction(mockPrediction);
    } catch (err) {
      setError('Failed to predict match outcome');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id.toString() === teamId);
    return team ? team.name : teamId;
  };

  const getVenueName = (venueId) => {
    const venue = venues.find(v => v.id.toString() === venueId);
    return venue ? `${venue.name}, ${venue.city}` : venueId;
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
          Select match details to predict the winner using our ML model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <Card title="Match Details" subtitle="Configure match parameters for prediction">
          <form onSubmit={handlePredict} className="space-y-6">
            {/* Teams Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Team A
                </label>
                <select
                  name="teamA"
                  value={formData.teamA}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Team A</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Team B
                </label>
                <select
                  name="teamB"
                  value={formData.teamB}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Team B</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Venue
              </label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Match Type
              </label>
              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
              </select>
            </div>

            {/* Toss Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toss Winner
                </label>
                <select
                  name="tossWinner"
                  value={formData.tossWinner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Toss Winner</option>
                  {formData.teamA && <option value={formData.teamA}>{getTeamName(formData.teamA)}</option>}
                  {formData.teamB && <option value={formData.teamB}>{getTeamName(formData.teamB)}</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toss Decision
                </label>
                <select
                  name="tossDecision"
                  value={formData.tossDecision}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="bat">Bat First</option>
                  <option value="bowl">Bowl First</option>
                </select>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cricket-green-600 hover:bg-cricket-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cricket-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Predict Match Outcome
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Prediction Results */}
        <Card title="Prediction Results" subtitle="AI-powered match outcome prediction">
          {prediction ? (
            <div className="space-y-6">
              {/* Winner */}
              <div className="text-center p-6 bg-gradient-to-r from-cricket-green-50 to-cricket-blue-50 dark:from-cricket-green-900/20 dark:to-cricket-blue-900/20 rounded-lg">
                <Trophy className="h-12 w-12 text-cricket-gold-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Predicted Winner
                </h3>
                <p className="text-3xl font-bold text-cricket-green-600 mb-2">
                  {getTeamName(prediction.winner)}
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <span className="text-lg text-gray-600 dark:text-gray-300">
                    Win Probability: <strong>{prediction.probability}%</strong>
                  </span>
                  <span className="px-3 py-1 bg-cricket-green-100 dark:bg-cricket-green-800 text-cricket-green-800 dark:text-cricket-green-200 rounded-full text-sm font-medium">
                    {prediction.confidence} Confidence
                  </span>
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Key Factors
                </h4>
                <div className="space-y-3">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {factor.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-cricket-green-500 h-2 rounded-full"
                            style={{ width: `${factor.impact}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {factor.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Summary */}
              {formData.teamA && formData.teamB && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Match Summary</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p><strong>Teams:</strong> {getTeamName(formData.teamA)} vs {getTeamName(formData.teamB)}</p>
                    {formData.venue && <p><strong>Venue:</strong> {getVenueName(formData.venue)}</p>}
                    <p><strong>Format:</strong> {formData.matchType}</p>
                    {formData.tossWinner && (
                      <p><strong>Toss:</strong> {getTeamName(formData.tossWinner)} won and chose to {formData.tossDecision} first</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Fill in the match details and click "Predict Match Outcome" to see the AI prediction
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MatchPredictor; 