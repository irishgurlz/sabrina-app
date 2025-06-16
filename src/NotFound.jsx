import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
          Go back
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
