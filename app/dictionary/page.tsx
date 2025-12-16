"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Volume2, BookOpen, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Phonetic {
  text: string;
  audio: string;
}

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Result {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
}

const partOfSpeechColors: { [key: string]: { bg: string; shadow: string; text: string } } = {
  noun: { bg: "bg-[#3742fa]", shadow: "shadow-[0_3px_0_#2c35c8]", text: "text-white" },
  verb: { bg: "bg-[#2ed573]", shadow: "shadow-[0_3px_0_#25aa5c]", text: "text-black" },
  adjective: { bg: "bg-[#a55eea]", shadow: "shadow-[0_3px_0_#844bbb]", text: "text-white" },
  adverb: { bg: "bg-[#ff6b35]", shadow: "shadow-[0_3px_0_#cc5529]", text: "text-white" },
  pronoun: { bg: "bg-[#00d4ff]", shadow: "shadow-[0_3px_0_#00a9cc]", text: "text-black" },
  preposition: { bg: "bg-[#ffd93d]", shadow: "shadow-[0_3px_0_#ccae31]", text: "text-black" },
  conjunction: { bg: "bg-[#ff6b9d]", shadow: "shadow-[0_3px_0_#cc567e]", text: "text-white" },
  interjection: { bg: "bg-[#ff4757]", shadow: "shadow-[0_3px_0_#cc3a47]", text: "text-white" },
};

const defaultPOS = { bg: "bg-[#666]", shadow: "shadow-[0_3px_0_#444]", text: "text-white" };

export default function Dictionary() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [expandedMeanings, setExpandedMeanings] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem("dictionary-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const searchWord = async (word: string) => {
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setExpandedMeanings({});

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
      );

      if (!response.ok) throw new Error("Word not found!");

      const data: Result[] = await response.json();
      setResults(data);

      const newHistory = [word.trim(), ...history.filter((h) => h !== word.trim())].slice(0, 8);
      setHistory(newHistory);
      localStorage.setItem("dictionary-history", JSON.stringify(newHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => new Audio(audioUrl).play();

  const toggleMeaning = (key: string) => {
    setExpandedMeanings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageWrapper title="Dictionary" showBack>
      <div className="max-w-3xl mx-auto">
        {/* Search */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-[#2ed573] shadow-[0_4px_0_#25aa5c]"
            )}>
              <BookOpen className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Search Word</h2>
              <p className="text-sm text-[#888]">Press Enter to search</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchWord(query)}
                placeholder="Type a word..."
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl font-medium",
                  "bg-[#252525] border-2 border-[#444] text-white",
                  "placeholder:text-[#666]",
                  "focus:outline-none focus:border-[#2ed573]"
                )}
              />
            </div>
            <Button color="green" onClick={() => searchWord(query)} isLoading={loading}>
              Search
            </Button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-[#333]">
              <div className="flex items-center gap-2 text-[#888] text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-bold">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((word) => (
                  <button
                    key={word}
                    onClick={() => { setQuery(word); searchWord(word); }}
                    className="px-3 py-1.5 rounded-lg bg-[#252525] border-2 border-[#444] text-white text-sm font-medium hover:border-[#555]"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="mb-6 bg-[#ff4757]/10 border-[#ff4757]">
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-[#ff4757]" />
                  <p className="text-[#ff4757] font-bold">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {results.map((result, resultIndex) => (
                <motion.div
                  key={resultIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: resultIndex * 0.1 }}
                >
                  <Card>
                    {/* Word Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-black text-white mb-1">{result.word}</h2>
                        {result.phonetic && (
                          <span className="text-[#888] text-lg">{result.phonetic}</span>
                        )}
                      </div>
                      {result.phonetics.some((p) => p.audio) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const audio = result.phonetics.find((p) => p.audio)?.audio;
                            if (audio) playAudio(audio);
                          }}
                        >
                          <Volume2 className="w-4 h-4" /> Listen
                        </Button>
                      )}
                    </div>

                    {/* Meanings */}
                    <div className="space-y-4">
                      {result.meanings.map((meaning, meaningIndex) => {
                        const key = `${resultIndex}-${meaningIndex}`;
                        const isExpanded = expandedMeanings[key] !== false;
                        const hasMore = meaning.definitions.length > 2;
                        const colors = partOfSpeechColors[meaning.partOfSpeech] || defaultPOS;

                        return (
                          <div
                            key={meaningIndex}
                            className="p-4 rounded-xl bg-[#252525] border-2 border-[#333]"
                          >
                            {/* Part of Speech */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className={cn(
                                "px-3 py-1 rounded-lg text-sm font-bold",
                                colors.bg, colors.shadow, colors.text
                              )}>
                                {meaning.partOfSpeech}
                              </span>
                              <span className="text-xs text-[#666] font-bold">
                                {meaning.definitions.length} definitions
                              </span>
                            </div>

                            {/* Definitions */}
                            <ol className="space-y-3 list-decimal list-inside">
                              {meaning.definitions
                                .slice(0, isExpanded ? undefined : 2)
                                .map((def, defIndex) => (
                                  <li key={defIndex} className="text-[#ccc]">
                                    <span className="text-white">{def.definition}</span>
                                    {def.example && (
                                      <p className="mt-1 pl-5 text-[#888] italic">
                                        &ldquo;{def.example}&rdquo;
                                      </p>
                                    )}
                                  </li>
                                ))}
                            </ol>

                            {hasMore && (
                              <button
                                onClick={() => toggleMeaning(key)}
                                className="mt-3 text-sm text-[#00d4ff] font-bold flex items-center gap-1 hover:underline"
                              >
                                {isExpanded ? (
                                  <><ChevronUp className="w-4 h-4" /> Show less</>
                                ) : (
                                  <><ChevronDown className="w-4 h-4" /> Show more</>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty */}
        {!loading && !results && !error && (
          <Card hover={false} className="text-center py-16">
            <div className={cn(
              "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center",
              "bg-[#252525] border-2 border-[#444]"
            )}>
              <BookOpen className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search for a Word</h3>
            <p className="text-[#888]">Enter any word to see its definition</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}