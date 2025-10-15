
import React, { useState, useEffect } from 'react';
import type { LogEntry } from './types';
import { INITIAL_ENTRIES } from './constants';
import EntryForm from './components/EntryForm';
import LogList from './components/LogList';
import Statistics from './components/Statistics';
import { supabase, logEntryToDB, dbToLogEntry } from './supabaseClient';

function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVitaminDReminder, setShowVitaminDReminder] = useState(false);
  const [tummyTimeCount, setTummyTimeCount] = useState(0);
  const [showTummyTimeReminder, setShowTummyTimeReminder] = useState(false);
  const [showSterilizationReminder, setShowSterilizationReminder] = useState(false);
  const [daysSinceLastSterilization, setDaysSinceLastSterilization] = useState(0);

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
              <i className="fas fa-baby text-3xl text-teal-500"></i>
              <div>
                <h1 className="text-2xl font-bold text-slate-700">Sledovanie kŕmenia Markuska</h1>
                <p className="text-sm text-slate-500">
                  <i className="fas fa-birthday-cake mr-1"></i>
                  Vek: {calculateAge()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showStats 
                  ? 'bg-teal-500 text-white hover:bg-teal-600' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className={`fas ${showStats ? 'fa-list' : 'fa-chart-bar'} mr-2`}></i>
              {showStats ? 'Záznamy' : 'Štatistiky'}
            </button>
          </div>
        </div>
      </header>

      {/* Reminders */}
      <div className="container mx-auto px-4 pt-4 space-y-3">
        {showVitaminDReminder && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-sun text-3xl text-orange-500"></i>
              <div>
                <p className="font-bold text-orange-800">Pripomienka: Vitamín D</p>
                <p className="text-sm text-orange-700">Nezabudnite dnes dať Markuskovi vitamín D!</p>
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
                <p className="font-bold text-cyan-800">Pripomienka: Sterilizácia fliašok</p>
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
          {showStats ? (
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
