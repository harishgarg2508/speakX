import React, { useEffect, useState } from 'react';
import grpcClient from '../services/grpcClient';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await grpcClient.getQuestions(10, 0);
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="question-card">
          <h3>{question.title}</h3>
          <p>Type: {question.type}</p>
          {question.options && (
            <ul>
              {question.options.map((option, index) => (
                <li key={index} className={option.isCorrectAnswer ? 'correct' : ''}>
                  {option.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;