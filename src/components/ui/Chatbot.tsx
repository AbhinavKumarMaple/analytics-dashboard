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
      text: "Hello! I'm your AI assistant. I can help you find properties by filtering them based on community or city. Try asking something like:\n\n- Show properties in community: Downtown\n- Find properties in city: Toronto\n\nOr ask me anything else about the properties!",
    },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <ChatbotButton onClick={toggleChat} />
      {isOpen && (
        <ChatbotWindow onClose={toggleChat} messages={messages} setMessages={setMessages} />
      )}
    </div>
  );
};

export default Chatbot;
