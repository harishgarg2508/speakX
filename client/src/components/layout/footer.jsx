import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Quiz App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
