"use client";

import ReactMarkdown from "react-markdown";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-gray-100 prose-code:text-brand-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
