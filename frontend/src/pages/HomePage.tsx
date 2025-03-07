// pages/HomePage.tsx
import React, { useState } from "react";
import TextInput from "../components/TextInput";
import MoodDisplay from "../components/MoodDisplay";
import PlaylistDisplay from "../components/PlaylistDisplay";

const HomePage: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const analyzeMood = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const moodResponse = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const moodData = await moodResponse.json();
      setMood(moodData.mood);

      const playlistResponse = await fetch("http://localhost:5000/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodData.mood }),
      });
      const playlistData = await playlistResponse.json();
      setPlaylistUrl(playlistData.playlist_url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center mt-4">
      <h1 className="display-4">Find the perfect playlist for your mood</h1>
      <TextInput onAnalyze={analyzeMood} isLoading={isLoading} />

      {mood && <MoodDisplay mood={mood} />}

      {playlistUrl && (
        <>
          <PlaylistDisplay playlistUrl={playlistUrl} />
          <button className="btn btn-spotify mt-3">Save to Your Library</button>
        </>
      )}
    </div>
  );
};

export default HomePage;
