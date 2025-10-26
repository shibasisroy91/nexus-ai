"use client";
import React, { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { v4 as uuid4 } from "uuid";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const SESSION_ID_KEY = "nexus-ai-session-id";

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!storedSessionId) {
      storedSessionId = uuid4();
      localStorage.setItem(SESSION_ID_KEY, storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Fetch saved messages for the session when sessionId becomes available
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/chat?sessionId=${encodeURIComponent(sessionId)}`
        );
        if (!res.ok) {
          console.warn("Failed to load messages:", await res.text());
          return;
        }
        const data = await res.json();
        const loaded: Message[] = (data.messages ?? []).map((m: unknown) => {
          const mm = m as {
            id: unknown;
            role: "user" | "assistant";
            content: unknown;
          };
          return {
            id: String(mm.id),
            role: mm.role,
            text:
              typeof mm.content === "string"
                ? mm.content
                : String(mm.content ?? ""),
          };
        });
        if (!cancelled) setMessages(loaded);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const send = async (text: string) => {
    const userMsg: Message = { id: String(Date.now()), role: "user", text };
    setMessages((s) => [...s, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId }),
      });

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
        replyText =
          "😵 Sorry, I couldn't get a response. Please check your connection or try again later.";
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
