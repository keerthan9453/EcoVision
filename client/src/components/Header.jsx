<<<<<<< HEAD
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const headerStyle = {
  position: "relative",
  width: "100%",
  top: 0,
  zIndex: 1000,
  backgroundColor: "rgb(2, 88, 82)",
  color: "white",
  padding: "30px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  overflow: "hidden",
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  margin: "0 15px",
  fontSize: "20px",
};

const h1Style = {
  margin: 0,
  marginLeft: "40px",
  fontSize: "24px",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  fontSize: "16px",
  cursor: "pointer",
  marginLeft: "15px",
};

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <header style={headerStyle}>
      <h1 style={h1Style}>Eco Vision</h1>

      <nav style={{ display: "flex", alignItems: "center" }}>
        <a href="/" style={navLinkStyle}>
          Home
        </a>
        <a href="/about" style={navLinkStyle}>
          About
        </a>
        <a href="/contact" style={navLinkStyle}>
          Contact
        </a>

        {/* Auth0 Login/Logout */}
        {isAuthenticated ? (
          <>
            <span style={{ marginLeft: "20px" }}>Hi, {user.name}</span>
            <button
              style={buttonStyle}
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </button>
          </>
        ) : (
          <button style={buttonStyle} onClick={() => loginWithRedirect()}>
            Log In
          </button>
        )}
      </nav>
    </header>
  );
=======
// client/src/components/Header.jsx
import React from 'react';
import '../styles/Style.css';

const Header = () => {
    return (
        <header>
            {/* Applied new h1Style here */}
            <h1>Eco Vision</h1>

            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </nav>
        </header>
    );
>>>>>>> 6f4d38c0acdf3a3397e2dfad65571f87b0352cde
};

export default Header;
