import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../contexts/Chatbot.css";

interface ChatMessageProps {
  type: "user" | "ai";
  text: string;
}

const ChatMessage = ({ type, text }: ChatMessageProps) => {
  const messageClass = type === "user" ? "user-message" : "ai-message";
  return (
    <div className={`chat-message ${messageClass}`}>
      {type === "ai" ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default ChatMessage;
