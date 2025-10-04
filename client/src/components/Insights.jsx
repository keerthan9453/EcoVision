import React from 'react';
import { CiLocationOn } from "react-icons/ci";
import { IoIosChatboxes } from "react-icons/io";
import { FaAccessibleIcon } from "react-icons/fa6";
import '../styles/Style.css';
const Insights = () => {
  return (
    <div className="insights">
        {/* Left Side: Text Content (Replicates <div class="text-overlay">) */}
        <h1>How It Works</h1>
        <div className="subtext1">
            <div className="box1">
                <div className="icon1">
                    <CiLocationOn size={35} color="#256d7dff" /> 
                </div>
                <h3>Interactive <em>What If </em>Scenarios</h3>
                <p>Click to plant trees, add solar panels, or create green spaces. Watch your community transform in real-time with measurable impact metrics.</p>
            </div>
            <div className="box2">
                <div className="icon2">
                    <IoIosChatboxes size={35} color="#c7e2e8ff"/>
                </div>
                <h3>AI Eco-Coach</h3>
                <p>Get personalized advice on reducing your carbon footprint. Ask anything from <em>What can I do in my apartment to make it eco-friendly?</em> to <em>How much am I saving by biking?</em></p>
            </div>
            <div className="box3">
                <div className="icon3">
                    <FaAccessibleIcon size={35} color="#3552a7ff"/>
                </div>
                <h3>Accessible by Design</h3>
                <p>High contrast mode, screen reader support, keyboard navigation, and dyslexia-friendly options. Climate action should be for everyone.</p>
            </div>
        </div>
    </div>
  );
};

export default Insights;