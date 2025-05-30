import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
