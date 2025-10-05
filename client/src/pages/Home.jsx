// client/src/pages/Home.jsx

import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Mission from '../components/Mission';
import Insights from '../components/Insights';
import Buttons from '../components/Buttons';
import Footer from '../components/Footer'; // Keep this one
import AccessibilityMenu from '../components/AccessibilityMenu';
import ChatbotWidget from '../components/ChatbotWidget.jsx'

const Home = () => {
  return (
    <div id="main-content-area">
      {/* The banner immediately follows the header */}
      <Banner />
      <AccessibilityMenu />
      <Mission />
      <Insights />
      <Buttons />
      <ChatbotWidget />
      
    </div>
  );
};

export default Home;
