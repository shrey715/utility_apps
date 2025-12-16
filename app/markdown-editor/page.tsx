"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Bold, Italic, List, Link, Code, Image as ImageIcon, Heading, Eye, EyeOff, Upload } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const defaultContent = `# Welcome to the Markdown Editor

This is a **real-time** markdown editor with _live preview_.

## Features
- GitHub Flavored Markdown
- Math equations with KaTeX
- Syntax highlighted code blocks

### Code Example
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Math Example
Inline: $E = mc^2$

Block:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

---

Start editing on the left to see changes here!
`;

const ToolbarButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    title={label}
    className="p-2 rounded-lg hover:bg-[#333] text-[#888] hover:text-white transition-colors"
  >
    <Icon className="w-4 h-4" />
  </button>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeBlock = (props: any) => {
  const { children, className, ...rest } = props;
  if (!children) return <code {...rest} className={className} />;
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      language={match[1]}
      style={oneDark}
      customStyle={{ margin: 0, borderRadius: "0.75rem", fontSize: "0.875rem" }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code
      {...rest}
      className={cn("px-1.5 py-0.5 rounded bg-[#333] text-[#ff6b9d] text-sm font-mono", className)}
    >
      {children}
    </code>
  );
};

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(defaultContent);
  const [showPreview, setShowPreview] = useState(true);
  const [fileName, setFileName] = useState("document");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value);

  const insertText = (before: string, after = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    setMarkdown(markdown.substring(0, start) + before + selected + after + markdown.substring(end));
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName || "document"}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdown(content);
        setFileName(file.name.replace(/\.md$/, ""));
      };
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  return (
    <PageWrapper title="Markdown" showBack>
      <div className="flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-3 rounded-xl bg-[#1e1e1e] border-2 border-[#333] flex-shrink-0">
          {/* Formatting buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <ToolbarButton icon={Bold} label="Bold" onClick={() => insertText("**", "**")} />
            <ToolbarButton icon={Italic} label="Italic" onClick={() => insertText("_", "_")} />
            <ToolbarButton icon={Heading} label="Heading" onClick={() => insertText("## ")} />
            <ToolbarButton icon={List} label="List" onClick={() => insertText("- ")} />
            <ToolbarButton icon={Link} label="Link" onClick={() => insertText("[", "](url)")} />
            <ToolbarButton icon={Code} label="Code" onClick={() => insertText("`", "`")} />
            <ToolbarButton icon={ImageIcon} label="Image" onClick={() => insertText("![alt](", ")")} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* File name input */}
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="filename"
              className="w-24 sm:w-32 px-2 py-1 rounded-lg bg-[#252525] border border-[#444] text-white text-sm focus:outline-none focus:border-[#ff6b9d]"
            />
            
            {/* Upload button */}
            <label className="cursor-pointer">
              <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
              <div className="p-2 rounded-lg bg-[#252525] border-2 border-[#444] text-white hover:border-[#555] transition-colors">
                <Upload className="w-4 h-4" />
              </div>
            </label>

            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                showPreview
                  ? "bg-[#ff6b9d] text-white shadow-[0_3px_0_#cc567e]"
                  : "bg-[#252525] border-2 border-[#444] text-white hover:border-[#555]"
              )}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"}</span>
            </button>
            
            {/* Download button */}
            <Button color="pink" size="sm" onClick={downloadMarkdown}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">.md</span>
            </Button>
          </div>
        </div>

        {/* Editor & Preview */}
        <div className={cn(
          "flex-1 grid gap-4 min-h-0",
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          {/* Editor */}
          <div className="rounded-xl bg-[#1e1e1e] border-2 border-[#333] overflow-hidden flex flex-col min-h-0">
            <div className="px-4 py-2 border-b-2 border-[#333] flex items-center gap-2 flex-shrink-0">
              <FileText className="w-4 h-4 text-[#888]" />
              <span className="text-sm font-bold text-[#888]">Editor</span>
            </div>
            <textarea
              value={markdown}
              onChange={handleChange}
              className="flex-1 w-full p-4 bg-transparent text-white resize-none outline-none font-mono text-sm leading-relaxed placeholder:text-[#666] min-h-0"
              placeholder="Start typing your markdown..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-[#1e1e1e] border-2 border-[#333] overflow-hidden flex flex-col min-h-0"
            >
              <div className="px-4 py-2 border-b-2 border-[#333] flex items-center gap-2 flex-shrink-0">
                <FileText className="w-4 h-4 text-[#888]" />
                <span className="text-sm font-bold text-[#888]">Preview</span>
              </div>
              <div
                className="flex-1 p-4 overflow-auto prose prose-invert prose-sm max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:border-b-2 prose-h1:border-[#333] prose-h1:pb-2
                  prose-p:text-[#ccc] prose-a:text-[#00d4ff] prose-strong:text-white
                  prose-li:text-[#ccc] prose-blockquote:border-l-[#ff6b9d] prose-blockquote:text-[#888]
                  prose-hr:border-[#333]"
              >
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{ code: CodeBlock }}
                >
                  {markdown}
                </Markdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}