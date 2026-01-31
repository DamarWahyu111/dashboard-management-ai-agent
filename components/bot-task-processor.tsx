'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
  Zap,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { processBotTask, type BotTaskInput, type BotProcessingResult } from '@/lib/bot-integration';

interface BotTaskProcessorProps {
  onTaskProcessed?: (result: BotProcessingResult) => void;
}

export function BotTaskProcessor({ onTaskProcessed }: BotTaskProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BotProcessingResult | null>(null);
  const [input, setInput] = useState<BotTaskInput>({
    title: '',
    priority: 'medium',
    dueDate: new Date(),
    hours: 1,
    source: 'whatsapp',
  });

  const handleProcess = async () => {
    if (!input.title.trim()) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const processingResult = await processBotTask(input);
      setResult(processingResult);
      
      // Notify parent component
      if (onTaskProcessed) {
        onTaskProcessed(processingResult);
      }
    } catch (error) {
      console.error('Error processing task:', error);
      setResult({
        success: false,
        task: {
          id: `error-${Date.now()}`,
          date: new Date(),
          task: input.title,
          source: 'whatsapp',
          status: 'pending',
          notes: 'Error processing task',
          priority: 'medium',
          deadline: input.dueDate,
        },
        syncedSystems: [],
        notifications: ['✗ Error processing task'],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInput({
      title: '',
      priority: 'medium',
      dueDate: new Date(),
      hours: 1,
      source: 'whatsapp',
    });
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section - Simulate BOT Input */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white">WA BOT Task Input</h3>
            <Badge className="bg-green-600/30 text-green-400 border-green-600/50">
              Auto-Sync Enabled
            </Badge>
          </div>

          <p className="text-slate-400 text-sm">
            Simulasi input dari WA BOT. Data akan otomatis di-sync ke Google Sheets, Google Calendar, dan Slack.
          </p>

          {/* Input Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Title</label>
              <input
                type="text"
                value={input.title}
                onChange={(e) => setInput({ ...input, title: e.target.value })}
                placeholder="Contoh: Deadline tugas hari ini jam 18.00"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Priority</label>
                <select
                  value={input.priority}
                  onChange={(e) => setInput({ ...input, priority: e.target.value as 'easy' | 'medium' | 'hard' })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1 block">Hours</label>
                <input
                  type="number"
                  value={input.hours}
                  onChange={(e) => setInput({ ...input, hours: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1 block">Due Date & Time</label>
              <input
                type="datetime-local"
                value={input.dueDate.toISOString().slice(0, 16)}
                onChange={(e) => setInput({ ...input, dueDate: new Date(e.target.value) })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {isProcessing && (
              <div className="space-y-4 py-6">
                <div className="text-center space-y-3">
                  <Loader2 className="animate-spin mx-auto text-blue-400" size={32} />
                  <div className="space-y-2">
                    <p className="text-white font-semibold">Processing task...</p>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full transition-all animate-pulse" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="flex justify-center gap-3 text-xs text-slate-400 pt-2">
                    <span>Syncing to Google Sheets</span>
                    <span>•</span>
                    <span>Adding to Google Calendar</span>
                    <span>•</span>
                    <span>Sending notifications</span>
                  </div>
                </div>
              </div>
            )}

            {!isProcessing && (
              <Button
                onClick={handleProcess}
                disabled={!input.title.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Process & Auto-Sync Task
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {result && !isProcessing && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Task Extracted */}
          <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-green-600/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h4 className="text-green-400 font-semibold mb-2">Task Processed</h4>
                <p className="text-white font-medium">{result.task.task}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge className="bg-green-600/30 text-green-400 border-green-600/50">
                    Priority: {result.task.priority?.toUpperCase() || 'MEDIUM'}
                  </Badge>
                  <Badge className="bg-blue-600/30 text-blue-400 border-blue-600/50">
                    Due: {result.task.deadline?.toLocaleDateString('id-ID') || 'Today'}
                  </Badge>
                  <Badge className="bg-purple-600/30 text-purple-400 border-purple-600/50">
                    Status: {result.task.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* System Sync Status */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                Auto-Synced to Systems
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className={`bg-slate-800/50 rounded-lg p-3 text-center ${result.syncedSystems.includes('Google Sheets') ? 'border border-green-600/50' : ''}`}>
                  <FileText className="mx-auto text-emerald-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Google Sheets</p>
                  {result.syncedSystems.includes('Google Sheets') ? (
                    <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                  ) : (
                    <p className="text-red-400 text-xs mt-1">✗ Failed</p>
                  )}
                </div>

                <div className={`bg-slate-800/50 rounded-lg p-3 text-center ${result.syncedSystems.includes('Google Calendar') ? 'border border-green-600/50' : ''}`}>
                  <Calendar className="mx-auto text-blue-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Google Calendar</p>
                  {result.syncedSystems.includes('Google Calendar') ? (
                    <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                  ) : (
                    <p className="text-red-400 text-xs mt-1">✗ Failed</p>
                  )}
                </div>

                <div className={`bg-slate-800/50 rounded-lg p-3 text-center ${result.syncedSystems.includes('Slack') ? 'border border-green-600/50' : ''}`}>
                  <MessageSquare className="mx-auto text-purple-400 mb-2" size={20} />
                  <p className="text-white text-xs font-medium">Slack</p>
                  {result.syncedSystems.includes('Slack') ? (
                    <p className="text-green-400 text-xs mt-1">✓ Synced</p>
                  ) : (
                    <p className="text-slate-400 text-xs mt-1">-</p>
                  )}
                </div>
              </div>

              {/* Notifications */}
              {result.notifications.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.notifications.map((notification, index) => (
                    <div key={index} className="text-xs text-slate-300 flex items-center gap-2">
                      {notification.startsWith('✓') ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : notification.startsWith('✗') ? (
                        <AlertCircle size={12} className="text-red-400" />
                      ) : (
                        <Clock size={12} className="text-blue-400" />
                      )}
                      <span>{notification}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Reset Button */}
          <Button onClick={handleReset} className="w-full bg-slate-700 hover:bg-slate-600 text-white">
            Process Another Task
          </Button>
        </div>
      )}
    </div>
  );
}
