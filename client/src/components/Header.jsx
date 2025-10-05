import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
// Removed axios and all login/signup logic

const headerStyle = {
  position: 'relative',
  width: '100%',
  top: 0,
  zIndex: 1000,
  backgroundColor: 'rgb(2, 88, 82)',
  color: 'white',
  padding: '30px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  overflow: 'hidden',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 15px',
  fontSize: '20px',
};

const h1Style = {
  margin: 0,
  marginLeft: '40px',
  fontSize: '24px',
};

const buttonStyle = {
  backgroundColor: 'transparent',
  color: '#61dafb',
  border: '2px solid #61dafb',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '16px',
  cursor: 'pointer',
  marginLeft: '15px',
  transition: 'all 0.3s ease',
};

const hoverStyle = {
  backgroundColor: '#61dafb',
  color: 'rgb(2, 88, 82)',
};

// Component now accepts user and setUser as props
const Header = ({ user, setUser }) => { 
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear central user state
    setUser(null); 
  };

  return (
    <header style={headerStyle}>
      {/* Use Link or a tag for home navigation */}
      <Link to="/" style={{ ...h1Style, ...navLinkStyle }}>
        Eco Vision
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={navLinkStyle}>
          Home
        </Link>
        
        {/* Contact link remains */}
        <a
          href="#footer"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            const footer = document.getElementById('footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
          }}
          style={navLinkStyle}
        >
          Contact
        </a>

        {user ? (
          <>
            {/* Display username and Profile Link/Button */}
            <span style={{ marginLeft: '20px' }}>Hi, {user.username}</span>
            <Link to="/profile" style={navLinkStyle}>
                Profile
            </Link>
            
            <button
              style={{
                ...buttonStyle,
                ...(isHovering ? hoverStyle : {}),
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          /* Single Login button linking to the new page */
          <Link to="/login">
            <button
              style={{
                ...buttonStyle,
                ...(isHovering ? hoverStyle : {}),
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Log In / Sign Up
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;