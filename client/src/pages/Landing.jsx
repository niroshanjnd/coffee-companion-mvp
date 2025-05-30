// client/src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <img src={logo} alt="Coffee Companion Logo" className="w-20 mb-4" />
      <h1 className="text-2xl font-bold text-center mb-2">Find Coffee Companions Nearby</h1>
      <Link to="/register" className="bg-[#f97316] text-white text-lg rounded-md w-full max-w-xs py-3 text-center mb-3 shadow">
        Register
      </Link>
      <Link to="/login" className="border border-[#0a2342] text-[#0a2342] text-lg rounded-md w-full max-w-xs py-3 text-center shadow">
        Login
      </Link>
      <img src="/map-icon.png" alt="Map Icon" className="w-24 mt-6" />
    </div>
  );
};

export default Landing;