import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';
import { BiChat } from 'react-icons/bi'; 

// 🔧 Make sure backend is running on port 8000
const CHAT_API_ENDPOINT = 'http://localhost:8000/process'; 

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am EcoBot. Ask me about sustainability and environmental data analysis.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault(); 
        const userMessage = input.trim();
        if (!userMessage || isLoading) return;

        const newMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newMessage]);
        setInput(''); 
        setIsLoading(true);

        try {
            // ✅ Send message as JSON
            const response = await fetch(CHAT_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (response.ok && data.gemini_output) {
                const botResponse = { 
                    sender: 'bot', 
                    text: data.gemini_output 
                };
                setMessages(prev => [...prev, botResponse]);
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${data.detail || 'No valid reply received.'}` }]);
            }
        } catch (error) {
            console.error("API Fetch Error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, the server connection failed." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-widget-container">
            <button 
                className="chatbot-fab-button" 
                onClick={toggleChat}
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
            >
                <BiChat size={30} /> 
            </button>
            
            {isOpen && (
                <div className="chatbot-popup-window">
                    <div className="popup-header">
                        EcoBot Assistant
                        <button className="close-button" onClick={toggleChat}>
                            &times;
                        </button>
                    </div>
                    
                    <div className="popup-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-row ${msg.sender}`}>
                                <div className={`message-bubble ${msg.sender}-bubble`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-row bot">
                                <div className="message-bubble bot-bubble">...typing</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <form className="popup-footer" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Wait' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
