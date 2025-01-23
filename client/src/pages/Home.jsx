// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import Card from '../components/common/card';
const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Quiz App</h1>
        <p className="text-lg text-gray-600 mb-6">
          Test your knowledge with various types of questions including anagrams,
          multiple choice, and reading exercises.
        </p>
        <Link to="/quiz">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Start Quiz
          </button>
        </Link>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card title="Anagrams">
          <p className="text-gray-600">
            Rearrange letters and words to find hidden meanings.
          </p>
        </Card>
        <Card title="Multiple Choice">
          <p className="text-gray-600">
            Test your knowledge with carefully crafted questions.
          </p>
        </Card>
        <Card title="Read Along">
          <p className="text-gray-600">
            Improve your reading skills with interactive exercises.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;