'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeWithAutonomousBrain } from '@/lib/autonomous-brain';

interface ProcessingResult {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  details?: {
    taskTitle: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
    estimatedHours: number;
    conflictDetected: boolean;
    suggestions: string[];
    syncedTo: string[];
  };
}

export function AISimpleInput() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<ProcessingResult>({ status: 'idle' });

  const handleProcess = async () => {
    if (!input.trim()) return;

    setResult({ status: 'processing', message: 'Processing your input with watsonx AI...' });

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const analysis = analyzeWithAutonomousBrain(input);

      setResult({
        status: 'success',
        message: 'Successfully processed and synced to all systems',
        details: {
          taskTitle: analysis.actionItems[0]?.title || 'Work Task',
          priority: (analysis.actionItems[0]?.priority?.toUpperCase() || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
          dueDate: analysis.actionItems[0]?.dueDate instanceof Date ? analysis.actionItems[0].dueDate.toISOString().split('T')[0] : analysis.actionItems[0]?.dueDate || 'Not specified',
          estimatedHours: analysis.actionItems[0]?.estimatedHours || 0,
          conflictDetected: analysis.conflicts.length > 0,
          suggestions: analysis.suggestions.slice(0, 2),
          syncedTo: ['Google Calendar', 'Google Sheets', 'Dashboard'],
        },
      });

      setInput('');

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setResult({ status: 'idle' });
      }, 5000);
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to process input. Please try again.',
      });
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setInput(
        'I need to finish the Q1 report by Friday. It is urgent for the client meeting next Monday.'
      );
      setTimeout(() => {
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-white font-semibold mb-4">
          Share What You're Working On
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Just tell the AI what you're doing. It will automatically schedule, track, and generate reports.
        </p>

        <Textarea
          placeholder="e.g., 'I'm working on the Q1 report, need to finish by Friday for the client presentation'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 mb-4 min-h-24"
          disabled={result.status === 'processing'}
        />

        <div className="flex gap-3">
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 bg-transparent"
            disabled={result.status === 'processing'}
          >
            <Mic size={18} />
            <span className="ml-2">{isListening ? 'Listening...' : 'Voice Input'}</span>
          </Button>

          <Button
            onClick={handleProcess}
            disabled={!input.trim() || result.status === 'processing'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {result.status === 'processing' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span className="ml-2">Process with AI</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Processing Status */}
      {result.status !== 'idle' && result.message && (
        <Card
          className={`border p-6 ${
            result.status === 'success'
              ? 'bg-green-900/20 border-green-700'
              : result.status === 'error'
                ? 'bg-red-900/20 border-red-700'
                : 'bg-blue-900/20 border-blue-700'
          }`}
        >
          <div className="flex items-start gap-4">
            {result.status === 'processing' && (
              <Loader2 className="animate-spin text-blue-400 shrink-0 mt-1" size={20} />
            )}
            {result.status === 'success' && (
              <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={20} />
            )}
            {result.status === 'error' && (
              <AlertCircle className="text-red-400 shrink-0 mt-1" size={20} />
            )}

            <div className="flex-1">
              <p
                className={`font-semibold ${
                  result.status === 'success'
                    ? 'text-green-400'
                    : result.status === 'error'
                      ? 'text-red-400'
                      : 'text-blue-400'
                }`}
              >
                {result.message}
              </p>

              {result.details && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400 text-sm">Task</p>
                      <p className="text-white font-medium">{result.details.taskTitle}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Priority</p>
                      <Badge
                        className={`mt-1 ${
                          result.details.priority === 'HIGH'
                            ? 'bg-red-600'
                            : result.details.priority === 'MEDIUM'
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                        }`}
                      >
                        {result.details.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400 text-sm">Due Date</p>
                      <p className="text-white">{result.details.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Est. Hours</p>
                      <p className="text-white">{result.details.estimatedHours}h</p>
                    </div>
                  </div>

                  {result.details.conflictDetected && (
                    <div className="bg-slate-900/50 border border-yellow-700/50 rounded p-3">
                      <p className="text-yellow-400 text-sm font-medium">
                        ⚠️ Schedule Conflict Detected
                      </p>
                      <p className="text-slate-300 text-xs mt-1">
                        This task conflicts with existing calendar events. AI has adjusted the schedule.
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-400 text-sm mb-2">Synced To:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.details.syncedTo.map((system) => (
                        <Badge key={system} className="bg-blue-700">
                          ✓ {system}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {result.details.suggestions.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">AI Suggestions:</p>
                      <ul className="space-y-1">
                        {result.details.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <h4 className="text-slate-300 font-medium text-sm mb-3">How It Works</h4>
        <ol className="space-y-2 text-slate-400 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-400 font-semibold">1.</span>
            <span>Tell the AI what you're working on (text or voice)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-semibold">2.</span>
            <span>watsonx AI automatically extracts tasks, priorities, and deadlines</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-semibold">3.</span>
            <span>Detects calendar conflicts and suggests optimizations</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-semibold">4.</span>
            <span>Auto-syncs to Google Calendar, Sheets, and Dashboard</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-semibold">5.</span>
            <span>Management gets real-time productivity reports</span>
          </li>
        </ol>
      </Card>
    </div>
  );
}
