import React from "react"
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: number;
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
}

export function MetricCard({ label, value, trend, icon, color }: MetricCardProps) {
  const bgGradient = color || 'from-blue-400 to-blue-600';
  const isTrendUp = trend !== undefined && trend >= 0;

  return (
    <Card className={`bg-gradient-to-br ${bgGradient} border-0 text-white p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">
            {value.toLocaleString()}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-3 text-sm">
              {isTrendUp ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="opacity-90">
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="opacity-80">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
