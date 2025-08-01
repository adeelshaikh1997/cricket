#!/usr/bin/env python3
"""
Test script to verify SportMonks Premium API connection
"""

import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_sportmonks_connection():
    """Test SportMonks Premium API connection"""
    
    api_key = os.getenv('SPORTMONKS_API_KEY', '')
    base_url = "https://cricket.sportmonks.com/api/v2.0"
    
    print(f"🔑 API Key: {api_key[:10]}...{api_key[-4:] if len(api_key) > 14 else '***'}")
    print(f"🌐 Base URL: {base_url}")
    
    if not api_key:
        print("❌ No API key found in environment variables")
        return False
    
    # Test 1: Basic players endpoint
    print("\n🧪 Test 1: Basic players endpoint")
    try:
        url = f"{base_url}/players?api_token={api_key}&include=country"
        print(f"📡 Calling: {url}")
        
        response = requests.get(url, timeout=10)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            players = data.get('data', [])
            print(f"✅ Success! Found {len(players)} players")
            
            if players:
                print("\n📋 Sample players:")
                for i, player in enumerate(players[:3]):
                    print(f"  {i+1}. {player.get('fullname', 'Unknown')} - {player.get('country', {}).get('name', 'Unknown')}")
            
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print("🏏 Testing SportMonks Premium API Connection")
    print("=" * 50)
    
    success = test_sportmonks_connection()
    
    if success:
        print("\n✅ SportMonks Premium API connection successful!")
        print("🎉 Your premium API is working correctly.")
    else:
        print("\n❌ SportMonks Premium API connection failed!")
        print("🔧 Please check your API key and internet connection.") 