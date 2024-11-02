"use client";
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Weatherapp = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-6">
      <div className="flex flex-row justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-left">Weather</h1>
        <button
          className="bg-gray-800 text-white text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:bg-gray-700 flex items-center"
          onClick={() => router.push('/')}
        >
          <FaHome />
        </button>
      </div>
    </div>
  );
};

export default Weatherapp;