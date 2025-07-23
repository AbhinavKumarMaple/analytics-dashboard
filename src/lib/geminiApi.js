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

  const SYSTEM_INSTRUCTION = `You are an AI assistant for a coding challenge platform. Your primary goal is to provide helpful hints and guidance to users who are stuck on a coding question.

When a user asks for help:
- Focus on providing conceptual hints, algorithmic approaches, or debugging strategies.
- Do NOT provide the full code solution or direct code snippets unless the user explicitly asks for "code", "solution", "implementation", or similar terms.
- If the user asks for code, provide concise and relevant snippets, explaining them clearly.
- Maintain a helpful and encouraging tone.
- Use markdown for formatting your responses, especially for code or structured information.`;

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
