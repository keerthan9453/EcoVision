import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import Trees from './pages/PlantTrees'; 
import Solar from './pages/Solar';
import GreenSpaces from './pages/GreenSpaces';
import RainGardens from './pages/Rain';
import Footer from './components/Footer';
import Login from './pages/Login'; // <--- NEW IMPORT
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing JWT in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Set the full decoded object as the user state
        setUser(decoded); 
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <>
      {/* Header receives the central state control */}
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* NEW LOGIN ROUTE */}
        <Route path="/login" element={<Login setUser={setUser} />} /> 
        
        <Route path="/trees" element={<Trees />} />
        <Route path="/solar" element={<Solar />} />
        <Route path="/greenspaces" element={<GreenSpaces />} />
        {/* Profile receives the user object */}
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/raingardens" element={<RainGardens />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
