# API Integration Guide

## Google Sheets API Integration

### Setup
1. Dapatkan API Key dari Google Cloud Console
2. Enable Google Sheets API
3. Set environment variables:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_API_URL=https://sheets.googleapis.com/v4/spreadsheets
NEXT_PUBLIC_GOOGLE_SHEETS_ID=YOUR_SPREADSHEET_ID
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=YOUR_API_KEY
```

### Implementation
Update `lib/mock-apis.ts` function `addToGoogleSheets`:

```typescript
export const addToGoogleSheets = async (
  task: string,
  details: string,
  dueDate: Date,
  priority?: 'low' | 'medium' | 'high' | 'urgent',
  assignee?: string,
): Promise<MockSheetEntry> => {
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
  
  if (!response.ok) {
    throw new Error('Failed to add to Google Sheets');
  }
  
  const data = await response.json();
  // Return the created entry
  return {
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
};
```

## Google Calendar API Integration

### Setup
1. Dapatkan OAuth 2.0 credentials dari Google Cloud Console
2. Enable Google Calendar API
3. Set environment variables:

```env
NEXT_PUBLIC_GOOGLE_CALENDAR_API_URL=https://www.googleapis.com/calendar/v3/calendars
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=primary
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=YOUR_API_KEY
```

### Implementation
Update `lib/mock-apis.ts` function `addToGoogleCalendar`:

```typescript
export const addToGoogleCalendar = async (
  title: string,
  startTime: Date,
  endTime: Date,
  attendees: string[],
): Promise<MockCalendarEvent> => {
  // Get OAuth token (you need to implement OAuth flow)
  const accessToken = await getGoogleCalendarAccessToken();
  
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_URL}/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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
  
  if (!response.ok) {
    throw new Error('Failed to add to Google Calendar');
  }
  
  const data = await response.json();
  return {
    id: data.id,
    title: data.summary,
    startTime: new Date(data.start.dateTime),
    endTime: new Date(data.end.dateTime),
    attendees: data.attendees?.map((a: any) => a.email) || [],
  };
};
```

## WA BOT Webhook Integration

### Setup
1. Create webhook endpoint in your Next.js API route
2. Configure WA BOT to send POST requests to your webhook

### Implementation
Create `app/api/bot/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { processBotTask, type BotTaskInput } from '@/lib/bot-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse BOT input (adjust based on your BOT format)
    const botInput: BotTaskInput = {
      title: body.title,
      priority: body.priority, // 'easy' | 'medium' | 'hard'
      dueDate: new Date(body.dueDate),
      hours: body.hours,
      source: 'whatsapp',
    };
    
    // Process and auto-sync
    const result = await processBotTask(botInput);
    
    return NextResponse.json({
      success: result.success,
      taskId: result.task.id,
      syncedSystems: result.syncedSystems,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process task' },
      { status: 500 }
    );
  }
}
```

## Slack Integration

### Setup
1. Create Slack App and get Bot Token
2. Set environment variable:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
```

### Implementation
Update `lib/mock-apis.ts` function `sendSlackNotification`:

```typescript
export const sendSlackNotification = async (
  channel: string,
  message: string,
): Promise<{ success: boolean; messageId: string }> => {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel,
      text: message,
    }),
  });
  
  const data = await response.json();
  
  if (!data.ok) {
    throw new Error(data.error || 'Failed to send Slack notification');
  }
  
  return {
    success: true,
    messageId: data.ts,
  };
};
```
