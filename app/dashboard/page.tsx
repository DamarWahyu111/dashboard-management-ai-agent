'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MetricCard } from '@/components/metric-card';
import { DashboardCharts } from '@/components/dashboard-charts';
import { AIAgent } from '@/components/ai-agent';
import { CalendarView } from '@/components/calendar-view';
import { CalendarDayDetails } from '@/components/calendar-day-details';
import { BotTaskProcessor } from '@/components/bot-task-processor';
import { StatisticsCards } from '@/components/statistics-cards';
import { TeamMembersManager } from '@/components/team-members-manager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/auth';
import { generateDashboardMetrics, type TimeframeType } from '@/lib/dashboard';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { AISimpleInput } from '@/components/ai-simple-input';
import type { MockCalendarEvent, MockSheetEntry } from '@/lib/mock-apis';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('week');
  const [metrics, setMetrics] = useState(generateDashboardMetrics('week'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<MockCalendarEvent[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<MockSheetEntry[]>([]);
  const [additionalEvents, setAdditionalEvents] = useState<MockCalendarEvent[]>([]);
  const [additionalTasks, setAdditionalTasks] = useState<MockSheetEntry[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }

    // Handle hash navigation (e.g., #calendar)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'calendar') {
        setActiveTab('overview');
        // Scroll to calendar section
        setTimeout(() => {
          const calendarSection = document.getElementById('team-calendar');
          if (calendarSection) {
            calendarSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (hash && ['overview', 'charts', 'statistics', 'ai'].includes(hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('overview');
      }
    };

    // Handle custom events from sidebar
    const handleNavigateToCalendar = () => {
      setActiveTab('overview');
      window.location.hash = 'calendar';
      setTimeout(() => {
        const calendarSection = document.getElementById('team-calendar');
        if (calendarSection) {
          calendarSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    const handleNavigateToTab = (event: CustomEvent) => {
      const tab = event.detail;
      if (['overview', 'charts', 'statistics', 'ai'].includes(tab)) {
        setActiveTab(tab);
        window.location.hash = tab === 'overview' ? '' : tab;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('navigateToCalendar', handleNavigateToCalendar as EventListener);
    window.addEventListener('navigateToTab', handleNavigateToTab as EventListener);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('navigateToCalendar', handleNavigateToCalendar as EventListener);
      window.removeEventListener('navigateToTab', handleNavigateToTab as EventListener);
    };
  }, [router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMetrics(generateDashboardMetrics(timeframe));
    setIsRefreshing(false);
  };

  const handleTimeframeChange = (newTimeframe: TimeframeType) => {
    setTimeframe(newTimeframe);
    setMetrics(generateDashboardMetrics(newTimeframe));
  };

  if (!user) {
    return null;
  }

  const handleNavigateToCalendar = () => {
    setActiveTab('overview');
    window.location.hash = 'calendar';
    setTimeout(() => {
      const calendarSection = document.getElementById('team-calendar');
      if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDateSelect = (date: Date, events: MockCalendarEvent[], tasks: MockSheetEntry[]) => {
    setSelectedCalendarDate(date);
    setSelectedDateEvents(events);
    setSelectedDateTasks(tasks);
    // Scroll to details
    setTimeout(() => {
      const detailsSection = document.getElementById('calendar-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <DashboardLayout userName={user.name} userEmail={user.email}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="ai">AI Orchestration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => handleTimeframeChange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'week'
                    ? 'bg-white text-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => handleTimeframeChange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'month'
                    ? 'bg-white text-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                This Month
              </button>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-white"
              variant="outline"
              size="sm"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label={metrics.efficiency.label}
              value={metrics.efficiency.value}
              trend={metrics.efficiency.trend}
              color="from-orange-400 to-orange-600"
            />
            <MetricCard
              label={metrics.taskCount.label}
              value={metrics.taskCount.value}
              trend={metrics.taskCount.trend}
              color="from-purple-400 to-purple-600"
            />
            <MetricCard
              label={metrics.views.label}
              value={metrics.views.value}
              trend={metrics.views.trend}
              color="from-cyan-400 to-cyan-600"
            />
            <MetricCard
              label={metrics.revenue.label}
              value={`$${metrics.revenue.value}`}
              trend={metrics.revenue.trend}
              color="from-pink-400 to-pink-600"
            />
          </div>

          {/* Calendar Widget */}
          <div id="team-calendar" className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Team Calendar</h3>
              <Button
                onClick={handleNavigateToCalendar}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-200 text-black border-white flex items-center gap-2"
              >
                <CalendarIcon size={16} />
                <span>Lihat Detail Calendar</span>
              </Button>
            </div>
            <CalendarView 
              showDetailsBelow={true}
              onDateSelect={handleDateSelect}
              customEvents={additionalEvents}
              customTasks={additionalTasks}
            />
            <p className="text-sm text-slate-400 mt-2">
              💡 Klik pada tanggal untuk melihat detail task, meeting, dan deadline di bawah calendar.
            </p>
            
            {/* Calendar Day Details - Show below calendar */}
            {selectedCalendarDate && (
              <div id="calendar-details" className="mt-4">
                <CalendarDayDetails 
                  date={selectedCalendarDate}
                  events={selectedDateEvents}
                  tasks={selectedDateTasks}
                />
              </div>
            )}
          </div>

          {/* Quick Insight */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6">
            <h3 className="text-white font-semibold mb-2">AI Quick Insights</h3>
            <p className="text-slate-400 text-sm">
              Go to the "AI Orchestration" tab to process what you're working on and get smart scheduling recommendations.
            </p>
          </div>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Advanced Analytics</h2>
          <DashboardCharts />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6 mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Team Statistics</h2>
              <p className="text-slate-400 text-sm">Data dari BOT WA dan team members</p>
            </div>
            <StatisticsCards />
            
            <div className="border-t border-slate-700 pt-6 mt-6">
              <h2 className="text-xl font-bold text-white mb-2">Team Members Management</h2>
              <TeamMembersManager />
            </div>
          </div>
        </TabsContent>

        {/* AI Orchestration Tab */}
        <TabsContent value="ai" className="space-y-6 mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">WA BOT Integration</h2>
              <p className="text-slate-400 text-sm mb-4">
                Simulasi input dari WA BOT. Task akan otomatis di-sync ke Google Sheets, Google Calendar, dan Slack.
              </p>
            </div>
            <BotTaskProcessor 
              onTaskProcessed={(result) => {
                // Add processed task and event to calendar
                if (result.task) {
                  setAdditionalTasks((prev) => [...prev, result.task]);
                }
                if (result.calendarEvent) {
                  setAdditionalEvents((prev) => [...prev, result.calendarEvent!]);
                }
                // Refresh page to show new items
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }}
            />
            
            <div className="border-t border-slate-700 pt-6 mt-6">
              <h2 className="text-xl font-bold text-white mb-2">AI Agent</h2>
              <AIAgent />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
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
