"use client";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import InitialMessage from "./InitialMessage";
import LoadingDot from "./LoadingDot";
import { MarkdownMessage } from "./MarkdownMessage";

export function ChatPanel({
  open,
  onClose,
}: Readonly<{ open: boolean; onClose: () => void }>) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
          {messages.length === 0 && <InitialMessage />}

          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user" ? "flex-justify-end" : "flex justify-start"
              }
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-(--accent-ai) text-white"
                    : "bg-(--surface-raised) text-(--text) border border-(--border)"
                }`}
              >
                {m.parts.map((part) => {
                  if (part.type === "text") {
                    return m.role === "user" ? (
                      <span key={part.text}>{part.text}</span>
                    ) : (
                      <MarkdownMessage text={part.text} key={part.text} />
                    );
                  }

                  if (
                    part.type === "tool-create_issue" &&
                    part.state === "approval-requested"
                  ) {
                    const input = part.input as { repo: string; title: string };
                    return (
                      <div
                        key={part.approval.id}
                        className="mt-2 rounded-lg border border-(--border) overflow-hidden text-xs"
                      >
                        <div className="bg-(--ink) border-l-2 border-(--accent-git) px-3 py-2 font-mono">
                          <p className="text-(--text-muted)">create_issue</p>
                          <p className="text-(--text) mt-1">{input.repo}</p>
                          <p className="text-(--accent-git)">+ {input.title}</p>
                        </div>
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() =>
                              addToolApprovalResponse({
                                id: part.approval.id,
                                approved: true,
                              })
                            }
                            className="flex-1 py-2 bg-(--accent-git)/10 text-(--accent-git) hover:bg-(--accent-git)/20 transition-colors font-medium"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              addToolApprovalResponse({
                                id: part.approval.id,
                                approved: false,
                              })
                            }
                            className="flex-1 py-2 bg-(--accent-danger)/10 text-(--accent-danger) hover:bg-(--accent-danger)/20 transition-colors font-medium border-l border-(--border)"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}

          {isLoading && <LoadingDot />}
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
