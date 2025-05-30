import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // ✅ adjust based on your actual file

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <img src={logo} alt="Coffee Companion Logo" className="w-32 h-32 mb-6" />

      <h1 className="text-4xl font-bold mb-4">Welcome to Coffee Companion</h1>
      <p className="mb-6 text-center max-w-lg text-gray-700">
        A place to connect with like-minded people over a coffee in your suburb.
      </p>

      <div className="space-x-4">
        <Link to="/login" className="bg-[#0a2342] text-white px-6 py-2 rounded hover:bg-[#1c345a]">
          Login
        </Link>
        <Link to="/register" className="bg-[#f97316] text-white px-6 py-2 rounded hover:bg-[#fb923c]">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
