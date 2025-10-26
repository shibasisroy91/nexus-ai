"use client";
import React, { useState } from "react";

type Props = {
  onSend?: (text: string) => void;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled = false }: Props) {
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
        className={`flex-1 rounded-full border border-zinc-100 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-zinc-400 dark:border-zinc-800 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        placeholder="Type a message..."
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        aria-disabled={disabled}
        className={`flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-md transition-opacity disabled:opacity-60 disabled:cursor-not-allowed ${
          disabled ? "" : "hover:opacity-95"
        }`}
      >
        {disabled ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
}
