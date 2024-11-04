"use client";
import { useState, useEffect } from 'react';
import { FaHome, FaExchangeAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const CurrencyConverter = () => {
  const router = useRouter();
  const [amt, setAmt] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState<number>(0);
  const [currencies, setCurrencies] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const loadCurrencies = async () => {
      const response = await fetch('/currencies.json');
      const data = await response.json();
      setCurrencies(data);
    };

    loadCurrencies();
  }, []);

  const convertCurrency = async () => {
    setLoading(true);
    const response = await fetch(`/api/convert?amount=${amt}&from=${fromCurrency}&to=${toCurrency}`);
    const data = await response.json();

    if (response.ok) {
      setRate(data.conversionRate);
      setResult(data.convertedAmount);
    } else {
      setRate(0);
      setResult(0);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-6 justify-between items-center">
      <div className="flex flex-row justify-between w-full mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">Currency Converter</h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={28} />
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-6xl px-4 sm:px-10">
        <div className="flex flex-col items-center space-y-6 w-full">
          <input
            type="number"
            value={amt}
            onChange={(e) => setAmt(parseFloat(e.target.value))}
            placeholder="Amount"
            className="w-full h-fit px-4 py-3 rounded-lg shadow-lg text-black text-lg sm:text-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
            <div className="flex flex-col items-center w-full sm:w-1/2">
              <label className="text-white mb-2 text-lg sm:text-xl">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full h-fit px-4 py-3 rounded-lg shadow-lg text-black text-lg sm:text-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                {Object.keys(currencies).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {currencies[currency]}
                  </option>
                ))}
              </select>
            </div>
            <FaExchangeAlt className="text-white text-4xl my-4 sm:my-0" />
            <div className="flex flex-col items-center w-full sm:w-1/2">
              <label className="text-white mb-2 text-lg sm:text-xl">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full h-fit px-4 py-3 rounded-lg shadow-lg text-black text-lg sm:text-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                {Object.keys(currencies).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {currencies[currency]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <motion.button
            className="bg-green-600 text-white text-lg sm:text-xl px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
            onClick={convertCurrency}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Convert
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <FaSpinner className="text-white text-4xl animate-spin" />
          </div>
        ) : (
          result !== null && (
            <div className="text-white text-2xl text-center mt-8 transition duration-300 w-full flex flex-col items-center">
              <span className="font-semibold">{amt} {fromCurrency}</span>
              <FaExchangeAlt className="text-white text-4xl my-4" />
              <span className="font-bold text-blue-400">{result.toFixed(2)} {toCurrency}</span>
              {
                rate !== 0 && (
                  <p className="text-gray-400 text-lg mt-3">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</p>
                )
              }
            </div>
          )
        )}
      </div>

      <footer className="text-center text-gray-400 text-xs sm:text-sm mt-10">
        <p>Powered by Freecurrency-API</p>
      </footer>
    </div>
  );
};

export default CurrencyConverter;