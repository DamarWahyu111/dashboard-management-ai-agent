// Dashboard data generation and management

export interface MetricValue {
  label: string;
  value: number;
  trend?: number;
  color?: string;
}

export interface DashboardMetrics {
  efficiency: MetricValue;
  taskCount: MetricValue;
  views: MetricValue;
  revenue: MetricValue;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TeamWorkload {
  name: string;
  value: number;
  fill: string;
}

export type TimeframeType = 'thisWeek' | 'thisMonth' | 'custom';

function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrendPercent(): number {
  return (Math.random() - 0.5) * 20;
}

export function generateDashboardMetrics(timeframe: TimeframeType): DashboardMetrics {
  return {
    efficiency: {
      label: 'Efficiency',
      value: getRandomValue(85, 98),
      trend: generateTrendPercent(),
      color: 'from-orange-400 to-orange-600'
    },
    taskCount: {
      label: 'Active Tasks',
      value: getRandomValue(2000, 2500),
      trend: generateTrendPercent(),
      color: 'from-purple-400 to-purple-600'
    },
    views: {
      label: 'Total Views',
      value: getRandomValue(30000, 32000),
      trend: generateTrendPercent(),
      color: 'from-cyan-400 to-cyan-600'
    },
    revenue: {
      label: 'Revenue',
      value: getRandomValue(2000, 3200),
      trend: generateTrendPercent(),
      color: 'from-pink-400 to-pink-600'
    }
  };
}

export function generateWorkloadChart(): TeamWorkload[] {
  const colors = ['#f97316', '#a855f7', '#06b6d4', '#ec4899', '#3b82f6'];
  return [
    { name: 'Team A', value: getRandomValue(40, 60), fill: colors[0] },
    { name: 'Team B', value: getRandomValue(30, 50), fill: colors[1] },
    { name: 'Team C', value: getRandomValue(35, 55), fill: colors[2] },
    { name: 'Team D', value: getRandomValue(25, 45), fill: colors[3] },
    { name: 'Team E', value: getRandomValue(30, 50), fill: colors[4] }
  ];
}

export function generateInputSourcesChart(): ChartDataPoint[] {
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  return hours.map(hour => ({
    name: hour,
    value: getRandomValue(1000, 3000)
  }));
}

export function generateActivitiesChart(): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    value: getRandomValue(20000, 80000)
  }));
}

export function generateDoughnutData(): ChartDataPoint[] {
  return [
    { name: 'Lorem', value: 35, fill: '#f97316' },
    { name: 'Venit', value: 28, fill: '#a855f7' },
    { name: 'Ipsum', value: 37, fill: '#06b6d4' }
  ];
}

export function generateRadarData(): ChartDataPoint[] {
  return [
    { name: 'Aliqua', value: 68, fill: '#f97316' },
    { name: 'Veniam', value: 33, fill: '#a855f7' },
    { name: 'Cullum', value: 21, fill: '#06b6d4' }
  ];
}

export function getTimeframeLabel(timeframe: TimeframeType): string {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  if (timeframe === 'thisWeek') {
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  } else if (timeframe === 'thisMonth') {
    return `${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  return 'Custom Range';
}
