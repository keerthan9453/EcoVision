// client/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode JWT
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token', err);
        setUser(null);
      }
    }
  }, [token]);
  if(token){
    const decoded = jwtDecode(token);
    console.log(decoded.username);
  }

  if (!token) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile">
      <h2>Username: {user.username}</h2>
      <p>Token expires in 1 hour from login</p>
    </div>
  );
};

export default Profile;
