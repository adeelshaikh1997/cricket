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

class HealthCheck(Resource):
    """Health check endpoint"""
    def get(self):
        return {
            'status': 'healthy',
            'message': 'Cricklytics Backend API is running',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }

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

class PlayerStats(Resource):
    """Player statistics endpoint"""
    def get(self, player_id):
        try:
            stats = cricket_service.get_player_stats(player_id)
            return {'data': stats}
        except Exception as e:
            logger.error(f"Player stats error: {str(e)}")
            return {'error': 'Failed to retrieve player statistics'}, 500

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
            
            players = cricket_service.get_players(team_id=team_id)
            
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