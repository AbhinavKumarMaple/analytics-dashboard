import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import ChatMessage from "./ChatMessage";
import { generateContent } from "../../lib/geminiApi";
import "../../contexts/Chatbot.css";

interface Message {
  type: "user" | "ai";
  text: string;
  metadata?: {
    filterAction?: {
      type: "apply" | "clear";
      filters?: Record<string, string>;
      page?: number;
    };
  };
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
  const pathname = usePathname();
  // Initialize filters from URL parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const urlFilters: Record<string, string> = {};

    // Extract filter values from URL
    ["MPC", "Community", "City", "State", "Zipcode", "page"].forEach((key) => {
      const value = params.get(key);
      if (value) {
        urlFilters[key] = value.toLocaleLowerCase();
      }
    });

    // If there are filters in the URL, add an initial AI message explaining the current filters
    if (Object.keys(urlFilters).length > 0) {
      const filterDescriptions = Object.entries(urlFilters)
        .filter(([key]) => key !== "page")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      const pageInfo = urlFilters.page ? ` (Page ${urlFilters.page})` : "";

      if (!messages.some((msg) => msg.type === "ai")) {
        setMessages([
          {
            type: "ai",
            text: `Currently showing properties with ${filterDescriptions}${pageInfo}`,
            metadata: {
              filterAction: {
                type: "apply",
                filters: urlFilters,
                page: urlFilters.page ? parseInt(urlFilters.page) : undefined,
              },
            },
          },
        ]);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseFilterAction = (text: string) => {
    // Remove the metadata from the visible message
    const cleanMessage = text.replace(/\[FILTER_ACTION:[^\]]+\]/, "").trim();
    const filterActionRegex = /\[FILTER_ACTION:(apply|clear)(\|({[^}]+}))?\]/;
    const match = text.match(filterActionRegex);

    if (match) {
      const [_, type, __, filterJson] = match;
      if (type === "clear") {
        return {
          isFilterCommand: true,
          metadata: {
            filterAction: { type: "clear" },
          },
          cleanMessage,
        };
      } else if (type === "apply" && filterJson) {
        try {
          const filters = JSON.parse(filterJson);
          return {
            isFilterCommand: true,
            metadata: {
              filterAction: {
                type: "apply",
                filters,
                page: filters.page ? parseInt(filters.page) : undefined,
              },
            },
            cleanMessage,
          };
        } catch (error) {
          console.error("Error parsing filter JSON:", error);
        }
      }
    }
    return { isFilterCommand: false, cleanMessage: text };
  };

  const handlePropertyFilter = (text: string) => {
    // Handle clear filters command
    if (text.toLowerCase().match(/clear filters|reset search|reset filters|clear search/i)) {
      return {
        isFilterCommand: true,
        metadata: {
          filterAction: {
            type: "clear",
          },
        },
      };
    }

    const pageMatch = text.match(/page\s*(\d+)/i);
    const queryParams = new URLSearchParams();
    let hasFilter = false;

    propertyFilters.forEach(({ key, regex }) => {
      const match = text.match(regex);
      if (match) {
        queryParams.set(key.toLowerCase(), match[1].trim());
        hasFilter = true;
      }
    });

    if (pageMatch) {
      queryParams.set("page", pageMatch[1]);
      hasFilter = true;
    }

    if (hasFilter) {
      const filters: Record<string, string> = {};
      propertyFilters.forEach(({ key, regex }) => {
        const match = text.match(regex);
        if (match) {
          filters[key] = match[1].trim();
        }
      });

      return {
        isFilterCommand: true,
        metadata: {
          filterAction: {
            type: "apply",
            filters,
            page: pageMatch ? parseInt(pageMatch[1]) : undefined,
          },
        },
      };
    }

    // Check if the message seems like a property search but doesn't match our format
    const searchTerms = [
      "property",
      "properties",
      "house",
      "houses",
      "home",
      "homes",
      "show",
      "find",
      "search",
      "filter",
    ];
    const isPropertySearch = searchTerms.some((term) => text.toLowerCase().includes(term));

    if (isPropertySearch) {
      const filterExamples = propertyFilters
        .map(({ key }) => `- Show properties in ${key.toLowerCase()}: [${key} name]`)
        .join("\n");

      throw new Error(
        "I understand you're looking for properties! To help you better, please use one of these formats:\n\n" +
          filterExamples +
          "\n\n" +
          "You can also:\n" +
          "- Combine multiple filters (e.g., 'Show properties in city: Atlanta and state: Georgia')\n" +
          "- Navigate pages (e.g., 'Take me to page 2')\n" +
          "- Clear all filters (e.g., 'Clear filters' or 'Reset search')"
      );
    }

    return {
      isFilterCommand: false,
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage = { type: "user" as const, text: inputMessage };
    const messagesWithUser = [...messages, newUserMessage];
    setMessages(messagesWithUser);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await generateContent(messagesWithUser, questionContext, userCodeContext);
      console.log(aiResponse);
      // Parse the AI response and extract filter action metadata
      const { isFilterCommand, metadata, cleanMessage } = parseFilterAction(aiResponse);

      // Apply filters if present
      if (isFilterCommand && metadata?.filterAction) {
        const { type, filters, page } = metadata.filterAction;
        console.log("filters", filters, page, type);
        if (type === "clear") {
          if (pathname === "/acquisition") {
            router.replace("/acquisition", { scroll: false });
          } else {
            router.push("/acquisition");
          }
        } else if (type === "apply") {
          const queryParams = new URLSearchParams(window.location.search);

          // Clear existing filter parameters
          ["MPC", "Community", "City", "State", "Zipcode", "page"].forEach((key) => {
            queryParams.delete(key.toLowerCase());
          });

          // Add new filter parameters
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              const formattedValue = typeof value === "string" ? value.toLowerCase() : value;
              queryParams.set(key, formattedValue);
            });
          }
          if (page) {
            queryParams.set("page", page.toString());
          }

          // Update URL with new parameters
          const newUrl = `/acquisition?${queryParams.toString()}`;
          if (pathname === "/acquisition") {
            router.replace(newUrl, { scroll: false });
          } else {
            router.push(newUrl);
          }
        }
      }

      // Use the clean message without metadata
      const responseMessage = cleanMessage;

      setMessages([...messagesWithUser, { type: "ai" as const, text: responseMessage, metadata }]);
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
