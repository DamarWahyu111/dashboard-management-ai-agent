'use client';

import React from "react"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, Slack, Cloud, Database, CheckCircle2, Plus } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
}

export function DataSourcesPanel() {
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Google Calendar',
      description: 'Sync your calendar events',
      icon: <Calendar className="w-8 h-8" />,
      isConnected: true,
    },
    {
      id: '2',
      name: 'Email',
      description: 'Connect your email account',
      icon: <Mail className="w-8 h-8" />,
      isConnected: false,
    },
    {
      id: '3',
      name: 'Slack',
      description: 'Integrate with Slack workspace',
      icon: <Slack className="w-8 h-8" />,
      isConnected: true,
    },
    {
      id: '4',
      name: 'Cloud Storage',
      description: 'Connect to AWS, Google Cloud, Azure',
      icon: <Cloud className="w-8 h-8" />,
      isConnected: false,
    },
    {
      id: '5',
      name: 'Database',
      description: 'Connect to your databases',
      icon: <Database className="w-8 h-8" />,
      isConnected: false,
    },
  ]);

  const toggleConnection = (id: string) => {
    setSources(sources.map(source =>
      source.id === id ? { ...source, isConnected: !source.isConnected } : source
    ));
  };

  const connectedCount = sources.filter(s => s.isConnected).length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Connected Sources</CardTitle>
          <CardDescription>
            {connectedCount} of {sources.length} data sources connected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(connectedCount / sources.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-slate-400">
                  {source.icon}
                </div>
                {source.isConnected && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>

              <h3 className="text-white font-semibold mb-1">{source.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{source.description}</p>

              <Button
                onClick={() => toggleConnection(source.id)}
                variant={source.isConnected ? 'outline' : 'default'}
                size="sm"
                className={`w-full ${source.isConnected
                  ? 'border-green-600 text-green-400 hover:bg-green-900/20'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {source.isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Custom Source */}
        <Card className="bg-slate-800 border-dashed border-slate-700 hover:border-slate-600 transition-colors">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="text-slate-400 mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-white font-semibold mb-1">Add Custom Source</h3>
            <p className="text-sm text-slate-400 text-center mb-4">
              Connect any custom data source or API
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
              Add Custom
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Preview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar size={20} />
            Calendar Events
          </CardTitle>
          <CardDescription>
            Events from connected sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { title: 'Team Standup', time: 'Today at 10:00 AM', source: 'Slack' },
              { title: 'Project Review', time: 'Tomorrow at 2:00 PM', source: 'Google Calendar' },
              { title: 'One-on-One', time: 'Wed at 3:00 PM', source: 'Google Calendar' },
            ].map((event, idx) => (
              <div key={idx} className="p-3 bg-slate-700 rounded-lg flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{event.title}</p>
                  <p className="text-xs text-slate-400">{event.time}</p>
                </div>
                <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                  {event.source}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
