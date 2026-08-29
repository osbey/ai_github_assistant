/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool } from "ai";
import { z } from "zod";

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  ms = 5000,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export const tools = {
  get_open_issues: tool({
    description:
      "List open issues for a GitHub repo, optionally filtered by label.",
    inputSchema: z.object({
      repo: z.string().describe("e.g. 'vercel/next.js'"),
      label: z.string().optional().describe("Filter by label, e.g. 'bug'"),
    }),
    contextSchema: z.object({ accessToken: z.string() }),
    execute: async ({ repo, label }, { context: { accessToken } }) => {
      try {
        const url = new URL(`https://api.github.com/repos/${repo}/issues`);
        url.searchParams.set("state", "open");
        if (label) url.searchParams.set("labels", label);

        const res = await fetchWithTimeout(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 401)
          return "Auth failed — GitHub session expired, please sign in again.";
        if (res.status === 404)
          return `Repo ${repo} not found or not accessible.`;
        if (res.status === 429 || res.status === 403) {
          const remaining = res.headers.get("x-ratelimit-remaining");
          if (remaining === "0")
            return "GitHub rate limit hit. Try again shortly.";
          return `GitHub API error: ${res.status}`;
        }
        if (!res.ok) return `GitHub API error: ${res.status}`;

        const issues = await res.json();
        if (issues.length === 0)
          return "No open issues found matching that filter.";
        return issues
          .slice(0, 10)
          .map((i: any) => `#${i.number}: ${i.title}`)
          .join("\n");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError")
          return "GitHub API timed out.";
        console.error("get_open_issues failed:", err);
        return "get_open_issues failed to execute.";
      }
    },
  }),

  get_pr_status: tool({
    description:
      "Get a pull request's CI status, review state, and mergeability.",
    inputSchema: z.object({
      repo: z.string(),
      number: z.string(),
    }),
    contextSchema: z.object({ accessToken: z.string() }),
    execute: async ({ repo, number }, { context: { accessToken } }) => {
      try {
        const res = await fetchWithTimeout(
          `https://api.github.com/repos/${repo}/pulls/${number}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (res.status === 401) return "Auth failed — GitHub session expired.";
        if (res.status === 404) return `PR #${number} not found in ${repo}.`;
        if (!res.ok) return `GitHub API error: ${res.status}`;

        const pr = await res.json();
        return [
          `Title: ${pr.title}`,
          `State: ${pr.state}`,
          `Mergeable: ${pr.mergeable ?? "unknown (still computing)"}`,
          `Mergeable state: ${pr.mergeable_state}`,
        ].join("\n");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError")
          return "GitHub API timed out.";
        console.error("get_pr_status failed:", err);
        return "get_pr_status failed to execute.";
      }
    },
  }),

  search_commits: tool({
    description: "Search recent commit history in a GitHub repo by keyword.",
    inputSchema: z.object({
      repo: z.string(),
      query: z.string().describe("Keyword to search commit messages for"),
    }),
    contextSchema: z.object({ accessToken: z.string() }),
    execute: async ({ repo, query }, { context: { accessToken } }) => {
      try {
        const url = `https://api.github.com/search/commits?q=repo:${repo}+${encodeURIComponent(query)}`;
        const res = await fetchWithTimeout(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.cloak-preview+json",
          },
        });

        if (res.status === 401) return "Auth failed — session expired.";
        if (res.status === 422)
          return `Invalid search query or repo not found: ${repo}`;
        if (!res.ok) return `GitHub API error: ${res.status}`;

        const data = await res.json();
        if (data.items.length === 0) return "No matching commits found.";
        return data.items
          .slice(0, 5)
          .map(
            (c: any) =>
              `${c.sha.slice(0, 7)}: ${c.commit.message.split("\n")[0]}`,
          )
          .join("\n");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError")
          return "GitHub API timed out.";
        console.error("search_commits failed:", err);
        return "search_commits failed to execute.";
      }
    },
  }),

  create_issue: tool({
    description: "Create a new GitHub issue in a repo.",
    inputSchema: z.object({
      repo: z.string(),
      title: z.string(),
      body: z.string().optional(),
    }),
    contextSchema: z.object({ accessToken: z.string() }),
    execute: async ({ repo, title, body }, { context: { accessToken } }) => {
      try {
        const res = await fetchWithTimeout(
          `https://api.github.com/repos/${repo}/issues`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body }),
          },
        );

        if (res.status === 401) return "Auth failed — session expired.";
        if (res.status === 403)
          return "Not authorized to create issues in this repo.";
        if (res.status === 404) return `Repo ${repo} not found.`;
        if (!res.ok) return `GitHub API error: ${res.status}`;

        const issue = await res.json();
        return `Created issue #${issue.number}: ${issue.html_url}`;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError")
          return "GitHub API timed out.";
        console.error("create_issue failed:", err);
        return "create_issue failed to execute.";
      }
    },
  }),
};
