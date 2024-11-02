"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const letters = "Welcome!".split("");

const Home = () => {
  const router = useRouter();
  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-transparent p-4">
      <header className="text-left mt-3 ml-3 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Random Utility(?) Apps</h1>
      </header>
      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-white">
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
        <br />
        PS. Perma dark-mode because light mode is for the weak.
      </p>
      <div className="flex flex-wrap justify-center gap-6 mb-12 w-full max-w-2xl">
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