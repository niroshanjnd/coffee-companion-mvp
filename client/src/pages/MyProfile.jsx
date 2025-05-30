import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);
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
    if (!user || !user.suburb) return;

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
          <button className="w-full border border-[#0a2342] text-[#0a2342] py-3 rounded-md">
            Verify Yourself
          </button>
          <button onClick={handleLogout} className="w-full border border-gray-400 text-gray-600 py-3 rounded-md">
            Logout
          </button>
        </div>

        {/* ✅ Coffee Shops List */}
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

        {/* ✅ Local Users List */}
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
