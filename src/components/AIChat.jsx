import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
const chatEndRef = useRef(null);
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // ✅ GET TOKEN

      const res = await axios.post(
        "https://api-0ggv.onrender.com/api/ai",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ SEND TOKEN
          },
        }
      );

      const botMessage = {
        role: "assistant",
        content: formatResponse(res.data),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

const formatResponse = (data) => {
  if (!data) return "No response";

  console.log("Raw AI response:", data);

  // ✅ Task list
  if (Array.isArray(data)) {
    return data
      .map(
        (t) =>
          `• ${t.task_title} (${t.priority || "medium"})`
      )
      .join("\n");
  }

  // ✅ Single task response
  if (data.task) {
    return `✅ Task Created: ${data.task.task_title}`;
  }

  // ✅ Generic message
  if (data.message) return data.message;

  return JSON.stringify(data, null, 2);
};

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h3>AI CRM Assistant</h3>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 10,
                background: msg.role === "user" ? "#007bff" : "#eee",
                color: msg.role === "user" ? "#fff" : "#000",
                whiteSpace: "pre-line" 
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}

        {loading && <p>AI is thinking...</p>}
         <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          placeholder="Type your command..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;