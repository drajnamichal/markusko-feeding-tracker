
import React, { useState, useEffect } from 'react';
import type { LogEntry } from './types';
import { INITIAL_ENTRIES } from './constants';
import EntryForm from './components/EntryForm';
import LogList from './components/LogList';
import Statistics from './components/Statistics';

function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('babyLogEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries).map((entry: any) => ({
          ...entry,
          dateTime: new Date(entry.dateTime),
        }));
        setEntries(parsedEntries);
      } else {
        setEntries(INITIAL_ENTRIES);
      }
    } catch (error) {
      console.error("Failed to load or parse entries from localStorage", error);
      setEntries(INITIAL_ENTRIES);
    }
  }, []);

  useEffect(() => {
    try {
      if (entries.length > 0) {
        localStorage.setItem('babyLogEntries', JSON.stringify(entries));
      }
    } catch (error) {
      console.error("Failed to save entries to localStorage", error);
    }
  }, [entries]);

  const addEntry = (newEntry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string }) => {
    const entryWithDate = {
      ...newEntry,
      id: new Date().toISOString() + Math.random(),
      dateTime: new Date(newEntry.dateTime),
    };

    setEntries(prevEntries => [entryWithDate, ...prevEntries].sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()));
  };
  
  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const updateEntry = (updatedEntry: LogEntry) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ).sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
    );
    setEditingEntry(null);
  };

  const startEditEntry = (entry: LogEntry) => {
    setEditingEntry(entry);
  };

  const cancelEdit = () => {
    setEditingEntry(null);
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-baby text-3xl text-teal-500"></i>
            <h1 className="text-2xl font-bold text-slate-700">Sledovanie kŕmenia Markuska</h1>
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
      </header>
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
