import '../styles/Style.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <Link to="/" className="logo">
        Eco Vision
      </Link>

      {/* Hamburger Icon */}
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar / Mobile Drawer */}
      <nav className={`sidebar ${menuOpen ? 'show' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <a
          href="#footer"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            const footer = document.getElementById('footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
          }}
        >
          Contact
        </a>

        {user ? (
          <>
            <span className="username">Hi, {user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="login-btn">Log In / Sign Up</button>
          </Link>
        )}
      </nav>

      {/* Desktop Menu */}
      <nav className="desktop-menu">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <a
          href="#footer"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            const footer = document.getElementById('footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Contact
        </a>

        {user ? (
          <>
            <span className="username">Hi, {user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-btn">Log In / Sign Up</button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
