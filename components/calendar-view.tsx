'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { DateRangePicker } from './date-range-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getMockGoogleCalendarEvents, getMockGoogleSheetEntries, type MockCalendarEvent, type MockSheetEntry } from '@/lib/mock-apis';

interface CalendarViewProps {
  dateRange?: {
    start: Date;
    end: Date;
  };
  onDateClick?: (date: Date) => void;
  compact?: boolean;
  showDetailsBelow?: boolean; // If true, show details below calendar instead of popup
  onDateSelect?: (date: Date, events: MockCalendarEvent[], tasks: MockSheetEntry[]) => void;
  customEvents?: MockCalendarEvent[]; // Additional events to display
  customTasks?: MockSheetEntry[]; // Additional tasks to display
}

export function CalendarView({ 
  dateRange: initialDateRange, 
  onDateClick, 
  compact = false,
  showDetailsBelow = false,
  onDateSelect,
  customEvents = [],
  customTasks = []
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const baseEvents = useMemo(() => getMockGoogleCalendarEvents(), []);
  const baseTasks = useMemo(() => getMockGoogleSheetEntries(), []);
  const calendarEvents = useMemo(() => [...baseEvents, ...customEvents], [baseEvents, customEvents]);
  const tasks = useMemo(() => [...baseTasks, ...customTasks], [baseTasks, customTasks]);

  // Get events for the current month or date range
  const getEventsForMonth = () => {
    const start = dateRange?.start || new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = dateRange?.end || new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= start && eventDate <= end;
    });
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear();
    const month = dateRange ? dateRange.start.getMonth() : currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc)
  const getFirstDayOfMonth = () => {
    const year = dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear();
    const month = dateRange ? dateRange.start.getMonth() : currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const monthEvents = getEventsForMonth();
  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getEventsForDay = (day: number): MockCalendarEvent[] => {
    const year = dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear();
    const month = dateRange ? dateRange.start.getMonth() : currentDate.getMonth();
    const dayDate = new Date(year, month, day, 0, 0, 0);

    return monthEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year;
    });
  };

  const getTasksForDay = (day: number): MockSheetEntry[] => {
    const year = dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear();
    const month = dateRange ? dateRange.start.getMonth() : currentDate.getMonth();
    const dayDate = new Date(year, month, day, 0, 0, 0);

    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline || task.date);
      return taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year;
    });
  };

  const handleDateClick = (day: number) => {
    const year = dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear();
    const month = dateRange ? dateRange.start.getMonth() : currentDate.getMonth();
    const clickedDate = new Date(year, month, day);
    
    setSelectedDate(clickedDate);
    
    const dayEvents = getEventsForDate(clickedDate);
    const dayTasks = getTasksForDate(clickedDate);
    
    if (showDetailsBelow) {
      // Show details below calendar instead of popup
      setShowDayDetails(false);
      if (onDateSelect) {
        onDateSelect(clickedDate, dayEvents, dayTasks);
      }
    } else {
      // Show popup dialog
      setShowDayDetails(true);
    }
    
    if (onDateClick) {
      onDateClick(clickedDate);
    }
  };

  const getEventsForDate = (date: Date): MockCalendarEvent[] => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  };

  const getTasksForDate = (date: Date): MockSheetEntry[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline || task.date);
      return taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear();
    });
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

  const monthName = dateRange
    ? dateRange.start.toLocaleString('default', { month: 'long', year: 'numeric' })
    : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {showDatePicker && (
        <DateRangePicker
          onRangeSelect={(range) => {
            setDateRange(range);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Calendar Header */}
      <Card className="bg-black border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-white">{monthName}</h2>
          </div>
          <div className="flex gap-2">
            {!dateRange && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="text-gray-400 hover:text-white"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={() => setShowDatePicker(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {dateRange ? 'Change Date Range' : 'Custom Range'}
            </Button>
            {dateRange && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateRange(undefined)}
                className="bg-gray-900 hover:bg-gray-800 text-white border-gray-800"
              >
                Clear Range
              </Button>
            )}
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-gray-400 text-xs font-semibold p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const dayTasks = day ? getTasksForDay(day) : [];
            const totalItems = dayEvents.length + dayTasks.length;
            const isToday =
              day &&
              new Date().getDate() === day &&
              new Date().getMonth() === (dateRange ? dateRange.start.getMonth() : currentDate.getMonth()) &&
              new Date().getFullYear() === (dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear());

            return (
              <div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`p-2 rounded-lg ${compact ? 'min-h-16' : 'min-h-24'} border-2 ${
                  day
                    ? isToday
                      ? 'border-blue-500 bg-blue-900/20 cursor-pointer hover:bg-blue-900/30'
                      : totalItems > 0
                        ? 'border-gray-800 bg-gray-900/50 cursor-pointer hover:bg-gray-900/70'
                        : 'border-gray-800 bg-gray-900/30 cursor-pointer hover:bg-gray-900/50'
                    : 'bg-transparent border-transparent'
                } transition-colors`}
              >
                {day && (
                  <div>
                    <div className={`text-sm font-semibold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {day}
                    </div>
                    {!compact && (
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs bg-blue-600 text-white rounded px-1.5 py-0.5 truncate"
                            title={event.title}
                          >
                            📅 {event.title}
                          </div>
                        ))}
                        {dayTasks.slice(0, 2 - dayEvents.length).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs ${getPriorityColor(task.priority)} rounded px-1.5 py-0.5 truncate`}
                            title={task.task}
                          >
                            ✓ {task.task}
                          </div>
                        ))}
                        {totalItems > 2 && (
                          <div className="text-xs text-gray-400 px-1.5">
                            +{totalItems - 2} more
                          </div>
                        )}
                      </div>
                    )}
                    {compact && totalItems > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-400">{totalItems}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Day Details Dialog */}
        <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-black border border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedDate?.toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Semua task, meeting, dan deadline untuk hari ini
              </DialogDescription>
            </DialogHeader>

            {selectedDate && (
              <div className="space-y-4 mt-4">
                {/* Meetings/Events */}
                {getEventsForDate(selectedDate).length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <CalendarIcon size={18} className="text-blue-400" />
                      Meetings & Events
                    </h3>
                    <div className="space-y-2">
                      {getEventsForDate(selectedDate).map((event) => (
                        <Card key={event.id} className="bg-gray-900 border border-gray-800 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{event.title}</h4>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
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
                                <div className="mt-2 text-xs text-gray-400">
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
                {getTasksForDate(selectedDate).length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-orange-400" />
                      Tasks & Deadlines
                    </h3>
                    <div className="space-y-2">
                      {getTasksForDate(selectedDate).map((task) => (
                        <Card key={task.id} className="bg-gray-900 border border-gray-800 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(task.status)}
                                <h4 className="text-white font-medium">{task.task}</h4>
                                {task.priority && (
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{task.notes}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
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

                {/* Empty State */}
                {getEventsForDate(selectedDate).length === 0 && 
                 getTasksForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Tidak ada meeting, task, atau deadline untuk hari ini</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
