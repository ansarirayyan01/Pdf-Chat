"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";

interface docs {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}

interface Imessage {
  role: "user" | "assistant";
  content?: string;
  document?: docs[];
}

const Chat: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Imessage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${message}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.message,
          document: data?.docs,
        },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-white">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Welcome to PDF Chat App</h1>
            <p className="mb-2 text-gray-300">Your intelligent assistant for PDF documents.</p>
            <p className="mb-2 text-gray-300">Ask any question, and I'll find the answer from your PDFs.</p>
            <p className="mb-4 text-gray-400">Start by typing your query below.</p>
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center text-white text-2xl">
              💬
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xl p-4 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-red-800 text-white ml-auto"
                  : "bg-gray-800 text-gray-100 mr-auto"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "assistant" && msg.document && msg.document.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.document.map((doc, i) => (
                    <div key={i} className="border-l-4 border-red-500 pl-3 bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-300 mb-1">
                        <strong>Source:</strong> {doc.metadata?.source || "Unknown"} |{" "}
                        <strong>Page:</strong> {doc.metadata?.loc?.pageNumber ?? "N/A"}
                      </p>
                      <p className="text-sm text-gray-100 whitespace-pre-wrap">{doc.pageContent}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 w-full bg-gray-900 p-4 border-t border-gray-800 flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border-red-700 bg-black text-white placeholder:text-gray-400"
          placeholder="Enter your query..."
          disabled={loading}
        />
        <Button
          onClick={handleSendChatMessage}
          disabled={!message.trim() || loading}
          className="bg-red-700 hover:bg-red-800 text-white"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default Chat;
