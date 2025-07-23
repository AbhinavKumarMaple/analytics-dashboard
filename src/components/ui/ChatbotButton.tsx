import React from "react";
import "../../contexts/Chatbot.css";

const ChatbotButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="chatbot-button" onClick={onClick}>
      AI Help
    </button>
  );
};

export default ChatbotButton;
