import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import { generateContent } from "../../lib/geminiApi";
import "../../contexts/Chatbot.css";

interface Message {
  type: "user" | "ai";
  text: string;
}

interface ChatbotWindowProps {
  onClose: () => void;
  questionContext?: string;
  userCodeContext?: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatbotWindow = ({
  onClose,
  questionContext,
  userCodeContext,
  messages,
  setMessages,
}: ChatbotWindowProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePropertyFilter = (text: string) => {
    const communityMatch = text.match(/community:\s*([\w\s]+)/i);
    const cityMatch = text.match(/city:\s*([\w\s]+)/i);

    if (communityMatch || cityMatch) {
      const community = communityMatch ? communityMatch[1].trim() : "";
      const city = cityMatch ? cityMatch[1].trim() : "";

      const queryParams = new URLSearchParams();
      if (community) queryParams.set("community", community);
      if (city) queryParams.set("city", city);

      router.push(`/acquisition?${queryParams.toString()}`);
      return true;
    }
    return false;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage = { type: "user" as const, text: inputMessage };
    const messagesWithUser = [...messages, newUserMessage];
    setMessages(messagesWithUser);
    setInputMessage("");
    setIsLoading(true);

    // Check if the message contains property filter commands
    const isFilterCommand = handlePropertyFilter(inputMessage);

    try {
      const aiResponse = await generateContent(messagesWithUser, questionContext, userCodeContext);

      let responseMessage = aiResponse;
      if (isFilterCommand) {
        responseMessage +=
          "\n\nI've updated the property filters based on your request. The page will refresh with the new filters applied.";
      }

      setMessages([...messagesWithUser, { type: "ai" as const, text: responseMessage }]);
    } catch (error) {
      setMessages([
        ...messagesWithUser,
        {
          type: "ai" as const,
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <h3>AI Assistant</h3>
        <button onClick={onClose} className="close-button">
          X
        </button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} type={msg.type} text={msg.text} />
        ))}
        {isLoading && <div className="loading-indicator">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            height: "40px",
            overflowY: "auto",
            width: "calc(100% + 10px)",
          }}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotWindow;
