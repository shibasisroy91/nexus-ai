"use client";
import React, { useEffect, useRef } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Props = {
  messages?: Message[];
};

export default function MessageList({ messages = [] }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  const rendered =
    messages.length > 0 ? (
      messages.map((m) => (
        <div
          key={m.id}
          className={`flex w-full ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs rounded-xl px-4 py-2 text-sm shadow-sm ${
              m.role === "user"
                ? "bg-primary text-zinc-900 shadow-md"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            }`}
          >
            {m.text}
          </div>
        </div>
      ))
    ) : (
      <>
        <div className="flex w-full justify-start">
          <div className="max-w-xs rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
            Hi — I’m Nexus. Ask me anything. This is a placeholder message
            bubble styled for an assistant reply.
          </div>
        </div>

        <div className="flex w-full justify-end">
          <div className="max-w-xs rounded-xl bg-primary text-white px-4 py-2 text-sm shadow-md">
            Thanks! How can I help you today?
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Messages are placeholders — interactive demo coming soon.
        </div>
      </>
    );

  return (
    <div ref={ref} className="h-full overflow-y-auto px-6 py-6">
      <div className="flex flex-col gap-4">{rendered}</div>
    </div>
  );
}
