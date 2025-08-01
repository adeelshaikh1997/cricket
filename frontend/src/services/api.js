import axios from 'axios';

// API Configuration - Backend Only (SportMonks Premium handled server-side)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

// Create backend API instance
const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

// Request interceptor
backendAPI.interceptors.request.use(
  (config) => {
    console.log(`Backend API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with error handling
const handleAPIError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data);
    return Promise.reject({
      status: error.response.status,
      message: error.response.data?.message || 'API request failed',
      data: error.response.data,
    });
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return Promise.reject({
      status: 0,
      message: 'Network error - please check your connection',
    });
  } else {
    console.error('Request Error:', error.message);
    return Promise.reject({
      status: -1,
      message: error.message || 'Unknown error occurred',
    });
  }
};

backendAPI.interceptors.response.use(
  (response) => response,
  handleAPIError
);

// API Functions for Cricket Data (All via SportMonks Premium Backend)

// Teams
export const getTeams = async () => {
  try {
    console.log('🏏 Fetching teams from SportMonks Premium via backend...');
    const response = await backendAPI.get('/teams');
    console.log('✅ Teams response:', response.data);
    return response.data || { data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch teams:', error);
    throw error;
  }
};

// Fixtures (matches)
export const getFixtures = async (days = 30) => {
  try {
    console.log('🏟️ Fetching fixtures from SportMonks Premium via backend...');
    const response = await backendAPI.get('/fixtures', { params: { days } });
    console.log('✅ Fixtures response:', response.data);
    return response.data || { data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch fixtures:', error);
    throw error;
  }
};

// Players
export const getPlayers = async (teamId = null, countryId = null) => {
  try {
    console.log('👥 Fetching players from SportMonks Premium via backend...');
    const params = {};
    if (teamId) params.team_id = teamId;
    if (countryId) params.country_id = countryId;
    
    const response = await backendAPI.get('/players', { params });
    console.log('✅ Players response:', response.data);
    return response.data || { success: false, data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch players:', error);
    throw error;
  }
};

// Player Match History
export const getPlayerMatchHistory = async (playerName, limit = 20) => {
  try {
    console.log(`🏏 Fetching match history for ${playerName} from SportMonks Premium...`);
    const encodedName = encodeURIComponent(playerName);
    const response = await backendAPI.get(`/players/${encodedName}/matches`, {
      params: { limit }
    });
    console.log('✅ Player match history response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch match history for ${playerName}:`, error);
    throw error;
  }
};

// Player Analytics
export const getPlayerAnalytics = async (playerName, role = 'Batsman') => {
  try {
    console.log(`📊 Fetching analytics for ${playerName} from SportMonks Premium...`);
    const encodedName = encodeURIComponent(playerName);
    const response = await backendAPI.get(`/players/${encodedName}/analytics`, {
      params: { role }
    });
    console.log('✅ Player analytics response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch analytics for ${playerName}:`, error);
    throw error;
  }
};

// Venues
export const getVenues = async () => {
  try {
    console.log('🏟️ Fetching venues from SportMonks Premium via backend...');
    const response = await backendAPI.get('/venues');
    console.log('✅ Venues response:', response.data);
    return response.data || { data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch venues:', error);
    throw error;
  }
};

// Live Matches
export const getLiveMatches = async () => {
  try {
    console.log('🔴 Fetching live matches from SportMonks Premium...');
    const response = await backendAPI.get('/live-matches');
    console.log('✅ Live matches response:', response.data);
    return response.data || { data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch live matches:', error);
    throw error;
  }
};

// Service Status
export const getServiceStatus = async () => {
  try {
    console.log('⚡ Fetching service status...');
    const response = await backendAPI.get('/status');
    console.log('✅ Service status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch service status:', error);
    throw error;
  }
};

// Match prediction
export const predictMatch = async (matchData) => {
  try {
    console.log('🎯 Predicting match outcome...');
    const response = await backendAPI.post('/predict', matchData);
    console.log('✅ Prediction response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to predict match:', error);
    throw error;
  }
};

// API Usage
export const getApiUsage = async () => {
  try {
    console.log('📊 Fetching API usage info...');
    const response = await backendAPI.get('/api-usage');
    console.log('✅ API usage response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch API usage:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await backendAPI.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};

// Data formatting utilities for SportMonks Premium data
export const formatTeamForUI = (team) => ({
  id: team.id,
  name: team.name,
  code: team.code,
  image: team.logo || team.image_path,
  national_team: team.national_team,
  country: team.country,
  ranking: team.current_ranking,
  founded: team.founded
});

export const formatPlayerForUI = (player) => ({
  id: player.id,
  name: player.fullname || player.name,
  firstname: player.firstname,
  lastname: player.lastname,
  position: player.position?.name || player.position,
  batting_style: player.battingstyle,
  bowling_style: player.bowlingstyle,
  image: player.image_path,
  country: player.country?.name || player.country,
  team: player.team,
  team_code: player.team_code,
  dateofbirth: player.dateofbirth,
  career_stats: player.career_stats
});

export const formatVenueForUI = (venue) => ({
  id: venue.id,
  name: venue.name,
  city: venue.city,
  country: venue.country?.name || venue.country,
  capacity: venue.capacity,
  image: venue.image_path,
  floodlight: venue.floodlight,
  coordinates: venue.coordinates
});

export const formatFixtureForUI = (fixture) => ({
  id: fixture.id,
  name: fixture.name,
  starting_at: fixture.starting_at,
  type: fixture.type,
  league: fixture.league,
  localteam: fixture.localteam,
  visitorteam: fixture.visitorteam,
  venue: fixture.venue ? formatVenueForUI(fixture.venue) : null,
  status: fixture.status,
  weather: fixture.weather,
  pitch_conditions: fixture.pitch_conditions
});

export const formatLiveMatchForUI = (match) => ({
  id: match.id,
  type: match.type,
  league: match.league,
  round: match.round,
  localteam: match.localteam,
  visitorteam: match.visitorteam,
  venue: match.venue,
  starting_at: match.starting_at,
  status: match.status,
  live: match.live,
  current_score: match.current_score
});

// Export API instance for direct use if needed
export { backendAPI }; 

// Test Players (fast endpoint for debugging)
export const getTestPlayers = async () => {
  try {
    console.log('🧪 Fetching test players for fast loading...');
    const response = await backendAPI.get('/test-players');
    console.log('✅ Test players response:', response.data);
    return response.data || { data: [] };
  } catch (error) {
    console.error('❌ Failed to fetch test players:', error);
    throw error;
  }
}; 