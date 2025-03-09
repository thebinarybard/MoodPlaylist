// pages/HomePage.tsx
import React, { useState } from "react";
import TextInput from "../components/TextInput";
import MoodDisplay from "../components/MoodDisplay";
import PlaylistDisplay from "../components/PlaylistDisplay";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const analyzeMood = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setSaveSuccess(false);
    try {
      const moodResponse = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const moodData = await moodResponse.json();
      setMood(moodData.mood);

      // HomePage.tsx - modify the analyzeMood function
      const playlistResponse = await fetch("http://localhost:5000/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodData.mood }),
      });

      if (!playlistResponse.ok) {
        throw new Error("Failed to fetch playlist");
      }

      const playlistData = await playlistResponse.json();
      setPlaylistUrl(playlistData.playlist_url);
      setPlaylistName(playlistData.playlist_name || "Spotify Playlist");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlaylist = async () => {
    if (!mood || !playlistUrl) return;

    setSaveLoading(true);
    try {
      const response = await fetch("http://localhost:5000/save_playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          playlist_url: playlistUrl,
          playlist_name: playlistName,
        }),
      });
      const data = await response.json();
      if (data.status === "saved") {
        setSaveSuccess(true);
        // Optional: Navigate to library after a short delay
        setTimeout(() => {
          navigate("/library");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="container text-center mt-4">
      <h2 className="">Find the perfect playlist for your mood</h2>
      <p className="lead mb-4">
        Enter your thoughts, and we'll find music that matches your emotional
        state
      </p>

      <TextInput onAnalyze={analyzeMood} isLoading={isLoading} />

      {mood && <MoodDisplay mood={mood} />}

      {playlistUrl && (
        <>
          <PlaylistDisplay playlistUrl={playlistUrl} />
          <button
            className={`btn ${
              saveSuccess ? "btn-spotify" : "btn-spotify"
            } mt-3`}
            onClick={savePlaylist}
            disabled={saveLoading || saveSuccess}
          >
            {saveLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>Saving...
              </>
            ) : saveSuccess ? (
              <>
                <i className="fas fa-check me-2"></i>Saved to Library
              </>
            ) : (
              <>Save to Your Library</>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;
