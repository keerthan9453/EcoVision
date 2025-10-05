import React, { useState } from 'react';

// Define the brand colors based on the desired green/white theme
const BRAND_GREEN = '#025852'; // Dark Teal/Green for accents, headers, buttons
const LIGHT_BACKGROUND = '#f0fff0'; // Very light pastel green for sidebar background
const MAP_BACKGROUND = '#f2fff2'; // Slightly lighter green for map placeholder

// Styles for the two-column layout
const layoutStyles = {
  display: 'flex',
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '0 20px',
  gap: '30px',
};

const mapAreaStyle = {
  flex: 3, // Takes 75% of the space
  paddingRight: '10px',
};

const sidebarStyle = {
  flex: 1, // Takes 25% of the space
  padding: '25px',
  backgroundColor: LIGHT_BACKGROUND, // Light green background for the sidebar
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: `1px solid ${BRAND_GREEN}30`, // Subtle green border
};

const mapPlaceholderStyle = {
  width: '100%',
  height: '600px', // Large box for the map
  backgroundColor: MAP_BACKGROUND, // Light green map background
  border: `2px dashed ${BRAND_GREEN}`, // Dark green dashed border
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  color: BRAND_GREEN, // Dark green text
  marginBottom: '20px',
};

const PageLayout = ({ pageTitle, children }) => {
  // State to hold the content shown in the sidebar when an item is clicked
  const [selectedItem, setSelectedItem] = useState(null); 

  // Function to simulate clicking a feature on the map
  const handleMapClick = (itemName, details) => {
    setSelectedItem({ name: itemName, ...details });
  };

  return (
    <div style={layoutStyles}>
      
      {/* 1. MAP AREA (Left Column) */}
      <div style={mapAreaStyle}>
        <h2 style={{ color: BRAND_GREEN }}>{pageTitle} Visualization</h2>
        
        {/* Map Placeholder Box */}
        <div style={mapPlaceholderStyle}>
          <span>MAP INTEGRATION AREA</span>
          <p style={{fontSize: '14px', margin: '5px 0'}}>Click the button below to simulate data interaction.</p>
          
          {/* Example interactive element (Simulated map pin click) */}
          <button 
            style={{ 
              padding: '10px 20px', 
              margin: '20px', 
              cursor: 'pointer',
              backgroundColor: BRAND_GREEN, // Use dark green for button
              color: 'white',
              border: 'none',
              borderRadius: '6px'
            }}
            onClick={() => handleMapClick('Oak Tree - Section C', { age: '5 years', co2: '100 kg/yr' })}
          >
            Simulate Plant Click
          </button>
        </div>

        {/* Additional content passed to PageLayout */}
        {children} 
      </div>
      
      {/* 2. SIDEBAR (Right Column) */}
      <div style={sidebarStyle}>
        <h3 style={{ color: BRAND_GREEN }}>Item Details</h3>
        
        {selectedItem ? (
          <div>
            <h4 style={{ color: BRAND_GREEN, marginTop: '15px' }}>{selectedItem.name}</h4>
            <p><strong>Age:</strong> {selectedItem.age}</p>
            <p><strong>CO2 Offset:</strong> {selectedItem.co2}</p>
            
            <p style={{marginTop: '25px', fontSize: '14px', color: '#555'}}>
                This dynamic section displays real-time data after clicking a mapped item.
            </p>
          </div>
        ) : (
          <p style={{marginTop: '15px', color: '#777'}}>Click a feature on the map to load its specific details here.</p>
        )}
        
        <hr style={{ margin: '20px 0' }}/>
        <h4>Quick Actions</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '8px' }}>
            <a href="/profile" style={{ color: BRAND_GREEN, textDecoration: 'none', fontWeight: 'bold' }}>View My Profile</a>
          </li>
          <li>
            <a href="/" style={{ color: BRAND_GREEN, textDecoration: 'none', fontWeight: 'bold' }}>Back to Home</a>
          </li>
        </ul>
      </div>
      
    </div>
  );
};

export default PageLayout;