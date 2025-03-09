// components/TextInput.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(text);
  };

  return (
    <div className="text-input-container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control shadow-sm"
            placeholder="How are you feeling today? Describe your mood, thoughts, or share what's on your mind..."
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-spotify"
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Analyzing...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Analyze My Mood
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TextInput;
