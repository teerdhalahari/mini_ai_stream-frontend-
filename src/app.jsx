import React, { useState, useEffect, useRef } from "react";
import { FaCalculator, FaCloudSun, FaImage, FaDatabase, FaFile } from "react-icons/fa";

// Tool icons
const toolIcons = {
  Calculator: <FaCalculator />,
  Weather: <FaCloudSun />,
  Image: <FaImage />,
  Database: <FaDatabase />,
  File: <FaFile />,
};

// Mock weather data
const weatherData = {
  london: "Rainy 18°C",
  paris: "Sunny 20°C",
  delhi: "Hot 35°C",
  newyork: "Cloudy 22°C",
  tokyo: "Clear 25°C",
};

// Tool handler functions
const toolHandlers = {
  calculator: (input) => {
    try {
      const expr = input.toLowerCase().replace("calculate", "").trim();
      return eval(expr);
    } catch {
      return "Invalid calculation";
    }
  },
  weather: (input) => {
    const cityMatch = input.match(/in (\w+)/i);
    const city = cityMatch ? cityMatch[1].toLowerCase() : "";
    return weatherData[city] || "Weather unknown";
  },
  image: (input) => `Generated image for "${input}"`,
  database: (input) => `Query result for "${input}"`,
  file: (input) => `File content for "${input}"`,
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const containerRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input;
    setMessages(prev => [...prev, { type: "user", content: userInput }]);
    setInput("");
    simulateAIResponse(userInput);
  };

  const simulateAIResponse = (msg) => {
    setTyping(true);

    // Simulate streaming AI typing
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "ai", content: `AI Response: ${msg}` }]);
      setTyping(false);

      // Trigger relevant tool if input contains keyword
      if (msg.toLowerCase().includes("calculate")) simulateToolCall("calculator", msg);
      else if (msg.toLowerCase().includes("weather")) simulateToolCall("weather", msg);
      else if (msg.toLowerCase().includes("image")) simulateToolCall("image", msg);
      else if (msg.toLowerCase().includes("database")) simulateToolCall("database", msg);
      else if (msg.toLowerCase().includes("file")) simulateToolCall("file", msg);
    }, 1000);
  };

  // Add tool result message
  const simulateToolCall = (toolKey, msg) => {
    const result = toolHandlers[toolKey](msg);
    const tool = { name: toolKey.charAt(0).toUpperCase() + toolKey.slice(1), result, status: "completed" };
    setMessages(prev => [...prev, { type: "tool", tool }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div id="chat-container" ref={containerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={
            msg.type === "user" ? "message user" :
            msg.type === "ai" ? "message ai" :
            `message tool ${msg.tool.status}`
          }>
            {msg.type === "tool" ? (
              <>
                {toolIcons[msg.tool.name]} <strong>{msg.tool.name}:</strong> <span className="result">{msg.tool.result}</span>
              </>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {typing && (
          <div className="typing">
            AI is typing
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
      </div>

      <div id="input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
