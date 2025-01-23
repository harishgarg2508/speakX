import React, { useState } from 'react';

const ReadAlong = ({ question }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);

  const words = question?.title?.split(' ') || [];

  const handlePlayClick = () => {
    setIsPlaying(true);
    let currentWord = 0;

    const interval = setInterval(() => {
      if (currentWord < words.length) {
        setHighlightedWords(prev => [...prev, currentWord]);
        currentWord++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 500);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Read Along</h3>
        <button
          onClick={handlePlayClick}
          disabled={isPlaying}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {isPlaying ? 'Reading...' : 'Start Reading'}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded">
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block mr-1 p-1 rounded ${
              highlightedWords.includes(index) ? 'bg-yellow-200' : ''
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReadAlong;