import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const Register = () => {
  const suburbRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', suburb: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.onload = () => {
      if (window.AddressFinder) {
        const widget = new window.AddressFinder.Widget(
          suburbRef.current,
          'YOUR_API_KEY',
          'AU'
        );
        widget.on('result:select', (full, meta) => {
          setFormData(prev => ({ ...prev, suburb: meta.locality_name }));
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault(); // 🛑 Prevent page reload

    try {
      const response = await axios.post('http://localhost:5050/api/auth/register', formData);
      console.log('✅ Registration success:', response.data);
      setSuccess(true);
      setError('');
      setFormData({ name: '', email: '', password: '', suburb: '' });
    } catch (err) {
      console.error('❌ Registration failed:', err);
      setError('Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <h2 className="text-2xl font-bold mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" placeholder="Name" required />
        <input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" placeholder="Email" type="email" required />
        <input name="password" value={formData.password} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" placeholder="Password" type="password" required />
        <input ref={suburbRef} className="w-full p-3 rounded border border-gray-300" placeholder="Suburb" required />
        <button type="submit" className="w-full bg-[#f97316] text-white rounded-md py-3">Register</button>
      </form>

      {success && <p className="mt-4 text-green-600">✅ Registration successful!</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Register;
