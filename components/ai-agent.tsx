'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Send,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
  TrendingUp,
  Volume2,
  StopCircle,
  Sparkles,
  Bot,
  X
} from 'lucide-react';

// Pastikan path ini sesuai dengan file kamu
import { analyzeWithAutonomousBrain } from '@/lib/autonomous-brain';

// --- TYPEWRITER COMPONENT (Efek Ngetik) ---
const TypewriterEffect = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 20); // Kecepatan ngetik (makin kecil makin cepat)
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <p className="text-gray-300 text-md leading-relaxed whitespace-pre-wrap">{displayedText}</p>;
};

// --- MAIN COMPONENT ---
type ProcessingStep = 'idle' | 'listening' | 'processing' | 'analyzing' | 'generating' | 'complete';

export function AIAgent() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<ProcessingStep>('idle');
  const [result, setResult] = useState<any>(null);
  
  // Audio & Mic States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [realAIResponse, setRealAIResponse] = useState('');
  const [showFullResult, setShowFullResult] = useState(false); // Delay tampilkan chart sampai teks selesai
  
  const recognitionRef = useRef<any>(null);

  // 1. SETUP MICROPHONE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US'; // Ubah ke 'id-ID' jika ingin Indonesia
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => {
             setStep('listening');
             setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          setStep('idle');
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === 'no-speech') {
            setIsListening(false);
            setStep('idle');
            return;
          }
          console.error("Mic Error:", event.error);
          setIsListening(false);
          setStep('idle');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (step === 'listening') setStep('idle');
        };
      }
    }
  }, [step]);

  // 2. HANDLERS
  const handleVoiceInput = () => {
    if (!recognitionRef.current) return alert("Browser not supported.");
    if (isListening) recognitionRef.current.stop();
    else {
        try { recognitionRef.current.start(); } 
        catch (err) { setIsListening(false); }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Sesuaikan logat
      utterance.rate = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
  };

  const reset = () => {
    stopSpeaking();
    setInput('');
    setStep('idle');
    setResult(null);
    setRealAIResponse('');
    setShowFullResult(false);
  };

  // 3. LOGIC SUBMIT
  const handleSubmit = async () => {
    if (!input.trim()) return;

    setStep('processing');
    stopSpeaking();
    setRealAIResponse('');
    setShowFullResult(false);

    try {
        // A. UI Simulation Loop
        const steps: ProcessingStep[] = ['processing', 'analyzing', 'generating'];
        
        // Start Fetching in background
        const aiPromise = fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input }),
        }).then(res => res.json());

        // Play loading animation
        for (const s of steps) {
            setStep(s);
            await new Promise((resolve) => setTimeout(resolve, 600)); 
        }

        // B. Handle Data
        const aiData = await aiPromise;
        if (aiData.error) throw new Error(aiData.error);
        
        const generatedText = aiData.result;
        setRealAIResponse(generatedText);

        // Mock Logic for Charts (preserving your logic)
        const mockAnalysis = analyzeWithAutonomousBrain(input);
        const finalResult = {
            ...mockAnalysis,
            suggestions: [generatedText], 
            insights: { ...mockAnalysis.insights, narrative: generatedText }
        };

        setResult(finalResult);
        setStep('complete');
        
        // C. Auto Speak
        speakText(generatedText);

    } catch (error: any) {
        console.error("AI Error:", error);
        setStep('idle');
        alert("Connection Error: " + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* --- HEADER & INPUT AREA --- */}
      <Card className="bg-slate-900 border-slate-800 p-1 shadow-2xl overflow-hidden relative group">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="p-6 bg-slate-900/90 backdrop-blur-sm relative z-10">
          
          {/* Header Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Sparkles className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Watsonx MindShare</h3>
                    <p className="text-slate-400 text-xs">Autonomous Workforce Brain</p>
                </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
                {isSpeaking && (
                    <Button variant="destructive" size="sm" onClick={stopSpeaking} className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        <StopCircle size={16} className="mr-2"/> Stop Audio
                    </Button>
                )}
                {result && (
                    <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400 hover:text-white">
                        <X size={16} className="mr-2"/> Clear
                    </Button>
                )}
            </div>
          </div>

          {/* Input Box */}
          <div className="relative">
            {step === 'idle' || step === 'listening' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What are you working on? (e.g. 'Create a Q1 financial report and schedule a meeting with the client')"
                  className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light text-lg"
                />
                
                {/* Action Bar */}
                <div className="absolute bottom-4 right-4 flex gap-3">
                  <Button
                    onClick={handleVoiceInput}
                    className={`rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] px-6' : 'bg-slate-700 hover:bg-slate-600 px-4'}`}
                  >
                    <Mic size={18} className={isListening ? "animate-bounce" : ""} />
                    {isListening && <span className="ml-2 font-semibold">Listening...</span>}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none"
                  >
                    <Send size={18} className="mr-2" />
                    Process
                  </Button>
                </div>
              </motion.div>
            ) : null}

            {/* Loading State Visualization */}
            {step !== 'idle' && step !== 'listening' && step !== 'complete' && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }}
                 className="h-32 flex flex-col items-center justify-center space-y-4"
               >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                    <Loader2 className="animate-spin text-blue-400 w-10 h-10 relative z-10" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-blue-300 font-medium text-lg capitalize tracking-wide animate-pulse">
                        {step}...
                    </p>
                    <p className="text-slate-500 text-xs">Watsonx is analyzing your intent</p>
                  </div>
               </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* --- RESULTS AREA --- */}
      <AnimatePresence>
      {result && step === 'complete' && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
          
          {/* 1. Main Insight Card (Typewriter Effect) */}
          <Card className="bg-linear-to-br from-slate-900 to-slate-900 border border-blue-500/30 p-1 shadow-2xl relative overflow-hidden">
             <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                       <Bot size={24} />
                   </div>
                   <h4 className="text-blue-400 font-bold text-lg">Watsonx Insight</h4>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-5 border border-white/5 min-h-25">
                    {/* Render text with effect */}
                    <TypewriterEffect 
                        text={realAIResponse} 
                        onComplete={() => setShowFullResult(true)} 
                    />
                </div>
                
                <div className="mt-4 flex gap-3">
                     <Button variant="outline" size="sm" onClick={() => speakText(realAIResponse)} className="border-slate-700 text-blue-300 hover:bg-slate-800">
                        <Volume2 size={14} className="mr-2"/> Replay Audio
                     </Button>
                </div>
             </div>
          </Card>

          {/* 2. Structured Data Cards (Hanya muncul setelah teks selesai diketik) */}
          {showFullResult && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="grid gap-4 md:grid-cols-2"
            >
                {/* Task Card */}
                <Card className="bg-slate-900 border-slate-800 p-5 hover:border-green-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-emerald-400 mt-1" size={20} />
                        <div>
                            <h4 className="text-emerald-400 font-semibold mb-1">Detected Tasks</h4>
                            <p className="text-white font-medium text-lg">{result.actionItems[0]?.title}</p>
                            <div className="flex gap-2 mt-3">
                                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                                    {result.actionItems[0]?.priority || 'Medium'}
                                </Badge>
                                <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10">
                                    {result.actionItems[0]?.dueDate || 'Today'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Workload Card */}
                {result.workloadImpact && (
                    <Card className="bg-slate-900 border-slate-800 p-5 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="text-purple-400 mt-1" size={20} />
                            <div className="w-full">
                                <h4 className="text-purple-400 font-semibold mb-3">Workload Impact</h4>
                                <div className="flex justify-between items-center bg-slate-800 rounded-lg p-3">
                                    <div>
                                        <p className="text-slate-400 text-xs">Current</p>
                                        <p className="text-white font-mono text-xl">{result.workloadImpact.current}h</p>
                                    </div>
                                    <div className="text-slate-600">→</div>
                                    <div>
                                        <p className="text-slate-400 text-xs">Predicted</p>
                                        <p className="text-purple-300 font-bold font-mono text-xl">{result.workloadImpact.after}h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Conflict Card (Conditional) */}
                {result.conflicts.length > 0 && (
                    <Card className="bg-slate-900 border-slate-800 p-5 border-l-4 border-l-orange-500 md:col-span-2">
                        <div className="flex items-center gap-3 text-orange-400 mb-2">
                            <AlertTriangle size={20} />
                            <h4 className="font-semibold">Scheduling Conflict Detected</h4>
                        </div>
                        {result.conflicts.map((c: any, i: number) => (
                            <p key={i} className="text-slate-300 text-sm ml-8">• Collision on {c.date}</p>
                        ))}
                    </Card>
                )}
            </motion.div>
          )}

          {/* 3. System Sync Footer */}
          {showFullResult && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex justify-center gap-6 text-slate-500 text-xs pt-4 border-t border-slate-800"
              >
                  <span className="flex items-center gap-1"><Calendar size={12}/> G-Calendar Synced</span>
                  <span className="flex items-center gap-1"><FileText size={12}/> Sheets Updated</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12}/> Slack Notified</span>
              </motion.div>
          )}

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}