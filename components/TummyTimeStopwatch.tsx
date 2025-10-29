import React, { useState, useEffect, useRef } from 'react';

interface TummyTimeStopwatchProps {
  onClose: () => void;
  onSave: (seconds: number) => void;
}

const TummyTimeStopwatch: React.FC<TummyTimeStopwatchProps> = ({ onClose, onSave }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedSeconds, setPausedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem('tummyTimeStopwatch_startTime');
    const savedPausedSeconds = localStorage.getItem('tummyTimeStopwatch_pausedSeconds');
    const savedIsRunning = localStorage.getItem('tummyTimeStopwatch_isRunning');
    
    if (savedStartTime && savedIsRunning === 'true') {
      const loadedStartTime = parseInt(savedStartTime, 10);
      const loadedPausedSeconds = parseInt(savedPausedSeconds || '0', 10);
      setStartTime(loadedStartTime);
      setPausedSeconds(loadedPausedSeconds);
      setIsRunning(true);
      
      // Calculate elapsed time based on saved start time
      const elapsed = loadedPausedSeconds + Math.floor((Date.now() - loadedStartTime) / 1000);
      setSeconds(elapsed);
    } else if (savedPausedSeconds) {
      const loadedPausedSeconds = parseInt(savedPausedSeconds, 10);
      setPausedSeconds(loadedPausedSeconds);
      setSeconds(loadedPausedSeconds);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isRunning && startTime !== null) {
      localStorage.setItem('tummyTimeStopwatch_startTime', startTime.toString());
      localStorage.setItem('tummyTimeStopwatch_pausedSeconds', pausedSeconds.toString());
      localStorage.setItem('tummyTimeStopwatch_isRunning', 'true');
    } else {
      localStorage.setItem('tummyTimeStopwatch_pausedSeconds', pausedSeconds.toString());
      localStorage.removeItem('tummyTimeStopwatch_startTime');
      localStorage.removeItem('tummyTimeStopwatch_isRunning');
    }
  }, [isRunning, startTime, pausedSeconds]);

  // Update timer display every second
  useEffect(() => {
    if (isRunning && startTime !== null) {
      // Calculate elapsed time based on timestamp difference
      const updateSeconds = () => {
        const elapsed = pausedSeconds + Math.floor((Date.now() - startTime) / 1000);
        setSeconds(elapsed);
      };

      // Update immediately
      updateSeconds();

      // Then update every second for display
      intervalRef.current = setInterval(updateSeconds, 1000);
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
  }, [isRunning, startTime, pausedSeconds]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (seconds > 0) {
      // Resume from paused state
      setStartTime(Date.now());
      setIsRunning(true);
    } else {
      // Start fresh
      setStartTime(Date.now());
      setPausedSeconds(0);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (startTime !== null) {
      // Calculate total elapsed time and save it
      const totalElapsed = pausedSeconds + Math.floor((Date.now() - startTime) / 1000);
      setPausedSeconds(totalElapsed);
      setSeconds(totalElapsed);
    }
    setIsRunning(false);
    setStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    setPausedSeconds(0);
    setSeconds(0);
    localStorage.removeItem('tummyTimeStopwatch_startTime');
    localStorage.removeItem('tummyTimeStopwatch_pausedSeconds');
    localStorage.removeItem('tummyTimeStopwatch_isRunning');
  };

  const handleSave = () => {
    // Calculate final elapsed time
    let finalSeconds = seconds;
    if (isRunning && startTime !== null) {
      finalSeconds = pausedSeconds + Math.floor((Date.now() - startTime) / 1000);
    }

    if (finalSeconds > 0) {
      onSave(finalSeconds);
      handleReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            <i className="fas fa-baby mr-2 text-indigo-500"></i>
            Tummy Time Stopky
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Zavrieť"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Large Time Display */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-6 text-center">
          <div className="text-7xl font-bold text-indigo-600 font-mono tracking-wider mb-2">
            {formatTime(seconds)}
          </div>
          <div className="text-sm text-slate-600 font-medium">
            {isRunning ? (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Stopky bežia...
              </span>
            ) : seconds > 0 ? (
              <span className="text-orange-600">⏸ Pozastavené</span>
            ) : (
              <span className="text-slate-400">⏹ Pripravené na štart</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i className="fas fa-play mr-2"></i>
              {seconds > 0 ? 'Pokračovať' : 'Štart'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="col-span-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i className="fas fa-pause mr-2"></i>
              Pauza
            </button>
          )}
          <button
            onClick={handleReset}
            disabled={seconds === 0}
            className="bg-slate-200 text-slate-700 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset"
          >
            <i className="fas fa-rotate-right"></i>
          </button>
        </div>

        {/* Save and Close */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={seconds === 0}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <i className="fas fa-save mr-2"></i>
            Uložiť a zaznamenať
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            <i className="fas fa-times mr-2"></i>
            Zavrieť
          </button>
        </div>

        {/* Info */}
        {seconds > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Kliknutím na <strong>"Uložiť a zaznamenať"</strong> sa vytvorí nový záznam s tummy time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TummyTimeStopwatch;

