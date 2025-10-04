// client/src/components/Header.jsx
import React from 'react';
import '../styles/Style.css';

const Footer = () => {
    return (
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <span class="footer-logo-text">Eco Vision</span>
                    </div>
                    <p class="footer-tagline">Built with accessibility in mind. Climate Action for everyone.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="{{ url_for('home') }}">Home</a></li>
                        <li><a href="{{ url_for('login') }}">login</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <div class="contact-item">
                        <span>📧 eco.vision@outlook.com</span>
                    </div>
                    <div class="contact-item">
                        <span>📍Eco Vision</span>
                    </div>
                    <div class="social-links">
                        <a href="https://www.instagram.com/vision.eco/" target="_blank" class="social-link">
                        📱 Instagram
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Eco Vision - All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;