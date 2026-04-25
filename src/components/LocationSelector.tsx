import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
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
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          // Use reverse geocoding with OpenStreetMap Nominatim API for precise location names
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          if (response.ok) {
            const data = await response.json();
            // Try to get the most specific location name available
            const city = data.address?.village || data.address?.town || data.address?.city || data.address?.county || "Current Location";
            const state = data.address?.state || "";
            const country = data.address?.country || "";
            const locationName = [city, state, country].filter(Boolean).join(", ");
            onLocationSelect(locationName, [lat, lon]);
          } else {
            onLocationSelect("Current Location", [lat, lon]);
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          onLocationSelect("Current Location", [lat, lon]);
        }
        setIsLoading(false);
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
      
      if (results && results.length > 0) {
        // Use the first result
        const city = results[0];
        const locationName = [city.name, city.state, city.country].filter(Boolean).join(", ");
        onLocationSelect(locationName, [city.lat, city.lon]);
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
      onLocationSelect(searchQuery, [18.5204, 73.8567]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (cityName: string) => {
    setSearchQuery(cityName);
    // Fake event object to satisfy handleSearch
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
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
                disabled={isLoading}
            >
                <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-left">
            <p className="text-xs text-slate-400 mb-3 px-1 uppercase tracking-wider font-semibold">Test Different Scenarios</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handlePresetSelect('Reykjavik')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                Reykjavík (Low AQI)
              </button>
              <button 
                onClick={() => handlePresetSelect('Loni Kalbhor')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium hover:bg-orange-500/20 transition-colors"
              >
                Loni Kalbhor (Avg AQI)
              </button>
              <button 
                onClick={() => handlePresetSelect('New Delhi')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-colors"
              >
                New Delhi (High AQI)
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 mt-2 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default LocationSelector;
