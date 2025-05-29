import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        ☕ Welcome to Coffee Companion
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
        Connect with like-minded people in your area for a warm coffee and good conversation.
      </p>
      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-lg"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-lg"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
