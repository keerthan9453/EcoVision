// client/src/components/Banner.jsx
import React from 'react';
import bannerImage from '../assets/IMG_3566.PNG';
import '../styles/Style.css';

const Banner = () => {
  return (
    <div className="banner">
      {/* Left Side: Text Content (Replicates <div class="text-overlay">) */}
      <div className="text-overlay">
        
        <h1>Eco Vision</h1>
        <div className="subtext">
            <p>Building a Sustainable Future</p>
            <p>See how small changes create real impact in your community</p>
        </div>
      </div>

      {/* Right Side: Image (Replicates <img src="..." alt="Logo" class="logo">) */}
      <img
        src={bannerImage} // Use the imported image variable
        alt="Eco Vision Town"
      />
    </div>
  );
};

export default Banner;