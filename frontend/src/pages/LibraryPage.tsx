// pages/LibraryPage.tsx
import React, { useState, useEffect } from "react";

const LibraryPage: React.FC = () => {
  const [savedPlaylists, setSavedPlaylists] = useState<
    { mood: string; url: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    fetchSavedPlaylists();
  }, []);

  const fetchSavedPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:5000/saved_playlists");
      const data = await response.json();
      setSavedPlaylists(data.playlists);
    } catch (error) {
      console.error("Error fetching saved playlists:", error);
    }
  };

  return (
    <div className="container text-center mt-4">
      <h1 className="display-4">Your Mood Library</h1>
      {savedPlaylists.length > 0 ? (
        <div className="playlist-list">
          {savedPlaylists.map((item, index) => (
            <div key={index} className="playlist-item">
              <span className="playlist-mood">
                {item.mood[0].toUpperCase() + item.mood.substring(1)}
              </span>
              <span className="playlist-timestamp">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
              <a
                href={item.url}
                className="playlist-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Spotify
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved playlists yet.</p>
      )}
    </div>
  );
};

export default LibraryPage;
