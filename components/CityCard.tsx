// @ts-nocheck
import React, { useEffect, useState, memo } from 'react';
import { CityConfig, WeatherDay, WeatherCondition } from '../types';
import { GeminiInsight } from './GeminiInsight';

// --- SUB-COMPONENTS FOR PERFORMANCE ---

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// 1. Static Weather Icon (Prevent re-renders)
const WeatherIcon = memo(({ condition, className = "w-6 h-6" }: { condition: WeatherCondition; className?: string }) => {
  switch (condition) {
    case 'sunny':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${className} text-yellow-400`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      );
    case 'cloudy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${className} text-slate-400`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    case 'rainy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${className} text-blue-400`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
    default: // partly-cloudy
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${className} text-orange-300`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" className="opacity-60" />
        </svg>
      );
  }
});

// 2. Isolated Clock Component (Only this part re-renders every second)
const DigitalClock = ({ timezone, onPeriodChange }: { timezone: string, onPeriodChange: (p: string, t: string) => void }) => {
  const [time, setTime] = useState({ 
    display: '', 
    period: '', 
    seconds: '', 
    dayDate: '' 
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short', 
        month: 'short', 
        day: 'numeric'
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);
      const get = (t: string) => parts.find(p => p.type === t)?.value || '';

      const hours = get('hour');
      const minutes = get('minute');
      const period = get('dayPeriod'); // AM/PM
      
      setTime({
        display: `${hours}:${minutes}`,
        seconds: get('second'),
        period,
        dayDate: `${get('weekday')}, ${get('month')} ${get('day')}`
      });
      
      // Pass data up for Gemini insights
      onPeriodChange(period, `${hours}:${minutes} ${period}`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [timezone, onPeriodChange]);

  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
          {time.display}
        </span>
        <span className="text-xl font-medium text-slate-400 tabular-nums w-8">
          :{time.seconds}
        </span>
        <span className="text-lg font-bold text-primary-500 ml-1">
          {time.period}
        </span>
      </div>
      <div className="text-slate-300 font-medium mt-1">
        {time.dayDate}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const mapWeatherCondition = (id: number): WeatherCondition => {
  if (id >= 200 && id < 600) return 'rainy';
  if (id >= 600 && id < 700) return 'rainy'; // Snow
  if (id === 800) return 'sunny';
  if (id === 801 || id === 802) return 'partly-cloudy';
  return 'cloudy';
};

interface CityCardProps {
  city: CityConfig;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Update current time string for Gemini without re-rendering everything constantly
  const handleTimeUpdate = React.useCallback((_period: string, timeStr: string) => {
    setCurrentTimeStr(timeStr);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city.lat || !city.lon) return;

      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        console.warn("No API Key found");
        setLoadingWeather(false);
        return;
      }

      try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: WeatherDay[] = data.daily.slice(0, 6).map((d: any) => ({
          dayName: new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          condition: mapWeatherCondition(d.weather[0].id),
          high: Math.round(d.temp.max),
          low: Math.round(d.temp.min)
        }));
        
        setForecast(mapped);
      } catch (err) {
        console.error("Weather error:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [city.lat, city.lon]);

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl transition-all duration-300 hover:shadow-primary-500/20 hover:border-primary-500/50">
      
      {/* Background Image (Optimized) */}
      <div className="absolute inset-0 z-0">
         <img 
            src={city.imageUrl || `https://picsum.photos/seed/${city.id}/600/600`} 
            alt={city.name} 
            loading="lazy"
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-700 grayscale group-hover:grayscale-0"
         />
         <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full min-h-105">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{city.name}</h2>
            <p className="text-slate-400 text-xs font-medium tracking-wide">{city.timezone}</p>
          </div>
        </div>

        {/* Digital Clock (Isolated) */}
        <DigitalClock timezone={city.timezone} onPeriodChange={handleTimeUpdate} />
        
        {/* Gemini AI Insight */}
        <div className="mb-4">
           <GeminiInsight cityName={city.name} currentTime={currentTimeStr} />
        </div>

        {/* Forecast Section */}
        <div className="mt-auto border-t border-white/10 pt-4">
           <div className="flex items-center justify-between mb-3">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forecast</h3>
             
             {/* Dynamic Badge - No longer hardcoded! */}
             {loadingWeather ? (
               <span className="text-[10px] text-yellow-500/80 animate-pulse">Loading...</span>
             ) : forecast.length > 0 ? (
               <span className="text-[10px] text-green-400/80 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-800/30">
                 Live Weather
               </span>
             ) : (
               <span className="text-[10px] text-red-400/80">Offline</span>
             )}
           </div>
           
           <div className="flex justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
             {loadingWeather 
               ? Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className="flex-1 h-14 rounded-lg bg-white/5 animate-pulse min-w-12" />
                 ))
               : forecast.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 min-w-12 p-1.5 rounded-lg bg-slate-900/40 border border-white/5">
                   <span className="text-[9px] font-semibold text-slate-400 mb-1">{day.dayName}</span>
                   <WeatherIcon condition={day.condition} className="w-4 h-4 mb-1" />
                   <div className="text-[10px] font-bold text-white">{day.high}°</div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;