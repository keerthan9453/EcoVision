// client/src/components/Header.jsx

import React from 'react';
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


const Header = () => {
    return (
        <header style={headerStyle}>
            {/* Applied new h1Style here */}
            <h1 style={h1Style}>Eco Vision</h1>

            <nav>
                <a href="/" style={navLinkStyle}>Home</a>
                <a href="/about" style={navLinkStyle}>About</a>
                <a href="/contact" style={navLinkStyle}>Contact</a>
            </nav>
        </header>
    );
};

export default Header;