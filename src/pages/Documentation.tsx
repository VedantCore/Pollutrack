import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, Database, BrainCircuit, Globe2, Server, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

const TEAM = [
  {
    name: "Shejal Dattatray",
    role: "Team Lead / Frontend Dev",
    image: "https://ui-avatars.com/api/?name=Shejal+Dattatray&background=6366f1&color=fff&size=200",
  },
  {
    name: "Vedant Sarva",
    role: "Lead Developer",
    image: "https://ui-avatars.com/api/?name=Vedant+Sarva&background=8b5cf6&color=fff&size=200",
  },
  {
    name: "Sudhanshu Pawar",
    role: "Backend / API",
    image: "https://ui-avatars.com/api/?name=Sudhanshu+Pawar&background=ec4899&color=fff&size=200",
  },
  {
    name: "Arpan Dabhade",
    role: "UI/UX Designer",
    image: "https://ui-avatars.com/api/?name=Arpan+Dabhade&background=14b8a6&color=fff&size=200",
  }
];

const TECH_STACK = [
  { name: "React 19", icon: <Layout className="w-5 h-5" />, desc: "Component-based UI architecture", color: "text-sky-400" },
  { name: "TypeScript", icon: <Code2 className="w-5 h-5" />, desc: "Static typing & robust tooling", color: "text-blue-500" },
  { name: "Tailwind CSS", icon: <Layout className="w-5 h-5" />, desc: "Utility-first styling & responsiveness", color: "text-cyan-400" },
  { name: "WeatherAPI", icon: <Globe2 className="w-5 h-5" />, desc: "Real-time meteorological & AQI data", color: "text-yellow-500" },
  { name: "Leaflet & React-Leaflet", icon: <Globe2 className="w-5 h-5" />, desc: "Interactive mapping & spatial data", color: "text-emerald-500" },
  { name: "Recharts", icon: <Database className="w-5 h-5" />, desc: "Data visualization & analytics charting", color: "text-purple-400" },
  { name: "Framer Motion", icon: <BrainCircuit className="w-5 h-5" />, desc: "Fluid animations & transition states", color: "text-pink-500" },
  { name: "Vite", icon: <Server className="w-5 h-5" />, desc: "Lightning-fast frontend build tooling", color: "text-yellow-400" }
];

const LOGICS = [
  {
    title: "AQI Calculation Engine",
    desc: "Dynamically processes raw pollutant concentrations (PM2.5, PM10, O3) and evaluates them against the standard EPA breakpoints to yield a unified Air Quality Index (1-500).",
  },
  {
    title: "Reverse Geocoding",
    desc: "Captures user's raw latitude and longitude via the browser's Geolocation API and pipes it into OpenStreetMap's Nominatim index to retrieve human-readable City, State, and Country formats.",
  },
  {
    title: "AI Prediction Hotspots",
    desc: "Uses an intelligent algorithmic grid to synthesize and fetch real-time spatial air quality metrics across a 25x25km radius. Color-codes severity (Green, Orange, Red) iteratively based on neighboring AQI levels.",
  },
  {
    title: "Advanced Component Predictions",
    desc: "Simulates localized meteorological variance over time applying decaying accuracy modifiers to standard linear AQI paths. Specifically models multi-horizon deviations for sub-components (PM2.5, PM10, CO, NO2).",
  },
  {
    title: "Mitigation Generation",
    desc: "Translates strict numerical data (e.g., AQI > 150) into localized, contextualized safety mitigation actions prioritizing respiratory health, such as outdoor restriction warnings.",
  }
];

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 w-full animate-fade-in space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Documentation</h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              An inside look into the ecosystem powering Pollutrack. Comprehensive breakdown of the team, technologies, and underlying infrastructure.
            </p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-white transition-colors border border-white/10 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Team Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">The Minds Behind Pollutrack</h2>
            <div className="h-px bg-slate-800 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 flex flex-col items-center text-center h-full group hover:border-indigo-500/30 transition-colors">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-indigo-400 text-sm font-medium mb-4">{member.role}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mt-12">
            <h2 className="text-2xl font-bold text-white">Technology Stack</h2>
            <div className="h-px bg-slate-800 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, idx) => (
              <GlassCard key={idx} className="p-5 flex items-start gap-4 hover:bg-slate-800/40 transition-colors">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${tech.color}`}>
                  {tech.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 mb-1">{tech.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Logics Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mt-12">
            <h2 className="text-2xl font-bold text-white">Core System Logic</h2>
            <div className="h-px bg-slate-800 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LOGICS.map((logic, idx) => (
              <GlassCard key={idx} className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BrainCircuit className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {logic.title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {logic.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Documentation;