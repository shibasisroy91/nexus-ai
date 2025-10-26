"use client";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = async (text: string) => {
    const userMsg: Message = { id: String(Date.now()), role: "user", text };
    setMessages((s) => [...s, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      // Log for debugging
      console.log("chat POST status:", res.status);

      let replyText = "";
      try {
        const data = await res.json();
        // API returns { "response": "message text" }
        if (data.response) {
          replyText = data.response;
        } else {
          console.warn("Unexpected response format:", data);
          replyText = "Sorry, I received an unexpected response format.";
        }
      } catch (err) {
        console.error("Failed to parse JSON response:", err);
        replyText = "Sorry, I received an invalid response.";
      }

      const reply: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: replyText,
      };
      setMessages((s) => [...s, reply]);
    } catch (err) {
      console.error("chat request failed", err);
      const errorMsg: Message = {
        id: String(Date.now() + 2),
        role: "assistant",
        text: `Error: ${String(err)}`,
      };
      setMessages((s) => [...s, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatWindow>
      <div className="flex h-full flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSend={send} disabled={isLoading} />
      </div>
    </ChatWindow>
  );
}
