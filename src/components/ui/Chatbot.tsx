import React, { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";
import "../../contexts/Chatbot.css";

interface Message {
  type: "user" | "ai";
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      text: "Hello! I'm your AI assistant for the real estate dashboard. I can help you:\n\n1. Find and filter properties:\n- Show properties in community: 40' dream\n- Find properties in city: Acworth\n- Show properties in state: AL\n- Find properties in zipcode: 07436\n- Show properties in MPC: 3 roots\n\n2. Navigate pages:\n- Take me to page 2\n- Show page 3\n\n3. Combine multiple filters:\n- Show properties in city: Acworth and state: AL\n- Find MPC: 3 roots properties in zipcode: 07436\n\nI'm here to help you navigate and find properties in our database. Just ask naturally, and I'll apply the filters and take you to the right page!",
    },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container ">
      <ChatbotButton onClick={toggleChat} />
      {isOpen && (
        <ChatbotWindow onClose={toggleChat} messages={messages} setMessages={setMessages} />
      )}
    </div>
  );
};

export default Chatbot;
