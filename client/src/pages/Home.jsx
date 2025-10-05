import React from 'react';
import Banner from '../components/Banner';
import Mission from '../components/Mission';
import Insights from '../components/Insights';
import Buttons from '../components/Buttons';

const Home = () => {
  return (
    // React fragments <> allow you to return multiple elements without an extra <div>
    <>
      {/* The banner immediately follows the header */}
      <Banner />
      <Mission />
      <Insights />
      <Buttons />
      
    </>
  );
};

export default Home;