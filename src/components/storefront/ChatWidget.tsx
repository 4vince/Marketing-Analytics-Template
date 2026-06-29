"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`anon-${Date.now()}`);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          conversationId: conversationId.current,
          message: userMsg,
          catalog: [],
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", content: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I'm having trouble responding right now." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl w-80 h-96 flex flex-col mb-2">
          <div className="bg-primary-500 text-white px-4 py-3 rounded-t-lg font-semibold">
            Chickenoodle Assistant
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <span className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.role === "user" ? "bg-primary-500 text-white" : "bg-[#2a2a2a] text-[#e0e0e0]"
                }`}>{msg.content}</span>
              </div>
            ))}
            {loading && <div className="text-[#888] text-sm">Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-[#333] p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 bg-[#2a2a2a] text-[#e0e0e0] border border-[#444] rounded px-2 py-1 text-sm placeholder-[#666]"
            />
            <button onClick={sendMessage} disabled={loading}
              className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-primary-600 transition-colors"
      >
        {open ? "×" : <span className="text-lg">Chat</span>}
      </button>
    </div>
  );
}
