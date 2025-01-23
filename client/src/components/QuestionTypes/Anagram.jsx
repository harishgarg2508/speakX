import React, { useState, useEffect } from 'react';

const Anagram = ({ question }) => {
  const [blocks, setBlocks] = useState([]);
  const [solution, setSolution] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (question?.blocks) {
      setBlocks(question.blocks.map(block => ({ ...block, isPlaced: false })));
    }
  }, [question]);

  const handleBlockClick = (clickedBlock, index) => {
    if (clickedBlock.isPlaced) {
      setSolution(prev => prev.filter((_, i) => i !== index));
      setBlocks(prev => [...prev, { ...clickedBlock, isPlaced: false }]);
    } else {
      setBlocks(prev => prev.filter((_, i) => i !== index));
      setSolution(prev => [...prev, { ...clickedBlock, isPlaced: true }]);
    }
  };

  useEffect(() => {
    const currentSolution = solution.map(block => block.text).join('');
    setIsCorrect(currentSolution === question?.solution);
  }, [solution, question]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{question?.title}</h3>
      
      <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-gray-100 rounded mb-4">
        {solution.map((block, index) => (
          <button
            key={`solution-${index}`}
            onClick={() => handleBlockClick(block, index)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {block.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {blocks.map((block, index) => (
          <button
            key={`block-${index}`}
            onClick={() => handleBlockClick(block, index)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {block.text}
          </button>
        ))}
      </div>

      {isCorrect && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Correct! Well done!
        </div>
      )}
    </div>
  );
};

export default Anagram;