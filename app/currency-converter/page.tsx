"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Coins, TrendingUp } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface CurrencyMap { [key: string]: string; }

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(0);
  const [currencies, setCurrencies] = useState<CurrencyMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/currencies.json").then((res) => res.json()).then(setCurrencies).catch(console.error);
  }, []);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const convert = async () => {
    if (amount <= 0) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
      const data = await response.json();
      if (response.ok) { setRate(data.conversionRate); setResult(data.convertedAmount); }
    } catch (error) { console.error("Conversion error:", error); }
    finally { setLoading(false); }
  };

  const SelectBox = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <div className="flex-1">
      <label className="block text-sm font-bold text-[#888] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 rounded-xl font-medium appearance-none cursor-pointer",
          "bg-[#252525] border-2 border-[#444] text-white",
          "focus:outline-none focus:border-[#ffd93d]"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem",
        }}
      >
        {Object.entries(currencies).map(([code, name]) => (
          <option key={code} value={code} className="bg-[#1a1a1a]">{code} - {name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <PageWrapper title="Currency" showBack>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", "bg-[#ffd93d] shadow-[0_4px_0_#ccae31]")}>
              <Coins className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Convert Currency</h2>
              <p className="text-sm text-[#888]">Real-time exchange rates</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#888] mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                className={cn(
                  "w-full px-4 py-4 rounded-xl text-2xl font-bold",
                  "bg-[#252525] border-2 border-[#444] text-white",
                  "focus:outline-none focus:border-[#ffd93d]"
                )}
              />
            </div>

            <div className="flex items-end gap-4">
              <SelectBox value={fromCurrency} onChange={setFromCurrency} label="From" />
              <motion.button
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={swapCurrencies}
                className={cn(
                  "p-3 rounded-xl mb-0.5",
                  "bg-[#252525] border-2 border-[#444] text-white",
                  "hover:border-[#555]"
                )}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </motion.button>
              <SelectBox value={toCurrency} onChange={setToCurrency} label="To" />
            </div>

            <Button color="yellow" onClick={convert} isLoading={loading} className="w-full" size="lg">
              Convert
            </Button>
          </div>
        </Card>

        {result !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="text-center">
              <p className="text-[#888] mb-2">{amount.toLocaleString()} {fromCurrency} =</p>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-5xl md:text-6xl font-black text-[#ffd93d] mb-4"
              >
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
              </motion.div>
              {rate > 0 && (
                <div className="flex items-center justify-center gap-2 text-[#666]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {result === null && (
          <Card hover={false} className="text-center py-16">
            <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", "bg-[#252525] border-2 border-[#444]")}>
              <Coins className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to Convert</h3>
            <p className="text-[#888]">Enter an amount and select currencies</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}