'use client';

import { useMemo } from 'react';
import { getAllMembers, getMembersByTeam } from '@/lib/team-members';
import { getAllTeams } from '@/lib/teams';
import { getMockGoogleSheetEntries, getMockGoogleCalendarEvents } from '@/lib/mock-apis';

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
      <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
    </div>
  );
}

export function StatisticsCards() {
  const stats = useMemo(() => {
    const members = getAllMembers();
    const teams = getAllTeams();
    const tasks = getMockGoogleSheetEntries();
    const events = getMockGoogleCalendarEvents();
    
    // Filter for this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const thisWeekTasks = tasks.filter(t => {
      const taskDate = new Date(t.deadline || t.date);
      return taskDate >= weekStart;
    });
    
    const thisWeekEvents = events.filter(e => {
      const eventDate = new Date(e.startTime);
      return eventDate >= weekStart;
    });
    
    const completedTasks = thisWeekTasks.filter(t => t.status === 'completed').length;
    const totalTasks = thisWeekTasks.length;
    const avgEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate from BOT data (whatsapp source)
    const botTasks = tasks.filter(t => t.source === 'whatsapp');
    const botEvents = events.filter(e => 
      e.attendees.some(a => a.includes('@')) // Events from BOT
    );
    
    return {
      teamMembers: members.length,
      tasksCompleted: completedTasks,
      avgEfficiency,
      meetingsThisWeek: thisWeekEvents.length,
      botTasks: botTasks.length,
      botEvents: botEvents.length,
      totalTeams: teams.length,
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatCard 
        title="Team Members" 
        value={stats.teamMembers} 
        subtitle="Total active members" 
      />
      <StatCard 
        title="Tasks Completed" 
        value={stats.tasksCompleted} 
        subtitle={`From ${stats.botTasks} BOT tasks this week`} 
      />
      <StatCard 
        title="Avg Efficiency" 
        value={`${stats.avgEfficiency}%`} 
        subtitle="Team average" 
      />
      <StatCard 
        title="Meetings This Week" 
        value={stats.meetingsThisWeek} 
        subtitle={`${stats.botEvents} from BOT scheduling`} 
      />
      <StatCard 
        title="Total Teams" 
        value={stats.totalTeams} 
        subtitle="Active teams" 
      />
      <StatCard 
        title="BOT Tasks" 
        value={stats.botTasks} 
        subtitle="Tasks from WA BOT" 
      />
    </div>
  );
}
