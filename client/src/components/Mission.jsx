// client/src/components/Banner.jsx
import React from 'react';
import '../styles/Style.css';
const Mission = () => {
  return (
    <div className="mission">
      {/* Left Side: Text Content (Replicates <div class="text-overlay">) */}
      <div className="text-overlay1">
        <h1>Our Mission</h1>
        <p>EcoVision turns good intentions into guaranteed results. By accurately simulating ecological changes, we provide the clear data needed to validate every investment in green initiatives, ensuring every effort contributes maximum impact to CO₂ reduction and biodiversity.</p>
      </div>
    </div>
  );
};

export default Mission;