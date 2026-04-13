import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-cyan-500/30">
            {/* Dynamic Glass Morphism Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
                <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000 mix-blend-screen"></div>
                <div className="absolute -bottom-[20%] left-[10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse-slow delay-2000 mix-blend-screen"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Activity className="text-white w-6 h-6" />
                        <div className="absolute inset-0 rounded-xl bg-white/20 border border-white/20"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Pollutrack.AI</span>
                </div>
                <div className="flex gap-6 items-center">
                   <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Documentation</button>
                   <button className="text-sm font-medium px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all text-white">Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center max-w-5xl mx-auto mt-10 md:mt-20 mb-20">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-cyan-900/10"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Live Monitoring Active
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-2xl"
                >
                    AI-Driven <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-gradient-x">Pollution Intelligence</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed"
                >
                    Advanced environmental tracking powered by neural networks. <br/>
                    Predict, analyze, and mitigate air quality risks in real-time.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-5"
                >
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-cyan-500/30 flex items-center gap-3 overflow-hidden"
                    >
                        <span className="relative z-10">Launch Dashboard</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm"></div>
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10 backdrop-blur-md">
                        View Methodology
                    </button>
                </motion.div>

                {/* Floating Cards Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
                    {[
                        { title: "Real-time Analytics", icon: Activity, desc: "Millisecond-latency updates on global air quality indices.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                        { title: "AI Forecasting", icon: Zap, desc: "Neural prediction models for 24h pollution trends.", color: "text-purple-400", bg: "bg-purple-500/10" },
                        { title: "Smart Alerts", icon: CheckCircle, desc: "Context-aware notifications for health safety.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className="group"
                        >
                            <GlassCard className="h-full hover:-translate-y-1 transition-transform duration-300">
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;