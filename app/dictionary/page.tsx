"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaTimes } from 'react-icons/fa';
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { motion } from 'framer-motion';

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

interface ResponseModalProps {
  data: Result[];
  setData: React.Dispatch<React.SetStateAction<Result[] | null>>;
}

interface ErrorModalProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, setError }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-200 text-neutral-950 p-6 rounded-lg shadow-lg max-w-3xl w-full border-2 border-white">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Error</h2>
          <button
            className="text-xl text-neutral-950 hover:text-neutral-900"
            onClick={() => setError(null)}
          >
            <FaTimes />
          </button>
        </div>
        <p className="text-lg">{error}</p>
      </div>
    </div>
  );
}

const ResponseModal: React.FC<ResponseModalProps> = ({ data, setData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-200 text-neutral-950 p-6 rounded-lg shadow-lg max-w-3xl w-full border-2 border-white overflow-y-auto max-h-[90vh]">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Results</h2>
          <button
            className="text-xl text-neutral-950 hover:text-neutral-900"
            onClick={() => setData(null)}
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {data.map((result, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
              <div className="flex flex-row items-center justify-between border-b pb-2 mb-2">
                <h3 className="text-lg font-semibold">{result.word}</h3>
                {result.phonetics.some(phonetic => phonetic.audio) && (
                  <button
                    className="text-xl text-neutral-950 hover:text-neutral-900"
                    onClick={() => {
                      const audioUrl = result.phonetics.find(phonetic => phonetic.audio)?.audio;
                      if (audioUrl) {
                        const audio = new Audio(audioUrl);
                        audio.play();
                      }
                    }}
                  >
                    <HiMiniSpeakerWave />
                  </button>
                )}
              </div>
              <p className="text-sm italic text-gray-600">Phonetic: {result.phonetic}</p>
              
              {result.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="flex flex-col gap-2 border-t pt-2">
                  <p className="italic font-semibold">{meaning.partOfSpeech}</p>
                  
                  {meaning.definitions.map((definition, defIndex) => (
                    <div key={defIndex} className="mb-2">
                      <p className="text-sm">{definition.definition}</p>
                      {definition.example && (
                        <p className="text-sm text-gray-600 italic">Example: {definition.example}</p>
                      )}
                    </div>
                  ))}

                  {meaning.synonyms.length > 0 && (
                    <p className="text-sm"><strong>Synonyms:</strong> {meaning.synonyms.join(", ")}</p>
                  )}
                  {meaning.antonyms.length > 0 && (
                    <p className="text-sm"><strong>Antonyms:</strong> {meaning.antonyms.join(", ")}</p>
                  )}
                </div>
              ))}

              {result.sourceUrls && (
                <div className="mt-4">
                  <p className="text-sm font-semibold">Source:</p>
                  {result.sourceUrls.map((url, urlIndex) => (
                    <a
                      key={urlIndex}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dictionary: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<Result[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchWord = async (word: string) => {
    if (!word) return;
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const data: Result[] = await response.json();
      setData(data);
      setError(null);
    } catch (err: unknown) {
      setData(null);
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-6 justify-between">
      <div className="flex flex-row justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-left">Dictionary</h1>
        <button
          className="bg-gray-800 text-white text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:bg-gray-700 flex items-center"
          onClick={() => router.push('/')}
        >
          <FaHome />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <input
          type="text"
          id="search"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-fit px-4 py-3 rounded-xl shadow-lg text-black text-lg sm:text-xl bg-gray-300"
          placeholder="Enter word to search"
        />
        <motion.button
          className="mt-4 bg-blue-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => searchWord((document.getElementById('search') as HTMLInputElement).value)}
        >
          Search
        </motion.button>
      </div>

      {error && <ErrorModal error={error} setError={setError} />}
      {data && <ResponseModal data={data} setData={setData} />}

      <footer className="flex flex-row items-center justify-center text-gray-400">
        Powered by Free Dictionary API
      </footer>
    </div>
  );
};

export default Dictionary;