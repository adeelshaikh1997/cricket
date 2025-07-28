import os
import logging
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class CricketService:
    """Service for handling cricket data from external APIs and cached data"""
    
    def __init__(self):
        self.api_key = os.getenv('SPORTMONKS_API_KEY')
        self.base_url = 'https://cricket.sportmonks.com/api/v2.0'
        self.cache_timeout = 3600  # 1 hour cache
        self.session = requests.Session()
        
        # Set up session headers
        if self.api_key:
            self.session.params = {'api_token': self.api_key}
    
    def _make_api_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make API request with error handling and caching"""
        try:
            if not self.api_key:
                logger.warning("SportMonks API key not configured, using mock data")
                return self._get_mock_data(endpoint)
            
            url = f"{self.base_url}/{endpoint}"
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed for {endpoint}: {str(e)}")
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
        """Get list of cricket teams"""
        try:
            response = self._make_api_request('teams')
            teams = response.get('data', [])
            
            # Filter and format teams
            formatted_teams = []
            for team in teams:
                formatted_team = {
                    'id': team.get('id'),
                    'name': team.get('name'),
                    'code': team.get('code'),
                    'national_team': team.get('national_team', False),
                    'image_path': team.get('image_path', ''),
                }
                formatted_teams.append(formatted_team)
            
            logger.info(f"Retrieved {len(formatted_teams)} teams")
            return formatted_teams
            
        except Exception as e:
            logger.error(f"Error fetching teams: {str(e)}")
            return []
    
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
        """Get cricket fixtures with optional filters"""
        try:
            params = {}
            
            if team_id:
                params['team_id'] = team_id
            if venue_id:
                params['venue_id'] = venue_id
            if date_from:
                params['date_from'] = date_from
            if date_to:
                params['date_to'] = date_to
            
            response = self._make_api_request('fixtures', params)
            fixtures = response.get('data', [])
            
            # Format fixtures
            formatted_fixtures = []
            for fixture in fixtures:
                formatted_fixture = {
                    'id': fixture.get('id'),
                    'name': fixture.get('name'),
                    'starting_at': fixture.get('starting_at'),
                    'type': fixture.get('type'),
                    'stage': fixture.get('stage', {}).get('name', ''),
                    'venue': fixture.get('venue', {}),
                    'status': fixture.get('status'),
                    'teams': fixture.get('teams', []),
                }
                formatted_fixtures.append(formatted_fixture)
            
            logger.info(f"Retrieved {len(formatted_fixtures)} fixtures")
            return formatted_fixtures
            
        except Exception as e:
            logger.error(f"Error fetching fixtures: {str(e)}")
            return []
    
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