import { auth } from "@/auth";
import { tools } from "@/lib/tools";
import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";

const INSTRUCTIONS = `
<role>You are a Github assistant with tools to check issues and PR status.</role>
<tool_use_policy>
- Use get_open_issues when asked about open issues, optionally with a label filter. 
- Use get_pr_status only when a specific repo AND PR number are given. 
- If a tool reports an error or expired session, tell the user plainly. 
- If a tool call is denied by the user, do no retry it - acknowledge the denial and stop.
</tool_use_policy>

`;

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return new Request("Unauthorized - please sign in with Github.");
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    tools: tools,
    stopWhen: isStepCount(5),
    toolsContext: {
      create_issue: { accessToken: session.accessToken },
      get_open_issues: { accessToken: session.accessToken },
      get_pr_status: { accessToken: session.accessToken },
      search_commits: { accessToken: session.accessToken },
    },
    toolApproval: {
      create_issue: "user-approval",
    },
    onError: ({ error }) => console.log("streaming error: ", error),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
