import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import GlassCard from './ui/GlassCard';
import { ShieldCheck, Trees as Tree, Droplets, Factory, AlertTriangle, Car } from 'lucide-react';

interface MitigationPlanProps {
  aqi: number;
}

const MitigationPlan: React.FC<MitigationPlanProps> = ({ aqi }) => {
  const getPlan = (aqi: number) => {
    if (aqi > 200) return {
      title: "Critical Action Plan",
      actions: [
        { icon: Car, label: "Traffic Control", description: "Restrict non-essential vehicles. Encourage public transport." },
        { icon: Factory, label: "Industrial Monitoring", description: "Audit emissions. Shut down polluting units temporarily." },
        { icon: ShieldCheck, label: "Health Advisory", description: "Alert vulnerable groups. Distribute masks." }
      ],
      color: "red"
    };
    if (aqi > 100) return {
      title: "Moderate Action Plan",
      actions: [
        { icon: Droplets, label: "Dust Suppression", description: "Increase road cleaning and water sprinkling." },
        { icon: Tree, label: "Green Initiatives", description: "Plan more urban plantation drives." },
        { icon: AlertTriangle, label: "Community Alert", description: "Advise caution for sensitive groups." }
      ],
      color: "orange"
    };
    return {
      title: "Routine Maintenance",
      actions: [
        { icon: Tree, label: "Sustain Green Cover", description: "Maintain existing parks and trees." },
        { icon: ShieldCheck, label: "Monitor Levels", description: "Keep tracking AQI for changes." }
      ],
      color: "green"
    };
  };

  const plan = getPlan(aqi);

  return (
    <GlassCard className="col-span-1 md:col-span-2 lg:col-span-2 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("p-2 rounded-lg flex items-center justify-center", 
          plan.color === 'red' ? 'bg-red-500/20 text-red-400' : 
          plan.color === 'orange' ? 'bg-orange-500/20 text-orange-400' : 
          'bg-green-500/20 text-green-400'
        )}>
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{plan.title}</h3>
          <p className="text-xs text-slate-400">Current Mitigation Strategy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-slate-800/50 p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <div className="mb-2 flex items-center gap-2">
              <action.icon className="h-4 w-4 text-indigo-400" />
              <h4 className="font-semibold text-slate-200">{action.label}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default MitigationPlan;
