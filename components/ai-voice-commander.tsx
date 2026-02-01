'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Send, StopCircle, Loader2, Bot, AlertCircle } from 'lucide-react';

export function AiVoiceCommander() {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // 1. SETUP VOICE RECOGNITION
  useEffect(() => {
    // Cek support browser (Chrome/Edge/Safari)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;      // Jangan stop kalau user diam sebentar
      recognition.interimResults = true;  // WAJIB TRUE AGAR SYNC REALTIME
      recognition.lang = 'id-ID';         // Bahasa Indonesia

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // LOGIC SYNC: Update input box langsung saat bicara
        // Kita timpa input value dengan hasil suara
        setInputValue((prev) => {
            // Jika ini awal kalimat, langsung pakai hasil suara.
            // Jika user mau ngetik manual + suara, logic bisa disesuaikan.
            // Untuk sekarang: Voice mode = overwrite mode biar responsif.
            return finalTranscript + interimTranscript;
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Mic Error:", event.error);
        setIsListening(false);
        setError("Masalah Mikrofon: " + event.error);
      };

      recognitionRef.current = recognition;
    } else {
      setError("Browser tidak support Voice. Gunakan Chrome Desktop.");
    }
  }, []);

  // 2. TOGGLE MIC
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setInputValue(''); // Kosongkan input biar bersih
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 3. KIRIM KE WATSONX
  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    
    // Matikan mic jika masih nyala
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsLoading(true);
    setAiResponse(null);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal connect AI");

      setAiResponse(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* INPUT CARD */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ketik atau tekan Voice untuk bicara..."
          className="w-full bg-transparent text-lg text-zinc-100 min-h-25 outline-none resize-none placeholder:text-zinc-600 mb-4"
          disabled={isLoading}
        />

        <div className="flex justify-between items-center">
          <button
            onClick={toggleListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isListening 
                ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500 animate-pulse' 
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
            {isListening ? 'Listening...' : 'Voice Input'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!inputValue || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* AI RESPONSE */}
      {aiResponse && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-zinc-800/50 px-6 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Bot size={18} className="text-blue-400" />
            <span className="text-sm font-medium text-zinc-300">Watsonx Answer</span>
          </div>
          <div className="p-6">
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
}