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
    <div className="playlist-display mt-4">
      <iframe
        src={embedUrl}
        width="100%"
        height="380"
        frameBorder="0"
        className="playlist-embed"
        allow="encrypted-media"
        loading="lazy"
        title="Spotify Playlist"
        style={{ borderRadius: "12px" }}
      ></iframe>
    </div>
  );
};

export default PlaylistDisplay;
