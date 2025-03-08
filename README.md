# MoodPlaylist

MoodPlaylist is a web application that analyzes your mood based on text input and recommends Spotify playlists to match your vibe. Built with a React frontend and a Flask backend, it allows users to save playlists to their library and revisit them later.

## Features

- **Mood Analysis**: Enter text to analyze your mood (e.g., "happy," "sad").
- **Playlist Recommendations**: Get Spotify playlist recommendations based on your detected mood.
- **Save Playlists**: Save recommended playlists to a personal library.
- **Responsive Design**: Includes a mobile-friendly navbar with a hamburger menu.
- **Multi-Page Navigation**: Navigate between Home, Library, and About pages using React Router.

## Demo

[https://mood-sync-sigma.vercel.app
](https://moodplaylist.vercel.app)
## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/downloads/) (v3.6 or higher)
- [npm](https://www.npmjs.com/)
- A code editor like [VS Code](https://code.visualstudio.com/)
- SQLite (optional, if using SQLite for the backend database)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/MoodPlaylist.git
cd MoodPlaylist
```

### 2. Set Up the Backend (Flask)

#### 1. Navigate to the Backend Directory
If your backend is in a separate directory (e.g., `backend/`), navigate there:
```bash
cd backend
```
If not, assume it's in the project root (`MoodPlaylist/`).

#### 2. Create a Virtual Environment and Activate It
Set up a virtual environment to isolate dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
You should see `(venv)` in your terminal prompt, indicating the virtual environment is active.

#### 3. Install Backend Dependencies
Install Flask and additional dependencies for Spotify API integration:
```bash
pip install flask flask-cors spotipy python-dotenv requests
```
- `flask`: For the backend server.
- `flask-cors`: To handle CORS (Cross-Origin Resource Sharing) since your React frontend on `localhost:3000` will call the Flask backend on `localhost:5000`.
- `spotipy`: A lightweight Python library for the Spotify API.
- `python-dotenv`: To manage environment variables (e.g., Spotify API credentials).
- `requests`: For making HTTP requests (used by Spotipy).

Save these dependencies to a `requirements.txt` file for reproducibility:
```bash
pip freeze > requirements.txt
```

#### 4. Set Up Spotify API Credentials
To use the Spotify API, you need a Spotify Developer account and an app registered on their dashboard:
- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
- Log in with your Spotify account.
- Click "Create an App," fill in the details (e.g., App Name: "MoodPlaylist Backend"), and create the app.
- Note down the **Client ID** and **Client Secret**.
- Add a Redirect URI (e.g., `http://localhost:5000/callback`) in the app settings under "Redirect URIs."

Create a `.env` file in your backend directory to store sensitive credentials:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
```
Add `.env` to `.gitignore` to keep credentials secure:
```bash
echo ".env" >> .gitignore
```

#### 5. Set Up a Database for Saving Playlists (Optional)
This project uses SQLite to save playlists. To set it up:
- Create a `playlists.db` file in your backend directory if it doesn’t exist.
- The Flask app will automatically create the necessary table (`playlists`) with columns for `mood`, `url`, and `timestamp` when it starts.

If you prefer another database (e.g., PostgreSQL), adjust the connection logic in `app.py` accordingly.

#### 6. Update the Flask App with Spotify API Integration
Ensure your Flask app (`app.py`) is configured to use the Spotify API. A sample `app.py` is provided in the repository, integrating Spotipy for playlist recommendations and SQLite for persistence.

#### 7. Run the Flask Server
Run the Flask app:
```bash
python app.py
```
The backend should now be running on `http://localhost:5000`. Test the endpoints using a tool like Postman or your React frontend:
- `POST http://localhost:5000/analyze`: Send `{"text": "I'm so happy today"}` to get a mood.
- `POST http://localhost:5000/playlist`: Send `{"mood": "happy"}` to get a Spotify playlist URL.
- `POST http://localhost:5000/save_playlist`: Send `{"mood": "happy", "playlist_url": "https://open.spotify.com/playlist/..."}` to save a playlist.
- `GET http://localhost:5000/saved_playlists`: Retrieve saved playlists.

### 3. Set Up the Frontend (React)
1. Navigate to the frontend directory (if separate, or assume it's in the root).
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the React app:
   ```bash
   npm start
   ```
   The frontend should now be running on `http://localhost:3000`.

## Usage

1. **Analyze Your Mood**:
   - Visit the Home page (`/`) and enter text describing your mood.
   - Click "Analyze" to detect your mood and get a Spotify playlist recommendation.
2. **Save Playlists**:
   - After receiving a playlist, click "Save to Your Library" to store it.
3. **View Saved Playlists**:
   - Navigate to the Library page (`/library`) to see all saved playlists with their moods and timestamps.
4. **Learn More**:
   - Visit the About page (`/about`) to learn more about the app.

## Project Structure

```
MoodPlaylist/
│
├── backend/                    # Flask backend (optional folder structure)
│   ├── app.py                  # Flask server
│   ├── playlists.db            # SQLite database (if used)
│   ├── .env                    # Environment variables (not tracked in git)
│   └── requirements.txt        # Backend dependencies
│
├──frontend/
│   └── src/                    # React frontend
│       ├── components/         # Reusable components (Navbar, TextInput, etc.)
│       ├── pages/              # Page components (HomePage, LibraryPage, etc.)
│       ├── App.tsx             # Main app component with routing
│       ├── App.css             # Global styles
│       └── index.tsx           # Entry point
│
├── public/                     # Static assets
├── package.json                # Frontend dependencies
└── README.md                   # Project documentation
```

## Technologies Used

### Frontend
- React (`react`, `react-dom`, `react-router-dom`)
- TypeScript (`typescript`)
- Bootstrap (`bootstrap`) for styling

### Backend
- Flask (`flask`) for API endpoints
- Spotipy (`spotipy`) for Spotify API integration
- SQLite for storing playlists
- Python (`python`) for backend logic
- Flask-CORS (`flask-cors`) for cross-origin requests
- Python Dotenv (`python-dotenv`) for environment variable management

## API Endpoints

The Flask backend exposes the following endpoints:

- `POST /analyze`: Analyze text to detect mood (currently uses a simple keyword-based approach; can be enhanced with NLP).
- `POST /playlist`: Fetch a Spotify playlist URL based on mood using the Spotify API.
- `POST /save_playlist`: Save a playlist to the SQLite database.
- `GET /saved_playlists`: Retrieve all saved playlists.

**Note**: The `/playlist` endpoint uses the Spotify API with the Client Credentials flow, which allows fetching public playlists without user authentication. To interact with user-specific data (e.g., save playlists to their Spotify account), additional OAuth setup is required.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## License

This project is licensed under the GNU General Public License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [Spotify API](https://developer.spotify.com/documentation/web-api/)
- [Spotipy](https://spotipy.readthedocs.io/)
