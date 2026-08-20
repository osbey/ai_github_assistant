"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export function ChatPanel({
  open,
  onClose,
}: Readonly<{ open: boolean; onClose: () => void }>) {
  // const { data: session } = useSession();

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("");
  }

  if (!open) return null;

  return (
    <>
      {/* mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden animate-[fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:h-full sm:w-105 z-50
          bg-(--surface) border-l border-(--border) flex flex-col
          animate-[slide-in_0.3s_ease-out]"
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--accent-git) opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-(--accent-git)" />
            </span>
            <h2 className="font-mono text-sm text-(--text)">repo-assistant</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="text-(--text-muted) hover:text-(--text) transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
          <div ref={bottomRef} />
        </div>

        {/* input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-(--border) flex gap-2"
        >
          <input
            className="flex-1 bg-(--ink) border border-(--border) rounded-lg px-3 py-2 text-sm
              text-(--text) placeholder:text-(--text-muted)
              focus:outline-none focus:ring-2 focus:ring-(--accent-ai) focus:border-transparent transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              // session ? "Ask about issues, PRs, commits…" :
              "Sign in to start"
            }
          />
          <button
            type="submit"
            className="bg-(--accent-ai) text-white rounded-lg px-4 py-2 text-sm font-medium
              hover:bg-(--accent-ai)/90 disabled:opacity-40 disabled:hover:bg-(--accent-ai) transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
