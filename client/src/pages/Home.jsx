import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Mission from '../components/Mission';
import Insights from '../components/Insights';
import Buttons from '../components/Buttons';
import { useAuth0 } from "@auth0/auth0-react";

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
    </>
  );
};

export default Home;