const API_KEY = "AIzaSyAVrFHH4_PkaUG4vp51EllPjeVRK1ddlBE"; // This should ideally be proxied through a backend for security
const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

const generateContent = async (messages, questionContext, userCodeContext) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  // Ensure messages is an array before mapping
  const history = Array.isArray(messages)
    ? messages.map((msg) => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
    : [];

  const SYSTEM_INSTRUCTION = `You are an AI assistant for a real estate dashboard. Your primary role is to help users find and filter properties, and navigate through the dashboard.

When users interact with you:
1. For property-related queries:
   - Recognize requests for filtering properties by MPC, Community, City, State, or Zipcode
   - Understand page navigation requests
   - Format filter commands as 'key: value' (e.g., 'city: Toronto')
   - Support multiple filters in a single query
   - Provide clear feedback about applied filters
   - Include hidden metadata in your response using the format:
     [FILTER_ACTION:apply|{"MPC":"value","City":"value","page":"2"}]
     [FILTER_ACTION:clear] (for clearing all filters)

2. For general questions about properties:
   - Help users understand available filter options
   - Guide users on how to combine multiple filters
   - Explain how to navigate between pages
   - Maintain context of the conversation

3. When handling unclear requests:
   - If a query seems property-related but doesn't match the format, explain the correct syntax
   - Provide examples of proper filter formats
   - Suggest relevant filter combinations

4. Response format:
   - Use clear, natural language
   - List applied filters explicitly
   - Confirm actions taken
   - Offer to help refine the search
   - Always include the appropriate [FILTER_ACTION] metadata for property-related actions

Examples of responses with metadata:
User: "Show properties in city: Toronto"
Response: I'll help you find properties in Toronto.
[FILTER_ACTION:apply|{"City":"Toronto"}]

User: "Find properties in MPC: Riverdale and state: Georgia"
Response: I'll search for properties in the Riverdale MPC within Georgia.
[FILTER_ACTION:apply|{"MPC":"Riverdale","State":"Georgia"}]

User: "Take me to page 2"
Response: Moving to page 2 of the property listings.
[FILTER_ACTION:apply|{"page":"2"}]

User: "Clear all filters"
Response: I'll clear all the current filters.
[FILTER_ACTION:clear]

Always maintain a helpful and professional tone, and ensure users understand how to effectively use the filtering system.`;

  // Add context to the initial message if available
  let initialContext = SYSTEM_INSTRUCTION + "\n\n"; // Prepend system instruction
  if (questionContext) {
    initialContext += `The current coding challenge question is: ${questionContext}\n\n`;
  }
  if (userCodeContext) {
    initialContext += `The user's current code is:\n\`\`\`\n${userCodeContext}\n\`\`\`\n\n`;
  }

  const lastUserMessage =
    history.length > 0 && history[history.length - 1].role === "user"
      ? history[history.length - 1].parts[0].text
      : "";

  const contentToSend = initialContext + lastUserMessage;

  const requestBody = {
    contents: [
      ...history.slice(0, -1), // All messages except the last user message
      {
        role: "user",
        parts: [{ text: contentToSend }],
      },
    ],
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No response from AI.";
    }
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return `Error: ${error.message}`;
  }
};

export { generateContent };
