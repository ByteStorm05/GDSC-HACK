import React, { useState } from "react";

const ChatBotUi = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: true, text: input }]);
    processResponse(input);
    setInput("");
  };

  const processResponse = (text) => {
    // Handle response logic or ask the next question.
    const response = getBotResponse(text);
    setMessages((prev) => [...prev, { user: false, text: response }]);
  };

  const getBotResponse = (text) => {
    // Mock response logic (replace with dynamic handling).
    if (text.toLowerCase().includes("wifi")) return "Do you need free WiFi?";
    return "What other amenities do you prefer?";
  };

  const handleDone = () => {
    const selectedAmenities = ["Free WiFi", "Swimming Pool"]; // Example array.
    onComplete(selectedAmenities); // Pass the amenities array back to parent.
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "16px", maxWidth: "400px" }}>
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.user ? "right" : "left" }}>
            <p style={{ background: msg.user ? "#e6f7ff" : "#f0f0f0", padding: "8px", borderRadius: "4px" }}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "calc(100% - 50px)", marginRight: "8px" }}
      />
      <button onClick={handleSendMessage}>Send</button>
      <button onClick={handleDone} style={{ marginLeft: "8px", background: "green", color: "white" }}>
        Done
      </button>
    </div>
  );
};

export default ChatBotUi;
