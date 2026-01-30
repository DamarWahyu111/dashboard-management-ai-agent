'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  Send,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { analyzeWithAutonomousBrain } from '@/lib/autonomous-brain';

type ProcessingStep = 'idle' | 'listening' | 'processing' | 'analyzing' | 'generating' | 'syncing' | 'complete';

export function AIAgent() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [step, setStep] = useState<ProcessingStep>('idle');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setStep('processing');

    // Simulate processing pipeline
    await simulateProcessing();

    // Analyze with autonomous brain
    const analysis = analyzeWithAutonomousBrain(input);
    setResult(analysis);
    setStep('complete');
  };

  const simulateProcessing = async () => {
    const steps: ProcessingStep[] = ['processing', 'analyzing', 'generating', 'syncing'];

    for (const s of steps) {
      setStep(s);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  const handleVoiceInput = async () => {
    setIsListening(!isListening);
    if (!isListening) {
      setStep('listening');
      // Simulate voice recognition
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setInput('Finish the quarterly report and schedule with client for approval tomorrow');
      setIsListening(false);
    }
  };

  const reset = () => {
    setInput('');
    setStep('idle');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white">Autonomous Workforce Brain</h3>
          </div>

          <p className="text-slate-400 text-sm">
            Tell the AI what you're working on. It will automatically schedule, track, and report.
          </p>

          {/* Input Area */}
          <div className="space-y-3">
            {step === 'idle' && (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type what you're working on... (e.g., 'Finish the quarterly report and schedule with client for approval tomorrow')"
                  className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500"
                />

                {/* Controls */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleVoiceInput}
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/20 flex items-center gap-2 bg-transparent"
                  >
                    <Mic size={16} />
                    Voice Input
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 ml-auto"
                  >
                    <Send size={16} />
                    Process
                  </Button>
                </div>
              </>
            )}

            {step !== 'idle' && step !== 'complete' && (
              <div className="space-y-4 py-6">
                <div className="text-center space-y-3">
                  <Loader2 className="animate-spin mx-auto text-blue-400" size={32} />

                  <div className="space-y-2">
                    <p className="text-white font-semibold capitalize">{step}...</p>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all"
                        style={{
                          width: step === 'processing' ? '25%' : step === 'analyzing' ? '50%' : step === 'generating' ? '75%' : '100%',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 text-xs text-slate-400 pt-2">
                    <span>Processing your input</span>
                    <span>•</span>
                    <span>Analyzing calendar</span>
                    <span>•</span>
                    <span>Generating suggestions</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {result && step === 'complete' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Task Extracted */}
          <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-green-600/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h4 className="text-green-400 font-semibold mb-2">Task Extracted</h4>
                <p className="text-white font-medium">{result.actionItems[0]?.title}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge className="bg-green-600/30 text-green-400 border-green-600/50">
                    Priority: {result.actionItems[0]?.priority}
                  </Badge>
                  <Badge className="bg-blue-600/30 text-blue-400 border-blue-600/50">
                    Due: {result.actionItems[0]?.dueDate || 'Today'}
                  </Badge>
                  <Badge className="bg-purple-600/30 text-purple-400 border-purple-600/50">
                    {result.actionItems[0]?.estimatedHours || 2}h estimate
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Conflicts Detected */}
          {result.conflicts.length > 0 && (
            <Card className="bg-gradient-to-br from-orange-900/20 to-slate-900 border-orange-600/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-orange-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h4 className="text-orange-400 font-semibold mb-2">Calendar Conflicts Detected</h4>
                  {result.conflicts.map((conflict: any, i: number) => (
                    <p key={i} className="text-white text-sm mb-1">
                      Conflicts with existing event on {conflict.date}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Smart Suggestions */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-600/30 p-4">
            <div className="flex items-start gap-3 mb-3">
              <Zap className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
              <h4 className="text-cyan-400 font-semibold">AI Suggestions</h4>
            </div>

            <div className="space-y-2">
              {result.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="bg-slate-800/50 border border-cyan-600/20 rounded-lg p-3">
                  <p className="text-white text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Workload Impact */}
          {result.workloadImpact && (
            <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-600/30 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h4 className="text-purple-400 font-semibold mb-3">Workload Analysis</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Current Workload</p>
                      <p className="text-white font-bold text-lg">{result.workloadImpact.current.toFixed(1)}h</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">After Task</p>
                      <p className="text-white font-bold text-lg">{result.workloadImpact.after.toFixed(1)}h</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Productivity Insights */}
          {result.insights && (
            <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-600/30 p-4">
              <div className="flex items-start gap-3">
                <Clock className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h4 className="text-blue-400 font-semibold mb-2">Productivity Insights</h4>
                  <p className="text-slate-300 text-sm">{result.insights.narrative}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Badge className="bg-blue-600/30 text-blue-400">
                      Efficiency: {result.insights.teamEfficiency}%
                    </Badge>
                    <Badge className="bg-green-600/30 text-green-400">
                      Potential: +{result.insights.potentialGain}%
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* System Sync Status */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                Auto-Synced to Systems
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <Calendar className="mx-auto text-blue-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Google Calendar</p>
                  <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <FileText className="mx-auto text-emerald-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Google Sheets</p>
                  <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <MessageSquare className="mx-auto text-purple-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Slack</p>
                  <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reset Button */}
          <Button onClick={reset} className="w-full bg-slate-700 hover:bg-slate-600 text-white">
            Process Another Task
          </Button>
        </div>
      )}
    </div>
  );
}
