import { useState, useEffect } from 'react';
import { getQuestions, getQuestionsByType } from '../services/grpcClient';

export const useQuestions = (type = null, limit = 10, offset = 0) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = type
          ? await getQuestionsByType(type)
          : await getQuestions(limit, offset);
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [type, limit, offset]);

  return { questions, loading, error };
};

