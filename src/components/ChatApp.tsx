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
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: "Hi — I’m Nexus. Ask me anything." },
    { id: "2", role: "user", text: "Thanks! How can I help you today?" },
  ]);

  const send = (text: string) => {
    const userMsg: Message = { id: String(Date.now()), role: "user", text };
    setMessages((s) => [...s, userMsg]);

    // Mock assistant response
    setTimeout(() => {
      const reply: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: `You said: "${text}" — here's a short helpful reply.`,
      };
      setMessages((s) => [...s, reply]);
    }, 700);
  };

  return (
    <ChatWindow>
      <div className="flex h-full flex-col">
        <MessageList messages={messages} />
        <MessageInput onSend={send} />
      </div>
    </ChatWindow>
  );
}
