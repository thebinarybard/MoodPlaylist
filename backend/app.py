from flask import Flask, request, jsonify
from textblob import TextBlob
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(".env")

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

app = Flask(__name__)
CORS(app)

# Initialize Spotify client
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

# Improved mood to playlist mapping with better descriptions
mood_playlists = {
    "happy": "upbeat positive music",
    "sad": "melancholic emotional songs",
    "neutral": "chill relaxing vibes",
    "angry": "intense hard rock",
    "stressed": "calming lofi beats",
    "calm": "peaceful acoustic covers"
}

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Analyze text sentiment
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # More nuanced mood classification
    if polarity > 0.5:
        mood = "happy"
    elif polarity > 0.1 and subjectivity > 0.5:
        mood = "calm"
    elif polarity < -0.5:
        mood = "sad"
    elif polarity < -0.1 and subjectivity < 0.5:
        mood = "angry"
    elif polarity < -0.1:
        mood = "stressed"
    else:
        mood = "neutral"
    
    return jsonify({
        "mood": mood,
        "analysis": {
            "polarity": polarity,
            "subjectivity": subjectivity
        }
    })

@app.route('/playlist', methods=['POST'])
def get_playlist():
    data = request.get_json()
    mood = data.get('mood')
    
    print(f"Received request for mood: {mood}")  # Debug logging
    
    if not mood:
        return jsonify({"error": "No mood provided"}), 400
    
    # Check if Spotify credentials are set
    if not client_id or not client_secret:
        print("ERROR: Spotify API credentials are missing")
        return jsonify({"error": "Spotify API credentials not configured"}), 500
    
    # Get appropriate genre for the mood
    genre = mood_playlists.get(mood, "pop")
    query = f"{mood} {genre}"
    print(f"Searching Spotify with query: '{query}'")  # Debug logging
    
    try:
        results = sp.search(q=query, type='playlist', limit=1)
        
        # Debug: Print the raw results
        print(f"Search results: {results}")
        
        # Check if there are valid items in the results
        if not results['playlists']['items'] or results['playlists']['items'][0] is None:
            print(f"No valid playlists found for query: '{query}'")
            
            # Fallback to a more generic search
            fallback_query = genre
            print(f"Trying fallback query: '{fallback_query}'")
            results = sp.search(q=fallback_query, type='playlist', limit=1)
            
            # Check again after fallback
            if not results['playlists']['items'] or results['playlists']['items'][0] is None:
                return jsonify({"error": f"No playlists found for {mood}"}), 404
        
        # Access playlist details
        playlist = results['playlists']['items'][0]['external_urls']['spotify']
        playlist_name = results['playlists']['items'][0]['name']
        
        response_data = {
            "playlist_url": playlist,
            "playlist_name": playlist_name,
            "mood": mood
        }
        print(f"Returning playlist: {response_data}")  # Debug logging
        
        return jsonify(response_data)
    except spotipy.SpotifyException as e:
        print(f"Spotify API error: {str(e)}")
        return jsonify({"error": f"Spotify API error: {str(e)}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/save_playlist', methods=['POST'])
def save_playlist():
    data = request.get_json()
    mood = data.get('mood')
    url = data.get('playlist_url')
    name = data.get('playlist_name', 'Unnamed Playlist')
    
    if not mood or not url:
        return jsonify({"error": "Mood and URL required"}), 400
    
    try:
        conn = sqlite3.connect('playlists.db')
        c = conn.cursor()
        c.execute(
            'INSERT INTO playlists (mood, url, name, timestamp) VALUES (?, ?, ?, datetime("now"))', 
            (mood, url, name)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "mood": mood})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/saved_playlists', methods=['GET'])
def get_saved_playlists():
    try:
        conn = sqlite3.connect('playlists.db')
        conn.row_factory = sqlite3.Row  # This enables column access by name
        c = conn.cursor()
        c.execute('SELECT mood, url, name, timestamp FROM playlists ORDER BY timestamp DESC')
        
        playlists = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({"playlists": playlists})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def init_db():
    conn = sqlite3.connect('playlists.db')
    c = conn.cursor()
    # Create table with name column added
    c.execute('''
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY, 
            mood TEXT, 
            url TEXT, 
            name TEXT,
            timestamp TEXT
        )
    ''')

    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

if __name__ == "__main__":
    app.run(debug=True, port=5000)