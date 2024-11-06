"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const letters = "Welcome!".split("");

const Home = () => {
  const router = useRouter();
  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-transparent p-4">
      <header className="flex flex-row justify-between items-center text-left m-3 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Random Utility(?) Apps</h1>
          <motion.span 
            className="text-gray-400 hover:text-gray-300 text-3xl font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}  
          >
            <Link href="https://github.com/shrey715/utility_apps">
              &lt;/&gt;
            </Link>
          </motion.span>
      </header>
      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-white mt-5">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <p className="text-center text-lg sm:text-xl md:text-2xl mb-12 max-w-1/2 text-white">
        This is a scrap project done for just passing time, but feel free to look around and use anything useful (if anything is useful).
      </p>
      <div className="flex flex-wrap justify-center gap-6 mb-12 w-full max-w-3xl">
        <motion.button
          className="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/qr-generator')}
        >
          QR Generator
        </motion.button>
        <motion.button
          className="bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/sgpa-calculator')}
        >
          SGPA Calculator
        </motion.button>
        <motion.button
          className="bg-green-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-green-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/dictionary')}
        >
          Dictionary
        </motion.button>
        <motion.button
          className="bg-yellow-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/currency-converter')}
        >
          Currency Converter
        </motion.button>
        <motion.button
          className="bg-purple-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-purple-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/color-picker')}
        >
          Color Picker
        </motion.button>
        <motion.button
          className="bg-indigo-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/weather')}
        >
          Weather
        </motion.button>
        <motion.button
          className="bg-pink-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-pink-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRedirect('/markdown-editor')}
        >
          Markdown Editor
        </motion.button>
      </div>
      <footer className="text-center mt-8 text-gray-400">
        <p>
          Shreyas Deb - 2024 - Right before Mid-Sems :&#41;
        </p>
      </footer>
    </div>
  );
};

export default Home;