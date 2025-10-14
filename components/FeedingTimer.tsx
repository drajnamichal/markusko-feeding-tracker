
import React, { useState, useEffect, useRef } from 'react';
import type { LogEntry } from '../types';

interface FeedingTimerProps {
  onQuickAdd: (duration: number, side?: 'left' | 'right') => void;
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
  side: 'left' | 'right' | 'bottle';
}

const FeedingTimer: React.FC<FeedingTimerProps> = ({ onQuickAdd }) => {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    side: 'left'
  });
  const intervalRef = useRef<number | null>(null);

  // Load timer state from localStorage
  useEffect(() => {
    const savedTimer = localStorage.getItem('feedingTimer');
    if (savedTimer) {
      try {
        const parsed = JSON.parse(savedTimer);
        if (parsed.isRunning && parsed.startTime) {
          const elapsed = Date.now() - parsed.startTime;
          setTimer({
            ...parsed,
            elapsed
          });
        }
      } catch (e) {
        console.error('Failed to load timer state', e);
      }
    }
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    localStorage.setItem('feedingTimer', JSON.stringify(timer));
  }, [timer]);

  // Update timer every second
  useEffect(() => {
    if (timer.isRunning && timer.startTime) {
      intervalRef.current = window.setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsed: Date.now() - (prev.startTime || 0)
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = (side: 'left' | 'right' | 'bottle') => {
    setTimer({
      isRunning: true,
      startTime: Date.now(),
      elapsed: 0,
      side
    });
  };

  const stopTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const resetTimer = () => {
    setTimer({
      isRunning: false,
      startTime: null,
      elapsed: 0,
      side: 'left'
    });
  };

  const handleQuickAdd = () => {
    const durationMinutes = Math.floor(timer.elapsed / 60000);
    if (durationMinutes > 0 || timer.elapsed > 0) {
      onQuickAdd(timer.elapsed, timer.side === 'bottle' ? undefined : timer.side);
      resetTimer();
    }
  };

  const getSideIcon = () => {
    switch (timer.side) {
      case 'left':
        return 'fa-l';
      case 'right':
        return 'fa-r';
      case 'bottle':
        return 'fa-bottle-baby';
      default:
        return 'fa-clock';
    }
  };

  const getSideLabel = () => {
    switch (timer.side) {
      case 'left':
        return 'Ľavá strana';
      case 'right':
        return 'Pravá strana';
      case 'bottle':
        return 'Fľaša';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700 flex items-center">
        <i className="fas fa-stopwatch mr-2 text-teal-500"></i>
        Časovač kŕmenia
      </h2>

      {!timer.isRunning && timer.elapsed === 0 ? (
        // Start buttons
        <div className="space-y-3">
          <p className="text-sm text-slate-600 mb-3">Spustiť časovač pre:</p>
          <button
            onClick={() => startTimer('left')}
            className="w-full bg-pink-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md"
          >
            <i className="fas fa-heart mr-2"></i>
            Ľavá prsník
          </button>
          <button
            onClick={() => startTimer('right')}
            className="w-full bg-pink-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-md"
          >
            <i className="fas fa-heart mr-2"></i>
            Pravá prsník
          </button>
          <button
            onClick={() => startTimer('bottle')}
            className="w-full bg-teal-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md"
          >
            <i className="fas fa-bottle-baby mr-2"></i>
            Fľaša
          </button>
        </div>
      ) : (
        // Timer display and controls
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg text-center">
            <p className="text-sm text-slate-600 mb-2">{getSideLabel()}</p>
            <div className="text-5xl font-bold text-teal-600 font-mono">
              {formatTime(timer.elapsed)}
            </div>
            {timer.isRunning && (
              <div className="mt-3 flex justify-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {timer.isRunning ? (
              <>
                <button
                  onClick={stopTimer}
                  className="col-span-2 bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-pause mr-2"></i>
                  Pozastaviť
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setTimer(prev => ({ ...prev, isRunning: true, startTime: Date.now() - prev.elapsed }))}
                  className="bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-play mr-2"></i>
                  Pokračovať
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-slate-400 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reset
                </button>
                <button
                  onClick={handleQuickAdd}
                  className="col-span-2 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-check mr-2"></i>
                  Pridať záznam
                </button>
              </>
            )}
          </div>

          {/* Quick duration buttons when timer is stopped */}
          {!timer.isRunning && timer.elapsed === 0 && (
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-2">Rýchle pridanie:</p>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setTimer({
                        isRunning: false,
                        startTime: Date.now() - (minutes * 60000),
                        elapsed: minutes * 60000,
                        side: 'left'
                      });
                    }}
                    className="bg-slate-100 text-slate-700 py-2 px-2 rounded text-sm hover:bg-slate-200 transition-all"
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedingTimer;

