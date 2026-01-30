'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export function AISuggestions() {
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Team Workload Optimization',
      description: 'Based on current metrics, Team B appears to be underutilized. Consider redistributing tasks.',
      action: 'View Team B',
      priority: 'medium',
    },
    {
      id: '2',
      title: 'Peak Activity Hours',
      description: 'Maximum team activity occurs between 2-4 PM. Schedule important meetings accordingly.',
      action: 'View Calendar',
      priority: 'low',
    },
    {
      id: '3',
      title: 'Resource Allocation',
      description: 'Current efficiency is at 92%. Allocate 2 more team members to critical tasks to reach 95%.',
      action: 'Manage Teams',
      priority: 'high',
    },
  ];

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-900/10';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-900/10';
      case 'low':
        return 'border-l-blue-500 bg-blue-900/10';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-400" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Smart insights based on your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border-l-4 p-4 rounded ${getPriorityColor(suggestion.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-3">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-slate-600 hover:bg-slate-700 bg-transparent"
              >
                {suggestion.action}
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
