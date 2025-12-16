import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merger",
  description: "Free online PDF merger. Combine multiple PDF files into one. Drag and drop, reorder pages, download merged PDF. No signup or upload limits.",
  keywords: ["pdf merger", "combine pdf", "merge pdf online", "join pdf files", "pdf combiner free", "merge multiple pdfs", "pdf joiner"],
  openGraph: {
    title: "Free PDF Merger - Combine PDFs Online | Random Utility Apps",
    description: "Merge multiple PDF files into one. Drag & drop, reorder, download. Free with no limits.",
  },
};

export default function PDFMergerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
