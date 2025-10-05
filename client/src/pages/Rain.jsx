import React from 'react';
import PageLayout from '../components/PageLayout'; // ✅ make sure this path is correct
import '../styles/Style.css';

const RainGardens = () => {
  return (
    // ✅ Passes title; map + sidebar handled by PageLayout
    <PageLayout pageTitle="Rain Gardens">
      {/* ✅ Content below map */}
      <section>
        <h2>Project Overview</h2>
        <p>
          This section contains additional information about the Rain Gardens
          initiative that appears below the main map visualization.
        </p>
      </section>
    </PageLayout>
  );
};

export default RainGardens;
