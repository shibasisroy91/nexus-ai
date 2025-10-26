"use client";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function ChatWindow({ children }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto flex h-[76vh] flex-col rounded-2xl bg-linear-to-tr from-white/60 to-zinc-50/70 p-1 shadow-2xl backdrop-blur-md">
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-secondary p-[0.5]"></div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Nexus AI</h3>
              <p className="text-xs text-zinc-500">
                AI assistant — responsive & helpful
              </p>
            </div>
          </div>
          <div className="text-xs text-zinc-500">Active</div>
        </header>

        <div className="flex-1 overflow-hidden">{children}</div>

        <footer className="border-t border-zinc-100 px-6 py-4">
          <p className="text-xs text-zinc-500">Nexus AI ©️ 2025</p>
        </footer>
      </div>
    </div>
  );
}
