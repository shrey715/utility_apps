"use client";
import { useRouter } from 'next/navigation';
import { FaHome, FaSpinner } from 'react-icons/fa';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';

interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
}

const WeatherDisplay: React.FC<{ data: WeatherData }> = ({ data }) => {
  if (!data) return null;

  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    weather,
    wind: { speed },
    clouds: { all: cloudiness },
  } = data;

  const weatherMain = weather[0].main;
  const weatherDescription = weather[0].description;
  const weatherIcon = weather[0].icon;

  return (
    <div className="flex flex-col items-center p-4 md:p-10 bg-gradient-to-br from-blue-500 to-blue-900 text-white rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{name}, {country}</h2>
      <p className="text-xl md:text-2xl font-light mb-4 md:mb-6">Weather Information</p>
      
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-4 md:mb-8">
        <Image
            src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt="weather icon"
            width={100} 
            height={100}
            className="w-24 h-24"
        />
        <div>
          <h3 className="text-3xl md:text-5xl font-bold">{temp.toFixed(1)}°C</h3>
          <p className="text-lg md:text-xl capitalize">{weatherDescription}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between w-full mb-4 md:mb-8 space-y-4 md:space-y-0">
        <div className="flex flex-col items-center">
          <p className="text-lg">Feels Like</p>
          <p className="text-2xl font-semibold">{feels_like.toFixed(1)}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg">Min Temp</p>
          <p className="text-2xl font-semibold">{temp_min.toFixed(1)}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg">Max Temp</p>
          <p className="text-2xl font-semibold">{temp_max.toFixed(1)}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        <div className="flex flex-col items-center">
          <p className="text-lg">Pressure</p>
          <p className="text-2xl font-semibold">{pressure} hPa</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg">Humidity</p>
          <p className="text-2xl font-semibold">{humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg">Wind Speed</p>
          <p className="text-2xl font-semibold">{speed} m/s</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg">Cloudiness</p>
          <p className="text-2xl font-semibold">{cloudiness}%</p>
        </div>
      </div>
    </div>
  );
};

const Weather: React.FC = () => {
  const router = useRouter();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== 'Enter') return;
    const city = (e.target as HTMLInputElement).value;

    if(!city){
      console.error('Invalid request parameters:', {city});
      return;
    }

    try{
      setWeather(null);
      setLoading(true);
      const response = await fetch(`/api/weather?city=${city}`);

      if(!response.ok){
        console.error('Failed to fetch weather data:', response.statusText);
        setLoading(false);
        return;
      }

      const data: WeatherData = await response.json();
      console.log('API response data:', data);
      setWeather(data);
      setLoading(false);
    }catch(error){
      setLoading(false);
      setWeather(null);
      console.error('An error occurred while fetching weather data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center text-white space-y-8">
      <header className="flex justify-between w-full mb-4 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-2">
          Weather
        </h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-2 md:p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={20} />
        </button>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl space-y-4 md:space-y-0 md:space-x-4">
        <input type="text" placeholder="Enter city (only in India)" className="bg-gray-800 p-4 w-full rounded-lg" onKeyDown={getWeather} />
      </div>

      {
        loading && (
          <div className="flex flex-col items-center space-y-4">
            <FaSpinner size={48} className="animate-spin" />
            <p>Fetching weather data...</p>
          </div>
        )
      }

      {
        weather && <WeatherDisplay data={weather} />
      }
    </div>
  )
}

export default Weather;