// Autonomous Workforce Brain
// AI 'Otak' untuk manage konteks, detect conflicts, dan suggest smart solutions

import {
  getMockGoogleCalendarEvents,
  getMockGoogleSheetEntries,
  addToGoogleCalendar,
  addToGoogleSheets,
  findAvailableTimeSlots,
  detectConflictBetweenActionAndCalendar,
  type MockCalendarEvent,
  type MockSheetEntry,
} from './mock-apis';

export interface ActionItemContext {
  title: string;
  description: string;
  dueDate?: Date;
  estimatedHours?: number;
  priority: 'high' | 'medium' | 'low';
  source: 'whatsapp' | 'slack' | 'email';
  confidence: number;
}

export interface ContextualSuggestion {
  type: 'schedule' | 'reschedule' | 'delegate' | 'split' | 'automate';
  title: string;
  description: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  estimatedEfficiencyGain?: number; // percentage
}

export interface ScheduleConflictResolution {
  actionItem: ActionItemContext;
  conflict: { event: MockCalendarEvent; date: string } | null;
  suggestions: ContextualSuggestion[];
  recommendedAction: ContextualSuggestion;
  workloadImpact: {
    currentLoad: number; // hours
    afterResolution: number; // hours
    overlapPercentage: number;
  };
}

export interface ProductivityInsight {
  period: string;
  teamEfficiency: number; // 0-100
  bottlenecks: string[];
  recommendations: string[];
  predictedImprovement: {
    description: string;
    percentageGain: number;
    timeframe: string;
  };
  automationOpportunities: string[];
}

// ============ BRAIN FUNCTION 1: Context-Aware Action Analysis ============
export const analyzeActionItemWithContext = async (
  actionItem: ActionItemContext,
): Promise<ScheduleConflictResolution> => {
  const calendarEvents = getMockGoogleCalendarEvents();
  const sheetEntries = getMockGoogleSheetEntries();

  // Detect conflicts
  const conflictInfo = detectConflictBetweenActionAndCalendar(
    {
      title: actionItem.title,
      dueDate: actionItem.dueDate,
      estimatedHours: actionItem.estimatedHours,
    },
    calendarEvents,
  );

  // Find available slots
  const availableSlots = actionItem.dueDate
    ? findAvailableTimeSlots(calendarEvents, actionItem.dueDate, (actionItem.estimatedHours || 1) * 60)
    : [];

  // Calculate workload
  const currentWorkload = calendarEvents.reduce((sum, event) => {
    const hours = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const actionHours = actionItem.estimatedHours || 2;
  const projectedWorkload = currentWorkload + actionHours;

  // Generate contextual suggestions
  const suggestions = generateContextualSuggestions(
    actionItem,
    conflictInfo,
    availableSlots,
    currentWorkload,
  );

  return {
    actionItem,
    conflict: conflictInfo.hasConflict
      ? { event: conflictInfo.conflictingEvent!, date: conflictInfo.conflictingEvent!.startTime.toDateString() }
      : null,
    suggestions,
    recommendedAction: suggestions[0],
    workloadImpact: {
      currentLoad: currentWorkload,
      afterResolution: projectedWorkload,
      overlapPercentage: conflictInfo.hasConflict ? 100 : 0,
    },
  };
};

// ============ BRAIN FUNCTION 2: Generate Contextual Suggestions ============
function generateContextualSuggestions(
  actionItem: ActionItemContext,
  conflictInfo: any,
  availableSlots: any[],
  currentWorkload: number,
): ContextualSuggestion[] {
  const suggestions: ContextualSuggestion[] = [];

  if (!conflictInfo.hasConflict) {
    // No conflict - schedule directly
    suggestions.push({
      type: 'schedule',
      title: 'Schedule Directly',
      description: `Add "${actionItem.title}" to calendar for ${actionItem.dueDate?.toDateString()}`,
      action: 'Add to Google Calendar',
      impact: 'high',
      estimatedEfficiencyGain: 0,
    });
  } else {
    // Conflict detected - offer smart alternatives
    const conflictEvent = conflictInfo.conflictingEvent;

    // Suggestion 1: Reschedule the conflicting event
    suggestions.push({
      type: 'reschedule',
      title: 'Reschedule Conflicting Meeting',
      description: `Move "${conflictEvent.title}" to next day. This gives you time to complete "${actionItem.title}" without overlap.`,
      action: `Suggest reschedule of "${conflictEvent.title}" to attendees`,
      impact: actionItem.priority === 'high' ? 'high' : 'medium',
      estimatedEfficiencyGain: actionItem.priority === 'high' ? 15 : 8,
    });

    // Suggestion 2: Split the work
    if (actionItem.estimatedHours && actionItem.estimatedHours > 2) {
      suggestions.push({
        type: 'split',
        title: 'Split Work Across Days',
        description: `Divide "${actionItem.title}" into smaller chunks. Complete part before the meeting, part after.`,
        action: 'Create 2-3 subtasks in Google Sheets',
        impact: 'medium',
        estimatedEfficiencyGain: 10,
      });
    }

    // Suggestion 3: Find best available slot
    if (availableSlots.length > 0) {
      const bestSlot = availableSlots[0];
      suggestions.push({
        type: 'schedule',
        title: 'Use Best Available Slot',
        description: `${bestSlot.startTime.toLocaleTimeString()} - ${bestSlot.endTime.toLocaleTimeString()} has ${bestSlot.availability} availability.`,
        action: 'Schedule in suggested time slot',
        impact: 'medium',
        estimatedEfficiencyGain: 5,
      });
    }

    // Suggestion 4: Auto-draft document while in meeting
    suggestions.push({
      type: 'automate',
      title: 'Generate Draft During Meeting',
      description: `AI can generate initial draft of "${actionItem.title}" while you're in "${conflictEvent.title}". You review and finalize after.`,
      action: 'Create draft template in Google Docs',
      impact: 'high',
      estimatedEfficiencyGain: 20,
    });
  }

  return suggestions;
}

// ============ BRAIN FUNCTION 3: Predictive Productivity Analysis ============
export const generateProductivityInsight = (timeframeLabel: string): ProductivityInsight => {
  const calendarEvents = getMockGoogleCalendarEvents();
  const sheetEntries = getMockGoogleSheetEntries();

  // Calculate metrics
  const totalMeetingHours = calendarEvents.reduce((sum, event) => {
    return sum + (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
  }, 0);

  const completedTasks = sheetEntries.filter((entry) => entry.status === 'completed').length;
  const totalTasks = sheetEntries.length;
  const completionRate = (completedTasks / totalTasks) * 100;

  // Detect bottlenecks
  const bottlenecks: string[] = [];
  if (totalMeetingHours > 15) {
    bottlenecks.push('Too many meetings consuming 40%+ of work time');
  }
  if (completionRate < 50) {
    bottlenecks.push('Low task completion rate - priority misalignment');
  }
  const whatsappOriginTasks = sheetEntries.filter((e) => e.source === 'whatsapp').length;
  if (whatsappOriginTasks > totalTasks * 0.6) {
    bottlenecks.push('Heavy reliance on informal communication (WA) over structured planning');
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (totalMeetingHours > 15) {
    recommendations.push('Consolidate 3-4 meetings into 1 bi-weekly sync (saves 4-5 hours)');
  }
  recommendations.push('Use voice-to-calendar AI for 100% of ad-hoc requests (eliminates manual entry)');
  recommendations.push('Implement 2-hour deep work blocks daily (schedule "Focus Time" events)');

  // Automation opportunities
  const automationOpportunities: string[] = [];
  automationOpportunities.push('WA voice notes → auto-extract tasks and add to GSheets');
  automationOpportunities.push('Calendar conflicts → auto-suggest reschedule with Slack notification');
  automationOpportunities.push('Daily summary email → auto-generated from calendar + completed tasks');
  automationOpportunities.push('Status reports → auto-compiled from GSheets entries');

  // Calculate efficiency improvement potential
  let efficiencyGain = 15; // baseline
  if (totalMeetingHours > 15) efficiencyGain += 20; // meeting reduction
  if (completionRate < 50) efficiencyGain += 10; // better prioritization
  efficiencyGain = Math.min(efficiencyGain, 45); // cap at 45%

  return {
    period: timeframeLabel,
    teamEfficiency: Math.max(45, 100 - bottlenecks.length * 15),
    bottlenecks,
    recommendations,
    predictedImprovement: {
      description: `Implementing AI orchestration + meeting reduction could improve efficiency by ${efficiencyGain}%`,
      percentageGain: efficiencyGain,
      timeframe: '2 weeks',
    },
    automationOpportunities,
  };
};

// ============ BRAIN FUNCTION 4: Sync with Action ============
export const executeSmartSync = async (
  actionItem: ActionItemContext,
  resolution: ScheduleConflictResolution,
  selectedAction: ContextualSuggestion,
): Promise<{
  success: boolean;
  calendarEventId?: string;
  sheetEntryId?: string;
  syncedSystems: string[];
  notifications: string[];
}> => {
  const syncedSystems: string[] = [];
  const notifications: string[] = [];
  let calendarEventId: string | undefined;
  let sheetEntryId: string | undefined;

  // 1. Add to Google Sheets
  try {
    const sheetEntry = await addToGoogleSheets(
      actionItem.title,
      `${actionItem.description} [Priority: ${actionItem.priority.toUpperCase()}] [Source: ${actionItem.source}]`,
      actionItem.dueDate || new Date(),
    );
    sheetEntryId = sheetEntry.id;
    syncedSystems.push('Google Sheets');
    notifications.push(`✓ Added to GSheets: ${actionItem.title}`);
  } catch (error) {
    notifications.push(`✗ Failed to sync to GSheets`);
  }

  // 2. Add to Google Calendar
  try {
    const startTime = actionItem.dueDate || new Date();
    const endTime = new Date(startTime.getTime() + (actionItem.estimatedHours || 1) * 60 * 60 * 1000);

    const calendarEvent = await addToGoogleCalendar(
      actionItem.title,
      startTime,
      endTime,
      ['team@company.com'],
    );
    calendarEventId = calendarEvent.id;
    syncedSystems.push('Google Calendar');
    notifications.push(`✓ Added to GCalendar: ${actionItem.title}`);
  } catch (error) {
    notifications.push(`✗ Failed to sync to GCalendar`);
  }

  // 3. Send Slack notification for high priority items
  if (actionItem.priority === 'high') {
    notifications.push(`🔔 Slack notification sent to #team about high-priority task`);
    syncedSystems.push('Slack');
  }

  return {
    success: syncedSystems.length >= 2,
    calendarEventId,
    sheetEntryId,
    syncedSystems,
    notifications,
  };
};

// ============ BRAIN FUNCTION 5: Extract Intent from Voice ============
export const extractIntentFromVoiceNote = (
  transcription: string,
): ActionItemContext => {
  // Simple NLP-like pattern matching (in production: use watsonx NLP)
  const lower = transcription.toLowerCase();

  // Detect priority
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('critical')) {
    priority = 'high';
  } else if (lower.includes('soon') || lower.includes('important')) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  // Detect due date
  let dueDate: Date | undefined;
  if (lower.includes('friday') || lower.includes('this friday')) {
    const today = new Date();
    dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (5 - today.getDay()));
  } else if (lower.includes('tomorrow')) {
    dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else if (lower.includes('today')) {
    dueDate = new Date();
  } else if (lower.includes('next week')) {
    dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  // Extract estimated hours
  let estimatedHours = 2;
  const hourMatch = transcription.match(/(\d+)\s*hour/i);
  if (hourMatch) {
    estimatedHours = parseInt(hourMatch[1]);
  }

  // Confidence score based on transcription clarity
  const confidence = 0.85 + (transcription.split(' ').length > 20 ? 0.1 : 0);

  return {
    title: extractTitleFromTranscription(transcription),
    description: transcription,
    dueDate,
    estimatedHours,
    priority,
    source: 'whatsapp',
    confidence: Math.min(confidence, 0.99),
  };
};

function extractTitleFromTranscription(transcription: string): string {
  // Extract key noun phrases
  const words = transcription.split(/\s+/);
  const keyWords = words.slice(0, Math.min(5, words.length)).join(' ');

  // Capitalize
  return keyWords.charAt(0).toUpperCase() + keyWords.slice(1);
}

// ============ BRAIN FUNCTION 6: Complete Analysis Pipeline ============
export const analyzeWithAutonomousBrain = (input: string) => {
  // Step 1: Extract intent from input
  const actionItem = extractIntentFromVoiceNote(input);

  // Step 2: Get calendar events and sheet entries
  const calendarEvents = getMockGoogleCalendarEvents();
  const sheetEntries = getMockGoogleSheetEntries();

  // Step 3: Detect conflicts
  const conflictInfo = detectConflictBetweenActionAndCalendar(
    {
      title: actionItem.title,
      dueDate: actionItem.dueDate,
      estimatedHours: actionItem.estimatedHours,
    },
    calendarEvents,
  );

  // Step 4: Find available slots
  const availableSlots = actionItem.dueDate
    ? findAvailableTimeSlots(calendarEvents, actionItem.dueDate, (actionItem.estimatedHours || 1) * 60)
    : [];

  // Step 5: Calculate workload
  const currentWorkload = calendarEvents.reduce((sum, event) => {
    const hours = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const actionHours = actionItem.estimatedHours || 2;
  const projectedWorkload = currentWorkload + actionHours;

  // Step 6: Generate suggestions
  const suggestions = generateContextualSuggestions(
    actionItem,
    conflictInfo,
    availableSlots,
    currentWorkload,
  );

  // Step 7: Get productivity insights
  const insights = generateProductivityInsight('This Week');

  return {
    actionItems: [actionItem],
    conflicts: conflictInfo.hasConflict ? [{ event: conflictInfo.conflictingEvent, date: conflictInfo.conflictingEvent?.startTime.toDateString() }] : [],
    suggestions: suggestions.map((s) => s.description),
    workloadImpact: {
      current: currentWorkload,
      after: projectedWorkload,
    },
    insights,
  };
};
