"use client";
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import { useState, ChangeEvent, ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

const CodeComponent = ({ children, className, ...rest }: CodeProps) => {
  if (!children) return <code {...rest} className={className}></code>;

  const match = /language-(\w+)/.exec(className || '');
  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      language={match[1]}
      style={dark}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code {...rest} className={className}>
      {children}
    </code>
  );
};

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>('# Hello World\n\nThis is a sample markdown editor.\n\n- **Bold text**\n- _Italic text_\n\n[Click here for more info](https://www.example.com)\n\n```js\nconsole.log("Hello, World!");\n```');
  const router = useRouter();

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "markdown.md";
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center text-white space-y-8">
      <header className="flex justify-between items-center w-full mb-6">
        <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-2">
          Markdown Editor
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-700 p-3 rounded-full shadow-md hover:bg-gray-600 transition-all duration-200"
          >
            <FaHome size={24} />
          </button>
          <button
            onClick={downloadMarkdown}
            className="bg-green-700 p-3 rounded-full shadow-md hover:bg-green-600 transition-all duration-200"
          >
            Download
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-800 rounded-lg shadow-lg p-4">
          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            className="w-full h-full bg-transparent text-white resize-none outline-none placeholder-gray-400"
            placeholder="Type your markdown here..."
          />
        </div>

        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-800 rounded-lg shadow-lg p-4 prose prose-invert max-w-none overflow-hidden">
          <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ ...props }) => <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4" {...props} />,
              h2: ({ ...props }) => <h2 className="text-2xl font-semibold text-blue-400 mb-4" {...props} />,
              h3: ({ ...props }) => <h3 className="text-xl font-semibold text-blue-500 mb-3" {...props} />,
              p: ({ ...props }) => <p className="text-gray-200 mb-4 leading-relaxed" {...props} />,
              a: ({ ...props }) => (
                <a
                  className="text-green-400 underline hover:text-green-300 transition-colors duration-150"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              li: ({ ...props }) => <li className="list-disc list-inside text-gray-200 mb-2" {...props} />,
              code: ({ ...props }) => <CodeComponent {...props} />,
            }}
          >
            {markdown}
          </Markdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;