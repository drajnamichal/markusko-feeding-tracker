
import React, { useState, useEffect } from 'react';
import type { LogEntry } from './types';
import { INITIAL_ENTRIES } from './constants';
import EntryForm from './components/EntryForm';
import LogList from './components/LogList';
import Statistics from './components/Statistics';
import WhiteNoise from './components/WhiteNoise';
import WHOGuidelines from './components/WHOGuidelines';
import DevelopmentGuide from './components/DevelopmentGuide';
import { supabase, logEntryToDB, dbToLogEntry } from './supabaseClient';

function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showWhiteNoise, setShowWhiteNoise] = useState(false);
  const [showWHO, setShowWHO] = useState(false);
  const [showDevelopment, setShowDevelopment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVitaminDReminder, setShowVitaminDReminder] = useState(false);
  const [tummyTimeCount, setTummyTimeCount] = useState(0);
  const [showTummyTimeReminder, setShowTummyTimeReminder] = useState(false);
  const [showSterilizationReminder, setShowSterilizationReminder] = useState(false);
  const [daysSinceLastSterilization, setDaysSinceLastSterilization] = useState(0);
  const [babyName, setBabyName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);

  // Calculate baby's age
  const calculateAge = () => {
    const birthDate = new Date('2025-09-29');
    const today = new Date();
    
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'deň' : diffDays < 5 ? 'dni' : 'dní'}`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      
      let monthText = months === 1 ? 'mesiac' : months < 5 ? 'mesiace' : 'mesiacov';
      let dayText = remainingDays === 1 ? 'deň' : remainingDays < 5 ? 'dni' : 'dní';
      
      if (remainingDays === 0) {
        return `${months} ${monthText}`;
      }
      return `${months} ${monthText}, ${remainingDays} ${dayText}`;
    }
  };

  // Load baby name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('babyName');
    if (savedName) {
      setBabyName(savedName);
    } else {
      setBabyName('Markus Drajna');
      localStorage.setItem('babyName', 'Markus Drajna');
    }
  }, []);

  // Update document title when baby name changes
  useEffect(() => {
    if (babyName) {
      document.title = babyName;
    }
  }, [babyName]);

  // Load entries from Supabase on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Check for vitamin D reminder
  useEffect(() => {
    if (entries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const hasVitaminDToday = entries.some(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.vitaminD;
      });

      setShowVitaminDReminder(!hasVitaminDToday);
    }
  }, [entries]);

  // Check for tummy time reminder
  useEffect(() => {
    if (entries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tummyTimeToday = entries.filter(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.tummyTime;
      }).length;

      setTummyTimeCount(tummyTimeToday);
      setShowTummyTimeReminder(tummyTimeToday < 3);
    }
  }, [entries]);

  // Check for sterilization reminder (every 2 days)
  useEffect(() => {
    if (entries.length > 0) {
      const now = new Date();
      
      // Find last sterilization entry
      const sterilizationEntries = entries
        .filter(entry => entry.sterilization)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (sterilizationEntries.length > 0) {
        const lastSterilization = sterilizationEntries[0].dateTime;
        const diffTime = now.getTime() - lastSterilization.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysSinceLastSterilization(diffDays);
        setShowSterilizationReminder(diffDays >= 2);
      } else {
        // No sterilization recorded yet - show reminder
        setDaysSinceLastSterilization(999);
        setShowSterilizationReminder(true);
      }
    }
  }, [entries]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('log_entries')
        .select('*')
        .order('date_time', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const entries = data.map(dbToLogEntry);
        setEntries(entries);
      } else {
        // If no data exists, migrate initial entries
        await migrateInitialData();
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      alert('Chyba pri načítaní dát z databázy');
    } finally {
      setLoading(false);
    }
  };

  const migrateInitialData = async () => {
    try {
      const dbEntries = INITIAL_ENTRIES.map(logEntryToDB);
      const { error } = await supabase
        .from('log_entries')
        .insert(dbEntries);

      if (error) throw error;

      setEntries(INITIAL_ENTRIES);
    } catch (error) {
      console.error('Error migrating initial data:', error);
    }
  };

  const addEntry = async (newEntry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string }) => {
    const entryWithDate: LogEntry = {
      ...newEntry,
      id: new Date().toISOString() + Math.random(),
      dateTime: new Date(newEntry.dateTime),
    };

    try {
      const dbEntry = logEntryToDB(entryWithDate);
      const { error } = await supabase
        .from('log_entries')
        .insert([dbEntry]);

      if (error) throw error;

      setEntries(prevEntries => [entryWithDate, ...prevEntries].sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()));
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Chyba pri pridávaní záznamu');
    }
  };
  
  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('log_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Chyba pri mazaní záznamu');
    }
  };

  const updateEntry = async (updatedEntry: LogEntry) => {
    try {
      const dbEntry = logEntryToDB(updatedEntry);
      const { error } = await supabase
        .from('log_entries')
        .update(dbEntry)
        .eq('id', updatedEntry.id);

      if (error) throw error;

      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === updatedEntry.id ? updatedEntry : entry
        ).sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
      );
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Chyba pri aktualizácii záznamu');
    }
  };

  const startEditEntry = (entry: LogEntry) => {
    setEditingEntry(entry);
  };

  const cancelEdit = () => {
    setEditingEntry(null);
  };

  const updateBabyName = (newName: string) => {
    setBabyName(newName);
    localStorage.setItem('babyName', newName);
    setShowNameModal(false);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-teal-500 mb-4"></i>
          <p className="text-slate-600">Načítavam dáta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">👶</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
                  {babyName}
                  <button
                    onClick={() => setShowNameModal(true)}
                    className="text-sm text-slate-400 hover:text-teal-500 transition-colors"
                    title="Zmeniť meno"
                  >
                    <i className="fas fa-pen-to-square"></i>
                  </button>
                </h1>
                <p className="text-sm text-slate-500">
                  <i className="fas fa-birthday-cake mr-1"></i>
                  Vek: {calculateAge()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setShowStats(!showStats);
                  setShowWhiteNoise(false);
                  setShowWHO(false);
                  setShowDevelopment(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showStats 
                    ? 'bg-teal-500 text-white hover:bg-teal-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className={`fas ${showStats ? 'fa-list' : 'fa-chart-bar'} mr-2`}></i>
                {showStats ? 'Záznamy' : 'Štatistiky'}
              </button>
              <button
                onClick={() => {
                  setShowWHO(!showWHO);
                  setShowStats(false);
                  setShowWhiteNoise(false);
                  setShowDevelopment(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showWHO 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className={`fas ${showWHO ? 'fa-list' : 'fa-stethoscope'} mr-2`}></i>
                {showWHO ? 'Záznamy' : 'WHO'}
              </button>
              <button
                onClick={() => {
                  setShowDevelopment(!showDevelopment);
                  setShowStats(false);
                  setShowWhiteNoise(false);
                  setShowWHO(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showDevelopment 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className={`fas ${showDevelopment ? 'fa-list' : 'fa-baby-carriage'} mr-2`}></i>
                {showDevelopment ? 'Záznamy' : 'Cvičenia'}
              </button>
              <button
                onClick={() => {
                  setShowWhiteNoise(!showWhiteNoise);
                  setShowStats(false);
                  setShowWHO(false);
                  setShowDevelopment(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showWhiteNoise 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className={`fas ${showWhiteNoise ? 'fa-list' : 'fa-music'} mr-2`}></i>
                {showWhiteNoise ? 'Záznamy' : 'White Noise'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Zmeniť meno bábätka</h2>
              <button
                onClick={() => setShowNameModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newName = formData.get('babyName') as string;
                if (newName.trim()) {
                  updateBabyName(newName.trim());
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="babyName" className="block text-sm font-medium text-slate-600 mb-2">
                  Meno bábätka
                </label>
                <input
                  type="text"
                  id="babyName"
                  name="babyName"
                  defaultValue={babyName}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Napr. Markus Drajna"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Uložiť
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminders */}
      <div className="container mx-auto px-4 pt-4 space-y-3">
        {showVitaminDReminder && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-sun text-3xl text-orange-500"></i>
              <div>
                <p className="font-bold text-orange-800">Pripomienka: Vitamín D</p>
                <p className="text-sm text-orange-700">Nezabudnite dnes dať {babyName ? `${babyName}` : 'bábätku'} vitamín D!</p>
              </div>
            </div>
            <button
              onClick={() => setShowVitaminDReminder(false)}
              className="text-orange-500 hover:text-orange-700 transition-colors"
              aria-label="Zavrieť pripomienku"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        )}

        {showTummyTimeReminder && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-baby text-3xl text-indigo-500"></i>
              <div>
                <p className="font-bold text-indigo-800">Pripomienka: Tummy Time</p>
                <p className="text-sm text-indigo-700">
                  Dnes: {tummyTimeCount}/3 | Ešte potrebujete: <span className="font-bold">{3 - tummyTimeCount}x</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTummyTimeReminder(false)}
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
              aria-label="Zavrieť pripomienku"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        )}

        {showSterilizationReminder && (
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-flask text-3xl text-cyan-500"></i>
              <div>
                <p className="font-bold text-cyan-800">Pripomienka: Sterilizácia fliaš</p>
                <p className="text-sm text-cyan-700">
                  {daysSinceLastSterilization >= 999 
                    ? 'Ešte ste nezaznamenali sterilizáciu!' 
                    : `Posledná sterilizácia pred ${daysSinceLastSterilization} ${daysSinceLastSterilization === 1 ? 'dňom' : 'dňami'}. Čas na novú sterilizáciu!`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSterilizationReminder(false)}
              className="text-cyan-500 hover:text-cyan-700 transition-colors"
              aria-label="Zavrieť pripomienku"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        )}
      </div>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <EntryForm 
            onAddEntry={addEntry} 
            editingEntry={editingEntry}
            onUpdateEntry={updateEntry}
            onCancelEdit={cancelEdit}
          />
        </div>
        <div className="lg:col-span-2">
          {showDevelopment ? (
            <DevelopmentGuide birthDate={new Date('2025-09-29')} />
          ) : showWHO ? (
            <WHOGuidelines entries={entries} birthDate={new Date('2025-09-29')} />
          ) : showWhiteNoise ? (
            <WhiteNoise />
          ) : showStats ? (
            <Statistics entries={entries} />
          ) : (
            <LogList 
              entries={entries} 
              onDeleteEntry={deleteEntry}
              onEditEntry={startEditEntry}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
