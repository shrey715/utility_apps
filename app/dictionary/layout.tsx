import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Dictionary",
  description: "Free online dictionary with definitions, pronunciations, and examples. Look up any English word instantly with audio pronunciation.",
  keywords: ["online dictionary", "english dictionary", "word lookup", "word meaning", "dictionary free", "word definition", "pronunciation dictionary"],
  openGraph: {
    title: "Free Online Dictionary | Random Utility Apps",
    description: "Look up any English word with definitions, pronunciations, and examples. Free and instant.",
  },
};

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
