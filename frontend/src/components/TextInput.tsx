import React, { useState } from "react";

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="mood-entry-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            rows={4}
            placeholder="How are you feeling today? Tell us about your mood..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-spotify"
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? "Finding your playlist..." : "Get My Playlist"}
        </button>
      </form>
    </div>
  );
};

export default TextInput;
