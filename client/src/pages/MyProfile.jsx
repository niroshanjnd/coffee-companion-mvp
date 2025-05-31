import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // ✅ for preview

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
        navigate('/login');
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/verification/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVerificationStatus(res.data.status);
      } catch (err) {
        console.error('Status fetch error', err);
      }
    };

    fetchCurrentUser();
    fetchStatus();
  }, [token, navigate]);

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
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.get('http://localhost:5050/api/coffee-shops', {
          params: {
            suburb: user.suburb,
            lat: latitude,
            lng: longitude
          }
        });

        setCoffeeShops(res.data);
      } catch (err) {
        console.error('Error fetching coffee shops:', err);
        alert('Failed to fetch coffee shops.');
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Location access is required to find nearby coffee shops.");
    }
  );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      // TODO: Upload to backend
    }
  };

  const openCamera = () => {
    alert('Webcam feature not implemented yet.');
    // You can integrate react-webcam or use getUserMedia
  };
  
  if (!user) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#fefaf6] px-4 py-10 text-[#0a2342]">
      <div className="max-w-3xl mx-auto">

      {/* ✅ Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 border border-gray-300 mb-3 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">No Photo</span>
            )}
          </div>

          <div className="flex gap-2">
            <label className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded cursor-pointer">
              📁 Upload
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </label>
            <button
              onClick={openCamera}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
            >
              📸 Camera
            </button>
          </div>
        </div>

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
        {!user.is_verified && (
          <button
            onClick={() => setShowVerificationForm(!showVerificationForm)}
            className="w-full border border-[#0a2342] text-[#0a2342] py-3 rounded">
            {showVerificationForm ? 'Hide Verification Form' : 'Verify Yourself'}
          </button>
          )}
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
          {shop.address}<br />
          📍 {shop.distance} km away<br />
          🕒 {shop.openingHours?.[0] || 'Hours not available'}
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
