"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Search, Droplets, Wind, Thermometer, Eye, Sunrise, Sunset } from "lucide-react";
import Image from "next/image";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
  clouds: { all: number };
}

const weatherColors: { [key: string]: { bg: string; shadow: string } } = {
  Clear: { bg: "bg-[#ffd93d]", shadow: "shadow-[0_4px_0_#ccae31]" },
  Clouds: { bg: "bg-[#666]", shadow: "shadow-[0_4px_0_#444]" },
  Rain: { bg: "bg-[#3742fa]", shadow: "shadow-[0_4px_0_#2c35c8]" },
  Drizzle: { bg: "bg-[#00d4ff]", shadow: "shadow-[0_4px_0_#00a9cc]" },
  Thunderstorm: { bg: "bg-[#a55eea]", shadow: "shadow-[0_4px_0_#844bbb]" },
  Snow: { bg: "bg-[#fff]", shadow: "shadow-[0_4px_0_#ccc]" },
  Mist: { bg: "bg-[#888]", shadow: "shadow-[0_4px_0_#666]" },
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="p-4 rounded-xl bg-[#252525] border-2 border-[#333]">
    <div className="flex items-center gap-2 text-[#888] mb-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold">{label}</span>
    </div>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(null); setWeather(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      if (!response.ok) throw new Error("City not found!");
      setWeather(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  };

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const colors = weather ? weatherColors[weather.weather[0].main] || weatherColors.Clouds : null;

  return (
    <PageWrapper title="Weather" showBack>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", "bg-[#3742fa] shadow-[0_4px_0_#2c35c8]")}>
              <Cloud className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Search Location</h2>
              <p className="text-sm text-[#888]">Enter a city name</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && getWeather()}
                placeholder="Type a city..."
                className={cn("w-full pl-12 pr-4 py-3 rounded-xl font-medium", "bg-[#252525] border-2 border-[#444] text-white placeholder:text-[#666]", "focus:outline-none focus:border-[#3742fa]")} />
            </div>
            <Button color="blue" onClick={getWeather} isLoading={loading}>Search</Button>
          </div>
        </Card>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="mb-6 bg-[#ff4757]/10 border-[#ff4757]"><p className="text-[#ff4757] font-bold">{error}</p></Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {weather && colors && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="text-center overflow-hidden relative">
                <div className={cn("absolute top-0 left-0 right-0 h-2", colors.bg)} />
                <div className="pt-4">
                  <h2 className="text-2xl font-black text-white mb-1">{weather.name}, {weather.sys.country}</h2>
                  <p className="text-[#888] capitalize font-medium mb-4">{weather.weather[0].description}</p>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Image src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description}
                      width={100} height={100} className="drop-shadow-lg" />
                    <div className="text-left">
                      <p className="text-6xl font-black text-white">{Math.round(weather.main.temp)}°</p>
                      <p className="text-[#888] font-medium">Feels like {Math.round(weather.main.feels_like)}°C</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 text-[#888] font-bold">
                    <span>↑ {Math.round(weather.main.temp_max)}°</span>
                    <span>↓ {Math.round(weather.main.temp_min)}°</span>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Droplets} label="Humidity" value={`${weather.main.humidity}%`} />
                <StatCard icon={Wind} label="Wind" value={`${weather.wind.speed} m/s`} />
                <StatCard icon={Thermometer} label="Pressure" value={`${weather.main.pressure} hPa`} />
                <StatCard icon={Eye} label="Clouds" value={`${weather.clouds.all}%`} />
              </div>

              <Card className="p-4">
                <div className="flex justify-around">
                  <div className="text-center">
                    <Sunrise className="w-8 h-8 text-[#ffd93d] mx-auto mb-2" />
                    <p className="text-xs text-[#888] font-bold">Sunrise</p>
                    <p className="text-lg font-bold text-white">{formatTime(weather.sys.sunrise)}</p>
                  </div>
                  <div className="h-16 w-0.5 bg-[#333]" />
                  <div className="text-center">
                    <Sunset className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                    <p className="text-xs text-[#888] font-bold">Sunset</p>
                    <p className="text-lg font-bold text-white">{formatTime(weather.sys.sunset)}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!weather && !loading && !error && (
          <Card hover={false} className="text-center py-16">
            <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", "bg-[#252525] border-2 border-[#444]")}>
              <Cloud className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Check the Weather</h3>
            <p className="text-[#888]">Enter a city name to see conditions</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}