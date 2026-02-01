// Dashboard data generation and management

import { getAllTeams } from './teams';
import { getAllMembers, getMembersByTeam } from './team-members';
import { getMockGoogleSheetEntries, getMockGoogleCalendarEvents } from './mock-apis';

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

export type TimeframeType = 'week' | 'month' | 'custom';

function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrendPercent(): number {
  return (Math.random() - 0.5) * 20;
}

export function generateDashboardMetrics(timeframe: TimeframeType): DashboardMetrics {
  // Get actual data from BOT and teams
  const tasks = getMockGoogleSheetEntries();
  const events = getMockGoogleCalendarEvents();
  const teams = getAllTeams();
  const members = getAllMembers();
  
  // Filter by timeframe
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const isWeek = timeframe === 'week';
  const startDate = isWeek ? weekStart : monthStart;
  
  const filteredTasks = tasks.filter(t => {
    const taskDate = new Date(t.deadline || t.date);
    return taskDate >= startDate;
  });
  
  const filteredEvents = events.filter(e => {
    const eventDate = new Date(e.startTime);
    return eventDate >= startDate;
  });
  
  // Calculate metrics from actual data
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const totalTasks = filteredTasks.length;
  const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate trend (compare with previous period)
  const prevStart = new Date(startDate);
  prevStart.setDate(startDate.getDate() - (isWeek ? 7 : 30));
  
  const prevTasks = tasks.filter(t => {
    const taskDate = new Date(t.deadline || t.date);
    return taskDate >= prevStart && taskDate < startDate;
  });
  const prevCompleted = prevTasks.filter(t => t.status === 'completed').length;
  const prevEfficiency = prevTasks.length > 0 ? (prevCompleted / prevTasks.length) * 100 : 0;
  const efficiencyTrend = prevEfficiency > 0 ? ((efficiency - prevEfficiency) / prevEfficiency) * 100 : 0;
  
  return {
    efficiency: {
      label: 'Efficiency',
      value: efficiency,
      trend: efficiencyTrend,
      color: 'from-white to-gray-400'
    },
    taskCount: {
      label: 'Active Tasks',
      value: totalTasks,
      trend: totalTasks > prevTasks.length ? ((totalTasks - prevTasks.length) / prevTasks.length) * 100 : 0,
      color: 'from-white to-gray-400'
    },
    views: {
      label: 'Total Events',
      value: filteredEvents.length,
      trend: filteredEvents.length > 0 ? 5.2 : 0,
      color: 'from-white to-gray-400'
    },
    revenue: {
      label: 'Team Members',
      value: members.length,
      trend: members.length > 0 ? 2.5 : 0,
      color: 'from-white to-gray-400'
    }
  };
}

export function generateWorkloadChart(): TeamWorkload[] {
  const colors = ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040'];
  const teams = getAllTeams();
  
  if (teams.length === 0) {
    return [];
  }
  
  // Calculate workload for each team based on tasks and events
  const tasks = getMockGoogleSheetEntries();
  const events = getMockGoogleCalendarEvents();
  
  return teams.map((team, index) => {
    const teamMembers = getMembersByTeam(team.id);
    const teamTasks = tasks.filter(t => 
      teamMembers.some(m => m.email === t.assignee) || 
      !t.assignee // Include unassigned tasks
    );
    const teamEvents = events.filter(e => 
      teamMembers.some(m => e.attendees.includes(m.email))
    );
    
    // Calculate workload: tasks + events
    const workload = teamTasks.length * 2 + teamEvents.length * 1.5;
    
    return {
      name: team.name,
      value: Math.round(workload),
      fill: colors[index % colors.length]
    };
  });
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
    { name: 'Completed', value: 35, fill: '#ffffff' },
    { name: 'In Progress', value: 28, fill: '#d4d4d4' },
    { name: 'Pending', value: 37, fill: '#a3a3a3' }
  ];
}

export function generateRadarData(): ChartDataPoint[] {
  return [
    { name: 'Tasks', value: 68, fill: '#ffffff' },
    { name: 'Events', value: 33, fill: '#d4d4d4' },
    { name: 'Members', value: 21, fill: '#a3a3a3' }
  ];
}

export function getTimeframeLabel(timeframe: TimeframeType): string {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  if (timeframe === 'week') {
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  } else if (timeframe === 'month') {
    return `${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  return 'Custom Range';
}
