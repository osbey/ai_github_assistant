import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownMessage({ text }: Readonly<{ text: string }>) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-(--accent-ai) prose-code:text-(--accent-git) prose-code:bg-(--surface) prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
