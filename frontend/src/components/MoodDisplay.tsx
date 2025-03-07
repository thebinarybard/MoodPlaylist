import React from "react";

interface MoodDisplayProps {
  mood: string | null;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ mood }) => {
  if (!mood) return null;

  // Map moods to emojis
  const moodEmojis: { [key: string]: string } = {
    happy: "😊",
    sad: "😢",
    energetic: "⚡",
    calm: "😌",
    angry: "😠",
    anxious: "😰",
    excited: "🤩",
    relaxed: "🧘",
    nostalgic: "🕰️",
    romantic: "❤️",
    confident: "💪",
    focused: "🧠",
    // Add more mood-emoji mappings as needed
  };

  const emoji = moodEmojis[mood.toLowerCase()] || "🎵";

  return (
    <div className="mood-display">
      <div className="mood-emoji">{emoji}</div>
      <p className="mood-text">
        You're feeling <span className="mood-name">{mood}</span>
      </p>
      <p>Here's a playlist that matches your vibe</p>
    </div>
  );
};

export default MoodDisplay;
