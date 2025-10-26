"use client";
import React, { useEffect, useRef } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Props = {
  messages?: Message[];
  isLoading?: boolean;
};

export default function MessageList({
  messages = [],
  isLoading = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, isLoading]);

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
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Send a message to start the conversation
      </div>
    );

  return (
    <div ref={ref} className="h-full overflow-y-auto px-6 py-6">
      <div className="flex flex-col gap-4">
        {rendered}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-xs rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
              <span className="italic text-zinc-500">Nexus is typing…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
