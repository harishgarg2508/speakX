import React, { useState } from 'react';

const MultipleChoice = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (option, index) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{question?.title}</h3>
      
      <div className="space-y-2">
        {question?.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option, index)}
            className={`w-full p-3 text-left rounded ${
              selectedOption === index
                ? option.isCorrectAnswer
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-500'
                : 'bg-gray-100 hover:bg-gray-200'
            } border`}
            disabled={showFeedback}
          >
            {option.text}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`mt-4 p-2 rounded ${
          question.options[selectedOption].isCorrectAnswer
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {question.options[selectedOption].isCorrectAnswer
            ? 'Correct answer!'
            : 'Incorrect. Try again!'}
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;