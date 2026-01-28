import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'bg-prospere-gray-900 border border-prospere-gray-800 rounded-xl p-6',
        'shadow-lg shadow-black/20',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  className 
}: MetricCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {icon && (
        <div className="absolute top-4 right-4 opacity-10">
          {icon}
        </div>
      )}
      <div className="relative z-10">
        <p className="text-prospere-gray-400 text-sm font-medium mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-prospere-gray-500 text-xs">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={cn(
            'mt-2 text-xs font-semibold',
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(2)}%
          </div>
        )}
      </div>
    </Card>
  );
}
