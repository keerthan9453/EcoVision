// client/src/components/Banner.jsx
import React from 'react';

const missionStyle = {
    position: 'relative',
    width: '80%',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f6f6fdff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
}
const textOverlayStyle = {
    TextAlign: 'center',
    zIndex: 1,
    fontSize: '24px',
    padding: '40px',
}
const h1Style = {
    fontSize: '36px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '10px',
    fontWeight: 'bold',
    padding: '10px 20px',
    color: 'rgba(5, 61, 57, 1)',
}
const pStyle = {
    fontSize: '18px',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
    color: 'rgba(62, 139, 142, 1)',
    margin: '0 20px',
    lineHeight: '1.6',
}

const Mission = () => {
  return (
    <div className="mission" style={missionStyle}>
      {/* Left Side: Text Content (Replicates <div class="text-overlay">) */}
      <div className="text-overlay" style={textOverlayStyle}>
        <h1 style={h1Style}>Our Mission</h1>
        <p style={pStyle}>EcoVision turns good intentions into guaranteed results. By accurately simulating ecological changes, we provide the clear data needed to validate every investment in green initiatives, ensuring every effort contributes maximum impact to CO₂ reduction and biodiversity.</p>
      </div>
    </div>
  );
};

export default Mission;