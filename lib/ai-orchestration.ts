// AI Orchestration Engine - The "Context Bridge" that connects WA → GSheet → GCalendar

export interface VoiceNoteInput {
  id: string;
  content: string; // transcribed from voice
  source: 'whatsapp' | 'slack' | 'email';
  timestamp: Date;
  senderName: string;
}

export interface ExtractedActionItem {
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  tags: string[];
  confidence: number; // 0-100, AI confidence level
}

export interface CalendarConflict {
  actionItem: ExtractedActionItem;
  conflictingEvent: string;
  suggestedTime?: Date;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface ProductivityNarrative {
  period: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  efficiencyScore: number; // 0-100
  predictedImprovement: number; // percentage
}

// Mock AI Processing - ekstrak voice note jadi action items
export const processVoiceNoteWithAI = (voiceNote: VoiceNoteInput): ExtractedActionItem[] => {
  // Simulasi watsonx natural language processing
  const content = voiceNote.content.toLowerCase();
  
  const actionItems: ExtractedActionItem[] = [];
  
  // Pattern matching untuk extract tasks
  if (content.includes('report') || content.includes('laporan')) {
    actionItems.push({
      title: 'Prepare Report',
      description: `Report mentioned in ${voiceNote.senderName}'s voice note`,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 hari
      priority: content.includes('urgent') ? 'high' : 'medium',
      assignee: voiceNote.senderName,
      tags: ['report', 'documentation'],
      confidence: 85,
    });
  }
  
  if (content.includes('meeting') || content.includes('rapat')) {
    actionItems.push({
      title: 'Schedule Team Meeting',
      description: `Meeting needed as per ${voiceNote.senderName}'s request`,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // esok hari
      priority: 'high',
      tags: ['meeting', 'collaboration'],
      confidence: 90,
    });
  }
  
  if (content.includes('review') || content.includes('evaluasi')) {
    actionItems.push({
      title: 'Review & Evaluate',
      description: 'Review task mentioned in voice note',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      tags: ['review', 'quality'],
      confidence: 75,
    });
  }
  
  if (content.includes('deadline') || content.includes('deadline')) {
    const lastItem = actionItems[actionItems.length - 1];
    if (lastItem) {
      lastItem.priority = 'high';
      lastItem.dueDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    }
  }
  
  return actionItems.length > 0 ? actionItems : [{
    title: 'Process Voice Note',
    description: voiceNote.content,
    priority: 'medium',
    tags: ['inbox'],
    confidence: 50,
  }];
};

// Predictive Workload Balancing - deteksi konflik kalender & suggest reschedule
export const detectWorkloadConflicts = (
  actionItems: ExtractedActionItem[],
  existingCalendarEvents: Array<{ title: string; startTime: Date; duration: number }>
): CalendarConflict[] => {
  const conflicts: CalendarConflict[] = [];
  
  for (const actionItem of actionItems) {
    if (!actionItem.dueDate) continue;
    
    for (const event of existingCalendarEvents) {
      const eventEnd = new Date(event.startTime.getTime() + event.duration * 60000);
      
      // Check if pada hari yang sama dan berdekatan
      const isSameDay = actionItem.dueDate.toDateString() === event.startTime.toDateString();
      const isNearby = Math.abs(actionItem.dueDate.getTime() - event.startTime.getTime()) < 24 * 60 * 60 * 1000;
      
      if (isSameDay || isNearby) {
        const suggestedTime = new Date(event.startTime.getTime() + event.duration * 60000 + 30 * 60000);
        
        conflicts.push({
          actionItem,
          conflictingEvent: event.title,
          suggestedTime,
          riskLevel: actionItem.priority === 'high' ? 'high' : 'medium',
        });
      }
    }
  }
  
  return conflicts;
};

// Auto-generate suggestions untuk resolve conflicts
export const generateConflictResolutions = (conflict: CalendarConflict): string[] => {
  const suggestions: string[] = [];
  
  if (conflict.riskLevel === 'high') {
    suggestions.push(`✓ AUTO: Proposed new time for "${conflict.actionItem.title}": ${conflict.suggestedTime?.toLocaleTimeString()}`);
    suggestions.push(`✓ AUTO: Draft email prepared to reschedule "${conflict.conflictingEvent}"`);
    suggestions.push(`→ SUGGESTION: Mark "${conflict.actionItem.title}" as critical and notify assignee`);
  } else {
    suggestions.push(`→ SUGGESTION: Consider moving "${conflict.actionItem.title}" to ${conflict.suggestedTime?.toLocaleTimeString()}`);
    suggestions.push(`→ SUGGESTION: Check if "${conflict.conflictingEvent}" can be shortened`);
  }
  
  return suggestions;
};

// Generate Productivity Narratives untuk management
export const generateProductivityNarrative = (
  period: string,
  teamMetrics: {
    tasksCompleted: number;
    tasksOverdue: number;
    meetingHours: number;
    focusHours: number;
    adminHours: number;
    totalHours: number;
  }
): ProductivityNarrative => {
  const efficiency = Math.round((teamMetrics.focusHours / teamMetrics.totalHours) * 100);
  const meetingRatio = Math.round((teamMetrics.meetingHours / teamMetrics.totalHours) * 100);
  const adminRatio = Math.round((teamMetrics.adminHours / teamMetrics.totalHours) * 100);
  
  const keyInsights: string[] = [];
  const recommendations: string[] = [];
  
  // Generate insights berdasarkan metrics
  if (efficiency < 50) {
    keyInsights.push(`🚨 Low focus time (${efficiency}%). Team spending too much time on meetings/admin.`);
    recommendations.push(`Reduce meetings by 20% and batch administrative tasks`);
    recommendations.push(`Schedule 2-3 hour deep work blocks each day`);
  } else if (efficiency >= 70) {
    keyInsights.push(`✅ High focus time (${efficiency}%). Team is well-organized and productive.`);
  }
  
  if (meetingRatio > 35) {
    keyInsights.push(`⚠️ High meeting load (${meetingRatio}% of time). This may reduce productivity.`);
    recommendations.push(`Review and consolidate recurring meetings`);
    recommendations.push(`Implement "no meeting Fridays" or similar policy`);
  }
  
  if (teamMetrics.tasksOverdue > 5) {
    keyInsights.push(`⚠️ ${teamMetrics.tasksOverdue} overdue tasks detected. Workload may be unbalanced.`);
    recommendations.push(`Redistribute tasks across team members`);
    recommendations.push(`Prioritize overdue items and set clear deadlines`);
  }
  
  if (teamMetrics.tasksCompleted > 20) {
    keyInsights.push(`✅ Strong execution: ${teamMetrics.tasksCompleted} tasks completed this period.`);
  }
  
  const predictedImprovement = Math.min(
    30, // Max 30% improvement
    (50 - efficiency) * 0.5 // Lebih rendah efficiency, lebih besar improvement potential
  );
  
  return {
    period,
    summary: `During ${period}, team achieved ${efficiency}% focus time with ${teamMetrics.tasksCompleted} tasks completed. 
             Meeting load stands at ${meetingRatio}%, leaving ${adminRatio}% for admin work.`,
    keyInsights,
    recommendations,
    efficiencyScore: efficiency,
    predictedImprovement: Math.round(predictedImprovement),
  };
};

// Cross-System Sync - push data ke "GSheet" dan "GCalendar"
export const syncToExternalSystems = (
  actionItems: ExtractedActionItem[],
  targetSystems: Array<'gsheet' | 'gcalendar' | 'slack'>
) => {
  const syncResults: Record<string, any> = {};
  
  for (const system of targetSystems) {
    if (system === 'gsheet') {
      syncResults.gsheet = {
        status: 'synced',
        itemCount: actionItems.length,
        sheetUrl: 'https://sheets.google.com/d/mock-spreadsheet-id',
        syncedAt: new Date(),
        data: actionItems.map(item => ({
          Title: item.title,
          Description: item.description,
          'Due Date': item.dueDate?.toLocaleDateString(),
          Priority: item.priority,
          Assignee: item.assignee || 'Unassigned',
          Tags: item.tags.join(', '),
          'AI Confidence': `${item.confidence}%`,
        })),
      };
    }
    
    if (system === 'gcalendar') {
      syncResults.gcalendar = {
        status: 'synced',
        itemCount: actionItems.filter(i => i.dueDate).length,
        calendarUrl: 'https://calendar.google.com/calendar/u/0/r/mock-calendar',
        syncedAt: new Date(),
        events: actionItems
          .filter(i => i.dueDate)
          .map(item => ({
            title: `[${item.priority.toUpperCase()}] ${item.title}`,
            description: item.description,
            startTime: item.dueDate,
            duration: item.priority === 'high' ? 120 : 60,
            color: item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green',
          })),
      };
    }
    
    if (system === 'slack') {
      syncResults.slack = {
        status: 'notified',
        messageCount: actionItems.length,
        channelUrl: 'https://slack.com/mock-channel',
        sentAt: new Date(),
        messages: actionItems.map(item => 
          `📌 *${item.title}* (${item.priority})\n${item.description}\nDue: ${item.dueDate?.toLocaleDateString()}`
        ),
      };
    }
  }
  
  return syncResults;
};

// Get all voice notes (mock data)
export const getMockVoiceNotes = (): VoiceNoteInput[] => {
  return [
    {
      id: '1',
      content: 'Yo, ada report yang harus diselesaiin sampai Jumat. Ini urgent banget buat client meeting minggu depan.',
      source: 'whatsapp',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderName: 'Alina',
    },
    {
      id: '2',
      content: 'Kita perlu meeting sama tim design untuk discuss mockup. Bisa besok atau lusa?',
      source: 'whatsapp',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      senderName: 'Budi',
    },
    {
      id: '3',
      content: 'Jangan lupa review dokumentasi sebelum deploy. Ada beberapa bug yang perlu di-clarify.',
      source: 'slack',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      senderName: 'Citra',
    },
  ];
};

// Mock calendar events
export const getMockCalendarEvents = () => {
  const now = new Date();
  return [
    {
      title: 'Team Standup',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
      duration: 30,
    },
    {
      title: 'Client Call',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      duration: 60,
    },
    {
      title: 'Design Review',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
      duration: 90,
    },
  ];
};
