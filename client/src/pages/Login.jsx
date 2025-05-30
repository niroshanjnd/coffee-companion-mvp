import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', formData);
      localStorage.setItem('token', res.data.token); // ✅ Store JWT
      setError('');
      navigate('/profile'); // ✅ Redirect to profile
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 rounded border border-gray-300"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 rounded border border-gray-300"
          required
        />
        <button type="submit" className="w-full bg-[#0a2342] text-white rounded-md py-3">
          Login
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Login;
