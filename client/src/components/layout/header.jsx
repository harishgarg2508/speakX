import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Quiz App
          </Link>
          
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-blue-600">
              Start Quiz
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;