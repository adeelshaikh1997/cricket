import axios from 'axios';

// API Configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTMONKS_API_KEY;
const SPORTMONKS_BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';

// Create axios instances
const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

const sportmonksAPI = axios.create({
  baseURL: SPORTMONKS_BASE_URL,
  timeout: 15000,
  params: {
    api_token: SPORTMONKS_API_KEY,
  },
});

// Request interceptors
backendAPI.interceptors.request.use(
  (config) => {
    console.log(`Backend API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

sportmonksAPI.interceptors.request.use(
  (config) => {
    console.log(`SportMonks API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptors with error handling
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

sportmonksAPI.interceptors.response.use(
  (response) => response,
  handleAPIError
);

// API Functions for Cricket Data

// Teams
export const getTeams = async () => {
  try {
    const response = await sportmonksAPI.get('/teams');
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    throw error;
  }
};

// Fixtures (matches)
export const getFixtures = async (params = {}) => {
  try {
    const response = await sportmonksAPI.get('/fixtures', { params });
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch fixtures:', error);
    throw error;
  }
};

// Players
export const getPlayers = async (teamId = null) => {
  try {
    const endpoint = teamId ? `/teams/${teamId}/squad` : '/players';
    const response = await sportmonksAPI.get(endpoint);
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch players:', error);
    throw error;
  }
};

// Venues
export const getVenues = async () => {
  try {
    const response = await sportmonksAPI.get('/venues');
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    throw error;
  }
};

// Match details
export const getMatchDetails = async (matchId) => {
  try {
    const response = await sportmonksAPI.get(`/fixtures/${matchId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch match details for ID ${matchId}:`, error);
    throw error;
  }
};

// Player statistics
export const getPlayerStats = async (playerId) => {
  try {
    const response = await sportmonksAPI.get(`/players/${playerId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch player stats for ID ${playerId}:`, error);
    throw error;
  }
};

// Team statistics
export const getTeamStats = async (teamId) => {
  try {
    const response = await sportmonksAPI.get(`/teams/${teamId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch team stats for ID ${teamId}:`, error);
    throw error;
  }
};

// Backend API Functions

// Match prediction
export const predictMatch = async (matchData) => {
  try {
    const response = await backendAPI.post('/predict', matchData);
    return response.data;
  } catch (error) {
    console.error('Failed to predict match:', error);
    throw error;
  }
};

// Get model info
export const getModelInfo = async () => {
  try {
    const response = await backendAPI.get('/model/info');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch model info:', error);
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

// Data formatting utilities
export const formatTeamForUI = (team) => ({
  id: team.id,
  name: team.name,
  code: team.code,
  image: team.image_path,
  national_team: team.national_team,
});

export const formatPlayerForUI = (player) => ({
  id: player.id,
  name: player.fullname || player.name,
  position: player.position?.name,
  batting_style: player.battingstyle,
  bowling_style: player.bowlingstyle,
  image: player.image_path,
  country: player.country?.name,
});

export const formatVenueForUI = (venue) => ({
  id: venue.id,
  name: venue.name,
  city: venue.city,
  country: venue.country?.name,
  capacity: venue.capacity,
  image: venue.image_path,
});

export const formatFixtureForUI = (fixture) => ({
  id: fixture.id,
  name: fixture.name,
  starting_at: fixture.starting_at,
  type: fixture.type,
  stage: fixture.stage?.name,
  venue: fixture.venue ? formatVenueForUI(fixture.venue) : null,
  teams: fixture.runs?.map(run => run.team) || [],
  status: fixture.status,
});

// Export API instances for direct use if needed
export { backendAPI, sportmonksAPI }; 