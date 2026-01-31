// Mock API Layer - Simulates WA, Google Calendar, Google Sheets
// For PoC: Uses pattern IBM Cloud Functions would follow

export interface MockCalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  isConflicting?: boolean;
}

export interface MockSheetEntry {
  id: string;
  date: Date;
  task: string;
  source: 'whatsapp' | 'slack' | 'email';
  status: 'pending' | 'in_progress' | 'completed';
  notes: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  assignee?: string;
}

export interface MockVoiceNote {
  id: string;
  timestamp: Date;
  sender: string;
  transcription: string;
  confidence: number;
}

// Mock WA Voice Note API
export const getMockWhatsAppVoiceNotes = (): MockVoiceNote[] => {
  const now = new Date();
  return [
    {
      id: 'wa-1',
      timestamp: new Date(now.getTime() - 3600000),
      sender: 'Adnan',
      transcription: 'Hey team, kita harus selesaikan report client sebelum Jumat. This is urgent for the Monday presentation.',
      confidence: 0.92,
    },
    {
      id: 'wa-2',
      timestamp: new Date(now.getTime() - 7200000),
      sender: 'Sarah',
      transcription: 'Schedule review meeting dengan marketing team. Butuh 30 menit. Preferably Thursday afternoon.',
      confidence: 0.88,
    },
    {
      id: 'wa-3',
      timestamp: new Date(now.getTime() - 10800000),
      sender: 'John',
      transcription: 'Update database schema for new features. Need to coordinate with backend team.',
      confidence: 0.85,
    },
  ];
};

// Mock Google Calendar API
export const getMockGoogleCalendarEvents = (): MockCalendarEvent[] => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const friday = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'cal-1',
      title: 'Team Standup',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 30),
      attendees: ['adnan@company.com', 'sarah@company.com', 'john@company.com'],
    },
    {
      id: 'cal-2',
      title: 'Client Call',
      startTime: new Date(friday.getFullYear(), friday.getMonth(), friday.getDate(), 14, 0),
      endTime: new Date(friday.getFullYear(), friday.getMonth(), friday.getDate(), 15, 0),
      attendees: ['adnan@company.com', 'client@external.com'],
    },
    {
      id: 'cal-3',
      title: 'Marketing Sync',
      startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 14, 0),
      endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 14, 30),
      attendees: ['sarah@company.com', 'marketing@company.com'],
    },
  ];
};

// Mock Google Sheets API
export const getMockGoogleSheetEntries = (): MockSheetEntry[] => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const friday = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: 'sheet-1',
      date: new Date(now.getTime() - 86400000),
      task: 'Prepare Report',
      source: 'whatsapp',
      status: 'in_progress',
      notes: 'From Adnan - Urgent, due Friday for client presentation',
      priority: 'urgent',
      deadline: friday,
      assignee: 'Adnan',
    },
    {
      id: 'sheet-2',
      date: new Date(now.getTime() - 172800000),
      task: 'Review Database Schema',
      source: 'whatsapp',
      status: 'pending',
      notes: 'Backend team coordination needed',
      priority: 'high',
      deadline: dayAfterTomorrow,
      assignee: 'John',
    },
    {
      id: 'sheet-3',
      date: new Date(now.getTime() - 259200000),
      task: 'API Documentation',
      source: 'slack',
      status: 'completed',
      notes: 'Completed and reviewed by team',
      priority: 'medium',
      deadline: new Date(now.getTime() - 86400000),
      assignee: 'Sarah',
    },
    {
      id: 'sheet-4',
      date: tomorrow,
      task: 'Marketing Sync Meeting Prep',
      source: 'email',
      status: 'pending',
      notes: 'Prepare slides for marketing sync meeting',
      priority: 'high',
      deadline: tomorrow,
      assignee: 'Sarah',
    },
    {
      id: 'sheet-5',
      date: friday,
      task: 'Client Presentation Review',
      source: 'whatsapp',
      status: 'pending',
      notes: 'Final review before client presentation',
      priority: 'urgent',
      deadline: friday,
      assignee: 'Adnan',
    },
  ];
};

// Real Google Sheets API Integration (replace with actual API)
const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL || 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_SHEETS_SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || 'YOUR_SPREADSHEET_ID';
const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || 'YOUR_API_KEY';

// Simulate adding to Google Sheets
export const addToGoogleSheets = async (
  task: string,
  details: string,
  dueDate: Date,
  priority?: 'low' | 'medium' | 'high' | 'urgent',
  assignee?: string,
): Promise<MockSheetEntry> => {
  // TODO: Replace with actual Google Sheets API call
  // Example API call:
  /*
  const response = await fetch(
    `${GOOGLE_SHEETS_API_URL}/${GOOGLE_SHEETS_SPREADSHEET_ID}/values/A:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          new Date().toISOString(),
          task,
          details,
          dueDate.toISOString(),
          priority || 'medium',
          assignee || '',
          'pending'
        ]],
      }),
    }
  );
  const data = await response.json();
  */

  return new Promise((resolve) => {
    setTimeout(() => {
      const entry: MockSheetEntry = {
        id: `sheet-${Date.now()}`,
        date: new Date(),
        task,
        source: 'whatsapp',
        status: 'pending',
        notes: details,
        priority: priority || 'medium',
        deadline: dueDate,
        assignee: assignee,
      };
      resolve(entry);
    }, 300);
  });
};

// Real Google Calendar API Integration (replace with actual API)
const GOOGLE_CALENDAR_API_URL = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_URL || 'https://www.googleapis.com/calendar/v3/calendars';
const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'primary';
const GOOGLE_CALENDAR_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || 'YOUR_API_KEY';

// Simulate adding to Google Calendar
export const addToGoogleCalendar = async (
  title: string,
  startTime: Date,
  endTime: Date,
  attendees: string[],
): Promise<MockCalendarEvent> => {
  // TODO: Replace with actual Google Calendar API call
  // Example API call:
  /*
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_URL}/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOOGLE_CALENDAR_ACCESS_TOKEN}`, // Use OAuth token
      },
      body: JSON.stringify({
        summary: title,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: attendees.map(email => ({ email })),
      }),
    }
  );
  const data = await response.json();
  */

  return new Promise((resolve) => {
    setTimeout(() => {
      const event: MockCalendarEvent = {
        id: `cal-${Date.now()}`,
        title,
        startTime,
        endTime,
        attendees,
      };
      resolve(event);
    }, 300);
  });
};

// Detect conflicts between action items and calendar
export const detectConflictBetweenActionAndCalendar = (
  actionItem: { title: string; dueDate?: Date; estimatedHours?: number },
  calendarEvents: MockCalendarEvent[],
): { hasConflict: boolean; conflictingEvent?: MockCalendarEvent; suggestion?: string } => {
  if (!actionItem.dueDate) {
    return { hasConflict: false };
  }

  const actionDate = new Date(actionItem.dueDate);
  const actionDateStart = new Date(actionDate.getFullYear(), actionDate.getMonth(), actionDate.getDate(), 0, 0);
  const actionDateEnd = new Date(actionDate.getFullYear(), actionDate.getMonth(), actionDate.getDate(), 23, 59);

  const conflictingEvent = calendarEvents.find((event) => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate >= actionDateStart &&
      eventDate <= actionDateEnd
    );
  });

  if (conflictingEvent) {
    return {
      hasConflict: true,
      conflictingEvent,
      suggestion: `Consider moving "${conflictingEvent.title}" to ${new Date(conflictingEvent.startTime.getTime() + 86400000).toLocaleDateString()} or extend work to next day`,
    };
  }

  return { hasConflict: false };
};

// Check available time slots
export const findAvailableTimeSlots = (
  calendarEvents: MockCalendarEvent[],
  targetDate: Date,
  durationMinutes: number,
): Array<{ startTime: Date; endTime: Date; availability: 'high' | 'medium' | 'low' }> => {
  const slots: Array<{ startTime: Date; endTime: Date; availability: 'high' | 'medium' | 'low' }> = [];
  const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 8, 0);
  const dayEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 18, 0);

  let currentTime = new Date(dayStart);

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
    const isConflicting = calendarEvents.some((event) => {
      return (
        (currentTime >= event.startTime && currentTime < event.endTime) ||
        (slotEnd > event.startTime && slotEnd <= event.endTime) ||
        (currentTime <= event.startTime && slotEnd >= event.endTime)
      );
    });

    if (!isConflicting) {
      const busySlots = calendarEvents.filter((event) => {
        const eventDate = new Date(event.startTime).toDateString() === targetDate.toDateString();
        return eventDate;
      }).length;

      let availability: 'high' | 'medium' | 'low' = 'high';
      if (busySlots > 3) availability = 'low';
      else if (busySlots > 1) availability = 'medium';

      slots.push({ startTime: new Date(currentTime), endTime: slotEnd, availability });
    }

    currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30 min intervals
  }

  return slots;
};

// Simulate Slack notification
export const sendSlackNotification = async (
  channel: string,
  message: string,
): Promise<{ success: boolean; messageId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `slack-${Date.now()}`,
      });
    }, 200);
  });
};
