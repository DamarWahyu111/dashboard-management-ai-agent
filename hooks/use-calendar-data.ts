import { useState, useCallback } from 'react';
import { getMockGoogleCalendarEvents, getMockGoogleSheetEntries, type MockCalendarEvent, type MockSheetEntry } from '@/lib/mock-apis';

export function useCalendarData() {
  const [additionalEvents, setAdditionalEvents] = useState<MockCalendarEvent[]>([]);
  const [additionalTasks, setAdditionalTasks] = useState<MockSheetEntry[]>([]);

  const allEvents = [...getMockGoogleCalendarEvents(), ...additionalEvents];
  const allTasks = [...getMockGoogleSheetEntries(), ...additionalTasks];

  const addEvent = useCallback((event: MockCalendarEvent) => {
    setAdditionalEvents((prev) => [...prev, event]);
  }, []);

  const addTask = useCallback((task: MockSheetEntry) => {
    setAdditionalTasks((prev) => [...prev, task]);
  }, []);

  return {
    events: allEvents,
    tasks: allTasks,
    addEvent,
    addTask,
  };
}
