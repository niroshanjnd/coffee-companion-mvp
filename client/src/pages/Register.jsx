import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    suburb: '',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSuburbs = async (input) => {
    if (!input || input.length < 3) return;
    try {
      const res = await axios.get('https://api.addressfinder.io/api/au/location/autocomplete', {
        params: {
          key: 'LY9F6XD7MUTJ43GNRHEQ', // replace this with your AddressFinder key
          q: input,
          state: 'QLD',
          type: 'locality',
        },
      });
      const suburbs = res.data.completions
      .filter(c => c.full_location.includes('QLD'))  // Optional: only show QLD suburbs
      .map(c => c.full_location);
      setSuggestions(suburbs);
    } catch (err) {
      console.error('Error fetching suburb suggestions:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'suburb') fetchSuburbs(value);
  };

  const handleSelectSuggestion = (suburb) => {
    setFormData(prev => ({ ...prev, suburb }));
    setSuggestions([]);
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
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border" required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border" required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border" required />

        <div className="relative">
          <input
            name="suburb"
            placeholder="Suburb"
            value={formData.suburb}
            onChange={handleChange}
            className="w-full p-2 border"
            required
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
              {suggestions.map((suburb, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectSuggestion(suburb)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suburb}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Register
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Register;
