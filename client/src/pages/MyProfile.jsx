import React from 'react';

const MyProfile = () => {
  const user = { name: 'Alex Johnson', suburb: 'Fitzroy' };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] px-4 text-[#0a2342]">
      <h2 className="text-xl font-bold mb-2">Welcome,</h2>
      <h3 className="text-2xl font-bold mb-2">{user.name}</h3>
      <p className="text-gray-600 mb-6">{user.suburb}</p>
      <div className="space-y-4 w-full max-w-xs">
        <button className="w-full bg-[#f97316] text-white py-3 rounded-md">Find Nearby Coffee Shops</button>
        <button className="w-full bg-[#0a2342] text-white py-3 rounded-md">Find People in My Suburb</button>
        <button className="w-full border border-[#0a2342] text-[#0a2342] py-3 rounded-md">Verify Yourself</button>
        <button className="w-full border border-gray-400 text-gray-600 py-3 rounded-md">Logout</button>
      </div>
    </div>
  );
};

export default MyProfile;