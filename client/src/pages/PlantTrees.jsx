import React from 'react';
import PageLayout from '../components/PageLayout'; // Make sure this path is correct

const PlantTrees = () => {
  return (
    // We only pass the pageTitle here. The map and sidebar are handled by PageLayout.
    <PageLayout pageTitle="Plant Trees">
      {/* Any content you put here will appear *below* the map box */}
      <section>
        <h2>Project Overview</h2>
        <p>This section is for supplemental content about the Plant Trees initiative that appears below the main map visualization.</p>
      </section>
    </PageLayout>
  );
};

export default PlantTrees;