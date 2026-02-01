'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MetricCard } from '@/components/metric-card';
import { DashboardCharts } from '@/components/dashboard-charts';
import { AIAgent } from '@/components/ai-agent';
import { CalendarView } from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import { generateDashboardMetrics, type TimeframeType } from '@/lib/dashboard';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('week' as TimeframeType);
  const [metrics, setMetrics] = useState(generateDashboardMetrics('week' as TimeframeType));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUser = getCurrentUser();
    if (localUser) {
      console.log("✅ User detected");
      setUser(localUser);
      setIsLoading(false);
    } else {
      console.log("❌ No user found, redirecting...");
      router.push('/login');
    }
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

  // 6. TAMPILAN LOADING (Mencegah kedip/flash)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse">Syncing Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // 7. RENDER DASHBOARD (UI ASLI KAMU)
  return (
    <DashboardLayout userName={user.name} userEmail={user.email}>
      <Tabs defaultValue="overview" className="w-full">
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
                onClick={() => handleTimeframeChange('week' as TimeframeType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === ('week' as TimeframeType)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => handleTimeframeChange('month' as TimeframeType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === ('month' as TimeframeType)
                    ? 'bg-blue-600 text-white'
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
              value={metrics.revenue.value as unknown as number}
              trend={metrics.revenue.trend}
              color="from-pink-400 to-pink-600"
            />
          </div>

          {/* Calendar Widget */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Team Calendar</h3>
            <CalendarView />
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
          <h2 className="text-xl font-bold text-white mb-4">Team Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatCard title="Team Members" value="12" subtitle="Active this week" />
            <StatCard title="Tasks Completed" value="48" subtitle="+8 from last week" />
            <StatCard title="Avg Efficiency" value="78%" subtitle="Team average" />
            <StatCard title="Meetings This Week" value="14" subtitle="Total scheduled" />
            <StatCard title="Docs Created" value="23" subtitle="Shared with team" />
            <StatCard title="AI Suggestions Used" value="31" subtitle="Accepted by team" />
          </div>
        </TabsContent>

        {/* AI Orchestration Tab */}
        <TabsContent value="ai" className="space-y-6 mt-6">
          <AIAgent />
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
    <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
      <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
    </div>
  );
}