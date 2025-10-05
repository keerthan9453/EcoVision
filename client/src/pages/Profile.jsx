<<<<<<< HEAD
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div className="profile">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
=======
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
>>>>>>> front-end
  );
};

export default Profile;
