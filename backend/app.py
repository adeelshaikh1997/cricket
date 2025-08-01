from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
import os
import logging
from datetime import datetime
import traceback
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from services.prediction_service import PredictionService
from services.multi_cricket_service import CricketService  # SportMonks-only service
from models.match_predictor import MatchPredictor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend
api = Api(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services - SportMonks Premium only
prediction_service = PredictionService()
cricket_service = CricketService()  # SportMonks Premium service

class HealthCheck(Resource):
    """Health check endpoint"""
    def get(self):
        return {
            'status': 'healthy',
            'message': 'Cricklytics Premium Backend API is running',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '2.0.0 - SportMonks Premium',
            'data_source': 'SportMonks Premium API'
        }

class APIUsage(Resource):
    """API usage monitoring endpoint"""
    def get(self):
        try:
            usage_info = cricket_service.get_api_usage_info()
            
            # Add additional status information
            usage_info.update({
                'timestamp': datetime.utcnow().isoformat(),
                'service_type': 'SportMonks Premium',
                'status': 'active'
            })
            
            return {
                'success': True,
                'data': usage_info
            }
        except Exception as e:
            logger.error(f"Error getting API usage info: {str(e)}")
            return {'error': 'Failed to get API usage information'}, 500

class MatchPrediction(Resource):
    """Match prediction endpoint"""
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['teamA', 'teamB']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field: {field}'}, 400
            
            # Extract match data
            team_a = data.get('teamA')
            team_b = data.get('teamB')
            venue = data.get('venue', '')
            toss_winner = data.get('tossWinner', '')
            toss_decision = data.get('tossDecision', 'bat')
            match_type = data.get('matchType', 'T20')
            
            # Make prediction
            prediction_result = prediction_service.predict_match(
                team_a=team_a,
                team_b=team_b,
                venue=venue,
                toss_winner=toss_winner,
                toss_decision=toss_decision,
                match_type=match_type
            )
            
            return prediction_result
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            logger.error(traceback.format_exc())
            return {'error': 'Internal server error during prediction'}, 500



class Teams(Resource):
    """Get all cricket teams"""
    def get(self):
        try:
            teams = cricket_service.get_teams()
            
            return {
                'success': True,
                'data': teams,
                'count': len(teams),
                'source': 'SportMonks Premium',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching teams: {str(e)}")
            return {'error': 'Failed to fetch teams'}, 500

class Venues(Resource):
    """Get all cricket venues"""
    def get(self):
        try:
            venues = cricket_service.get_venues()
            
            return {
                'success': True,
                'data': venues,
                'count': len(venues),
                'source': 'SportMonks Premium',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching venues: {str(e)}")
            return {'error': 'Failed to fetch venues'}, 500

class Fixtures(Resource):
    """Get upcoming cricket fixtures"""
    def get(self):
        try:
            days_ahead = request.args.get('days', default=30, type=int)
            fixtures = cricket_service.get_fixtures(days_ahead=days_ahead)
            
            return {
                'success': True,
                'data': fixtures,
                'count': len(fixtures),
                'source': 'SportMonks Premium',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching fixtures: {str(e)}")
            return {'error': 'Failed to fetch fixtures'}, 500



class Players(Resource):
    """Get all cricket players"""
    def get(self):
        try:
            team_id = request.args.get('team_id', type=int)
            country_id = request.args.get('country_id', type=int)
            
            players = cricket_service.get_players(team_id=team_id, country_id=country_id)
            
            return {
                'success': True,
                'data': players,
                'count': len(players),
                'source': 'SportMonks Premium',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching players: {str(e)}")
            return {'error': 'Failed to fetch players'}, 500



class LiveMatches(Resource):
    """Get live cricket matches"""
    def get(self):
        try:
            live_matches = cricket_service.get_live_matches()
            
            return {
                'success': True,
                'data': live_matches,
                'count': len(live_matches),
                'source': 'SportMonks Premium Live',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching live matches: {str(e)}")
            return {'error': 'Failed to fetch live matches'}, 500

class PlayerAnalytics(Resource):
    """Get advanced player analytics"""
    def get(self, player_name):
        try:
            # Get query parameters
            player_role = request.args.get('role', default='Batsman')
            
            # Get comprehensive analytics from SportMonks Premium
            analytics = cricket_service.get_advanced_player_analytics(player_name, player_role)
            
            return {
                'success': True,
                'data': analytics,
                'player': player_name,
                'role': player_role,
                'source': 'SportMonks Premium Analytics',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting analytics for {player_name}: {str(e)}")
            return {'error': f'Failed to get analytics for {player_name}'}, 500

class PlayerMatchHistory(Resource):
    """Get player match history"""
    def get(self, player_name):
        try:
            limit = request.args.get('limit', default=20, type=int)
            match_history = cricket_service.get_player_match_history(player_name, limit=limit)
            
            return {
                'success': True,
                'data': match_history,
                'count': len(match_history),
                'player': player_name,
                'source': 'SportMonks Premium',
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting match history for {player_name}: {str(e)}")
            return {'error': f'Failed to get match history for {player_name}'}, 500

class ServiceStatus(Resource):
    """Get comprehensive service status"""
    def get(self):
        try:
            service_status = cricket_service.get_api_usage_summary()
            
            return {
                'success': True,
                'service': 'Cricklytics Premium',
                'version': '2.0.0',
                'data_source': 'SportMonks Premium API Only',
                'status': service_status,
                'features': [
                    '🔴 Live Cricket Scores & Commentary',
                    '📊 Comprehensive Player Statistics', 
                    '🏆 Team Rankings & Detailed Data',
                    '🏟️ All International Cricket Venues',
                    '📈 Historical Match Data & Analytics',
                    '⚡ Ball-by-ball Live Commentary',
                    '🌤️ Weather & Pitch Condition Reports',
                    '🏏 Official Tournament & League Data',
                    '🔄 Real-time Score Updates',
                    '🎯 Advanced Predictive Analytics'
                ],
                'premium_benefits': [
                    'High rate limits (300/min, 10K/hour)',
                    'Real-time data updates',
                    'Comprehensive player career statistics',
                    'Advanced situational analytics',
                    'Official tournament data',
                    'Historical match database access'
                ],
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting service status: {str(e)}")
            return {'error': 'Failed to get service status'}, 500

class TestPlayers(Resource):
    """Quick test endpoint with minimal fake players"""
    def get(self):
        fake_players = [
            {'id': 1, 'fullname': 'Virat Kohli', 'team': 'India National Team', 'team_code': 'IND', 'position': 'Batsman', 'battingstyle': 'Right-hand bat', 'country': 'India', 'ranking': 1, 'is_international': True},
            {'id': 2, 'fullname': 'Steve Smith', 'team': 'Australia National Team', 'team_code': 'AUS', 'position': 'Batsman', 'battingstyle': 'Right-hand bat', 'country': 'Australia', 'ranking': 2, 'is_international': True},
            {'id': 3, 'fullname': 'Joe Root', 'team': 'England National Team', 'team_code': 'ENG', 'position': 'Batsman', 'battingstyle': 'Right-hand bat', 'country': 'England', 'ranking': 3, 'is_international': True},
            {'id': 4, 'fullname': 'Kane Williamson', 'team': 'New Zealand National Team', 'team_code': 'NZ', 'position': 'Batsman', 'battingstyle': 'Right-hand bat', 'country': 'New Zealand', 'ranking': 4, 'is_international': True},
            {'id': 5, 'fullname': 'Babar Azam', 'team': 'Pakistan National Team', 'team_code': 'PAK', 'position': 'Batsman', 'battingstyle': 'Right-hand bat', 'country': 'Pakistan', 'ranking': 5, 'is_international': True}
        ]
        
        return {
            'success': True,
            'data': fake_players,
            'count': len(fake_players),
            'source': 'Test Data',
            'timestamp': datetime.utcnow().isoformat()
        }

# Register API routes
api.add_resource(HealthCheck, '/health')
api.add_resource(APIUsage, '/api-usage')
api.add_resource(MatchPrediction, '/predict')
api.add_resource(Teams, '/teams')
api.add_resource(Players, '/players')
api.add_resource(TestPlayers, '/test-players')  # Add test endpoint
api.add_resource(Venues, '/venues')
api.add_resource(LiveMatches, '/live-matches')
api.add_resource(Fixtures, '/fixtures')
api.add_resource(PlayerAnalytics, '/players/<string:player_name>/analytics')
api.add_resource(PlayerMatchHistory, '/players/<string:player_name>/matches')
api.add_resource(ServiceStatus, '/status')

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.before_request
def log_request_info():
    logger.info(f"{request.method} {request.url} - {request.remote_addr}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info("🚀 Starting Cricklytics Premium Backend")
    logger.info("💎 Powered by SportMonks Premium API")
    logger.info(f"🔗 Running on http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=debug) 