import React from 'react';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface PollutantCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
  delay?: number;
}

const statusColors = {
  Good: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Moderate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Unhealthy: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Hazardous: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const iconColors = {
    Good: 'text-emerald-400',
    Moderate: 'text-yellow-400',
    Unhealthy: 'text-orange-400',
    Hazardous: 'text-red-400',
};

const PollutantCard: React.FC<PollutantCardProps> = ({
  title,
  value,
  unit,
  status,
  icon: Icon,
  className,
  delay = 0,
}) => {
  return (
    <GlassCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay }}
      className={cn('flex flex-col items-center justify-center p-6', className)}
    >
      <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/50 shadow-inner border border-white/5", iconColors[status])}>
        <Icon size={28} />
      </div>
      <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline gap-1 mb-3">
        <span className={cn('text-4xl font-bold tracking-tight text-white drop-shadow-lg')}>
          {value}
        </span>
        <span className="text-sm font-medium text-slate-500">{unit}</span>
      </div>
      <div className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border backdrop-blur-md', statusColors[status])}>
        {status}
      </div>
    </GlassCard>
  );
};

export default PollutantCard;