import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden text-white font-sans selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
                <div className="absolute -bottom-[20%] left-[30%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-2000"></div>
            </div>

            {/* Navbar Placeholder */}
            <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Pollutrack.AI</span>
                </div>
                <div>
                   <button className="text-sm text-slate-400 hover:text-white transition-colors mr-6">Documentation</button>
                   <button className="text-sm text-slate-400 hover:text-white transition-colors">Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center max-w-5xl mx-auto mt-[-50px]">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 text-xs font-medium uppercase tracking-wider backdrop-blur-md"
                >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Live Monitoring Active
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                >
                    AI-Based Air & Dust <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Pollution Monitoring</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
                >
                    Real-time prediction • Smart alerts • Sustainable solutions. <br/>
                    Experience the future of environmental tracking with our intelligent dashboard.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
                    >
                        View Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover:ring-white/20"></div>
                    </button>
                    <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all border border-slate-700 backdrop-blur-md">
                        Learn More
                    </button>
                </motion.div>

                {/* Floating Elements / Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl">
                    {[
                        { title: "Real-time Analytics", icon: Activity, desc: "Instant updates on air quality index." },
                        { title: "AI Predictions", icon: Zap, desc: "Forecast pollution trends with 95% accuracy." },
                        { title: "Health Alerts", icon: CheckCircle, desc: "Smart notifications for your safety." },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        >
                            <GlassCard className="p-6 h-full hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
