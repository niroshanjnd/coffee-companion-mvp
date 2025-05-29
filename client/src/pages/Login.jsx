import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" required />
      <button type="submit" className="w-full bg-green-500 text-white p-2">Login</button>
    </form>
  );
};

export default Login;
