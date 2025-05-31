import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const suburbRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', suburb: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.onload = () => {
      if (window.AddressFinder) {
        const widget = new window.AddressFinder.Widget(suburbRef.current, 'LY9F6XD7MUTJ43GNRHEQ', 'AU');
        widget.on('result:select', (full, meta) => {
          setFormData(prev => ({ ...prev, suburb: meta.locality_name }));
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/auth/register', formData);
      setSuccess(true);
      setError('');
      setFormData({ name: '', email: '', password: '', suburb: '' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Registration failed');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] text-[#0a2342] px-4">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-3 rounded border border-gray-300" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-3 rounded border border-gray-300" required />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-3 rounded border border-gray-300" required />
        <input ref={suburbRef} placeholder="Suburb" className="w-full p-3 rounded border border-gray-300" required />
        <button type="submit" className="w-full bg-[#f97316] text-white py-3 rounded-md font-semibold">Register</button>
      </form>
      {success && <p className="text-green-600 mt-4">✅ Registered! Redirecting...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Register;