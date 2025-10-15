import React, { useState, useEffect, useRef } from 'react';

interface Sound {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const SOUNDS: Sound[] = [
  { id: 'white', name: 'Biele šumy', icon: 'fa-wind', color: 'bg-slate-500' },
  { id: 'pink', name: 'Ružové šumy', icon: 'fa-cloud', color: 'bg-pink-400' },
  { id: 'brown', name: 'Hnedé šumy', icon: 'fa-water', color: 'bg-amber-700' },
  { id: 'rain', name: 'Dážď', icon: 'fa-cloud-rain', color: 'bg-blue-500' },
  { id: 'ocean', name: 'Oceán', icon: 'fa-water', color: 'bg-cyan-500' },
  { id: 'heartbeat', name: 'Srdcový tep', icon: 'fa-heart-pulse', color: 'bg-red-500' },
];

const TIMER_OPTIONS = [
  { value: 0, label: 'Bez časovača' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hodina' },
];

const WhiteNoise: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [timer, setTimer] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);

    return () => {
      stopSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timer > 0) {
      setRemainingTime(timer * 60);
      
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            stopSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [isPlaying, timer]);

  const generateNoise = (type: string): AudioBuffer => {
    if (!audioContextRef.current) throw new Error('Audio context not initialized');

    const sampleRate = audioContextRef.current.sampleRate;
    const bufferSize = sampleRate * 2; // 2 seconds of audio
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'white':
        // White noise - equal power across all frequencies
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        break;

      case 'pink':
        // Pink noise - 1/f noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        break;

      case 'brown':
        // Brown noise - 1/f^2 noise
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
        break;

      case 'rain':
        // Rain simulation
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5;
          if (Math.random() > 0.99) {
            data[i] *= 2;
          }
        }
        break;

      case 'ocean':
        // Ocean waves simulation
        for (let i = 0; i < bufferSize; i++) {
          const wave = Math.sin(i / 100) * 0.3;
          const noise = (Math.random() * 2 - 1) * 0.2;
          data[i] = wave + noise;
        }
        break;

      case 'heartbeat':
        // Heartbeat simulation
        for (let i = 0; i < bufferSize; i++) {
          const beat = Math.floor(i / (sampleRate * 0.8)) % 2;
          const phase = (i % (sampleRate * 0.8)) / (sampleRate * 0.8);
          
          if (beat === 0 && phase < 0.1) {
            data[i] = Math.sin(phase * 50) * 0.8;
          } else if (beat === 0 && phase >= 0.1 && phase < 0.2) {
            data[i] = Math.sin((phase - 0.1) * 50) * 0.5;
          } else {
            data[i] = 0;
          }
        }
        break;
    }

    return buffer;
  };

  const playSound = (soundId: string) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop any currently playing sound
    stopSound();

    // Generate and play new sound
    const buffer = generateNoise(soundId);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNodeRef.current);
    source.start();

    sourceNodeRef.current = source;
    setSelectedSound(soundId);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setRemainingTime(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else if (selectedSound) {
      playSound(selectedSound);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
            <i className="fas fa-music text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">White Noise</h2>
            <p className="text-sm text-slate-500">Uloženie bábätka</p>
          </div>
        </div>
        {isPlaying && remainingTime > 0 && (
          <div className="bg-purple-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">
              <i className="fas fa-clock mr-1"></i>
              {formatTime(remainingTime)}
            </p>
          </div>
        )}
      </div>

      {/* Sound Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">Vyberte zvuk</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => {
                if (isPlaying && selectedSound === sound.id) {
                  stopSound();
                } else {
                  playSound(sound.id);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedSound === sound.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className={`${sound.color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <i className={`fas ${sound.icon} text-white`}></i>
              </div>
              <p className="text-sm font-medium text-slate-700 text-center">{sound.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {selectedSound && (
        <div className="space-y-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-2`}></i>
            {isPlaying ? 'Zastaviť' : 'Prehrať'}
          </button>

          {/* Volume Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">
                <i className="fas fa-volume-up mr-1"></i>
                Hlasitosť
              </label>
              <span className="text-sm font-bold text-purple-600">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Timer Selection */}
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              <i className="fas fa-clock mr-1"></i>
              Časovač vypnutia
            </label>
            <div className="grid grid-cols-5 gap-2">
              {TIMER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimer(option.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    timer === option.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      {!selectedSound && (
        <div className="text-center py-8">
          <i className="fas fa-hand-pointer text-4xl text-slate-300 mb-3"></i>
          <p className="text-slate-500">Vyberte zvuk pre prehrávanie</p>
        </div>
      )}
    </div>
  );
};

export default WhiteNoise;

