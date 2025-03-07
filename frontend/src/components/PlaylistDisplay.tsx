import React from "react";

interface PlaylistDisplayProps {
  playlistUrl: string | null;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ playlistUrl }) => {
  if (!playlistUrl) return null;

  // Convert regular Spotify URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes("spotify.com/playlist/")) {
      const playlistId = url.split("playlist/")[1].split("?")[0];
      return `https://open.spotify.com/embed/playlist/${playlistId}`;
    }
    return url; // Return as is if not convertible
  };

  const embedUrl = getEmbedUrl(playlistUrl);

  return (
    <div className="playlist-display">
      <iframe
        src={embedUrl}
        className="playlist-embed"
        allow="encrypted-media"
        loading="lazy"
        title="Spotify Playlist"
      ></iframe>
    </div>
  );
};

export default PlaylistDisplay;
