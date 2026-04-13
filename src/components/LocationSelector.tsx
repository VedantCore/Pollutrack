import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Loader2, Navigation, Clock } from 'lucide-react';
// import { cn } from '../lib/utils';
import GlassCard from './ui/GlassCard';

import { weatherService } from '../services/weatherService';

interface LocationSelectorProps {
  onLocationSelect: (location: string, coordinates?: [number, number]) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUseMyLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Get actual location name using reverse geocoding
          const locationName = await weatherService.getCityName(latitude, longitude);
          
          setIsLoading(false);
          onLocationSelect(locationName, [latitude, longitude]);
        } catch (err) {
          console.error("Error getting location name:", err);
          setIsLoading(false);
          // Fallback
          onLocationSelect("Current Location", [position.coords.latitude, position.coords.longitude]);
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please search manually.");
        setIsLoading(false);
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const results = await weatherService.searchCity(searchQuery);
      
      if (results.length > 0) {
        // Use the first result
        const city = results[0];
        onLocationSelect(city.name, [city.lat, city.lon]);
      } else {
        // Fallback for demo/no-key scenario
        console.warn("No results found or API key missing. Falling back to mock coordinates.");
        // Generate pseudo-random coordinates around India for demo
        const lat = 20 + (Math.random() * 10 - 5);
        const lon = 78 + (Math.random() * 10 - 5);
        onLocationSelect(searchQuery, [lat, lon]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      // Fallback
      onLocationSelect(searchQuery); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Main Card */}
      <GlassCard className="w-full max-w-md p-8 flex flex-col items-center text-center relative z-10 border-white/20 shadow-2xl">
        <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-inner">
          <MapPin className="w-12 h-12 text-indigo-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Select Location</h2>
        <p className="text-slate-400 mb-8">
          To provide accurate air quality data, we need to know where you are.
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Use Current Location
              </>
            )}
             <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover:ring-white/20 pointer-events-none" />
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-sm text-slate-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
                <Search className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 mt-2 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.p>
          )}

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Searches
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onLocationSelect("Loni Kalbhor, Pune, India", [18.4908, 74.0264])}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Loni Kalbhor</div>
                    <div className="text-xs text-slate-400">Pune, India</div>
                  </div>
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">
                  AQI 68
                </div>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LocationSelector;
