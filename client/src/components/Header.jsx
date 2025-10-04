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
};

export default Header;