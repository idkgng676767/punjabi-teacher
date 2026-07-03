"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Mic, Sparkles, PenTool, Volume2, Loader2, Star, ArrowRight, RotateCcw } from "lucide-react";
import { letters } from "@/lib/letters";
import type { LessonStage } from "@/types";
import { AgentAvatar } from "@/components/AgentAvatar";

const stages: LessonStage[] = ["learn", "recognize", "write", "quiz"];
const stageLabels = ["Learn", "Recognize", "Write", "Quiz"];

export function LessonScreen() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [stage, setStage] = useState<LessonStage>("learn");
  const [selected, setSelected] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingTts, setIsLoadingTts] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentLetter = letters[currentLetterIndex];
  const progress = Math.round(((currentLetterIndex + 1) / letters.length) * 100);

  const choices = [
    currentLetter,
    letters[(currentLetterIndex + 1) % letters.length],
    letters[(currentLetterIndex + 2) % letters.length],
    letters[(currentLetterIndex + 3) % letters.length],
  ];

  const handleNextLetter = useCallback(() => {
    setSelected(null);
    setAiResponse(null);
    setError(null);
    setIsPlaying(false);
    setCurrentLetterIndex((prev) => (prev + 1) % letters.length);
    setStage("learn");
  }, []);

  const handleListen = useCallback(async () => {
    setError(null);
    setIsLoadingTts(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentLetter.pronunciation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `TTS failed with status ${response.status}`);
      }

      const data = await response.json();
      const audioSrc = `data:${data.contentType};base64,${data.audio}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error("TTS error:", err);
      setError(err.message || "Failed to generate audio.");
    } finally {
      setIsLoadingTts(false);
    }
  }, [currentLetter.pronunciation]);

  const handleGetFeedback = useCallback(async () => {
    setError(null);
    setIsLoadingChat(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I am learning the Punjabi letter ${currentLetter.character} (${currentLetter.name}). Give me a brief, encouraging message.`
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Chat failed with status ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.response);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to get AI feedback.");
    } finally {
      setIsLoadingChat(false);
    }
  }, [currentLetter.character, currentLetter.name]);

  const handleSubmitChoice = (choiceChar: string) => {
    setSelected(choiceChar);
    if (choiceChar === currentLetter.character) {
      setXp((prev) => prev + 25);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <main className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 p-6 md:p-12">
      
      <header className="flex w-full max-w-4xl items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Punjabi Teacher</h1>
          <p className="text-sm text-white/60">Learn the Gurmukhi alphabet with AI</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/50 uppercase tracking-wider">Daily Streak</p>
            <p className="text-xl font-bold text-mango">{streak}</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-xs text-white/50 uppercase tracking-wider">Total XP</p>
            <p className="text-xl font-bold text-mint">{xp}</p>
          </div>
        </div>
      </header>

      {aiResponse && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative rounded-2xl border-2 border-mint/30 bg-mint/10 p-5 shadow-[0_0_20px_rgba(74,222,128,0.1)] backdrop-blur-xl">
            <button onClick={() => setAiResponse(null)} className="absolute right-3 top-3 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white">
              <Sparkles size={16} />
            </button>
            <h3 className="mb-1 text-lg font-semibold text-white flex items-center gap-2">
              <Star className="text-mint" size={20} /> AI Tutor says:
            </h3>
            <p className="text-sm leading-relaxed text-white/90">{aiResponse}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl border-2 border-rose-400/30 bg-rose-500/10 p-5 backdrop-blur-xl">
            <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-rose-300">
              <RotateCcw size={20} /> Error
            </h3>
            <p className="text-sm leading-relaxed text-white/90">{error}</p>
            <button onClick={() => setError(null)} className="mt-3 text-xs text-rose-300/70 underline hover:text-rose-300">Dismiss</button>
          </div>
        </div>
      )}

      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3">
        
        <div className="col-span-2 flex flex-col gap-6">
          
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <div className="mb-8 flex flex-wrap gap-2">
              {stages.map((s, i) => (
                <button 
                  key={s} 
                  onClick={() => setStage(s)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${stage === s ? 'bg-white text-slate-900 shadow-lg' : 'bg-black/20 text-white/60 hover:bg-black/40'}`}
                >
                  {stageLabels[i]}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center justify-center">
                <h2 className="text-[9rem] font-extrabold leading-none text-mango md:text-[12rem] bg-gradient-to-b from-mango to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,159,28,0.5)]">
                  {currentLetter.character}
                </h2>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-white/40 uppercase tracking-[0.2em]">{currentLetter.name}</p>
                <p className="mt-2 text-3xl font-bold text-mint">{currentLetter.pronunciation}</p>
                <p className="mt-1 text-sm text-white/30">Letter #{currentLetter.order}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button 
                onClick={handleListen} 
                disabled={isLoadingTts || isPlaying}
                className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 ${isPlaying ? 'bg-mint text-slate-900' : 'bg-saffron text-slate-900 hover:brightness-110'} disabled:opacity-50 disabled:cursor-not-allowed shadow-glow`}
              >
                {isLoadingTts ? <Loader2 className="animate-spin" size={18} /> : isPlaying ? <Volume2 size={18} /> : <Volume2 size={18} />}
                <span>{isPlaying ? 'Playing...' : isLoadingTts ? 'Generating...' : 'Listen'}</span>
              </button>
              
              <button 
                onClick={handleGetFeedback}
                disabled={isLoadingChat}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingChat ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{isLoadingChat ? 'Thinking...' : 'Get AI Feedback'}</span>
              </button>
            </div>
            
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={() => { setIsPlaying(false); setError("Audio playback failed"); }} />
          </div>

          {stage === 'recognize' && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-semibold text-white/90">Pick the correct letter</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {choices.map((letter) => {
                  const status = selected === letter.character ? (letter.character === currentLetter.character ? 'correct' : 'wrong') : 'default';
                  return (
                    <button
                      key={letter.character}
                      onClick={() => handleSubmitChoice(letter.character)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center transition-all duration-200
                        ${status === 'default' ? 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20' : ''}
                        ${status === 'correct' ? 'border-mint bg-mint/20 text-mint shadow-[0_0_15px_rgba(74,222,128,0.2)]' : ''}
                        ${status === 'wrong' ? 'border-rose-400 bg-rose-500/10 text-rose-400' : ''}
                      `}
                    >
                      <span className="text-4xl font-bold">{letter.character}</span>
                      <span className="text-xs text-white/50">{letter.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {stage === 'learn' && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl text-center">
              <p className="text-white/60">Listen to the pronunciation and study the letter. Click &quot;Get AI Feedback&quot; to hear from the tutor.</p>
            </div>
          )}

        </div>

        <div className="col-span-1 flex flex-col gap-6">
          
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white/90">Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-medium text-white/50">
                  <span>Current Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-saffron via-mango to-mint transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-black/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/20">
                  <Star size={20} className="text-saffron" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Streak</p>
                  <p className="text-2xl font-bold text-white">{streak}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white/90">Lesson Queue</h3>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {letters.map((letter, index) => (
                <button
                  key={letter.character}
                  onClick={() => {
                    setCurrentLetterIndex(index);
                    setSelected(null);
                    setAiResponse(null);
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    index === currentLetterIndex
                      ? "border-saffron bg-saffron/10 shadow-[0_0_10px_rgba(234,88,12,0.1)]"
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">{letter.character}</span>
                    <div className="flex flex-col">
                      <span className="text-sm text-white/70">{letter.name}</span>
                      <span className="text-xs text-white/30">{letter.pronunciation}</span>
                    </div>
                  </div>
                  <span className="text-xs text-white/30">#{letter.order}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleNextLetter}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-plum to-saffron px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-glow"
              >
                Next Letter <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
