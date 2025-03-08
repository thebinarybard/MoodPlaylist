from flask import Flask, request, jsonify
from textblob import TextBlob
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
import os

load_dotenv("/.env")

client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

app = Flask(__name__)
CORS(app)

# Spotify credentials
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

mood_playlists = {
    "happy": "happy songs",
    "sad": "sad songs",
    "neutral": "chill vibes",
    "angry": "hard rock",
    "stressed": "lofi beats",
    "calm": "acoustic covers"
}

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
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
    return jsonify({"mood": mood})

@app.route('/playlist', methods=['POST'])
def get_playlist():
    data = request.get_json()
    mood = data.get('mood')
    if not mood:
        return jsonify({"error": "No mood provided"}), 400
    genre = mood_playlists.get(mood, "pop")  # Use mood-specific genre
    query = f"{mood} {genre}"
    try:
        results = sp.search(q=query, type='playlist', limit=1)
        playlist = results['playlists']['items'][0]['external_urls']['spotify']
        return jsonify({"playlist_url": playlist})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save_playlist', methods=['POST'])
def save_playlist():
    data = request.get_json()
    mood = data.get('mood')
    url = data.get('playlist_url')
    if not mood or not url:
        return jsonify({"error": "Mood and URL required"}), 400
    try:
        conn = sqlite3.connect('playlists.db')
        c = conn.cursor()
        c.execute('INSERT INTO playlists (mood, url, timestamp) VALUES (?, ?, datetime("now"))', (mood, url))
        conn.commit()
        conn.close()
        return jsonify({"status": "saved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/saved_playlists', methods=['GET'])
def get_saved_playlists():
    try:
        conn = sqlite3.connect('playlists.db')
        c = conn.cursor()
        c.execute('SELECT mood, url, timestamp FROM playlists ORDER BY timestamp DESC')
        playlists = [{"mood": row[0], "url": row[1], "timestamp": row[2]} for row in c.fetchall()]
        conn.close()
        return jsonify({"playlists": playlists})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def init_db():
    conn = sqlite3.connect('playlists.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, mood TEXT, url TEXT, timestamp TEXT)')
    #clear saved playlists
    #c.execute("DELETE FROM playlists;")
    conn.commit()
    conn.close()

init_db()

if __name__ == "__main__":
    app.run(debug=True, port=5000)