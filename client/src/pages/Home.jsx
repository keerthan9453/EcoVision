// client/src/pages/Home.jsx

import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Mission from '../components/Mission';
import Insights from '../components/Insights';
import Buttons from '../components/Buttons';
import Footer from '../components/Footer'; // Keep this one

const Home = () => {
  return (
    // React fragments <> allow you to return multiple elements without an extra <div>
    <>
      <Header />
      {/* The banner immediately follows the header */}
      <Banner />
      <Mission />
      <Insights />
      <Buttons />
      <Footer />
    </>
  );
};

export default Home;