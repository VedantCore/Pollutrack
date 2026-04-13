import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-2xl shadow-xl transition-all duration-500',
          'hover:shadow-indigo-500/20 hover:border-white/20 hover:bg-white/[0.04]',
          glow && 'shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] border-indigo-500/30',
          className
        )}
        {...props}
      >
        {children}
        
        {/* Inner shine effect */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl border border-white/5 opacity-50" />
        
        {/* Hover gradient sweep */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Corner glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;