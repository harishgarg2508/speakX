// src/pages/Quiz.js
import React, { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import Anagram from '../components/QuestionTypes/Anagram';
import MultipleChoice from '../components/QuestionTypes/MultipleChoice';
import ReadAlong from '../components/QuestionTypes/ReadAlong';
import Card from '../components/common/card';
import Button from '../components/common/button';

const Quiz = () => {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const { questions, loading, error } = useQuestions();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Handle answer submission
  const handleAnswerSubmit = (questionId, isCorrect) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Reset quiz
  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setQuizCompleted(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-red-50">
          <p className="text-red-600">Error loading questions: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz completed state
  if (quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card title="Quiz Completed!">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Your Score: {score} / {questions.length}
            </h2>
            <p className="mb-4">
              Percentage: {((score / questions.length) * 100).toFixed(1)}%
            </p>
            <Button onClick={handleReset}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Current question
  const currentQuestion = questions[currentIndex];

  // Render question based on type
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'ANAGRAM':
        return (
          <Anagram 
            question={question} 
            onAnswer={(isCorrect) => handleAnswerSubmit(question._id, isCorrect)}
          />
        );
      case 'MCQ':
        return (
          <MultipleChoice 
            question={question} 
            onAnswer={(isCorrect) => handleAnswerSubmit(question._id, isCorrect)}
          />
        );
      case 'READ_ALONG':
        return (
          <ReadAlong 
            question={question} 
            onComplete={() => handleAnswerSubmit(question._id, true)}
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question card */}
      <Card className="mb-4">
        {renderQuestion(currentQuestion)}
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <Button 
          variant="secondary" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!answers[currentQuestion._id]}
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Quiz;