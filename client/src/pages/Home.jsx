import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Mission from '../components/Mission';
import Insights from '../components/Insights';
import Buttons from '../components/Buttons';
import Footer from '../components/Footer';
import AccessibilityMenu from '../components/AccessibilityMenu';
const Home = () => {
  return (
    <div id="main-content-area">
      <Header />
      {/* The banner immediately follows the header */}
      <Banner />
      <AccessibilityMenu />
      <Mission />
      <Insights />
      <Buttons />
      <Footer />
    </div>
  );
};

export default Home;