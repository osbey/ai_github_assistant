"use client";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { CommitGraph } from "./components/CommitGraph";
import { ChatPanel } from "./components/ChatPanel";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-(--border)">
        <span className="font-mono text-sm text-(--text)">repo-assistant</span>

        <div className="flex items-center gap-3">
          {/* <span className="hidden sm:inline text-sm text-(--text-muted)">
            Osbey
          </span> */}
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm text-(--text-muted) hover:text-(--text) transition-colors"
          >
            Sign out
          </button>
        </div>

        <button
          type="button"
          onClick={() => signIn("github")}
          className="text-sm bg-(--surface-raised) border border-(--border) rounded-lg px-4 py-2
              hover:border-(--accent-ai) transition-colors"
        >
          Sign in with GitHub
        </button>
      </nav>

      <main className="grid sm:grid-cols-2 min-h-[calc(100vh-73px)]">
        <div className="flex flex-col justify-center px-6 sm:px-10 py-16 sm:py-0">
          <p className="font-mono text-sm text-(--accent-git) mb-4">
            $ connect-your-repo
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-semibold leading-[1.1] text-(--text) mb-6">
            Ask your repo
            <br />
            what&#39;s going on.
          </h1>
          <p className="text-(--text-muted) text-base sm:text-lg max-w-md mb-8">
            Open issues, PR status, commit history, in plain English. No
            dashboard hopping.
          </p>

          {/* <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="w-fit bg-(--accent-ai) text-white rounded-lg px-6 py-3 text-sm font-medium
                hover:bg-(--accent-ai)/90 transition-colors"
            >
              Open assistant
            </button> */}

          <button
            type="button"
            onClick={() => signIn("github")}
            className="w-fit bg-(--accent-ai) text-white rounded-lg px-6 py-3 text-sm font-medium
                hover:bg-(--accent-ai)/90 transition-colors"
          >
            Connect GitHub to start
          </button>
        </div>

        <div className="hidden sm:block relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-80">
            <div className="w-72 h-96">
              <CommitGraph />
            </div>
          </div>
        </div>
      </main>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
