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
from services.cricket_service import CricketService
from services.multi_cricket_service import MultiCricketService
from models.match_predictor import MatchPredictor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend
api = Api(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
prediction_service = PredictionService()
cricket_service = CricketService()
multi_cricket_service = MultiCricketService()

class HealthCheck(Resource):
    """Health check endpoint"""
    def get(self):
        return {
            'status': 'healthy',
            'message': 'Cricklytics Backend API is running',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }

class APIUsage(Resource):
    """API usage monitoring endpoint"""
    def get(self):
        try:
            usage_info = cricket_service.get_api_usage_info()
            
            # Add additional status information
            usage_info.update({
                'timestamp': datetime.utcnow().isoformat(),
                'status': 'protected' if usage_info['protection_active'] else 'active',
                'remaining_calls': max(0, usage_info['daily_limit'] - usage_info['calls_today']),
                'warning_threshold': cricket_service.api_usage_threshold
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

class ModelInfo(Resource):
    """Model information endpoint"""
    def get(self):
        try:
            model_info = prediction_service.get_model_info()
            return model_info
        except Exception as e:
            logger.error(f"Model info error: {str(e)}")
            return {'error': 'Failed to retrieve model information'}, 500

class Teams(Resource):
    """Teams data endpoint"""
    def get(self):
        try:
            teams = cricket_service.get_teams()
            return {'data': teams}
        except Exception as e:
            logger.error(f"Teams data error: {str(e)}")
            return {'error': 'Failed to retrieve teams data'}, 500

class Venues(Resource):
    """Venues data endpoint"""
    def get(self):
        try:
            venues = cricket_service.get_venues()
            return {'data': venues}
        except Exception as e:
            logger.error(f"Venues data error: {str(e)}")
            return {'error': 'Failed to retrieve venues data'}, 500

class Fixtures(Resource):
    """Fixtures data endpoint"""
    def get(self):
        try:
            # Get query parameters
            team_id = request.args.get('team_id')
            venue_id = request.args.get('venue_id')
            date_from = request.args.get('date_from')
            date_to = request.args.get('date_to')
            
            fixtures = cricket_service.get_fixtures(
                team_id=team_id,
                venue_id=venue_id,
                date_from=date_from,
                date_to=date_to
            )
            
            return {'data': fixtures}
        except Exception as e:
            logger.error(f"Fixtures data error: {str(e)}")
            return {'error': 'Failed to retrieve fixtures data'}, 500

class PlayerMatchHistory(Resource):
    """Player match history endpoint"""
    def get(self, player_name):
        try:
            logger.info(f"Fetching match history for player: {player_name}")
            
            # Get player match history from cricket service
            match_history = cricket_service.get_player_match_history(player_name)
            
            return {
                'success': True,
                'data': match_history,
                'player': player_name,
                'total_matches': len(match_history),
                'message': f'Successfully retrieved {len(match_history)} matches for {player_name}'
            }
            
        except Exception as e:
            logger.error(f"Error in PlayerMatchHistory endpoint: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to fetch player match history',
                'message': str(e)
            }, 500

class PlayerStats(Resource):
    """Player statistics endpoint"""
    def get(self, player_id):
        try:
            logger.info(f"Fetching player stats for ID: {player_id}")
            
            players = cricket_service.get_players()
            player = next((p for p in players if str(p.get('id')) == str(player_id)), None)
            
            if not player:
                return {'error': 'Player not found'}, 404
            
            # Get match history for this player
            match_history = cricket_service.get_player_match_history(player.get('fullname', ''))
            
            return {
                'success': True,
                'data': {
                    'player': player,
                    'matchHistory': match_history
                },
                'message': f'Successfully retrieved stats for player {player_id}'
            }
            
        except Exception as e:
            logger.error(f"Error in PlayerStats endpoint: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to fetch player stats',
                'message': str(e)
            }, 500

class TeamStats(Resource):
    """Team statistics endpoint"""
    def get(self, team_id):
        try:
            stats = cricket_service.get_team_stats(team_id)
            return {'data': stats}
        except Exception as e:
            logger.error(f"Team stats error: {str(e)}")
            return {'error': 'Failed to retrieve team statistics'}, 500

class Players(Resource):
    """Get all international cricket players"""
    
    def get(self):
        try:
            logger.info(f"GET {request.url} - {request.remote_addr}")
            
            # Get optional team filter
            team_id = request.args.get('team_id')
            
            players = multi_cricket_service.get_players(prefer_real_data=True)
            
            return {
                'success': True,
                'data': players,
                'total': len(players),
                'message': f'Successfully retrieved {len(players)} international cricket players'
            }
            
        except Exception as e:
            logger.error(f"Error in Players endpoint: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to fetch players',
                'message': str(e)
            }, 500

class PlayerAdvancedAnalytics(Resource):
    """Get comprehensive player analytics with real data"""
    
    def get(self, player_name):
        try:
            logger.info(f"GET {request.url} - {request.remote_addr}")
            
            # Get player role from query params (fallback to position detection)
            player_role = request.args.get('role', 'Batsman')
            
            # Get comprehensive analytics
            analytics = multi_cricket_service.get_advanced_player_analytics(player_name, player_role)
            
            return {
                'success': True,
                'data': analytics,
                'player': player_name,
                'role': player_role,
                'data_sources': analytics.get('data_source', []),
                'has_real_data': analytics.get('has_real_data', False),
                'message': f'Successfully retrieved advanced analytics for {player_name}'
            }
            
        except Exception as e:
            logger.error(f"Error in PlayerAdvancedAnalytics endpoint: {str(e)}")
            return {'success': False, 'error': 'Failed to fetch player analytics', 'message': str(e)}, 500

class MultiAPIUsage(Resource):
    """Get usage information across all cricket APIs"""
    
    def get(self):
        try:
            logger.info(f"GET {request.url} - {request.remote_addr}")
            
            usage_summary = multi_cricket_service.get_api_usage_summary()
            
            return {
                'success': True,
                'data': usage_summary,
                'timestamp': datetime.utcnow().isoformat(),
                'message': 'Multi-API usage summary retrieved successfully'
            }
            
        except Exception as e:
            logger.error(f"Error in MultiAPIUsage endpoint: {str(e)}")
            return {'success': False, 'error': 'Failed to get API usage summary', 'message': str(e)}, 500

class RealDataStatus(Resource):
    """Check real data availability and quality"""
    
    def get(self):
        try:
            logger.info(f"GET {request.url} - {request.remote_addr}")
            
            # Test data availability from each source
            sportmonks_status = "Available" if multi_cricket_service.sportmonks.api_key else "No API Key"
            cricketdata_status = "Available"  # Always available
            entity_sport_status = "Development API"
            
            # Test with a sample player
            test_players = multi_cricket_service.get_players(prefer_real_data=True)
            sample_analytics = None
            
            if test_players:
                sample_player = test_players[0]['fullname']
                sample_analytics = multi_cricket_service.get_advanced_player_analytics(
                    sample_player, test_players[0].get('position', {}).get('name', 'Batsman')
                )
            
            return {
                'success': True,
                'data': {
                    'api_status': {
                        'sportmonks': sportmonks_status,
                        'cricketdata': cricketdata_status,
                        'entity_sport': entity_sport_status
                    },
                    'data_quality': {
                        'total_players': len(test_players),
                        'real_data_available': sample_analytics.get('has_real_data', False) if sample_analytics else False,
                        'sample_player': test_players[0]['fullname'] if test_players else None,
                        'data_sources': sample_analytics.get('data_source', []) if sample_analytics else []
                    },
                    'recommendations': [
                        "✅ Get SportMonks free API key for best quality international data",
                        "🎯 Entity Sport provides additional coverage for domestic leagues", 
                        "💾 CricketData.org serves as reliable backup with 260+ players",
                        "🚀 Multi-source system ensures data availability at all times"
                    ]
                },
                'message': 'Real data status check completed'
            }
            
        except Exception as e:
            logger.error(f"Error in RealDataStatus endpoint: {str(e)}")
            return {'success': False, 'error': 'Failed to check real data status', 'message': str(e)}, 500

# Register API endpoints
api.add_resource(HealthCheck, '/health')
api.add_resource(MatchPrediction, '/predict')
api.add_resource(ModelInfo, '/model/info')
api.add_resource(Teams, '/teams')
api.add_resource(Venues, '/venues')
api.add_resource(Fixtures, '/fixtures')
api.add_resource(Players, '/players')
api.add_resource(PlayerStats, '/players/<int:player_id>')
api.add_resource(TeamStats, '/teams/<int:team_id>/stats')
api.add_resource(APIUsage, '/api/usage')
api.add_resource(PlayerMatchHistory, '/players/<string:player_name>/history')
api.add_resource(PlayerAdvancedAnalytics, '/players/<string:player_name>/analytics')
api.add_resource(MultiAPIUsage, '/api/multi-usage')
api.add_resource(RealDataStatus, '/api/real-data-status')

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
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run app
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5001))  # Changed from 5000 to 5001 to avoid AirPlay conflict
    
    logger.info(f"Starting Cricklytics Backend API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug_mode) 