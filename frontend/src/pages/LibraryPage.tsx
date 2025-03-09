// pages/LibraryPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faMusic,
  faSmile,
  faFrown,
  faMeh,
  faDizzy,
  faAngry,
  faPeace,
} from "@fortawesome/free-solid-svg-icons";

interface SavedPlaylist {
  mood: string;
  url: string;
  name?: string;
  timestamp: string;
}

const LibraryPage: React.FC = () => {
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSavedPlaylists();
  }, []);

  const fetchSavedPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/saved_playlists");
      const data = await response.json();
      setSavedPlaylists(data.playlists || []);
    } catch (error) {
      console.error("Error fetching saved playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return <FontAwesomeIcon icon={faSmile} className="me-2" size="lg" />;
      case "sad":
        return <FontAwesomeIcon icon={faFrown} className="me-2" size="lg" />;
      case "neutral":
        return <FontAwesomeIcon icon={faMeh} className="me-2" size="lg" />;
      case "angry":
        return <FontAwesomeIcon icon={faAngry} className="me-2" size="lg" />;
      case "stressed":
        return <FontAwesomeIcon icon={faDizzy} className="me-2" size="lg" />;
      case "calm":
        return <FontAwesomeIcon icon={faPeace} className="me-2" size="lg" />;
      default:
        return <FontAwesomeIcon icon={faMusic} className="me-2" size="lg" />;
    }
  };

  // Function to get mood badge color
  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "success";
      case "sad":
        return "primary";
      case "neutral":
        return "secondary";
      case "angry":
        return "danger";
      case "stressed":
        return "warning";
      case "calm":
        return "info";
      default:
        return "light";
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="title">YOUR MOOD LIBRARY</h1>

        <Link to="/" className="btn btn-sm  btn-spotify">
          Add A Playlist
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
          <p className="mt-3">Loading your saved playlists...</p>
        </div>
      ) : savedPlaylists.length > 0 ? (
        <div className="row">
          {savedPlaylists.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className={`badge bg-${getMoodColor(
                        item.mood
                      )} px-3 py-2`}
                    >
                      {getMoodIcon(item.mood)}
                      {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                    </span>
                    <small className="text-muted">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </small>
                  </div>
                  <h5 className="card-title">
                    {item.name || "Spotify Playlist"}
                  </h5>
                  <a
                    href={item.url}
                    className="btn btn-spotify w-100 mt-3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faMusic}
                      className="me-2"
                      size="lg"
                    />
                    Open in Spotify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faMusic} className="me-2 mb-4" size="3x" />
          <h3>No saved playlists yet</h3>
          <p className="text-muted mb-4">
            Start by analyzing your mood on the home page
          </p>
          <Link to="/" className="btn btn-spotify">
            Go to Home Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
