import os
import requests
import logging
from typing import Dict, List, Optional
import time
from datetime import datetime, timedelta
import json
import hashlib

logger = logging.getLogger(__name__)

class CricketService:
    def __init__(self):
        self.base_url = "https://cricapi.com/api"
        self.api_key = os.getenv('CRICKETDATA_API_KEY')
        self.session = requests.Session()
        
        # 🛡️ DEVELOPMENT MODE PROTECTION
        self.development_mode = os.getenv('CRICKET_DEV_MODE', 'true').lower() == 'true'
        self.api_calls_today = 0
        self.api_limit = 100
        self.api_usage_threshold = 80  # Warn at 80% usage
        
        # 🚀 AGGRESSIVE CACHING FOR DEVELOPMENT
        self._cache = {}
        self._cache_duration = 21600 if self.development_mode else 3600  # 6 hours in dev, 1 hour in prod
        self._last_api_call = 0
        self._min_call_interval = 2 if self.development_mode else 1  # 2 seconds between calls in dev
        
        # 📊 USAGE TRACKING
        self._daily_calls = 0
        self._daily_limit = 85 if self.development_mode else 95  # Lower limit in dev mode
        self._calls_reset_time = None
        
        # Default free API key for demo (replace with your actual key)
        if not self.api_key:
            self.api_key = "a1b2c3d4e5f6g7h8"  # Demo key
            
        logger.info(f"🛡️ CricketService initialized - Dev Mode: {self.development_mode}")
        logger.info(f"📊 API Protection: {self._daily_limit} calls/day, {self._cache_duration}s cache")
    
    def get_api_usage_info(self) -> Dict:
        """Get current API usage information"""
        return {
            'development_mode': self.development_mode,
            'daily_limit': self._daily_limit,
            'calls_today': self._daily_calls,
            'usage_percentage': (self._daily_calls / self._daily_limit) * 100,
            'cache_duration_hours': self._cache_duration / 3600,
            'protection_active': self._daily_calls >= self._daily_limit
        }
    
    def _check_cache(self, cache_key: str) -> Optional[Dict]:
        """Check if we have cached data that's still valid"""
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self._cache_duration:
                logger.info(f"Using cached data for {cache_key}")
                return cached_data
        return None
    
    def _store_cache(self, cache_key: str, data: Dict):
        """Store data in cache with timestamp"""
        self._cache[cache_key] = (data, time.time())
    
    def _can_make_api_call(self) -> bool:
        """Check if we can make an API call without hitting limits"""
        now = time.time()
        
        # 🛡️ DEVELOPMENT MODE PROTECTION
        if self.development_mode and self._daily_calls >= self._daily_limit:
            logger.warning(f"🚫 DEV MODE: API limit reached ({self._daily_calls}/{self._daily_limit}). Using cached/fallback data only.")
            return False
        
        # Check if we need to wait between calls
        if now - self._last_api_call < self._min_call_interval:
            wait_time = self._min_call_interval - (now - self._last_api_call)
            logger.info(f"⏳ Rate limiting: waiting {wait_time:.1f}s between API calls")
            time.sleep(wait_time)
        
        # Warn at usage threshold
        if self._daily_calls >= self.api_usage_threshold:
            percentage = (self._daily_calls / self._daily_limit) * 100
            logger.warning(f"⚠️ API Usage Alert: {self._daily_calls}/{self._daily_limit} calls ({percentage:.1f}%)")
        
        return True
    
    def _make_api_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make API request with caching and rate limiting"""
        cache_key = f"{endpoint}_{params or {}}"
        
        # 🚀 CHECK CACHE FIRST (aggressive in dev mode)
        cached_data = self._check_cache(cache_key)
        if cached_data:
            return cached_data
        
        # 🛡️ DEVELOPMENT MODE: Prefer fallback over API calls
        if self.development_mode and self._daily_calls >= self._daily_limit * 0.8:  # 80% threshold
            logger.info(f"🛡️ DEV MODE: Avoiding API call to preserve quota. Using fallback data.")
            return {'status': 'cache_miss', 'message': 'Development mode protection active'}
        
        # Check if we can make the API call
        if not self._can_make_api_call():
            return {'status': 'rate_limited', 'message': 'API quota exceeded or rate limited'}
        
        if not self.api_key:
            logger.warning("No CricketData API key configured")
            return {'status': 'error', 'message': 'No API key configured'}
        
        try:
            url = f"{self.base_url}/{endpoint}"
            request_params = {'apikey': self.api_key}
            if params:
                request_params.update(params)
            
            logger.info(f"📡 Making CricketData API request: {endpoint}")
            
            response = self.session.get(url, params=request_params, timeout=10)
            self._last_api_call = time.time()
            self._daily_calls += 1
            
            # 📊 LOG USAGE
            usage_pct = (self._daily_calls / self._daily_limit) * 100
            logger.info(f"📊 API Usage: {self._daily_calls}/{self._daily_limit} ({usage_pct:.1f}%)")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check for rate limit in response
                if isinstance(data, dict) and 'hitsToday' in data:
                    hits_today = data.get('hitsToday', 0)
                    hits_limit = data.get('hitsLimit', 100)
                    if hits_today >= hits_limit:
                        logger.error(f"🚫 CricketData API quota exceeded: {hits_today}/{hits_limit}")
                        return {'status': 'quota_exceeded', 'message': f'Daily quota exceeded: {hits_today}/{hits_limit}'}
                
                if data.get('status') == 'success':
                    logger.info(f"✅ CricketData API success for {endpoint}")
                    self._store_cache(cache_key, data)
                    return data
                else:
                    logger.warning(f"⚠️ CricketData API returned error: {data}")
                    return {'status': 'api_error', 'data': data}
            else:
                logger.error(f"❌ API request failed with status {response.status_code}")
                return {'status': 'http_error', 'code': response.status_code}
                
        except requests.exceptions.Timeout:
            logger.error("⏰ CricketData API request timed out")
            return {'status': 'timeout', 'message': 'Request timed out'}
        except requests.exceptions.RequestException as e:
            logger.error(f"🌐 CricketData API request failed: {e}")
            return {'status': 'request_error', 'message': str(e)}
        except Exception as e:
            logger.error(f"💥 Unexpected error in API request: {e}")
            return {'status': 'unknown_error', 'message': str(e)}
    
    def _get_mock_data(self, endpoint: str) -> Dict:
        """Return mock data when API is not available"""
        
        if 'teams' in endpoint:
            return {
                'data': [
                    {'id': 1, 'name': 'India', 'code': 'IND', 'national_team': True},
                    {'id': 2, 'name': 'Australia', 'code': 'AUS', 'national_team': True},
                    {'id': 3, 'name': 'England', 'code': 'ENG', 'national_team': True},
                    {'id': 4, 'name': 'Pakistan', 'code': 'PAK', 'national_team': True},
                    {'id': 5, 'name': 'South Africa', 'code': 'SA', 'national_team': True},
                    {'id': 6, 'name': 'New Zealand', 'code': 'NZ', 'national_team': True},
                    {'id': 7, 'name': 'West Indies', 'code': 'WI', 'national_team': True},
                    {'id': 8, 'name': 'Sri Lanka', 'code': 'SL', 'national_team': True},
                    {'id': 9, 'name': 'Bangladesh', 'code': 'BAN', 'national_team': True},
                    {'id': 10, 'name': 'Afghanistan', 'code': 'AFG', 'national_team': True},
                ]
            }
        
        elif 'venues' in endpoint:
            return {
                'data': [
                    {'id': 1, 'name': "Lord's", 'city': 'London', 'country': {'name': 'England'}, 'capacity': 30000},
                    {'id': 2, 'name': 'Eden Gardens', 'city': 'Kolkata', 'country': {'name': 'India'}, 'capacity': 66000},
                    {'id': 3, 'name': 'MCG', 'city': 'Melbourne', 'country': {'name': 'Australia'}, 'capacity': 100000},
                    {'id': 4, 'name': 'The Oval', 'city': 'London', 'country': {'name': 'England'}, 'capacity': 25000},
                    {'id': 5, 'name': 'Wankhede Stadium', 'city': 'Mumbai', 'country': {'name': 'India'}, 'capacity': 33000},
                    {'id': 6, 'name': 'Sydney Cricket Ground', 'city': 'Sydney', 'country': {'name': 'Australia'}, 'capacity': 48000},
                    {'id': 7, 'name': 'Newlands', 'city': 'Cape Town', 'country': {'name': 'South Africa'}, 'capacity': 25000},
                    {'id': 8, 'name': 'Basin Reserve', 'city': 'Wellington', 'country': {'name': 'New Zealand'}, 'capacity': 11600},
                ]
            }
        
        elif 'fixtures' in endpoint:
            return {
                'data': [
                    {
                        'id': 1,
                        'name': 'India vs Australia',
                        'starting_at': '2024-02-15 14:30:00',
                        'type': 'T20',
                        'stage': {'name': 'Final'},
                        'venue': {'id': 2, 'name': 'Eden Gardens', 'city': 'Kolkata'},
                        'status': 'upcoming'
                    },
                    {
                        'id': 2,
                        'name': 'England vs Pakistan', 
                        'starting_at': '2024-02-18 19:30:00',
                        'type': 'ODI',
                        'stage': {'name': 'Semi-Final'},
                        'venue': {'id': 1, 'name': "Lord's", 'city': 'London'},
                        'status': 'upcoming'
                    }
                ]
            }
        
        elif 'players' in endpoint:
            return {
                'data': [
                    {
                        'id': 1,
                        'fullname': 'Virat Kohli',
                        'position': {'name': 'Batsman'},
                        'battingstyle': 'Right-hand bat',
                        'bowlingstyle': 'Right-arm medium',
                        'country': {'name': 'India'}
                    },
                    {
                        'id': 2,
                        'fullname': 'Steve Smith',
                        'position': {'name': 'Batsman'},
                        'battingstyle': 'Right-hand bat',
                        'bowlingstyle': 'Right-arm leg-break',
                        'country': {'name': 'Australia'}
                    }
                ]
            }
        
        return {'data': []}
    
    def get_teams(self) -> List[Dict]:
        """Get list of international cricket teams with real data integration"""
        try:
            # Get real data first
            response = self._make_api_request('currentMatches', {'offset': 0})
            real_teams = []
            
            if response.get('status') == 'success':
                matches = response.get('data', [])
                teams_set = set()
                
                # Extract teams from real matches
                for match in matches:
                    team_info = match.get('teamInfo', [])
                    for team in team_info:
                        team_name = team.get('name', '')
                        if team_name and team_name not in teams_set:
                            teams_set.add(team_name)
                            real_teams.append({
                                'name': team_name,
                                'code': team.get('shortname', ''),
                                'image_path': team.get('img', ''),
                                'is_real': True
                            })
            
            # Define major international cricket teams
            international_teams = [
                {'name': 'India', 'code': 'IND', 'ranking': 1, 'region': 'Asia'},
                {'name': 'Australia', 'code': 'AUS', 'ranking': 2, 'region': 'Oceania'},
                {'name': 'England', 'code': 'ENG', 'ranking': 3, 'region': 'Europe'},
                {'name': 'New Zealand', 'code': 'NZ', 'ranking': 4, 'region': 'Oceania'},
                {'name': 'Pakistan', 'code': 'PAK', 'ranking': 5, 'region': 'Asia'},
                {'name': 'South Africa', 'code': 'SA', 'ranking': 6, 'region': 'Africa'},
                {'name': 'West Indies', 'code': 'WI', 'ranking': 7, 'region': 'Caribbean'},
                {'name': 'Sri Lanka', 'code': 'SL', 'ranking': 8, 'region': 'Asia'},
                {'name': 'Bangladesh', 'code': 'BAN', 'ranking': 9, 'region': 'Asia'},
                {'name': 'Afghanistan', 'code': 'AFG', 'ranking': 10, 'region': 'Asia'},
                {'name': 'Ireland', 'code': 'IRE', 'ranking': 11, 'region': 'Europe'},
                {'name': 'Zimbabwe', 'code': 'ZIM', 'ranking': 12, 'region': 'Africa'},
                {'name': 'Netherlands', 'code': 'NED', 'ranking': 13, 'region': 'Europe'},
                {'name': 'Scotland', 'code': 'SCO', 'ranking': 14, 'region': 'Europe'}
            ]
            
            # Merge real teams with international teams
            formatted_teams = []
            real_team_names = {team['name'] for team in real_teams}
            
            # Add international teams, marking which ones have real data
            for i, team in enumerate(international_teams):
                is_real = team['name'] in real_team_names
                real_team_data = next((rt for rt in real_teams if rt['name'] == team['name']), {})
                
                formatted_teams.append({
                    'id': i + 1,
                    'name': team['name'],
                    'code': team['code'],
                    'national_team': True,
                    'ranking': team['ranking'],
                    'region': team['region'],
                    'image_path': real_team_data.get('image_path', ''),
                    'has_real_data': is_real,
                    'status': 'live_data' if is_real else 'international_team'
                })
            
            # Add unique real teams that aren't in international list
            unique_real_teams = [rt for rt in real_teams if rt['name'] not in {t['name'] for t in international_teams}]
            for i, team in enumerate(unique_real_teams):
                formatted_teams.append({
                    'id': len(formatted_teams) + 1,
                    'name': team['name'],
                    'code': team['code'],
                    'national_team': False,
                    'ranking': 99,
                    'region': 'Other',
                    'image_path': team.get('image_path', ''),
                    'has_real_data': True,
                    'status': 'live_tournament'
                })
            
            logger.info(f"Retrieved {len(formatted_teams)} teams: {len([t for t in formatted_teams if t['has_real_data']])} with real data")
            return formatted_teams
            
        except Exception as e:
            logger.error(f"Error fetching teams: {str(e)}")
            return self._get_mock_data('teams').get('data', [])
    
    def get_venues(self) -> List[Dict]:
        """Get list of cricket venues"""
        try:
            response = self._make_api_request('venues')
            venues = response.get('data', [])
            
            # Format venues
            formatted_venues = []
            for venue in venues:
                formatted_venue = {
                    'id': venue.get('id'),
                    'name': venue.get('name'),
                    'city': venue.get('city'),
                    'country': venue.get('country', {}).get('name', ''),
                    'capacity': venue.get('capacity'),
                    'image_path': venue.get('image_path', ''),
                }
                formatted_venues.append(formatted_venue)
            
            logger.info(f"Retrieved {len(formatted_venues)} venues")
            return formatted_venues
            
        except Exception as e:
            logger.error(f"Error fetching venues: {str(e)}")
            return []
    
    def get_fixtures(self, team_id: Optional[str] = None, venue_id: Optional[str] = None,
                    date_from: Optional[str] = None, date_to: Optional[str] = None) -> List[Dict]:
        """Get cricket fixtures/matches from CricketData API"""
        try:
            # Get current matches (live and upcoming)
            response = self._make_api_request('currentMatches', {'offset': 0})
            
            if response.get('status') == 'success':
                matches = response.get('data', [])
                formatted_fixtures = []
                
                for match in matches:
                    # Extract team names
                    team_info = match.get('teamInfo', [])
                    team_names = [team.get('name', '') for team in team_info[:2]]
                    
                    formatted_fixture = {
                        'id': match.get('id'),
                        'name': ' vs '.join(team_names) if len(team_names) >= 2 else match.get('name', ''),
                        'starting_at': match.get('dateTimeGMT', ''),
                        'type': match.get('matchType', ''),
                        'stage': match.get('series', ''),
                        'venue': match.get('venue', ''),
                        'status': match.get('status', ''),
                        'teams': team_names,
                    }
                    formatted_fixtures.append(formatted_fixture)
                
                logger.info(f"Retrieved {len(formatted_fixtures)} fixtures from CricketData API")
                return formatted_fixtures
            else:
                return self._get_mock_data('fixtures').get('data', [])
            
        except Exception as e:
            logger.error(f"Error fetching fixtures: {str(e)}")
            return self._get_mock_data('fixtures').get('data', [])
    
    def get_player_stats(self, player_id: int) -> Dict:
        """Get statistics for a specific player"""
        try:
            response = self._make_api_request(f'players/{player_id}')
            player_data = response.get('data', {})
            
            # Format player stats
            stats = {
                'id': player_data.get('id'),
                'name': player_data.get('fullname', player_data.get('name', '')),
                'position': player_data.get('position', {}).get('name', ''),
                'batting_style': player_data.get('battingstyle', ''),
                'bowling_style': player_data.get('bowlingstyle', ''),
                'country': player_data.get('country', {}).get('name', ''),
                'image_path': player_data.get('image_path', ''),
                'career_stats': self._get_mock_player_stats(player_id),
            }
            
            logger.info(f"Retrieved stats for player {player_id}")
            return stats
            
        except Exception as e:
            logger.error(f"Error fetching player stats for {player_id}: {str(e)}")
            return {}
    
    def get_team_stats(self, team_id: int) -> Dict:
        """Get statistics for a specific team"""
        try:
            response = self._make_api_request(f'teams/{team_id}')
            team_data = response.get('data', {})
            
            # Format team stats
            stats = {
                'id': team_data.get('id'),
                'name': team_data.get('name'),
                'code': team_data.get('code'),
                'national_team': team_data.get('national_team', False),
                'image_path': team_data.get('image_path', ''),
                'performance_stats': self._get_mock_team_stats(team_id),
            }
            
            logger.info(f"Retrieved stats for team {team_id}")
            return stats
            
        except Exception as e:
            logger.error(f"Error fetching team stats for {team_id}: {str(e)}")
            return {}
    
    def get_players(self, team_id: Optional[str] = None) -> List[Dict]:
        """Get cricket players from CricketData API players endpoint"""
        try:
            players = []
            
            # Try to get real players from CricketData API players endpoint
            if self.api_key:
                try:
                    logger.info("Fetching players from CricketData.org players API")
                    response = self._make_api_request('players')
                    
                    if response.get('status') == 'success':
                        api_players = response.get('data', [])
                        logger.info(f"Retrieved {len(api_players)} players from CricketData API")
                        
                        # Format players from API response
                        for i, player_data in enumerate(api_players):
                            try:
                                # Handle CricketData.org API structure: {id, name, country}
                                if isinstance(player_data, dict):
                                    player_name = player_data.get('name', player_data.get('fullname', f'Player {i+1}'))
                                    country = player_data.get('country', 'Unknown')
                                    player_id = player_data.get('id', i + 1)
                                    
                                    # Use country as team since CricketData.org doesn't provide team info
                                    team_name = country
                                    team_code = country[:3].upper() if country else 'UNK'
                                    
                                    # Filter by team if specified
                                    if team_id and (team_code.lower() != team_id.lower() and team_name.lower() != team_id.lower()):
                                        continue
                                    
                                    formatted_player = {
                                        'id': player_id,
                                        'fullname': player_name,
                                        'firstname': player_name.split(' ')[0] if player_name else '',
                                        'lastname': ' '.join(player_name.split(' ')[1:]) if player_name and len(player_name.split(' ')) > 1 else '',
                                        'team': team_name,
                                        'team_code': team_code,
                                        'position': {'name': 'Player'},  # Default since API doesn't provide role
                                        'battingstyle': 'Right-hand bat',  # Default
                                        'bowlingstyle': '',
                                        'country': {'name': country, 'code': team_code},
                                        'image_path': '',
                                        'ranking': 99,  # Default
                                        'is_international': True,
                                        'status': 'active'
                                    }
                                    players.append(formatted_player)
                                elif isinstance(player_data, str):
                                    # Handle string format (shouldn't happen with this API)
                                    formatted_player = {
                                        'id': i + 1,
                                        'fullname': player_data,
                                        'firstname': player_data.split(' ')[0] if player_data else '',
                                        'lastname': ' '.join(player_data.split(' ')[1:]) if player_data and len(player_data.split(' ')) > 1 else '',
                                        'team': 'Unknown',
                                        'team_code': 'UNK',
                                        'position': {'name': 'Player'},
                                        'battingstyle': 'Right-hand bat',
                                        'bowlingstyle': '',
                                        'country': {'name': 'Unknown', 'code': 'UNK'},
                                        'image_path': '',
                                        'ranking': 99,
                                        'is_international': True,
                                        'status': 'active'
                                    }
                                    players.append(formatted_player)
                                    
                            except Exception as e:
                                logger.warning(f"Error processing player data at index {i}: {str(e)}")
                                continue
                        
                        if players:
                            logger.info(f"Successfully formatted {len(players)} players from CricketData API")
                            
                            # Combine API players with major international players for comprehensive coverage
                            major_international_players = [
                                # India - Top players
                                {'name': 'Virat Kohli', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                                {'name': 'Rohit Sharma', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                                {'name': 'KL Rahul', 'team': 'India', 'team_code': 'IND', 'role': 'Wicket-keeper', 'ranking': 1},
                                {'name': 'Hardik Pandya', 'team': 'India', 'team_code': 'IND', 'role': 'All-rounder', 'ranking': 1},
                                {'name': 'Jasprit Bumrah', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                                
                                # Australia - Top players
                                {'name': 'Steve Smith', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                                {'name': 'David Warner', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                                {'name': 'Pat Cummins', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                                {'name': 'Glenn Maxwell', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                                
                                # England - Top players
                                {'name': 'Joe Root', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                                {'name': 'Ben Stokes', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                                {'name': 'Jos Buttler', 'team': 'England', 'team_code': 'ENG', 'role': 'Wicket-keeper', 'ranking': 3},
                                
                                # New Zealand - Top players
                                {'name': 'Kane Williamson', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                                {'name': 'Trent Boult', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                                
                                # Pakistan - Top players
                                {'name': 'Babar Azam', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                                {'name': 'Shaheen Afridi', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                                
                                # South Africa - Top players
                                {'name': 'Quinton de Kock', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Wicket-keeper', 'ranking': 6},
                                {'name': 'Kagiso Rabada', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                            ]
                            
                            # Add major international players to the API players
                            for i, major_player in enumerate(major_international_players):
                                # Skip if team filter specified and doesn't match
                                if team_id and (major_player['team_code'].lower() != team_id.lower() and major_player['team'].lower() != team_id.lower()):
                                    continue
                                    
                                formatted_player = {
                                    'id': f"major_{i + 1}",
                                    'fullname': major_player['name'],
                                    'firstname': major_player['name'].split(' ')[0],
                                    'lastname': ' '.join(major_player['name'].split(' ')[1:]) if len(major_player['name'].split(' ')) > 1 else '',
                                    'team': major_player['team'],
                                    'team_code': major_player['team_code'],
                                    'position': {'name': major_player['role']},
                                    'battingstyle': 'Right-hand bat',
                                    'bowlingstyle': 'Right-arm medium' if major_player['role'] == 'Bowler' else '',
                                    'country': {'name': major_player['team'], 'code': major_player['team_code']},
                                    'image_path': '',
                                    'ranking': major_player['ranking'],
                                    'is_international': True,
                                    'status': 'active'
                                }
                                players.append(formatted_player)
                            
                            logger.info(f"Combined {len(players)} total players: CricketData API + major international players")
                            return players
                        else:
                            logger.warning("No players found in API response, falling back to comprehensive list")
                    else:
                        logger.warning(f"CricketData players API returned: {response.get('info', 'Unknown error')}")
                        
                except Exception as e:
                    logger.error(f"Error fetching players from CricketData API: {str(e)}")
            else:
                logger.info("No API key provided, using comprehensive international players list")

            # Comprehensive international cricket players database (fallback)
            international_players = [
                # India (IND) - Extended Squad
                {'name': 'Virat Kohli', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'Rohit Sharma', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'KL Rahul', 'team': 'India', 'team_code': 'IND', 'role': 'Wicket-keeper', 'ranking': 1},
                {'name': 'Hardik Pandya', 'team': 'India', 'team_code': 'IND', 'role': 'All-rounder', 'ranking': 1},
                {'name': 'Jasprit Bumrah', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Ravindra Jadeja', 'team': 'India', 'team_code': 'IND', 'role': 'All-rounder', 'ranking': 1},
                {'name': 'Shubman Gill', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'Rishabh Pant', 'team': 'India', 'team_code': 'IND', 'role': 'Wicket-keeper', 'ranking': 1},
                {'name': 'Mohammed Shami', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Kuldeep Yadav', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Ravichandran Ashwin', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Shreyas Iyer', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'Ishan Kishan', 'team': 'India', 'team_code': 'IND', 'role': 'Wicket-keeper', 'ranking': 1},
                {'name': 'Yuzvendra Chahal', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Axar Patel', 'team': 'India', 'team_code': 'IND', 'role': 'All-rounder', 'ranking': 1},
                {'name': 'Suryakumar Yadav', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'Deepak Chahar', 'team': 'India', 'team_code': 'IND', 'role': 'Bowler', 'ranking': 1},
                {'name': 'Prithvi Shaw', 'team': 'India', 'team_code': 'IND', 'role': 'Batsman', 'ranking': 1},
                {'name': 'Washington Sundar', 'team': 'India', 'team_code': 'IND', 'role': 'All-rounder', 'ranking': 1},
                {'name': 'Sanju Samson', 'team': 'India', 'team_code': 'IND', 'role': 'Wicket-keeper', 'ranking': 1},
                
                # Australia (AUS) - Extended Squad
                {'name': 'Steve Smith', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                {'name': 'David Warner', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                {'name': 'Pat Cummins', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Glenn Maxwell', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                {'name': 'Josh Hazlewood', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Alex Carey', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Wicket-keeper', 'ranking': 2},
                {'name': 'Mitchell Starc', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Marnus Labuschagne', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                {'name': 'Adam Zampa', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Marcus Stoinis', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                {'name': 'Travis Head', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                {'name': 'Matthew Wade', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Wicket-keeper', 'ranking': 2},
                {'name': 'Cameron Green', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                {'name': 'Mitchell Marsh', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                {'name': 'Nathan Lyon', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Aaron Finch', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                {'name': 'Josh Inglis', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Wicket-keeper', 'ranking': 2},
                {'name': 'Sean Abbott', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Bowler', 'ranking': 2},
                {'name': 'Ashton Agar', 'team': 'Australia', 'team_code': 'AUS', 'role': 'All-rounder', 'ranking': 2},
                {'name': 'Tim David', 'team': 'Australia', 'team_code': 'AUS', 'role': 'Batsman', 'ranking': 2},
                
                # England (ENG) - Extended Squad  
                {'name': 'Joe Root', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Ben Stokes', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                {'name': 'Jos Buttler', 'team': 'England', 'team_code': 'ENG', 'role': 'Wicket-keeper', 'ranking': 3},
                {'name': 'Jonny Bairstow', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'James Anderson', 'team': 'England', 'team_code': 'ENG', 'role': 'Bowler', 'ranking': 3},
                {'name': 'Stuart Broad', 'team': 'England', 'team_code': 'ENG', 'role': 'Bowler', 'ranking': 3},
                {'name': 'Harry Brook', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Moeen Ali', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                {'name': 'Liam Livingstone', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                {'name': 'Mark Wood', 'team': 'England', 'team_code': 'ENG', 'role': 'Bowler', 'ranking': 3},
                {'name': 'Sam Curran', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                {'name': 'Adil Rashid', 'team': 'England', 'team_code': 'ENG', 'role': 'Bowler', 'ranking': 3},
                {'name': 'Jason Roy', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Eoin Morgan', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Chris Woakes', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                {'name': 'Ollie Pope', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Dawid Malan', 'team': 'England', 'team_code': 'ENG', 'role': 'Batsman', 'ranking': 3},
                {'name': 'Phil Salt', 'team': 'England', 'team_code': 'ENG', 'role': 'Wicket-keeper', 'ranking': 3},
                {'name': 'Jofra Archer', 'team': 'England', 'team_code': 'ENG', 'role': 'Bowler', 'ranking': 3},
                {'name': 'Tom Curran', 'team': 'England', 'team_code': 'ENG', 'role': 'All-rounder', 'ranking': 3},
                
                # New Zealand (NZ) - Extended Squad
                {'name': 'Kane Williamson', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                {'name': 'Trent Boult', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Ross Taylor', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                {'name': 'Tim Southee', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Martin Guptill', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                {'name': 'Devon Conway', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Wicket-keeper', 'ranking': 4},
                {'name': 'Mitchell Santner', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'All-rounder', 'ranking': 4},
                {'name': 'Kyle Jamieson', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Daryl Mitchell', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'All-rounder', 'ranking': 4},
                {'name': 'Tom Latham', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Wicket-keeper', 'ranking': 4},
                {'name': 'Colin de Grandhomme', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'All-rounder', 'ranking': 4},
                {'name': 'Glenn Phillips', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Wicket-keeper', 'ranking': 4},
                {'name': 'Ish Sodhi', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Neil Wagner', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Henry Nicholls', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                {'name': 'James Neesham', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'All-rounder', 'ranking': 4},
                {'name': 'Matt Henry', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Finn Allen', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Batsman', 'ranking': 4},
                {'name': 'Adam Milne', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'Bowler', 'ranking': 4},
                {'name': 'Michael Bracewell', 'team': 'New Zealand', 'team_code': 'NZ', 'role': 'All-rounder', 'ranking': 4},
                
                # Pakistan (PAK) - Extended Squad
                {'name': 'Babar Azam', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Shaheen Afridi', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Mohammad Rizwan', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Wicket-keeper', 'ranking': 5},
                {'name': 'Shadab Khan', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'All-rounder', 'ranking': 5},
                {'name': 'Fakhar Zaman', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Hasan Ali', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Imam-ul-Haq', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Mohammad Hafeez', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'All-rounder', 'ranking': 5},
                {'name': 'Haris Rauf', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Shoaib Malik', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Mohammad Nawaz', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'All-rounder', 'ranking': 5},
                {'name': 'Naseem Shah', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Shan Masood', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Asif Ali', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                {'name': 'Mohammad Wasim Jr', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Azam Khan', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Wicket-keeper', 'ranking': 5},
                {'name': 'Usman Qadir', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Bowler', 'ranking': 5},
                {'name': 'Sarfaraz Ahmed', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Wicket-keeper', 'ranking': 5},
                {'name': 'Faheem Ashraf', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'All-rounder', 'ranking': 5},
                {'name': 'Abdullah Shafique', 'team': 'Pakistan', 'team_code': 'PAK', 'role': 'Batsman', 'ranking': 5},
                
                # South Africa (SA) - Extended Squad
                {'name': 'Quinton de Kock', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Wicket-keeper', 'ranking': 6},
                {'name': 'Kagiso Rabada', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'Faf du Plessis', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'AB de Villiers', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Lungi Ngidi', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'David Miller', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Anrich Nortje', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'Temba Bavuma', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Keshav Maharaj', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'Rassie van der Dussen', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Aiden Markram', 'team': 'South Africa', 'team_code': 'SA', 'role': 'All-rounder', 'ranking': 6},
                {'name': 'Heinrich Klaasen', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Wicket-keeper', 'ranking': 6},
                {'name': 'Marco Jansen', 'team': 'South Africa', 'team_code': 'SA', 'role': 'All-rounder', 'ranking': 6},
                {'name': 'Wayne Parnell', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'Tabraiz Shamsi', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Bowler', 'ranking': 6},
                {'name': 'Dwaine Pretorius', 'team': 'South Africa', 'team_code': 'SA', 'role': 'All-rounder', 'ranking': 6},
                {'name': 'Reeza Hendricks', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Janneman Malan', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                {'name': 'Andile Phehlukwayo', 'team': 'South Africa', 'team_code': 'SA', 'role': 'All-rounder', 'ranking': 6},
                {'name': 'Tristan Stubbs', 'team': 'South Africa', 'team_code': 'SA', 'role': 'Batsman', 'ranking': 6},
                
                # West Indies (WI) - Extended Squad
                {'name': 'Chris Gayle', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Batsman', 'ranking': 7},
                {'name': 'Andre Russell', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Kieron Pollard', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Jason Holder', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Shimron Hetmyer', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Batsman', 'ranking': 7},
                {'name': 'Nicholas Pooran', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Wicket-keeper', 'ranking': 7},
                {'name': 'Alzarri Joseph', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Bowler', 'ranking': 7},
                {'name': 'Evin Lewis', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Batsman', 'ranking': 7},
                {'name': 'Sunil Narine', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Dwayne Bravo', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Sheldon Cottrell', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Bowler', 'ranking': 7},
                {'name': 'Fabian Allen', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Shai Hope', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Wicket-keeper', 'ranking': 7},
                {'name': 'Roston Chase', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Kemar Roach', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Bowler', 'ranking': 7},
                {'name': 'Akeal Hosein', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Bowler', 'ranking': 7},
                {'name': 'Brandon King', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Batsman', 'ranking': 7},
                {'name': 'Kyle Mayers', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Odean Smith', 'team': 'West Indies', 'team_code': 'WI', 'role': 'All-rounder', 'ranking': 7},
                {'name': 'Hayden Walsh Jr', 'team': 'West Indies', 'team_code': 'WI', 'role': 'Bowler', 'ranking': 7},
                
                # Sri Lanka (SL) - Extended Squad
                {'name': 'Angelo Mathews', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'All-rounder', 'ranking': 8},
                {'name': 'Lasith Malinga', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Kusal Mendis', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Batsman', 'ranking': 8},
                {'name': 'Wanindu Hasaranga', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'All-rounder', 'ranking': 8},
                {'name': 'Dimuth Karunaratne', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Batsman', 'ranking': 8},
                {'name': 'Kusal Perera', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Wicket-keeper', 'ranking': 8},
                {'name': 'Dhananjaya de Silva', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'All-rounder', 'ranking': 8},
                {'name': 'Chamika Karunaratne', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'All-rounder', 'ranking': 8},
                {'name': 'Maheesh Theekshana', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Pathum Nissanka', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Batsman', 'ranking': 8},
                {'name': 'Bhanuka Rajapaksa', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Wicket-keeper', 'ranking': 8},
                {'name': 'Dasun Shanaka', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'All-rounder', 'ranking': 8},
                {'name': 'Lahiru Kumara', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Dinesh Chandimal', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Wicket-keeper', 'ranking': 8},
                {'name': 'Dushmantha Chameera', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Charith Asalanka', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Batsman', 'ranking': 8},
                {'name': 'Nuwan Thushara', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Avishka Fernando', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Batsman', 'ranking': 8},
                {'name': 'Jeffrey Vandersay', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Bowler', 'ranking': 8},
                {'name': 'Niroshan Dickwella', 'team': 'Sri Lanka', 'team_code': 'SL', 'role': 'Wicket-keeper', 'ranking': 8},
                
                # Bangladesh (BAN) - Extended Squad
                {'name': 'Shakib Al Hasan', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Tamim Iqbal', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Batsman', 'ranking': 9},
                {'name': 'Mushfiqur Rahim', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Wicket-keeper', 'ranking': 9},
                {'name': 'Mustafizur Rahman', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Liton Das', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Wicket-keeper', 'ranking': 9},
                {'name': 'Mahmudullah', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Mehidy Hasan', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Taskin Ahmed', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Afif Hossain', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Nurul Hasan', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Wicket-keeper', 'ranking': 9},
                {'name': 'Shoriful Islam', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Nasum Ahmed', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Soumya Sarkar', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Rubel Hossain', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Mosaddek Hossain', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'All-rounder', 'ranking': 9},
                {'name': 'Mominul Haque', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Batsman', 'ranking': 9},
                {'name': 'Najmul Hossain', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Batsman', 'ranking': 9},
                {'name': 'Yasir Ali', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Batsman', 'ranking': 9},
                {'name': 'Ebadot Hossain', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                {'name': 'Hasan Mahmud', 'team': 'Bangladesh', 'team_code': 'BAN', 'role': 'Bowler', 'ranking': 9},
                
                # Afghanistan (AFG) - Extended Squad
                {'name': 'Rashid Khan', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                {'name': 'Mohammad Nabi', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'All-rounder', 'ranking': 10},
                {'name': 'Hazratullah Zazai', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Mujeeb Ur Rahman', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                {'name': 'Najibullah Zadran', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Mohammad Shahzad', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Wicket-keeper', 'ranking': 10},
                {'name': 'Rahmanullah Gurbaz', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Wicket-keeper', 'ranking': 10},
                {'name': 'Hashmatullah Shahidi', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Ibrahim Zadran', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Azmatullah Omarzai', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'All-rounder', 'ranking': 10},
                {'name': 'Gulbadin Naib', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'All-rounder', 'ranking': 10},
                {'name': 'Naveen-ul-Haq', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                {'name': 'Fazalhaq Farooqi', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                {'name': 'Rahmat Shah', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Asghar Afghan', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Karim Janat', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'All-rounder', 'ranking': 10},
                {'name': 'Qais Ahmad', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                {'name': 'Usman Ghani', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Batsman', 'ranking': 10},
                {'name': 'Afsar Zazai', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Wicket-keeper', 'ranking': 10},
                {'name': 'Hamid Hassan', 'team': 'Afghanistan', 'team_code': 'AFG', 'role': 'Bowler', 'ranking': 10},
                
                # Ireland (IRE) - Extended Squad
                {'name': 'Paul Stirling', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Batsman', 'ranking': 11},
                {'name': 'Kevin O\'Brien', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Andrew Balbirnie', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Batsman', 'ranking': 11},
                {'name': 'Harry Tector', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Batsman', 'ranking': 11},
                {'name': 'Lorcan Tucker', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Wicket-keeper', 'ranking': 11},
                {'name': 'George Dockrell', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Mark Adair', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Josh Little', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Bowler', 'ranking': 11},
                {'name': 'Craig Young', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Bowler', 'ranking': 11},
                {'name': 'Curtis Campher', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Gareth Delany', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Andy McBrine', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                {'name': 'Barry McCarthy', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Bowler', 'ranking': 11},
                {'name': 'Neil Rock', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'Wicket-keeper', 'ranking': 11},
                {'name': 'Shane Getkate', 'team': 'Ireland', 'team_code': 'IRE', 'role': 'All-rounder', 'ranking': 11},
                
                # Scotland (SCO) - Extended Squad
                {'name': 'Kyle Coetzer', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Batsman', 'ranking': 12},
                {'name': 'Calum MacLeod', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Batsman', 'ranking': 12},
                {'name': 'Richie Berrington', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'All-rounder', 'ranking': 12},
                {'name': 'Matthew Cross', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Wicket-keeper', 'ranking': 12},
                {'name': 'Mark Watt', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Bowler', 'ranking': 12},
                {'name': 'Chris Greaves', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'All-rounder', 'ranking': 12},
                {'name': 'George Munsey', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Batsman', 'ranking': 12},
                {'name': 'Michael Leask', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'All-rounder', 'ranking': 12},
                {'name': 'Josh Davey', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Bowler', 'ranking': 12},
                {'name': 'Dylan Budge', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Wicket-keeper', 'ranking': 12},
                {'name': 'Hamza Tahir', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Bowler', 'ranking': 12},
                {'name': 'Adrian Neill', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Bowler', 'ranking': 12},
                {'name': 'Oli Hairs', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Batsman', 'ranking': 12},
                {'name': 'Brandon McMullen', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'All-rounder', 'ranking': 12},
                {'name': 'Chris Sole', 'team': 'Scotland', 'team_code': 'SCO', 'role': 'Bowler', 'ranking': 12},
                
                # Netherlands (NED) - Extended Squad
                {'name': 'Pieter Seelaar', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Ryan ten Doeschate', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Scott Edwards', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Wicket-keeper', 'ranking': 13},
                {'name': 'Max O\'Dowd', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Batsman', 'ranking': 13},
                {'name': 'Colin Ackermann', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Bas de Leede', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Logan van Beek', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Roelof van der Merwe', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Fred Klaassen', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Bowler', 'ranking': 13},
                {'name': 'Paul van Meekeren', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Bowler', 'ranking': 13},
                {'name': 'Brandon Glover', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Bowler', 'ranking': 13},
                {'name': 'Stephan Myburgh', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Batsman', 'ranking': 13},
                {'name': 'Tobias Visee', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Wicket-keeper', 'ranking': 13},
                {'name': 'Tim Pringle', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'All-rounder', 'ranking': 13},
                {'name': 'Vikramjit Singh', 'team': 'Netherlands', 'team_code': 'NED', 'role': 'Batsman', 'ranking': 13},
                
                # Zimbabwe (ZIM) - Extended Squad
                {'name': 'Brendan Taylor', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Wicket-keeper', 'ranking': 14},
                {'name': 'Craig Ervine', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Batsman', 'ranking': 14},
                {'name': 'Sean Williams', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Sikandar Raza', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Regis Chakabva', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Wicket-keeper', 'ranking': 14},
                {'name': 'Wesley Madhevere', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Ryan Burl', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Tendai Chatara', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Bowler', 'ranking': 14},
                {'name': 'Blessing Muzarabani', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Bowler', 'ranking': 14},
                {'name': 'Richard Ngarava', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Bowler', 'ranking': 14},
                {'name': 'Luke Jongwe', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Innocent Kaia', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Batsman', 'ranking': 14},
                {'name': 'Tadiwanashe Marumani', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Wicket-keeper', 'ranking': 14},
                {'name': 'Milton Shumba', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'All-rounder', 'ranking': 14},
                {'name': 'Tony Munyonga', 'team': 'Zimbabwe', 'team_code': 'ZIM', 'role': 'Batsman', 'ranking': 14},
            ]
            
            # Filter by team if specified
            if team_id:
                international_players = [p for p in international_players if p['team_code'].lower() == team_id.lower() or p['team'].lower() == team_id.lower()]
            
            # Format players for API response
            formatted_players = []
            for i, player in enumerate(international_players):
                formatted_players.append({
                    'id': i + 1,
                    'fullname': player['name'],
                    'firstname': player['name'].split(' ')[0],
                    'lastname': ' '.join(player['name'].split(' ')[1:]) if len(player['name'].split(' ')) > 1 else '',
                    'team': player['team'],
                    'team_code': player['team_code'],
                    'position': {'name': player['role']},
                    'battingstyle': 'Right-hand bat',  # Default
                    'bowlingstyle': 'Right-arm medium' if player['role'] == 'Bowler' else None,
                    'country': {'name': player['team'], 'code': player['team_code']},
                    'image_path': '',
                    'ranking': player['ranking'],
                    'is_international': True,
                    'status': 'active'
                })
            
            logger.info(f"Retrieved {len(formatted_players)} international cricket players")
            return formatted_players
            
        except Exception as e:
            logger.error(f"Error fetching players: {str(e)}")
            return self._get_mock_data('players').get('data', [])
    
    def _get_mock_player_stats(self, player_id: int) -> Dict:
        """Generate mock player statistics"""
        import random
        
        return {
            'matches': random.randint(50, 200),
            'runs': random.randint(1000, 8000),
            'average': round(random.uniform(25.0, 55.0), 2),
            'strike_rate': round(random.uniform(120.0, 160.0), 2),
            'centuries': random.randint(5, 25),
            'fifties': random.randint(15, 60),
            'wickets': random.randint(0, 150),
            'bowling_average': round(random.uniform(20.0, 35.0), 2),
            'economy_rate': round(random.uniform(6.0, 9.0), 2),
        }
    
    def _get_mock_team_stats(self, team_id: int) -> Dict:
        """Generate mock team statistics"""
        import random
        
        return {
            'matches_played': random.randint(100, 300),
            'wins': random.randint(60, 200),
            'losses': random.randint(50, 150),
            'win_rate': round(random.uniform(0.55, 0.85), 3),
            'current_ranking': {
                'T20': random.randint(1, 12),
                'ODI': random.randint(1, 12),
                'Test': random.randint(1, 12),
            },
            'recent_form': [
                random.choice(['W', 'L']) for _ in range(10)
            ]
        } 
    
    def get_player_match_history(self, player_name: str, player_id: Optional[str] = None) -> List[Dict]:
        """Get player's recent match history from CricketData API"""
        try:
            # Try multiple CricketData.org endpoints for player match data
            match_history = []
            
            if self.api_key:
                # Try playerFinder first to get player ID if not provided
                if not player_id:
                    logger.info(f"Finding player ID for {player_name}")
                    player_response = self._make_api_request('playerFinder', {'name': player_name})
                    
                    if player_response.get('status') == 'success' and player_response.get('data'):
                        players_found = player_response.get('data', [])
                        if players_found:
                            player_id = players_found[0].get('pid', players_found[0].get('id'))
                            logger.info(f"Found player ID: {player_id} for {player_name}")
                
                # Try different endpoints for match history
                endpoints_to_try = [
                    f'playerStats?pid={player_id}',
                    f'player/{player_id}/matches',
                    f'player/{player_id}/recent',
                    'recentMatches',  # Get recent matches and filter
                    'currentMatches'  # Get current matches
                ]
                
                for endpoint in endpoints_to_try:
                    try:
                        logger.info(f"Trying endpoint: {endpoint}")
                        response = self._make_api_request(endpoint)
                        
                        if response.get('status') == 'success' and response.get('data'):
                            data = response.get('data', [])
                            
                            # Process the response based on endpoint type
                            if 'playerStats' in endpoint:
                                # Player stats might have match history
                                if isinstance(data, dict):
                                    matches = data.get('recentMatches', data.get('matches', []))
                                    match_history.extend(self._process_player_matches(matches, player_name))
                            
                            elif 'matches' in endpoint or 'recent' in endpoint:
                                # Direct match data
                                match_history.extend(self._process_player_matches(data, player_name))
                            
                            elif 'currentMatches' in endpoint or 'recentMatches' in endpoint:
                                # Extract player performance from match data
                                for match in data if isinstance(data, list) else [data]:
                                    player_performance = self._extract_player_from_match(match, player_name)
                                    if player_performance:
                                        match_history.append(player_performance)
                            
                            if match_history:
                                logger.info(f"Found {len(match_history)} matches from {endpoint}")
                                break
                                
                    except Exception as e:
                        logger.warning(f"Failed to get data from {endpoint}: {e}")
                        continue
            
            # If we got real data, return it (limit to last 10)
            if match_history:
                logger.info(f"Returning {len(match_history)} real matches for {player_name}")
                return match_history[:10]
            
            # Fallback: Create realistic player-specific data based on player characteristics
            logger.info(f"No real match data found for {player_name}, creating realistic fallback")
            return self._generate_realistic_player_history(player_name)
            
        except Exception as e:
            logger.error(f"Error getting player match history for {player_name}: {e}")
            return self._generate_realistic_player_history(player_name)
    
    def _process_player_matches(self, matches_data: List[Dict], player_name: str) -> List[Dict]:
        """Process match data to extract player performance"""
        processed_matches = []
        
        try:
            for match in matches_data if isinstance(matches_data, list) else [matches_data]:
                if isinstance(match, dict):
                    # Extract relevant match info
                    match_info = {
                        'matchNumber': len(processed_matches) + 1,
                        'opponent': match.get('team2', match.get('opposition', 'Unknown')),
                        'venue': match.get('venue', 'Unknown Venue'),
                        'format': match.get('matchType', match.get('format', 'ODI')),
                        'date': match.get('date', match.get('dateTimeGMT', '')),
                        'runs': match.get('runs', match.get('score', 0)),
                        'balls': match.get('balls', match.get('ballsFaced', 0)),
                        'fours': match.get('fours', match.get('boundaries', 0)),
                        'sixes': match.get('sixes', match.get('maximums', 0)),
                        'result': match.get('result', match.get('matchResult', 'Unknown')),
                        'notOut': match.get('notOut', False)
                    }
                    
                    # Calculate strike rate
                    if match_info['balls'] > 0:
                        match_info['strikeRate'] = round((match_info['runs'] / match_info['balls']) * 100, 1)
                    else:
                        match_info['strikeRate'] = 0
                    
                    # Determine milestone
                    runs = match_info['runs']
                    match_info['milestone'] = 'Century' if runs >= 100 else ('Fifty' if runs >= 50 else None)
                    
                    # Format date
                    if match_info['date']:
                        try:
                            from datetime import datetime
                            date_obj = datetime.fromisoformat(match_info['date'].replace('Z', '+00:00'))
                            match_info['dateFormatted'] = date_obj.strftime('%b %d')
                        except:
                            match_info['dateFormatted'] = match_info['date'][:10]
                    
                    processed_matches.append(match_info)
        
        except Exception as e:
            logger.error(f"Error processing matches: {e}")
        
        return processed_matches
    
    def _extract_player_from_match(self, match_data: Dict, player_name: str) -> Optional[Dict]:
        """Extract specific player performance from match data"""
        try:
            # Look for player in match data
            players = match_data.get('players', [])
            scorecard = match_data.get('scorecard', {})
            
            # Search for player in various data structures
            for player in players:
                if isinstance(player, dict) and player_name.lower() in player.get('name', '').lower():
                    return {
                        'matchNumber': 1,
                        'opponent': match_data.get('team2', 'Unknown'),
                        'venue': match_data.get('venue', 'Unknown'),
                        'format': match_data.get('matchType', 'ODI'),
                        'date': match_data.get('date', ''),
                        'runs': player.get('runs', 0),
                        'balls': player.get('balls', 0),
                        'fours': player.get('fours', 0),
                        'sixes': player.get('sixes', 0),
                        'strikeRate': player.get('strikeRate', 0),
                        'result': match_data.get('result', 'Unknown'),
                        'notOut': player.get('notOut', False),
                        'milestone': 'Century' if player.get('runs', 0) >= 100 else ('Fifty' if player.get('runs', 0) >= 50 else None)
                    }
            
        except Exception as e:
            logger.error(f"Error extracting player from match: {e}")
        
        return None
    
    def _generate_realistic_player_history(self, player_name: str) -> List[Dict]:
        """Generate realistic match history based on player characteristics"""
        import hashlib
        
        # Use player name hash for consistent but realistic data
        name_hash = int(hashlib.md5(player_name.encode()).hexdigest(), 16)
        
        # Player-specific characteristics based on name hash
        is_aggressive = (name_hash % 3) == 0  # 33% are aggressive
        is_consistent = (name_hash % 4) == 0  # 25% are very consistent
        team_strength = (name_hash % 5) + 6   # Team strength 6-10
        
        # Base stats influenced by player type
        base_avg = 35 if is_consistent else (25 if is_aggressive else 30)
        base_sr = 85 if is_aggressive else (70 if is_consistent else 78)
        
        matches = []
        opponents = ['Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh']
        venues = ['MCG Melbourne', 'Lords London', 'Eden Gardens Kolkata', 'Wankhede Mumbai', 'SCG Sydney', 'The Oval London']
        formats = ['ODI', 'T20I', 'Test']
        
        for i in range(10):
            # Use hash + match number for consistent results per player
            match_seed = (name_hash + i * 1000) % 10000
            
            # Realistic runs based on player type
            if is_consistent:
                runs = int(25 + (match_seed % 40))  # 25-65 consistent range
            elif is_aggressive:
                runs = int((match_seed % 90)) if match_seed % 4 != 0 else int(50 + (match_seed % 50))  # Boom or bust
            else:
                runs = int(10 + (match_seed % 70))  # 10-80 normal range
            
            balls = max(20, int(runs * (100/base_sr) + (match_seed % 20) - 10))
            fours = max(0, int(runs / 25 + (match_seed % 6)))
            sixes = max(0, int(runs / 40 + (match_seed % 3)))
            
            # Calculate strike rate
            strike_rate = round((runs / balls) * 100, 1) if balls > 0 else 0
            
            # Match date (going backwards from today)
            from datetime import datetime, timedelta
            match_date = datetime.now() - timedelta(days=i*10 + (match_seed % 7))
            
            matches.append({
                'matchNumber': 10 - i,
                'opponent': opponents[match_seed % len(opponents)],
                'venue': venues[match_seed % len(venues)],
                'format': formats[match_seed % len(formats)],
                'date': match_date.strftime('%Y-%m-%d'),
                'dateFormatted': match_date.strftime('%b %d'),
                'runs': runs,
                'balls': balls,
                'fours': fours,
                'sixes': sixes,
                'strikeRate': strike_rate,
                'result': 'Won' if (match_seed % 3) != 0 else ('Lost' if (match_seed % 5) != 0 else 'Tied'),
                'notOut': (match_seed % 7) == 0,  # ~14% not out
                'milestone': 'Century' if runs >= 100 else ('Fifty' if runs >= 50 else None)
            })
        
        logger.info(f"Generated realistic history for {player_name} (aggressive={is_aggressive}, consistent={is_consistent})")
        return matches