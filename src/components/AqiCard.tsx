import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import GlassCard from './ui/GlassCard';
import { getAQIDescription, getHealthRecommendation } from '../lib/aqiCalculator';

interface AqiCardProps {
  aqi: number;
}

const AqiCard: React.FC<AqiCardProps> = ({ aqi }) => {
  const status = getAQIDescription(aqi);
  const recommendation = getHealthRecommendation(aqi);

  const getColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-500 bg-green-500';
    if (aqi <= 100) return 'text-yellow-500 bg-yellow-500';
    if (aqi <= 150) return 'text-orange-500 bg-orange-500';
    if (aqi <= 200) return 'text-red-500 bg-red-500';
    if (aqi <= 300) return 'text-red-700 bg-red-700';
    return 'text-purple-700 bg-purple-700';
  };

  const colorClass = getColor(aqi);

  return (
    <GlassCard className="col-span-1 row-span-2 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
        </div>
      <div className="z-10 flex flex-col items-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Current AQI</h2>
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="flex items-center justify-center"
        >
            <div className={cn("relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-700/50 bg-slate-800/80 shadow-inner backdrop-blur-sm", colorClass.split(" ")[0].replace("text", "border"))}>
                <span className={cn("text-6xl font-black tracking-tighter", colorClass.split(" ")[0])}>
                    {aqi}
                </span>
                <div className={cn("absolute -bottom-2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg", colorClass.split(" ")[1])}>
                    {status}
                </div>
            </div>
        </motion.div>
        <p className="mt-6 text-center text-sm text-slate-300 font-medium leading-relaxed max-w-xs">
          {recommendation}
        </p>
        <p className="mt-3 text-center text-xs text-slate-500 font-medium">Last updated: Just now</p>
      </div>
    </GlassCard>
  );
};


export default AqiCard;
