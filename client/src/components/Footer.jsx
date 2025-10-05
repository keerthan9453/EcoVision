import React from 'react';
import { Link } from 'react-router-dom'; // 👈 import Link for routing
import '../styles/Style.css';

const Footer = () => {
    return (
        <footer id="footer" className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <span className="footer-logo-text">Eco Vision</span>
                    </div>
                    <p className="footer-tagline">
                        Built with accessibility in mind. Climate Action for everyone.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li>
                            <Link to="/">Home</Link> {/* 👈 use Link for internal navigation */}
                        </li>
                        <li>
                            <Link to="/login">Login</Link> {/* 👈 update route paths as needed */}
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Info</h4>
                    <div className="contact-item">
                        <span>📧 eco.vision@outlook.com</span>
                    </div>
                    <div className="contact-item">
                        <span>📍Eco Vision</span>
                    </div>
                    <div className="social-links">
                        <a
                            href="https://www.instagram.com/vision.eco/"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="social-link"
                        >
                            📱 Instagram
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 Eco Vision - All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
