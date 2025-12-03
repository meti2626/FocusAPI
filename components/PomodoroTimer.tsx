import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RefreshCw, X } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notification here
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all z-40"
        title="Open Focus Timer"
      >
        <Timer className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 w-80 z-40 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary-500" />
          {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="text-5xl font-mono font-bold text-center text-slate-800 mb-8 tracking-wider">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={toggleTimer}
          className={`
            p-4 rounded-full transition-colors flex items-center justify-center
            ${isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-primary-500 text-white hover:bg-primary-600'}
          `}
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        <button 
          onClick={resetTimer}
          className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
      
      <div className="mt-6 flex justify-center gap-2">
        <button 
          onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={`text-xs px-3 py-1 rounded-full ${mode === 'focus' ? 'bg-primary-100 text-primary-700' : 'text-slate-400'}`}
        >
          Focus
        </button>
        <button 
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={`text-xs px-3 py-1 rounded-full ${mode === 'break' ? 'bg-green-100 text-green-700' : 'text-slate-400'}`}
        >
          Break
        </button>
      </div>
    </div>
  );
};