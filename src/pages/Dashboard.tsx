import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Wind, 
  ThermometerSun, 
  CloudRain, 
  CloudFog,
  // Map as MapIcon,
  // LayoutDashboard,
  MapPin,
  RefreshCw,
  Loader2
} from 'lucide-react';
import PollutantCard from '../components/ui/PollutantCard';
import AqiCard from '../components/AqiCard';
import SmartAlert from '../components/SmartAlert';
import MitigationPlan from '../components/MitigationPlan';
import AIPrediction from '../components/AIPrediction';
import PollutionMap from '../components/PollutionMap';
import GlassCard from '../components/ui/GlassCard';
import LocationSelector from '../components/LocationSelector';
import { weatherService } from '../services/weatherService';
import type { AirPollutionData } from '../services/weatherService';
import { calculateAQI } from '../lib/aqiCalculator';

export interface PollutantValues {
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
}

export interface WeeklyTrend {
  day: string;
  aqi: number;
}

export interface AIPrediction {
  time: string;
  actual: number | null;
  predicted: number;
}

export interface Hotspot {
  lat: number;
  lng: number;
  aqi: number;
  radius: number;
}

export interface DashboardData {
  currentAQI: number;
  pollutants: PollutantValues;
  weeklyTrend: WeeklyTrend[];
  aiPrediction24h: AIPrediction[];
  hotspots: Hotspot[];
}

const defaultDashboardData: DashboardData = {
  currentAQI: 0,
  pollutants: { pm25: 0, pm10: 0, co: 0, no2: 0 },
  weeklyTrend: [],
  aiPrediction24h: [],
  hotspots: []
};


const Dashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real AQI data when coordinates change
  useEffect(() => {
    if (!coordinates) return;

    const fetchAQI = async () => {
      setIsLoading(true);

      // Mock Data for Loni Kalbhor
      if (selectedCity && selectedCity.includes("Loni Kalbhor")) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setData({
          currentAQI: 68,
          pollutants: { pm25: 45, pm10: 82, co: 0.5, no2: 25 }, // Mock values
          weeklyTrend: [
             { day: "Mon", aqi: 62 },
             { day: "Tue", aqi: 65 },
             { day: "Wed", aqi: 58 },
             { day: "Thu", aqi: 68 }, // Today
             { day: "Fri", aqi: 70 },
             { day: "Sat", aqi: 72 },
             { day: "Sun", aqi: 69 },
          ],
          aiPrediction24h: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            actual: i < 12 ? 60 + Math.random() * 10 : null,
            predicted: 65 + Math.random() * 15
          })),
          hotspots: [
            { lat: 18.4908, lng: 74.0264, aqi: 68, radius: 1000 }
          ]
        });
        setIsLoading(false);
        return;
      }

      try {
        const [lat, lon] = coordinates;
        const now = Math.floor(Date.now() / 1000);
        const start = now - 7 * 24 * 60 * 60; // 7 days ago

        // Fetch Current, History, and Forecast in parallel
        const [currentData, historyData, forecastData] = await Promise.all([
            weatherService.getAirPollution(lat, lon),
            weatherService.getAirPollutionHistory(lat, lon, start, now),
            weatherService.getAirPollutionForecast(lat, lon)
        ]);
        
        // 1. Process Current Data
        let currentAQI = 0;
        let currentPollutants = { pm25: 0, pm10: 0, co: 0, no2: 0 };
        
        if (currentData.list && currentData.list.length > 0) {
          const current = currentData.list[0];
          const components = current.components;

          const convertedPollutants = {
            pm25: components.pm2_5,
            pm10: components.pm10,
            co: parseFloat((components.co / 1145).toFixed(2)),
            no2: parseFloat((components.no2 / 1.88).toFixed(0)),
            so2: parseFloat((components.so2 / 2.62).toFixed(0)),
            o3: parseFloat((components.o3 / 1.96).toFixed(0))
          };

          currentAQI = calculateAQI(convertedPollutants);
          currentPollutants = {
              pm25: convertedPollutants.pm25,
              pm10: convertedPollutants.pm10,
              co: convertedPollutants.co,
              no2: convertedPollutants.no2
          };
        }

        // 2. Process Weekly Trend (History)
        // Aggregate history data by day
        const weeklyTrend = [];
        if (historyData.list && historyData.list.length > 0) {
          const daysMap = new Map<string, AirPollutionData['list'][number][]>();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            historyData.list.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const dayName = days[date.getDay()];
                // Simple assumption: take the max AQI of the day or average? 
                // Let's take the reading around noon for simplicity or just average
                // To keep it simple speed-wise, let's just use the day key and overwrite (showing latest daily value)
                // Better: Group by day and average PM2.5 then calc AQI?
                // Simplest consistent approach: One reading per day.
                if (!daysMap.has(dayName)) {
                    daysMap.set(dayName, []);
                }
                daysMap.get(dayName)?.push(item);
            });

            // Sort days to match chart order (Mon-Sun or relative to today?)
            // Let's just create trend from the available map
            for (const [day, items] of daysMap) {
                 // Calculate average AQI for the day
                const avgPm25 = items.reduce((sum, i) => sum + i.components.pm2_5, 0) / items.length;
                 const dayAQI = calculateAQI({ pm25: avgPm25 }); 
                 weeklyTrend.push({ day, aqi: dayAQI });
            }
            // Sort by day index relative to today? Recharts handles strings order if array is ordered.
            // Let's rely on map insertion order or just limit to 7
        }

        // 3. Process Forecast (AI Prediction)
        const aiPrediction24h = [];
        if (forecastData.list) {
            // Take first 24 hours (approx 24 items if hourly, or less)
            // OpenWeather forecast provides hourly? No, documentation says "hourly for 4 days"?
            /* 
             for (let i = 0; i < Math.min(6, forecastData.list.length); i++) {
                const item = forecastData.list[i]; // Every item or skip? 
                // Creating a simplified prediction graph
                // Step every 4 hours?
             }
             */
             
             // OpenWeather returns items with 'dt'.
             // Let's pick 4 points: 00:00, 06:00, 12:00, 18:00 of TOMORROW or Next 24h?
             // Prediction usually means next 24h.
             // const next24h = forecastData.list.slice(0, 8); // Access next ~8 hours or samples
             // Actually let's map the next 4 intervals (6h gap)
             // Forecast step is usually 1 hour.
             
             for (let i = 0; i < 4; i++) {
                 const index = i * 6; // 0, 6, 12, 18 hours ahead
                 if (index < forecastData.list.length) {
                    const item = forecastData.list[index];
                    const date = new Date(item.dt * 1000);
                    const time = `${date.getHours().toString().padStart(2, '0')}:00`;
                    
                    const components = item.components;
                    const predictedAQI = calculateAQI({
                        pm25: components.pm2_5,
                        pm10: components.pm10,
                        o3: parseFloat((components.o3 / 1.96).toFixed(0))
                    });

                    aiPrediction24h.push({
                        time,
                        actual: null, // Future
                        predicted: predictedAQI
                    });
                 }
             }
        }

        // 4. Hotspots (Simulated)
        // Since we don't have area data, verify realistic hotspots nearby
        const hotspots = [
            { 
              lat: lat + 0.01, 
              lng: lon + 0.01, 
              aqi: currentAQI + 15, 
              radius: 800 
            },
            { 
              lat: lat - 0.015, 
              lng: lon - 0.005, 
              aqi: Math.max(0, currentAQI - 10), 
              radius: 600 
            }
        ];


        setData({
            currentAQI,
            pollutants: currentPollutants,
            weeklyTrend: weeklyTrend.length > 0 ? weeklyTrend : [],
            aiPrediction24h: aiPrediction24h.length > 0 ? aiPrediction24h : [],
            hotspots
        });

      } catch (err) {
        console.error("Failed to fetch AQI:", err);
        // Fallback to empty default data to avoid crash/infinite load
        setData(defaultDashboardData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAQI();
  }, [coordinates]);

  // If no city is selected, show the selector
  if (!selectedCity) {
    return (
      <LocationSelector 
        onLocationSelect={(city, coords) => {
          setSelectedCity(city);
          if (coords) setCoordinates(coords);
        }} 
      />
    );
  }

  // Loading State
  if (isLoading || !data) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Analyzing Atmosphere</h2>
            <p className="text-slate-400">Fetching real-time pollution metrics for {selectedCity}...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8 relative overflow-hidden transition-opacity duration-500">
      <SmartAlert aqi={data.currentAQI} />
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Live Monitoring
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-3">
            {selectedCity}
            <span className="text-lg font-normal text-slate-500">Air Quality Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" /> {selectedCity} • Updated Just Now
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedCity(null)}
              className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition-all border border-white/5 backdrop-blur-sm"
            >
                <MapPin size={18} />
                Change City
            </button>
            <button 
              onClick={() => {
                // Force re-fetch
                const currentCoords = coordinates;
                setCoordinates(null);
                setTimeout(() => setCoordinates(currentCoords), 10);
              }}
              disabled={isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                Refresh Data
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
        
        {/* Row 1: Key Metrics */}
        {/* AQI Card - Large */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 min-h-[300px]">
            <AqiCard aqi={data.currentAQI} />
        </div>

        {/* Pollutant Cards */}
        <PollutantCard 
            title="PM2.5" 
            value={data.pollutants.pm25} 
            unit="µg/m³" 
            status={calculateAQI({ pm25: data.pollutants.pm25 }) <= 50 ? "Good" : "Moderate"} 
            icon={CloudFog} 
            delay={0.1}
        />
        <PollutantCard 
            title="PM10" 
            value={data.pollutants.pm10} 
            unit="µg/m³" 
            status={calculateAQI({ pm10: data.pollutants.pm10 }) <= 100 ? "Good" : "Unhealthy"} 
            icon={Wind} 
            delay={0.2}
        />
        <PollutantCard 
            title="CO" 
            value={data.pollutants.co} 
            unit="ppm" 
            status="Good" 
            icon={CloudRain} 
            delay={0.3}
        />

        {/* Row 2: Charts & Trends */}
        <GlassCard className="col-span-1 md:col-span-2 lg:col-span-2 h-[300px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-200">Weekly Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#94a3b8' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="aqi" 
                        stroke="#f59e0b" 
                        strokeWidth={4} 
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4, stroke: '#1e293b' }} 
                        activeDot={{ r: 6, stroke: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GlassCard>

        {/* Extra Pollutant or Weather Card */}
        <PollutantCard 
            title="NO₂" 
            value={data.pollutants.no2} 
            unit="ppb" 
            status="Good" 
            icon={ThermometerSun} 
            delay={0.4}
        />

       {/* Mitigation Plan Card */}
       <MitigationPlan aqi={data.currentAQI} />
       
       {/* Row 3: Prediction & Map */}
       <AIPrediction data={data.aiPrediction24h} />
       
       <PollutionMap center={coordinates || undefined} hotspots={data.hotspots} />
      </div>
    </div>
  );
};


export default Dashboard;
