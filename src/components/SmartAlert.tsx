import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

interface SmartAlertProps {
  aqi: number;
}

const SmartAlert: React.FC<SmartAlertProps> = ({ aqi }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  // Only show alert if AQI is Unhealthy or worse (>150)
  if (aqi <= 150 || !isVisible) return null;

  const getAlertLevel = (aqi: number) => {
    if (aqi <= 200) {
      return {
        title: '⚠ Unhealthy Air Quality',
        message: `AQI is ${aqi} (Unhealthy). Sensitive groups should limit outdoor activity.`,
        bgColor: 'bg-orange-950/90',
        borderColor: 'border-orange-500/30',
        shadowColor: 'shadow-[0_0_40px_-5px_rgba(202,138,4,0.4)]',
        icon: AlertCircle,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/20'
      };
    } else if (aqi <= 300) {
      return {
        title: '⚠⚠ Very Unhealthy Air Quality',
        message: `AQI is ${aqi} (Very Unhealthy). Everyone should limit outdoor activity.`,
        bgColor: 'bg-red-950/90',
        borderColor: 'border-red-500/30',
        shadowColor: 'shadow-[0_0_40px_-5px_rgba(220,38,38,0.4)]',
        icon: AlertTriangle,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/20'
      };
    } else {
      return {
        title: '🚨 HAZARDOUS - DO NOT GO OUTSIDE',
        message: `AQI is ${aqi} (Hazardous). Stay indoors and use air purifier. This is a health emergency.`,
        bgColor: 'bg-purple-950/90',
        borderColor: 'border-purple-600/30',
        shadowColor: 'shadow-[0_0_40px_-5px_rgba(147,51,234,0.4)]',
        icon: AlertTriangle,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-600/30'
      };
    }
  };

  const alert = getAlertLevel(aqi);
  const Icon = alert.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-0 right-0 z-50 mx-auto w-[90%] max-w-2xl"
      >
        <div className={`relative flex items-center gap-4 rounded-xl border ${alert.borderColor} ${alert.bgColor} p-4 ${alert.shadowColor} backdrop-blur-md`}>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${alert.iconBg} ${alert.iconColor}`}>
            <Icon className="h-6 w-6 animate-pulse" />
          </div>
          
          <div className="flex-1">
            <h4 className={`text-lg font-bold ${alert.iconColor}`}>{alert.title}</h4>
            <p className={`text-sm ${alert.iconColor}/80`}>
              {alert.message}
            </p>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className={`absolute right-2 top-2 rounded-lg p-1 transition-colors ${alert.iconColor} hover:${alert.iconBg}`}
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartAlert;
