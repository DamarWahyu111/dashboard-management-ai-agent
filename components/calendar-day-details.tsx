'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Users, AlertCircle, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MockCalendarEvent, MockSheetEntry } from '@/lib/mock-apis';

interface CalendarDayDetailsProps {
  date: Date;
  events: MockCalendarEvent[];
  tasks: MockSheetEntry[];
}

export function CalendarDayDetails({ date, events, tasks }: CalendarDayDetailsProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const MESSAGE_PREVIEW_LENGTH = 100;

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-400" />;
      case 'in_progress': return <Circle size={16} className="text-blue-400" />;
      default: return <Circle size={16} className="text-gray-400" />;
    }
  };

  if (events.length === 0 && tasks.length === 0) {
    return (
      <Card className="bg-black border border-gray-800 p-6 mt-4">
        <div className="text-center py-8 text-gray-400">
          <CalendarIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>Tidak ada meeting, task, atau deadline untuk {date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black border border-gray-800 p-6 mt-4">
      <h3 className="text-xl font-bold text-white mb-4">
        {date.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h3>

      <div className="space-y-4">
        {/* Meetings/Events */}
        {events.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <CalendarIcon size={18} className="text-blue-400" />
              Meetings & Events ({events.length})
            </h4>
            <div className="space-y-2">
              {events.map((event) => (
                <Card key={event.id} className="bg-gray-900 border border-gray-800 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{event.title}</h5>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>
                            {new Date(event.startTime).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(event.endTime).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        )}
                      </div>
                      {event.attendees.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400">
                          {event.attendees.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {tasks.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-400" />
              Tasks & Deadlines ({tasks.length})
            </h4>
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-gray-900 border border-gray-800 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(task.status)}
                        <h5 className="text-white font-medium">{task.task}</h5>
                        {task.priority && (
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="mb-2">
                        {task.notes && task.notes.length > MESSAGE_PREVIEW_LENGTH ? (
                          <div>
                            <p className="text-sm text-slate-300">
                              {expandedTasks.has(task.id) 
                                ? task.notes 
                                : `${task.notes.substring(0, MESSAGE_PREVIEW_LENGTH)}...`}
                            </p>
                            <Button
                              onClick={() => toggleExpand(task.id)}
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-xs text-white hover:text-gray-300 p-0 h-auto"
                            >
                              {expandedTasks.has(task.id) ? (
                                <>
                                  <ChevronUp size={12} className="mr-1" />
                                  Sembunyikan Detail
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={12} className="mr-1" />
                                  Detail
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-300">{task.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <span>Status: {task.status}</span>
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>Assignee: {task.assignee}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>Source: {task.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
