import os
import logging
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class CricketService:
    """Service for handling cricket data from CricketData.org (free API) and cached data"""
    
    def __init__(self):
        # CricketData.org API (free - formerly CricAPI)
        self.api_key = os.getenv('CRICKETDATA_API_KEY')
        self.base_url = 'https://api.cricapi.com/v1'
        self.cache_timeout = 3600  # 1 hour cache
        self.session = requests.Session()
        
        # Default free API key for demo (you should get your own)
        if not self.api_key:
            logger.info("No CricketData API key found, using demo mode")
            self.api_key = None
    
    def _make_api_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make API request to CricketData.org with error handling and caching"""
        try:
            # Always try real API first if we have a key
            if self.api_key:
                url = f"{self.base_url}/{endpoint}"
                api_params = {'apikey': self.api_key}
                if params:
                    api_params.update(params)
                
                logger.info(f"Making CricketData API request: {endpoint}")
                response = self.session.get(url, params=api_params, timeout=10)
                response.raise_for_status()
                
                data = response.json()
                
                # Check if API response is successful
                if data.get('status') == 'success':
                    logger.info(f"CricketData API success for {endpoint}")
                    return data
                else:
                    logger.warning(f"CricketData API returned error: {data.get('info', 'Unknown error')}")
                    return self._get_mock_data(endpoint)
            else:
                logger.info("No API key provided, using mock data for demo")
                return self._get_mock_data(endpoint)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"CricketData API request failed for {endpoint}: {str(e)}")
            return self._get_mock_data(endpoint)
        except Exception as e:
            logger.error(f"Unexpected error in API request: {str(e)}")
            return self._get_mock_data(endpoint)
    
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