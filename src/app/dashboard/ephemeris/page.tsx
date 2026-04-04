"use client";

import { useEffect, useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Rocket,
  Sun,
  Wind,
  Search,
  Star,
  Droplets,
  MapPin,
  Navigation,
  Eye,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";

const MoonIcon = ({ phase }: { phase: string }) => {
  const isNew = phase === "New Moon";
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full blur-md opacity-20 ${isNew ? "bg-slate-500" : "bg-red-400 dark:bg-red-500"}`}
      />
      <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-sm">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="fill-slate-200 dark:fill-slate-800"
        />
        {phase === "Full Moon" && (
          <circle
            cx="50"
            cy="50"
            r="45"
            className="fill-white dark:fill-slate-100"
          />
        )}
        {phase === "First Quarter" && (
          <path
            d="M 50,5 A 45,45 0 0,1 50,95 L 50,5"
            className="fill-white dark:fill-slate-100"
          />
        )}
        {phase === "Waning Quarter" && (
          <path
            d="M 50,5 A 45,45 0 0,0 50,95 L 50,5"
            className="fill-white dark:fill-slate-100"
          />
        )}
        {phase === "Waxing Crescent" && (
          <path
            d="M 50,5 A 45,45 0 0,1 50,95 A 30,45 0 0,0 50,5"
            className="fill-white dark:fill-slate-100"
          />
        )}
        {phase === "Waning Crescent" && (
          <path
            d="M 50,5 A 45,45 0 0,0 50,95 A 30,45 0 0,1 50,5"
            className="fill-white dark:fill-slate-100"
          />
        )}
      </svg>
    </div>
  );
};

interface AstroData {
  time: string[];
  cloudCover: number[];
  temperature: number[];
  humidity: number[];
  dewPoint: number[];
  windSpeed: number[];
  isDay: number[];
}

export default function Ephemeris() {
  const { data: session, isPending } = authClient.useSession();
  const [weather, setWeather] = useState<AstroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [coords, setCoords] = useState({
    lat: 48.8566,
    lon: 2.3522,
    name: "Paris, FR",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Ma Position";
          setCoords({
            lat: latitude,
            lon: longitude,
            name: `${city}, ${data.address.country_code?.toUpperCase() || ""}`,
          });
        } catch (e) {
          setCoords((prev) => ({ ...prev, lat: latitude, lon: longitude }));
        }
      });
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function fetchAstroData() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,cloud_cover,wind_speed_10m,is_day&timezone=auto&forecast_days=3`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.hourly) {
          throw new Error("Invalid API response: hourly data missing");
        }

        const now = new Date();
        const startIndex = data.hourly.time.findIndex(
          (t: string) => new Date(t) >= now,
        );
        const start = startIndex === -1 ? 0 : startIndex;

        if (!isCancelled) {
          setWeather({
            time: data.hourly.time.slice(start, start + 48),
            cloudCover: data.hourly.cloud_cover.slice(start, start + 48),
            temperature: data.hourly.temperature_2m.slice(start, start + 48),
            humidity: data.hourly.relative_humidity_2m.slice(start, start + 48),
            dewPoint: data.hourly.dew_point_2m.slice(start, start + 48),
            windSpeed: data.hourly.wind_speed_10m.slice(start, start + 48),
            isDay: data.hourly.is_day.slice(start, start + 48),
          });
        }
      } catch (error) {
        console.error("Meteo Fetch Error:", error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchAstroData();
    return () => {
      isCancelled = true;
    };
  }, [coords]);

  const moon = useMemo(() => {
    if (!mounted) return { name: "Loading...", dark: true };
    const date = new Date();
    const lp = 2551443.02;
    const new_moon = new Date("1970-01-07T20:35:00Z").getTime() / 1000;
    const phase = (date.getTime() / 1000 - new_moon) % lp;
    const res = Math.floor(phase / (24 * 3600)) + 1;
    if (res <= 1 || res >= 29) return { name: "New Moon", dark: true };
    if (res <= 7) return { name: "Waxing Crescent", dark: true };
    if (res <= 14) return { name: "First Quarter", dark: false };
    if (res <= 15) return { name: "Full Moon", dark: false };
    if (res <= 22) return { name: "Waning Quarter", dark: false };
    return { name: "Waning Crescent", dark: true };
  }, [mounted]);

  const calculateScore = (cloud: number, humidity: number, wind: number) => {
    const cloudScore = (100 - cloud) * 0.6;
    const humidityScore = (100 - humidity) * 0.2;
    const windScore = Math.max(0, (40 - wind) * 2.5) * 0.2;
    return Math.round(cloudScore + humidityScore + windScore);
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity) return;
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=fr&format=json`,
      );
      const data = await res.json();
      if (data.results?.[0]) {
        const city = data.results[0];
        setCoords({
          lat: city.latitude,
          lon: city.longitude,
          name: `${city.name}, ${city.country_code}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted || isPending || loading)
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Rocket className="text-red-500 animate-bounce w-12 h-12" />
        <p className="text-sm font-medium text-gray-400 animate-pulse uppercase tracking-widest">
          Loading Sky Data...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h1 className={`${exo.className} text-4xl font-semibold`}>
                  Ephemeris
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-3 text-md flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> Sky conditions for{" "}
                  <span className="font-medium text-gray-700 dark:text-slate-200">
                    {coords.name}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <form onSubmit={handleCitySearch} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none w-full md:w-64 text-sm shadow-sm transition-all"
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                </form>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                  <Navigation className="w-4 h-4" /> Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">
                    Moon Phase
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{moon.name}</h3>
                  <p
                    className={`text-[11px] mt-2 font-medium ${moon.dark ? "text-green-500" : "text-red-400"}`}
                  >
                    {moon.dark
                      ? "● Deep sky recommended"
                      : "○ High light pollution"}
                  </p>
                </div>
                <MoonIcon phase={moon.name} />
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">
                    Obs. Score (Now)
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {weather
                      ? calculateScore(
                          weather.cloudCover[0],
                          weather.humidity[0],
                          weather.windSpeed[0],
                        )
                      : 0}
                    %
                  </h3>
                  <div className="flex gap-1 mt-2 text-[11px] text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{" "}
                    Seeing now
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900/30">
                  <Eye className="w-5 h-5 text-red-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">
                    Dew Point
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {weather ? Math.round(weather.dewPoint[0]) : 0}°C
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Humidity: {weather?.humidity[0]}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden mb-10">
              <div className="p-6 border-b border-gray-50 dark:border-slate-700">
                <h2 className="font-semibold flex items-center gap-2">
                  <Sun className="w-5 h-5 text-red-500" /> Next 48 Hours
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-400 dark:text-slate-500 text-[11px] uppercase font-bold tracking-widest border-b border-gray-50 dark:border-slate-700">
                      <th className="p-5">Time</th>
                      <th className="p-5">Cloud Cover</th>
                      <th className="p-5 text-center">Temp / Dew</th>
                      <th className="p-5 text-center">Wind</th>
                      <th className="p-5 text-center">Obs. Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {weather?.time.map((t, i) => {
                      const score = calculateScore(
                        weather.cloudCover[i],
                        weather.humidity[i],
                        weather.windSpeed[i],
                      );
                      const isNight = weather.isDay[i] === 0;
                      return (
                        <tr
                          key={t}
                          className={`hover:bg-gray-50/30 dark:hover:bg-slate-700/30 transition-colors ${isNight ? "bg-red-50/5 dark:bg-red-900/10" : ""}`}
                        >
                          <td className="p-5">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-red-500 font-bold uppercase">
                                {new Date(t).toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </span>
                              <span className="text-sm font-semibold">
                                {new Date(t).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-1.5 h-6 rounded-full ${weather.cloudCover[i] < 20 ? "bg-green-500" : weather.cloudCover[i] < 60 ? "bg-orange-400" : "bg-red-500"}`}
                              />
                              <span className="text-sm font-medium">
                                {weather.cloudCover[i]}%
                              </span>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <span className="text-sm font-bold">
                              {Math.round(weather.temperature[i])}°C
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              DP: {Math.round(weather.dewPoint[i])}°C
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-slate-400">
                              <Wind className="w-3 h-3" />{" "}
                              {Math.round(weather.windSpeed[i])}{" "}
                              <span className="text-[10px]">km/h</span>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${score > 70 ? "bg-green-50 dark:bg-green-900/20 text-green-700" : score > 40 ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700" : "bg-red-50 dark:bg-red-900/20 text-red-700"}`}
                            >
                              {score}/100
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
