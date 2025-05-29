import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching current user', err);
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
      console.error('Error loading users by location', err);
    }
  };

  const handleLoadCoffeeShops = async () => {
    const dummyShops = [
      { name: 'The Daily Grind', address: `${user.suburb} Central` },
      { name: 'Brew Haven', address: `${user.suburb} Plaza` },
      { name: 'Espresso Corner', address: `${user.suburb} Mall` },
    ];
    setCoffeeShops(dummyShops);
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-600 mb-6">Suburb: {user.suburb}</p>

      <div className="space-x-4 mb-6">
        <button
          onClick={handleLoadCoffeeShops}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Find Nearby Coffee Shops
        </button>

        <button
          onClick={handleLoadLocalUsers}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Find People in My Suburb
        </button>
      </div>

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
  );
};

export default MyProfile;
