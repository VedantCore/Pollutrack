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
  Good: 'text-green-400',
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
      className={cn('flex flex-col items-center justify-center p-6 bg-slate-900/40 border-slate-700/50', className)}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/50 text-sky-400 shadow-inner">
        <Icon size={24} />
      </div>
      <h3 className="mb-1 text-sm font-medium text-slate-400 uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-3xl font-bold tracking-tight', statusColors[status])}>
          {value}
        </span>
        <span className="text-xs font-semibold text-slate-500">{unit}</span>
      </div>
      <div className={cn('mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50', statusColors[status])}>
        {status}
      </div>
    </GlassCard>
  );
};

export default PollutantCard;
