import React from 'react';
import { motion } from 'framer-motion';

interface GuaranteeStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'amber' | 'gray';
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const GuaranteeStatCard: React.FC<GuaranteeStatCardProps> = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, className = '' }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  const iconClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    gray: 'text-gray-600',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-lg border p-3 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className={`h-4 w-4 ${iconClasses[color]}`} />}
            <h3 className="text-xs font-medium opacity-80">{title}</h3>
            {trend && <span className="text-xs opacity-60">{trendIcons[trend]}</span>}
          </div>
          <div className="text-xl font-bold mb-1">{value}</div>
          {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default GuaranteeStatCard;
