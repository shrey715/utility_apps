import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather App",
  description: "Free weather app with current conditions, temperature, humidity, wind speed, and sunrise/sunset times. Search any city worldwide.",
  keywords: ["weather app", "weather forecast", "current weather", "weather today", "city weather", "weather search", "temperature check"],
  openGraph: {
    title: "Free Weather App | Random Utility Apps",
    description: "Check current weather, temperature, humidity, and more. Search any city worldwide.",
  },
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
