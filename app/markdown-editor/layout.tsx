import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "Free online Markdown editor with live preview. Supports GitHub Flavored Markdown, code syntax highlighting, math equations. Auto-saves to browser.",
  keywords: ["markdown editor", "markdown preview", "online markdown", "github markdown", "md editor", "markdown writer", "live markdown preview"],
  openGraph: {
    title: "Free Markdown Editor with Live Preview | Random Utility Apps",
    description: "Edit Markdown with live preview, syntax highlighting, and math support. Auto-saves.",
  },
};

export default function MarkdownEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
