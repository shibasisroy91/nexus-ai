"use client";
import React, { useState } from "react";

type Props = {
  onSend?: (text: string) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3 px-6 py-4">
      <input
        aria-label="Type a message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-full border border-zinc-100 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-zinc-400 dark:border-zinc-800"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="rounded-full cursor-pointer bg-black px-4 py-2 text-sm font-medium text-white shadow-md hover:opacity-95"
      >
        Send
      </button>
    </form>
  );
}
