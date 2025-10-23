import React, { useState, useEffect } from 'react';
import type { SleepSession } from '../types';

interface SleepTrackerProps {
  onClose: () => void;
  onSave: (startTime: Date, endTime: Date, durationMinutes: number) => Promise<void>;
  recentSleeps: SleepSession[];
}

type ButtonState = 'idle' | 'loading' | 'success';

const SleepTracker: React.FC<SleepTrackerProps> = ({ onClose, onSave, recentSleeps }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [saveButtonState, setSaveButtonState] = useState<ButtonState>('idle');

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem('sleepTracker_startTime');
    const savedIsTracking = localStorage.getItem('sleepTracker_isTracking');
    
    if (savedStartTime && savedIsTracking === 'true') {
      const loadedStartTime = new Date(savedStartTime);
      setStartTime(loadedStartTime);
      setIsTracking(true);
      
      // Calculate elapsed time
      const elapsed = Math.floor((new Date().getTime() - loadedStartTime.getTime()) / 1000);
      setSeconds(elapsed);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isTracking && startTime) {
      localStorage.setItem('sleepTracker_startTime', startTime.toISOString());
      localStorage.setItem('sleepTracker_isTracking', 'true');
    } else {
      localStorage.removeItem('sleepTracker_startTime');
      localStorage.removeItem('sleepTracker_isTracking');
    }
  }, [isTracking, startTime]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    setSeconds(0);
    
    // Save to localStorage
    localStorage.setItem('sleepTracker_startTime', now.toISOString());
    localStorage.setItem('sleepTracker_isTracking', 'true');
  };

  const handleStop = async () => {
    if (startTime) {
      setSaveButtonState('loading');
      
      try {
        const endTime = new Date();
        const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
        
        await onSave(startTime, endTime, durationMinutes);
        
        setSaveButtonState('success');
        setTimeout(() => {
          setSaveButtonState('idle');
        }, 1500);
        
        setIsTracking(false);
        setStartTime(null);
        setSeconds(0);
        
        // Clear localStorage
        localStorage.removeItem('sleepTracker_startTime');
        localStorage.removeItem('sleepTracker_isTracking');
      } catch (error) {
        setSaveButtonState('idle');
      }
    }
  };

  const handleReset = () => {
    setIsTracking(false);
    setStartTime(null);
    setSeconds(0);
    
    // Clear localStorage
    localStorage.removeItem('sleepTracker_startTime');
    localStorage.removeItem('sleepTracker_isTracking');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            <i className="fas fa-moon mr-2 text-indigo-500"></i>
            Sledovanie spánku
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Timer Display */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 font-mono tracking-tight">
            {formatTime(seconds)}
          </div>
          <p className="text-indigo-100 text-sm">
            {isTracking ? 'Spánok prebieha...' : 'Pripravené na sledovanie'}
          </p>
          {startTime && (
            <p className="text-indigo-100 text-xs mt-2">
              Začiatok: {startTime.toLocaleTimeString('sk-SK')}
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          {!isTracking ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <i className="fas fa-play mr-2"></i>
              Začiatok spánku
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                disabled={saveButtonState === 'loading' || saveButtonState === 'success'}
                className={`
                  flex-1 text-white py-4 rounded-lg font-bold transition-all shadow-lg
                  ${saveButtonState === 'loading' ? 'bg-slate-400 cursor-wait' : saveButtonState === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'}
                `}
              >
                {saveButtonState === 'loading' && (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Ukladám...
                  </>
                )}
                {saveButtonState === 'success' && (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Uložené!
                  </>
                )}
                {saveButtonState === 'idle' && (
                  <>
                    <i className="fas fa-stop mr-2"></i>
                    Koniec spánku
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-200 text-slate-700 px-6 py-4 rounded-lg font-bold hover:bg-slate-300 transition-all"
              >
                <i className="fas fa-redo"></i>
              </button>
            </>
          )}
        </div>

        {/* Recent Sleeps */}
        {recentSleeps.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              <i className="fas fa-history mr-2"></i>
              Posledné spánky
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentSleeps.slice(0, 5).map((sleep) => (
                <div key={sleep.id} className="bg-slate-50 p-3 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-700">
                      {new Date(sleep.startTime).toLocaleDateString('sk-SK')}
                    </span>
                    <span className="text-indigo-600 font-bold">
                      {sleep.durationMinutes ? Math.floor(sleep.durationMinutes / 60) : 0}h {sleep.durationMinutes ? sleep.durationMinutes % 60 : 0}m
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(sleep.startTime).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                    {' → '}
                    {sleep.endTime ? new Date(sleep.endTime).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }) : 'Prebieha...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepTracker;

