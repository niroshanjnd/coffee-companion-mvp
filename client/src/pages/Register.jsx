import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [suburbs, setSuburbs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    suburb: '',
  });

  useEffect(() => {
  const fetchSuburbs = async () => {
    try {
      const res = await axios.get('https://queensland.opendatasoft.com/api/records/1.0/search/?dataset=queensland-suburbs&rows=1000');
      const records = res.data.records;
      const uniqueSuburbs = Array.from(new Set(records.map(r => r.fields.suburb.trim()))).sort();
      setSuburbs(uniqueSuburbs);
    } catch (err) {
      console.error('Error loading suburbs:', err);
    }
  };

  fetchSuburbs();
}, []);

  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/auth/register', formData);
      setFormData({ name: '', email: '', password: '', suburb: '' });
      setError('');
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
      setShowPopup(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      {showPopup && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 rounded shadow-lg z-10">
          ✅ Registration successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-12">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />

        <select
          name="suburb"
          value={formData.suburb}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        >
          <option value="">Select a suburb</option>
          {suburbs.map((suburb, idx) => (
            <option key={idx} value={suburb}>
              {suburb}
            </option>
          ))}
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Register
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Register;
