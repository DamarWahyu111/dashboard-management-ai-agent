'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { DateRangePicker } from './date-range-picker';
import { getMockGoogleCalendarEvents, type MockCalendarEvent } from '@/lib/mock-apis';

interface CalendarViewProps {
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function CalendarView({ dateRange: initialDateRange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const calendarEvents = useMemo(() => getMockGoogleCalendarEvents(), []);

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
      <Card className="bg-slate-800 border-slate-700 p-6">
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
                  className="text-slate-400 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="text-slate-400 hover:text-white"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="text-slate-400 hover:text-white"
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
                className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Clear Range
              </Button>
            )}
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-slate-400 text-xs font-semibold p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday =
              day &&
              new Date().getDate() === day &&
              new Date().getMonth() === (dateRange ? dateRange.start.getMonth() : currentDate.getMonth()) &&
              new Date().getFullYear() === (dateRange ? dateRange.start.getFullYear() : currentDate.getFullYear());

            return (
              <div
                key={index}
                className={`p-2 rounded-lg min-h-24 border-2 ${
                  day
                    ? isToday
                      ? 'border-blue-500 bg-blue-900/20'
                      : dayEvents.length > 0
                        ? 'border-slate-600 bg-slate-700/50'
                        : 'border-slate-700 bg-slate-700/30'
                    : 'bg-transparent border-transparent'
                }`}
              >
                {day && (
                  <div>
                    <div className={`text-sm font-semibold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-600 text-white rounded px-1.5 py-0.5 truncate hover:bg-blue-700 cursor-pointer"
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-400 px-1.5">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
