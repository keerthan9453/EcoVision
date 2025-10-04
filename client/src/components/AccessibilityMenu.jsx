// client/src/components/AccessibilityMenu.js

import React, { useState } from 'react';
import '../styles/AccessibilityMenu.css';
import { BiAccessibility } from "react-icons/bi";

const handleTextToVoice = () => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return; 
    }

    // Targets the new content ID
    const contentElement = document.getElementById('main-content-area') || document.body;
    let textToSpeak = contentElement.textContent || '';
    
    textToSpeak = textToSpeak.replace(/\s+/g, ' ').trim(); // Cleanup text

    if (textToSpeak.length > 0) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        // Set voice parameters
        utterance.lang = 'en-US'; 
        utterance.rate = 1; 

        window.speechSynthesis.speak(utterance);
    }
};

const toggleBodyClass = (className) => {
    document.body.classList.toggle(className);
};

const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (mode) => {
        setIsOpen(false);
        if (mode === 'high-contrast') {
            toggleBodyClass('high-contrast-mode');
        }
        else if (mode === 'larger-text') {
            toggleBodyClass('larger-text-mode');
        }
        else if (mode === 'text-to-speech') {
            handleTextToVoice();
        }
        else if (mode === 'reset') {
            document.body.classList.remove('high-contrast-mode', 'larger-text-mode', 'reduce-motion');
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        } 
        console.log(`Clicked mode: ${mode}`);
        // This is where the feature logic will go in the next step!
        setIsOpen(false); // Close the menu after selection
    };
    return (
        <div className="accessibility-wrapper">
            <button 
                className="accessibility-button" 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen} // Good for screen readers
                aria-label="Toggle Accessibility Menu"
            >
                <BiAccessibility size={24}/>
            </button>
            {isOpen && (
                <div className="accessibility-dropdown">
                    <button onClick={() => handleOptionClick('high-contrast')}>
                        High Contrast Mode
                    </button>
                    <button onClick={() => handleOptionClick('larger-text')}>
                        Larger Text
                    </button>
                    <button onClick={() => handleOptionClick('text-to-speech')}>
                        Text to Speech
                    </button>
                    <button onClick={() => handleOptionClick('reduce-motion')}>
                        Reduce Motion
                    </button>
                    <button onClick={() => handleOptionClick('reset')}>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccessibilityMenu;