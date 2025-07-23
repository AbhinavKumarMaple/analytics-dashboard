import React from "react";
import "../../contexts/Chatbot.css";
import { BotIcon } from "lucide-react";

const ChatbotButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="chatbot-button" onClick={onClick}>
      {/* <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M8 16C8 16 9 15 12 15C15 15 16 16 16 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 8H7.01"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 8H17.01"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg> */}
      {/* bot-message-square */}
      <BotIcon className="scale-150 text-black dark:text-white" />
    </button>
  );
};

export default ChatbotButton;
