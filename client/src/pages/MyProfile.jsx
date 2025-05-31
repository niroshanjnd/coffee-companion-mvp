import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/verification/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVerificationStatus(res.data.status || 'Not uploaded');
      } catch (err) {
        console.error('Status fetch error:', err);
      }
    };

    if (token) {
      fetchCurrentUser();
      fetchStatus();
    }
  }, [token]);

  const handleLoadLocalUsers = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5050/api/users/location/${user.suburb}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocalUsers(res.data);
    } catch (err) {
      console.error('Error loading users by location:', err);
    }
  };

  const handleLoadCoffeeShops = () => {
    if (!user) return;
    const dummyShops = [
      { name: 'The Daily Grind', address: `${user.suburb} Central` },
      { name: 'Brew Haven', address: `${user.suburb} Plaza` },
      { name: 'Espresso Corner', address: `${user.suburb} Mall` }
    ];
    setCoffeeShops(dummyShops);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await axios.post('http://localhost:5050/api/verification/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Document uploaded!');
      // Re-fetch status
      const statusRes = await axios.get('http://localhost:5050/api/verification/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerificationStatus(statusRes.data.status);
      setShowVerificationForm(false);
    } catch (err) {
      console.error('Upload error', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#fefaf6] px-4 py-10 text-[#0a2342]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}</h2>
        <p className="text-gray-700 mb-2">Suburb: {user.suburb}</p>
        <p className="mb-4">Verification Status: <strong>{verificationStatus}</strong></p>

        <div className="space-y-4 mb-6">
          <button onClick={handleLoadCoffeeShops} className="w-full bg-orange-500 text-white py-3 rounded">
            Find Nearby Coffee Shops
          </button>
          <button onClick={handleLoadLocalUsers} className="w-full bg-purple-600 text-white py-3 rounded">
            Find People in My Suburb
          </button>
          <button
            onClick={() => setShowVerificationForm(!showVerificationForm)}
            className="w-full border border-[#0a2342] text-[#0a2342] py-3 rounded"
          >
            {showVerificationForm ? 'Hide Verification Form' : 'Verify Yourself'}
          </button>
          <button onClick={handleLogout} className="w-full border border-gray-400 text-gray-600 py-3 rounded">
            Logout
          </button>
        </div>

        {showVerificationForm && (
          <form onSubmit={handleUpload} className="mb-10" encType="multipart/form-data">
            <label className="block mb-2 font-medium">Upload Verification Document:</label>
            <input type="file" name="document" className="mb-4 block border p-2 rounded w-full" required />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
              Submit
            </button>
          </form>
        )}

        {coffeeShops.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Coffee Shops</h3>
            <ul className="space-y-2">
              {coffeeShops.map((shop, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <strong>{shop.name}</strong><br />
                  {shop.address}
                </li>
              ))}
            </ul>
          </div>
        )}

        {localUsers.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">People Near You</h3>
            <ul className="space-y-2">
              {localUsers.map(user => (
                <li key={user.id} className="border p-2 rounded">
                  <strong>{user.name}</strong><br />
                  {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
