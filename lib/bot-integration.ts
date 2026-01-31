// WA BOT Integration - Handle input from WhatsApp Bot
// This simulates receiving data from WA BOT and auto-processing it

import { addToGoogleSheets, addToGoogleCalendar, sendSlackNotification } from './mock-apis';
import type { MockSheetEntry, MockCalendarEvent } from './mock-apis';

export interface BotTaskInput {
  title: string;
  priority: 'easy' | 'medium' | 'hard'; // From BOT
  dueDate: Date;
  hours: number;
  source?: 'whatsapp' | 'slack' | 'email';
}

export interface BotProcessingResult {
  success: boolean;
  task: MockSheetEntry;
  calendarEvent?: MockCalendarEvent;
  syncedSystems: string[];
  notifications: string[];
}

// Map BOT priority to system priority
const mapBotPriority = (botPriority: 'easy' | 'medium' | 'hard'): 'low' | 'medium' | 'high' | 'urgent' => {
  switch (botPriority) {
    case 'easy': return 'low';
    case 'medium': return 'medium';
    case 'hard': return 'high';
    default: return 'medium';
  }
};

// Process task from WA BOT and auto-sync to systems
export const processBotTask = async (input: BotTaskInput): Promise<BotProcessingResult> => {
  const syncedSystems: string[] = [];
  const notifications: string[] = [];
  let calendarEvent: MockCalendarEvent | undefined;

  try {
    // 1. Add to Google Sheets
    const task = await addToGoogleSheets(
      input.title,
      `Task from WA BOT - Priority: ${input.priority}, Estimated hours: ${input.hours}`,
      input.dueDate,
      mapBotPriority(input.priority),
      undefined // assignee can be added later
    );
    syncedSystems.push('Google Sheets');
    notifications.push(`✓ Added to Google Sheets: ${input.title}`);

    // 2. Add to Google Calendar
    const startTime = new Date(input.dueDate);
    // Set time to the specified hour (default to 18:00 if not specified)
    const hour = startTime.getHours() || 18;
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime.getTime() + input.hours * 60 * 60 * 1000);
    
    calendarEvent = await addToGoogleCalendar(
      input.title,
      startTime,
      endTime,
      [] // attendees can be added later
    );
    syncedSystems.push('Google Calendar');
    notifications.push(`✓ Added to Google Calendar: ${input.title} at ${startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`);

    // 3. Send Slack notification for high priority tasks
    if (input.priority === 'hard') {
      await sendSlackNotification(
        '#team',
        `🔔 New high-priority task: *${input.title}*\nDue: ${input.dueDate.toLocaleDateString('id-ID')} at ${startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}\nEstimated: ${input.hours}h`
      );
      syncedSystems.push('Slack');
      notifications.push(`✓ Slack notification sent to #team`);
    }

    return {
      success: true,
      task,
      calendarEvent,
      syncedSystems,
      notifications,
    };
  } catch (error) {
    console.error('Error processing bot task:', error);
    return {
      success: false,
      task: {
        id: `error-${Date.now()}`,
        date: new Date(),
        task: input.title,
        source: input.source || 'whatsapp',
        status: 'pending',
        notes: 'Error processing task',
        priority: mapBotPriority(input.priority),
        deadline: input.dueDate,
      },
      syncedSystems,
      notifications: [...notifications, '✗ Error processing task'],
    };
  }
};

// Simulate receiving input from WA BOT
// In production, this would be called via webhook from the BOT
export const simulateBotInput = async (
  message: string
): Promise<BotTaskInput | null> => {
  // Parse message like "Saya ada deadline tugas hari ini jam 18.00"
  // In production, the BOT would extract this and send structured data
  
  // For now, return null to indicate manual input needed
  // The BOT should send structured data with title, priority, dueDate, hours
  return null;
};
