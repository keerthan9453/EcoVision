import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '50px',
  backgroundColor: '#f9f9f9',
  minHeight: '80vh',
};

const formStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'rgb(2, 88, 82)', // Dark green color
  color: 'white',
};

const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#eee',
    color: 'rgb(2, 88, 82)',
    border: '1px solid rgb(2, 88, 82)'
};

const Login = ({ setUser }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8090/login', {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Decode and update central user state
      const decoded = jwtDecode(token);
      setUser(decoded); 

      // Redirect user to home page
      navigate('/'); 
    } catch (err) {
      // Custom modal or message box UI should replace this in production
      console.error('Login failed:', err.response?.data?.message || 'Invalid credentials');
      alert('Login failed: Invalid credentials or server error.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8090/signup', {
        username,
        password,
      });
      // Redirect to login view after successful signup
      setIsLoginView(true);
      // Optional: alert user success
      console.log('Signup successful! Please log in.');
      alert('Signup successful! Please log in.');
    } catch (err) {
      console.error('Signup failed:', err.response?.data?.message || 'Signup failed');
      alert(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: 'rgb(2, 88, 82)', marginBottom: '30px' }}>
        {isLoginView ? 'Welcome Back' : 'Create an Account'}
      </h2>
      
      <form style={formStyle} onSubmit={isLoginView ? handleLogin : handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={primaryButtonStyle}>
          {isLoginView ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      
      <button
        style={{ ...secondaryButtonStyle, marginTop: '20px', width: '100%', maxWidth: '400px' }}
        onClick={() => setIsLoginView(!isLoginView)}
      >
        {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
      </button>

    </div>
  );
};

export default Login;