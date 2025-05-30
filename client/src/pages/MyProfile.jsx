import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLoadLocalUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/users/location/${user.suburb}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocalUsers(res.data);
    } catch (err) {
      console.error('Error loading users by location:', err);
    }
  };

  const handleLoadCoffeeShops = () => {
    if (!user?.suburb) return;

    const dummyShops = [
      { name: 'The Daily Grind', address: `${user.suburb} Central` },
      { name: 'Brew Haven', address: `${user.suburb} Plaza` },
      { name: 'Espresso Corner', address: `${user.suburb} Mall` },
    ];
    setCoffeeShops(dummyShops);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    // For MVP, log the values or send to backend via POST
    const formData = new FormData();
    formData.append('documentId', documentId);
    if (documentFile) formData.append('documentFile', documentFile);

    try {
      const res = await axios.post('http://localhost:5050/api/users/verify', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Verification submitted successfully!');
      setShowVerificationForm(false);
      setDocumentId('');
      setDocumentFile(null);
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Verification failed.');
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <div className="max-w-3xl w-full mt-10 px-4">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}</h2>
        <p className="text-gray-600 mb-6">Suburb: {user.suburb}</p>

        <div className="space-y-4 w-full max-w-xs">
          <button onClick={handleLoadCoffeeShops} className="w-full bg-[#f97316] text-white py-3 rounded-md">
            Find Nearby Coffee Shops
          </button>
          <button onClick={handleLoadLocalUsers} className="w-full bg-[#0a2342] text-white py-3 rounded-md">
            Find People in My Suburb
          </button>
          <button
            onClick={() => setShowVerificationForm(!showVerificationForm)}
            className="w-full border border-[#0a2342] text-[#0a2342] py-3 rounded-md"
          >
            Verify Yourself
          </button>
          <button onClick={handleLogout} className="w-full border border-gray-400 text-gray-600 py-3 rounded-md">
            Logout
          </button>
        </div>

        {/* ✅ Verification Form */}
        {showVerificationForm && (
          <form onSubmit={handleVerifySubmit} className="bg-white shadow-md mt-6 p-4 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">Enter ID Details</h3>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Document ID Number"
              required
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="file"
              onChange={(e) => setDocumentFile(e.target.files[0])}
              className="w-full mb-3"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
              Submit Verification
            </button>
          </form>
        )}

        {/* ✅ Coffee Shops */}
        {coffeeShops.length > 0 && (
          <div className="my-6">
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

        {/* ✅ Local Users */}
        {localUsers.length > 0 && (
          <div className="my-6">
            <h3 className="text-xl font-semibold mb-2">People Near You</h3>
            <ul className="space-y-2">
              {localUsers.map((user) => (
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
