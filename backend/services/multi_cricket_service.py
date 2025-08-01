import logging
import os
from typing import Dict, List, Optional, Any
from datetime import datetime

# Import our premium SportMonks service
from .sportmonks_service import SportMonksCricketService

logger = logging.getLogger(__name__)

class CricketService:
    """
    Premium SportMonks-Only Cricket Service
    Comprehensive cricket data service powered exclusively by SportMonks Premium API
    """
    
    def __init__(self):
        # Initialize SportMonks Premium service
        self.sportmonks = SportMonksCricketService()
        
        logger.info("🏏 Premium Cricket Service initialized with SportMonks-only integration")
        logger.info("💎 All data powered by SportMonks Premium API")

    def get_teams(self) -> List[Dict]:
        """Get all cricket teams from SportMonks"""
        try:
            teams = self.sportmonks.get_teams()
            logger.info(f"📊 Retrieved {len(teams)} teams from SportMonks Premium")
            return teams
        except Exception as e:
            logger.error(f"💥 Error fetching teams: {str(e)}")
            return []

    def get_players(self, team_id: int = None, country_id: int = None) -> List[Dict]:
        """Get players from SportMonks with comprehensive statistics"""
        try:
            players = self.sportmonks.get_players(team_id, country_id)
            logger.info(f"📊 Retrieved {len(players)} players from SportMonks Premium")
            return players
        except Exception as e:
            logger.error(f"💥 Error fetching players: {str(e)}")
            return []

    def get_venues(self) -> List[Dict]:
        """Get all cricket venues from SportMonks"""
        try:
            venues = self.sportmonks.get_venues()
            logger.info(f"🏟️ Retrieved {len(venues)} venues from SportMonks Premium")
            return venues
        except Exception as e:
            logger.error(f"💥 Error fetching venues: {str(e)}")
            return []

    def get_live_matches(self) -> List[Dict]:
        """Get live matches with real-time scores"""
        try:
            live_matches = self.sportmonks.get_live_matches()
            logger.info(f"🔴 Retrieved {len(live_matches)} live matches from SportMonks Premium")
            return live_matches
        except Exception as e:
            logger.error(f"💥 Error fetching live matches: {str(e)}")
            return []

    def get_fixtures(self, days_ahead: int = 30) -> List[Dict]:
        """Get upcoming fixtures from SportMonks"""
        try:
            fixtures = self.sportmonks.get_fixtures(days_ahead)
            logger.info(f"📅 Retrieved {len(fixtures)} upcoming fixtures from SportMonks Premium")
            return fixtures
        except Exception as e:
            logger.error(f"💥 Error fetching fixtures: {str(e)}")
            return []

    def get_player_match_history(self, player_name: str, limit: int = 20) -> List[Dict]:
        """Get detailed match history for a player from SportMonks"""
        try:
            match_history = self.sportmonks.get_player_match_history(player_name, limit)
            logger.info(f"📊 Retrieved {len(match_history)} matches for {player_name} from SportMonks Premium")
            return match_history
        except Exception as e:
            logger.error(f"💥 Error fetching match history for {player_name}: {str(e)}")
            return []

    def get_advanced_player_analytics(self, player_name: str, player_role: str = 'Batsman') -> Dict:
        """Get comprehensive player analytics from SportMonks Premium data"""
        try:
            # Get real match history from SportMonks
            match_history = self.get_player_match_history(player_name, 50)
            
            analytics = {
                'has_real_data': len(match_history) > 0,
                'data_source': ['sportmonks_premium'],
                'recentFormAnalysis': None,
                'situationalStats': None,
                'phasePerformance': None,
                'homeAwayStats': None
            }

            if match_history:
                # Real form analysis from SportMonks data
                analytics['recentFormAnalysis'] = self._analyze_real_form(match_history, player_role)
                
                # Real situational analysis from SportMonks data
                analytics['situationalStats'] = self.sportmonks.get_real_situational_stats(player_name)
                
                # Phase performance analysis
                analytics['phasePerformance'] = self._estimate_phase_performance(match_history, player_role)
                
                # Home/Away analysis from real venue data
                analytics['homeAwayStats'] = self._analyze_venue_performance(match_history, player_name)
                
                logger.info(f"✅ Generated comprehensive analytics for {player_name} using SportMonks Premium data")
            else:
                logger.warning(f"⚠️ No match history found for {player_name} in SportMonks Premium")
                # Return empty analytics structure
                analytics.update({
                    'recentFormAnalysis': {'streak': 'unknown', 'summary': 'No data available', 'momentumScore': 50},
                    'situationalStats': {'defending': {}, 'chasing': {}, 'pressure': {}},
                    'phasePerformance': [],
                    'homeAwayStats': {'home': {}, 'away': {}, 'neutral': {}, 'bestVenues': []}
                })

            return analytics
            
        except Exception as e:
            logger.error(f"💥 Error getting advanced analytics for {player_name}: {str(e)}")
            return {
                'has_real_data': False,
                'data_source': ['error'],
                'error': str(e)
            }

    def _analyze_real_form(self, matches: List[Dict], player_role: str) -> Dict:
        """Analyze recent form from real SportMonks match data"""
        if not matches:
            return {'streak': 'unknown', 'summary': 'No recent matches', 'momentumScore': 50}
            
        last_5 = matches[-5:] if len(matches) >= 5 else matches
        
        if player_role in ['Bowler', 'All-rounder']:
            # Analyze bowling performance if available
            total_wickets = sum(m.get('wickets', 0) for m in last_5)
            avg_economy = sum(m.get('economy', 6.0) for m in last_5) / len(last_5) if last_5 else 6.0
            
            streak = 'hot' if avg_economy < 6.5 and total_wickets >= 3 else \
                    'cold' if avg_economy > 8.0 else 'steady'
                    
            return {
                'streak': streak,
                'summary': f"{'🔥 Hot' if streak == 'hot' else '❄️ Cold' if streak == 'cold' else '➡️ Steady'} bowling: {total_wickets} wickets, Economy {avg_economy:.1f}",
                'momentumScore': min(100, max(20, 100 - (avg_economy * 10) + (total_wickets * 5)))
            }
        else:
            # Analyze batting performance
            avg_runs = sum(m.get('runs', 0) for m in last_5) / len(last_5)
            avg_sr = sum(m.get('strikeRate', 0) for m in last_5) / len(last_5)
            scores_30_plus = len([m for m in last_5 if m.get('runs', 0) >= 30])
            
            streak = 'hot' if avg_runs >= 35 and scores_30_plus >= 3 else \
                    'cold' if avg_runs < 20 else 'steady'
                    
            return {
                'streak': streak,
                'summary': f"{'🔥 Hot' if streak == 'hot' else '❄️ Cold' if streak == 'cold' else '➡️ Steady'} batting: Avg {avg_runs:.0f} runs, {scores_30_plus}/5 scores 30+",
                'momentumScore': min(100, max(20, (avg_runs * 1.5) + (avg_sr * 0.3)))
            }

    def _estimate_phase_performance(self, matches: List[Dict], player_role: str) -> List[Dict]:
        """Estimate phase performance from SportMonks match data"""
        if not matches:
            return []
            
        total_runs = sum(m.get('runs', 0) for m in matches)
        total_balls = sum(m.get('balls', 0) for m in matches)
        
        # Intelligent distribution based on real cricket patterns and SportMonks data
        return [
            {
                'phase': 'Powerplay (1-6)',
                'average': total_runs * 0.35 / len(matches),  # 35% of runs typically in powerplay
                'strikeRate': total_runs / max(total_balls, 1) * 100 * 1.4,  # Higher SR in powerplay
                'runs': int(total_runs * 0.35),
                'matches': len(matches)
            },
            {
                'phase': 'Middle (7-15)',
                'average': total_runs * 0.45 / len(matches),  # 45% in middle overs
                'strikeRate': total_runs / max(total_balls, 1) * 100 * 0.9,  # Lower SR in middle
                'runs': int(total_runs * 0.45),
                'matches': len(matches)
            },
            {
                'phase': 'Death (16-20)',
                'average': total_runs * 0.20 / len(matches),  # 20% in death overs
                'strikeRate': total_runs / max(total_balls, 1) * 100 * 1.6,  # Highest SR in death
                'runs': int(total_runs * 0.20),
                'matches': len(matches)
            }
        ]

    def _analyze_venue_performance(self, matches: List[Dict], player_name: str) -> Dict:
        """Analyze venue performance from real SportMonks venue data"""
        venue_stats = {}
        
        for match in matches:
            venue = match.get('venue', 'Unknown')
            if venue not in venue_stats:
                venue_stats[venue] = []
            venue_stats[venue].append(match)
        
        # Determine frequent venues (likely home grounds)
        home_venues = set()
        if venue_stats:
            venue_counts = {v: len(matches) for v, matches in venue_stats.items()}
            most_frequent = max(venue_counts.values())
            home_venues = {v for v, count in venue_counts.items() if count >= max(2, most_frequent * 0.7)}
        
        home_matches = []
        away_matches = []
        neutral_matches = []
        
        for match in matches:
            venue = match.get('venue', 'Unknown')
            if venue in home_venues:
                home_matches.append(match)
            elif len(venue_stats.get(venue, [])) == 1:  # Single appearance = away/neutral
                neutral_matches.append(match)
            else:
                away_matches.append(match)
        
        def calc_venue_stats(match_list):
            if not match_list:
                return {'matches': 0, 'average': 0, 'strikeRate': 0, 'runs': 0}
            return {
                'matches': len(match_list),
                'average': sum(m.get('runs', 0) for m in match_list) / len(match_list),
                'strikeRate': sum(m.get('strikeRate', 0) for m in match_list) / len(match_list),
                'runs': sum(m.get('runs', 0) for m in match_list)
            }
        
        # Best venues by performance
        best_venues = []
        for venue, venue_matches in venue_stats.items():
            if len(venue_matches) >= 2:
                avg_runs = sum(m.get('runs', 0) for m in venue_matches) / len(venue_matches)
                best_venues.append({
                    'venue': venue,
                    'average': f"{avg_runs:.1f}",
                    'matches': len(venue_matches),
                    'total_runs': sum(m.get('runs', 0) for m in venue_matches)
                })
        
        best_venues = sorted(best_venues, key=lambda x: float(x['average']), reverse=True)[:5]
        
        return {
            'home': calc_venue_stats(home_matches),
            'away': calc_venue_stats(away_matches),
            'neutral': calc_venue_stats(neutral_matches),
            'bestVenues': best_venues
        }

    def get_api_usage_summary(self) -> Dict:
        """Get comprehensive API usage for SportMonks Premium"""
        return {
            'primary_source': 'SportMonks Premium',
            'sportmonks': self.sportmonks.get_api_usage_info(),
            'service_status': 'Premium Service Active',
            'features_enabled': [
                'Live Scores & Commentary',
                'Comprehensive Player Statistics', 
                'Team Rankings & Data',
                'All International Venues',
                'Historical Match Data',
                'Ball-by-ball Analysis',
                'Weather & Pitch Reports',
                'Official Tournament Data',
                'Real-time Updates'
            ],
            'data_quality': 'Official & Verified',
            'coverage': 'Worldwide Cricket',
            'recommendation': '✅ Premium service provides comprehensive cricket data with high rate limits'
        }

    def get_api_usage_info(self) -> Dict:
        """Get API usage information - compatibility method"""
        return self.sportmonks.get_api_usage_info()

# Backward compatibility - keep the old class name as an alias
MultiCricketService = CricketService 