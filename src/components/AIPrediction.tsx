import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import GlassCard from './ui/GlassCard';
import { Brain, TrendingUp } from 'lucide-react';

interface PredictionData {
  time: string;
  actual: number | null;
  predicted: number;
}

interface AIPredictionProps {
  data: PredictionData[];
}

const AIPrediction: React.FC<AIPredictionProps> = ({ data }) => {
  return (
    <GlassCard className="col-span-1 lg:col-span-2 row-span-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Brain className="w-32 h-32" />
        </div>
      <div className="mb-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Brain className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Prediction Module</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
             <TrendingUp className="h-4 w-4 text-green-400" />
             <span>89% Accuracy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[250px] lg:h-[300px]">
        <div className="lg:col-span-2 h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="Predicted AQI" />
                <Area type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual AQI" connectNulls />
            </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center space-y-4 z-10">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 mb-1">Insight</h4>
                <p className="text-sm text-white">Pollution levels are expected to <span className="text-red-400 font-bold">fluctuate</span> in the next 24 hours based on forecast models.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 mb-1">Recommendation</h4>
                <p className="text-sm text-white">Check back regularly for updated AI-driven health advisories.</p>
            </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AIPrediction;
