'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getMockWhatsAppVoiceNotes,
  getMockGoogleCalendarEvents,
  getMockGoogleSheetEntries,
} from '@/lib/mock-apis';
import {
  analyzeActionItemWithContext,
  extractIntentFromVoiceNote,
  generateProductivityInsight,
  executeSmartSync,
  type ContextualSuggestion,
} from '@/lib/autonomous-brain';
import {
  MessageCircle,
  Calendar,
  Sheet,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  TrendingUp,
  Send,
} from 'lucide-react';

export function AIIntegrationPanel() {
  const [voiceNotes, setVoiceNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [sheetEntries, setSheetEntries] = useState<any[]>([]);

  useEffect(() => {
    // Load all mock data
    const notes = getMockWhatsAppVoiceNotes();
    setVoiceNotes(notes);
    setCalendarEvents(getMockGoogleCalendarEvents());
    setSheetEntries(getMockGoogleSheetEntries());
    
    // Generate initial insight
    const prod = generateProductivityInsight('This Week');
    setInsight(prod);
  }, []);

  const handleAnalyzeVoiceNote = async (note: any) => {
    setSelectedNote(note);
    setIsAnalyzing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    // Extract intent from voice note
    const actionItem = extractIntentFromVoiceNote(note.transcription);

    // Analyze with context (detect conflicts, suggest solutions)
    const analysis = await analyzeActionItemWithContext(actionItem);

    setAnalysisResult(analysis);
    setIsAnalyzing(false);
  };

  const handleExecuteSync = async (suggestedAction: ContextualSuggestion) => {
    if (!analysisResult) return;

    setIsSyncing(true);

    // Execute smart sync to all systems
    const result = await executeSmartSync(
      analysisResult.actionItem,
      analysisResult,
      suggestedAction,
    );

    setSyncResult(result);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="voice-processing" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="voice-processing">Voice Processing</TabsTrigger>
          <TabsTrigger value="conflicts">Smart Conflicts</TabsTrigger>
          <TabsTrigger value="insights">Productivity Insights</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Voice Processing Tab */}
        <TabsContent value="voice-processing" className="space-y-6 mt-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-blue-400" size={24} />
              <h3 className="text-xl font-bold text-white">WA Voice Notes Processing</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Processing incoming WhatsApp voice notes. AI automatically extracts tasks, detects conflicts, and suggests smart solutions.
            </p>

            {/* Voice Notes List */}
            <div className="space-y-3">
              {voiceNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedNote?.id === note.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                  onClick={() => handleAnalyzeVoiceNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{note.sender}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(note.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm italic">"{note.transcription}"</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyzeVoiceNote(note);
                      }}
                      disabled={isAnalyzing}
                      size="sm"
                      className={selectedNote?.id === note.id ? 'bg-blue-600' : ''}
                    >
                      <Brain size={16} className="mr-1" />
                      {isAnalyzing && selectedNote?.id === note.id ? 'Analyzing...' : 'Analyze'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis Result */}
          {analysisResult && (
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">AI Analysis Result</h3>

              {/* Extracted Action Item */}
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <h4 className="font-semibold text-white mb-2">Extracted Action Item</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400">Title: </span>
                    <span className="text-white font-medium">{analysisResult.actionItem.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Priority: </span>
                    <Badge className={
                      analysisResult.actionItem.priority === 'high'
                        ? 'bg-red-600'
                        : analysisResult.actionItem.priority === 'medium'
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                    }>
                      {analysisResult.actionItem.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-400">Due: </span>
                    <span className="text-white">
                      {analysisResult.actionItem.dueDate
                        ? new Date(analysisResult.actionItem.dueDate).toDateString()
                        : 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Hours: </span>
                    <span className="text-white">{analysisResult.actionItem.estimatedHours}h</span>
                  </div>
                </div>
              </div>

              {/* Conflict Detection */}
              {analysisResult.conflict && (
                <Alert className="mb-6 border-red-600/50 bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">
                    <strong>Schedule Conflict Detected!</strong> The task "{analysisResult.actionItem.title}" 
                    conflicts with "{analysisResult.conflict.event.title}" on{' '}
                    {analysisResult.conflict.date}
                  </AlertDescription>
                </Alert>
              )}

              {/* Smart Suggestions */}
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Smart Suggestions (Autonomous Brain)</h4>
                <div className="space-y-2">
                  {analysisResult.suggestions.map((suggestion: ContextualSuggestion, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                        idx === 0
                          ? 'border-blue-500 bg-blue-900/20 hover:bg-blue-900/30'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-white">{suggestion.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {suggestion.estimatedEfficiencyGain && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp size={12} className="mr-1" />
                              +{suggestion.estimatedEfficiencyGain}% efficiency
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => handleExecuteSync(suggestion)}
                          disabled={isSyncing}
                          size="sm"
                          variant={idx === 0 ? 'default' : 'outline'}
                          className={idx === 0 ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          <Send size={14} className="mr-1" />
                          {isSyncing ? 'Syncing...' : 'Execute'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workload Impact */}
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <h4 className="font-semibold text-white mb-3">Workload Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-sm">Current Load: </span>
                    <span className="text-white font-bold">
                      {analysisResult.workloadImpact.currentLoad.toFixed(1)}h
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">After Resolution: </span>
                    <span className="text-white font-bold">
                      {analysisResult.workloadImpact.afterResolution.toFixed(1)}h
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Sync Result */}
          {syncResult && (
            <Card className={`border-2 p-6 ${syncResult.success ? 'bg-green-900/20 border-green-600' : 'bg-red-900/20 border-red-600'}`}>
              <div className="flex items-center gap-2 mb-4">
                {syncResult.success ? (
                  <CheckCircle2 className="text-green-400" size={24} />
                ) : (
                  <AlertTriangle className="text-red-400" size={24} />
                )}
                <h3 className={`text-lg font-bold ${syncResult.success ? 'text-green-200' : 'text-red-200'}`}>
                  {syncResult.success ? 'Sync Successful!' : 'Sync Encountered Issues'}
                </h3>
              </div>
              <div className="space-y-2">
                {syncResult.notifications.map((notif: string, idx: number) => (
                  <div key={idx} className="text-slate-300 text-sm">
                    {notif}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-400">
                Synced Systems: {syncResult.syncedSystems.join(', ')}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Smart Conflicts Tab */}
        <TabsContent value="conflicts" className="space-y-6 mt-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-400" size={24} />
              <h3 className="text-xl font-bold text-white">Smart Conflict Detection</h3>
            </div>
            <p className="text-slate-400 mb-4">
              AI analyzes calendar overlaps and suggests intelligent resolutions automatically.
            </p>

            {calendarEvents.length > 0 ? (
              <div className="space-y-3">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(event.startTime).toLocaleTimeString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-slate-500">Attendees: {event.attendees.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No conflicts detected. Your schedule is optimized!</p>
            )}
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          {insight && (
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Productivity Insights</h3>
              </div>

              {/* Efficiency Score */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg">
                  <div className="text-sm text-blue-200">Team Efficiency</div>
                  <div className="text-3xl font-bold text-white">{insight.teamEfficiency}%</div>
                </div>
                <div className="p-4 bg-linear-to-br from-green-600 to-green-800 rounded-lg">
                  <div className="text-sm text-green-200">Predicted Improvement</div>
                  <div className="text-3xl font-bold text-white">+{insight.predictedImprovement.percentageGain}%</div>
                </div>
              </div>

              {/* Bottlenecks */}
              {insight.bottlenecks.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-2">Current Bottlenecks</h4>
                  <div className="space-y-2">
                    {insight.bottlenecks.map((bottleneck: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-slate-700/30 rounded">
                        <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                        <span className="text-slate-300 text-sm">{bottleneck}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {insight.recommendations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {insight.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-green-900/20 rounded border-l-2 border-green-600">
                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-green-200 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Automation Opportunities */}
              {insight.automationOpportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Automation Opportunities</h4>
                  <div className="space-y-2">
                    {insight.automationOpportunities.map((opp: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-purple-900/20 rounded border-l-2 border-purple-600">
                        <Zap size={16} className="text-purple-400 mt-0.5 shrink-0" />
                        <span className="text-purple-200 text-sm">{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Connected Systems</h3>
            <p className="text-slate-400 mb-6">
              All systems automatically synced when you process voice notes and execute smart suggestions.
            </p>

            {/* Google Sheets */}
            <div className="mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sheet size={20} className="text-green-400" />
                  <span className="font-semibold text-white">Google Sheets</span>
                </div>
                <Badge className="bg-green-600">Connected</Badge>
              </div>
              <p className="text-sm text-slate-400">
                {sheetEntries.length} task entries synced. Auto-sync on voice note processing.
              </p>
            </div>

            {/* Google Calendar */}
            <div className="mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  <span className="font-semibold text-white">Google Calendar</span>
                </div>
                <Badge className="bg-green-600">Connected</Badge>
              </div>
              <p className="text-sm text-slate-400">
                {calendarEvents.length} calendar events synced. Auto-creates events from extracted tasks.
              </p>
            </div>

            {/* Slack */}
            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-400" />
                  <span className="font-semibold text-white">Slack</span>
                </div>
                <Badge className="bg-green-600">Connected</Badge>
              </div>
              <p className="text-sm text-slate-400">
                Auto-send notifications for high-priority tasks and schedule conflicts.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
