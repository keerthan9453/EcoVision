import React from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom'; 
import { FaTree } from "react-icons/fa"
import { LiaSolarPanelSolid } from "react-icons/lia";
import { TbMichelinStarGreen } from "react-icons/tb";
import { IoMdRainy } from "react-icons/io";
import '../styles/Style.css';

const Buttons = () => {
  return (
    <div className="buttons">
        <h1>Real Impact, Visualized</h1>
        <p>See exactly what your environmental choices mean in tangible terms</p>
        
        <div className="subtext2">
            
            <Link to="/trees" className="box-link">
                <div className="Box1 button-content">
                    <div className="icon1">
                        <FaTree size={35} color="#256d7dff" aria-label="Plant Trees Icon"  />
                    </div>
                    <h3>Plant Trees</h3>
                </div>
            </Link>
            <Link to="/solar" className="box-link">
                <div className="Box2 button-content">
                    <div className="icon2">
                        <LiaSolarPanelSolid size={35} color="#c7e2e8ff" aria-label="Solar Panels Icon" />
                    </div>
                    <h3>Solar Panels</h3>
                </div>
            </Link>
            
            <Link to="/greenspaces" className="box-link">
                <div className="Box3 button-content">
                    <div className="icon3">
                        <TbMichelinStarGreen size={35} color="#3552a7ff" aria-label="Green Spaces Icon"  />
                    </div>
                    <h3>Green Spaces</h3>
                </div>
            </Link>
            
            {/* BUTTON 4: Rain Gardens - Links to /raingardens page */}
            <Link to="/raingardens" className="box-link">
                <div className="Box4 button-content"> 
                    <div className="icon4"> 
                        <IoMdRainy size={35} color="#1f2f60ff" aria-label="Rain Gardens Icons" />
                    </div>
                    <h3>Rain Gardens</h3>
                </div>
            </Link>

        </div>
    </div>
  );
};

export default Buttons;