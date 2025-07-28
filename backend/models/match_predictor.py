import os
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Any, Tuple
import warnings

warnings.filterwarnings('ignore')
logger = logging.getLogger(__name__)

class MatchPredictor:
    """Cricket match outcome prediction model using Random Forest"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'team_a_rating',
            'team_b_rating', 
            'venue_batting_avg',
            'venue_home_advantage',
            'toss_advantage',
            'match_type_factor',
            'head_to_head_ratio'
        ]
        self.is_trained = False
    
    def generate_training_data(self, n_samples: int = 1000) -> Tuple[np.ndarray, np.ndarray]:
        """Generate synthetic training data for cricket matches"""
        logger.info(f"Generating {n_samples} training samples")
        
        X = []
        y = []
        
        # Team ratings (1-100 scale)
        team_ratings = np.random.normal(65, 15, (n_samples, 2))
        team_ratings = np.clip(team_ratings, 30, 95)
        
        for i in range(n_samples):
            team_a_rating = team_ratings[i, 0]
            team_b_rating = team_ratings[i, 1]
            
            # Venue factors
            venue_batting_avg = np.random.uniform(0.3, 0.8)  # Batting friendliness
            venue_home_advantage = np.random.uniform(0, 0.2)  # Home advantage
            
            # Toss advantage
            toss_advantage = np.random.uniform(-0.1, 0.1)
            
            # Match type factor (T20 more unpredictable)
            match_type_factor = np.random.choice([0.02, 0.05, 0.1])  # Test, ODI, T20
            
            # Head-to-head ratio (Team A wins / total matches)
            head_to_head_ratio = np.random.uniform(0.2, 0.8)
            
            # Create feature vector
            features = [
                team_a_rating,
                team_b_rating,
                venue_batting_avg,
                venue_home_advantage,
                toss_advantage,
                match_type_factor,
                head_to_head_ratio
            ]
            
            # Calculate outcome probability
            # Higher rating, better venue conditions, home advantage all favor team A
            rating_diff = (team_a_rating - team_b_rating) / 50  # Normalize
            venue_factor = venue_batting_avg * 0.3
            home_factor = venue_home_advantage
            toss_factor = toss_advantage
            match_factor = match_type_factor * np.random.normal(0, 1)  # Add randomness
            h2h_factor = (head_to_head_ratio - 0.5) * 0.4
            
            # Combined probability for Team A winning
            win_prob = 0.5 + rating_diff + venue_factor + home_factor + toss_factor + match_factor + h2h_factor
            win_prob = np.clip(win_prob, 0.1, 0.9)  # Keep realistic bounds
            
            # Determine winner (1 = Team A wins, 0 = Team B wins)
            outcome = 1 if np.random.random() < win_prob else 0
            
            X.append(features)
            y.append(outcome)
        
        X = np.array(X)
        y = np.array(y)
        
        logger.info(f"Generated training data: {X.shape[0]} samples, {X.shape[1]} features")
        logger.info(f"Team A win rate in training data: {np.mean(y):.3f}")
        
        return X, y
    
    def train(self, X: np.ndarray = None, y: np.ndarray = None, save_model: bool = True) -> Dict[str, Any]:
        """Train the cricket match prediction model"""
        
        if X is None or y is None:
            logger.info("No training data provided, generating synthetic data")
            X, y = self.generate_training_data(1500)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        logger.info("Training Random Forest model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        train_predictions = self.model.predict(X_train_scaled)
        test_predictions = self.model.predict(X_test_scaled)
        
        train_accuracy = accuracy_score(y_train, train_predictions)
        test_accuracy = accuracy_score(y_test, test_predictions)
        
        # Feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        
        results = {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'feature_importance': feature_importance,
            'model_params': self.model.get_params(),
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }
        
        logger.info(f"Model training completed:")
        logger.info(f"Training accuracy: {train_accuracy:.3f}")
        logger.info(f"Test accuracy: {test_accuracy:.3f}")
        
        self.is_trained = True
        
        # Save model
        if save_model:
            self.save_model()
        
        return results
    
    def predict(self, features: np.ndarray) -> Tuple[int, float]:
        """Make prediction for match outcome"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Scale features
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Predict
        prediction = self.model.predict(features_scaled)[0]
        probability = self.model.predict_proba(features_scaled)[0]
        
        return prediction, max(probability)
    
    def predict_proba(self, features: np.ndarray) -> np.ndarray:
        """Get prediction probabilities"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Scale features
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        return self.model.predict_proba(features_scaled)
    
    def save_model(self, filepath: str = None):
        """Save trained model to disk"""
        if not self.is_trained or self.model is None:
            raise ValueError("No trained model to save")
        
        if filepath is None:
            os.makedirs('models', exist_ok=True)
            filepath = 'models/cricket_predictor.joblib'
        
        # Save model and scaler together
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str = None):
        """Load trained model from disk"""
        if filepath is None:
            filepath = 'models/cricket_predictor.joblib'
        
        if not os.path.exists(filepath):
            logger.warning(f"Model file not found: {filepath}")
            return False
        
        try:
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.is_trained = model_data['is_trained']
            
            logger.info(f"Model loaded from {filepath}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from trained model"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model not trained")
        
        return dict(zip(self.feature_names, self.model.feature_importances_))

def train_and_save_model():
    """Utility function to train and save the cricket prediction model"""
    predictor = MatchPredictor()
    
    # Train model
    results = predictor.train()
    
    print("Training Results:")
    print(f"Training Accuracy: {results['train_accuracy']:.3f}")
    print(f"Test Accuracy: {results['test_accuracy']:.3f}")
    print("\nFeature Importance:")
    for feature, importance in results['feature_importance'].items():
        print(f"{feature}: {importance:.3f}")
    
    return predictor

if __name__ == "__main__":
    # Train and save model when script is run directly
    train_and_save_model() 