
import React, { useState, useEffect } from 'react';
import type { LogEntry, BabyProfile, Measurement } from './types';
import { INITIAL_ENTRIES } from './constants';
import EntryForm from './components/EntryForm';
import LogList from './components/LogList';
import Statistics from './components/Statistics';
import WhiteNoise from './components/WhiteNoise';
import WHOGuidelines from './components/WHOGuidelines';
import DevelopmentGuide from './components/DevelopmentGuide';
import TummyTimeStopwatch from './components/TummyTimeStopwatch';
import { supabase, logEntryToDB, dbToLogEntry, babyProfileToDB, dbToBabyProfile, measurementToDB, dbToMeasurement, type BabyProfileDB, type MeasurementDB } from './supabaseClient';

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
  const [showBathingReminder, setShowBathingReminder] = useState(false);
  const [daysSinceLastBathing, setDaysSinceLastBathing] = useState(0);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showTummyTimeStopwatch, setShowTummyTimeStopwatch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastBottleFeedingData, setLastBottleFeedingData] = useState<{
    entry: LogEntry;
    hours: number;
    minutes: number;
  } | null>(null);

  // Calculate baby's age
  const calculateAge = () => {
    if (!babyProfile) return '...';
    
    const birthDate = new Date(babyProfile.birthDate);
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

  // Load baby profile and entries from Supabase on mount
  useEffect(() => {
    loadBabyProfile();
    loadEntries();
  }, []);

  // Update document title when baby profile changes
  useEffect(() => {
    if (babyProfile) {
      document.title = babyProfile.name;
      loadMeasurements();
    }
  }, [babyProfile]);

  // Check for vitamin D reminder
  useEffect(() => {
    if (!loading) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const hasVitaminDToday = entries.some(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.vitaminD;
      });

      setShowVitaminDReminder(!hasVitaminDToday);
    }
  }, [entries, loading]);

  // Check for tummy time reminder
  useEffect(() => {
    if (!loading) {
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
  }, [entries, loading]);

  // Check for sterilization reminder (every 2 days)
  useEffect(() => {
    if (!loading) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Find last sterilization entry
      const sterilizationEntries = entries
        .filter(entry => entry.sterilization)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (sterilizationEntries.length > 0) {
        const lastSterilization = sterilizationEntries[0].dateTime;
        const lastSterilizationDay = new Date(lastSterilization.getFullYear(), lastSterilization.getMonth(), lastSterilization.getDate());
        const diffTime = today.getTime() - lastSterilizationDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysSinceLastSterilization(diffDays);
        setShowSterilizationReminder(diffDays >= 2);
      } else {
        // No sterilization recorded yet - show reminder
        setDaysSinceLastSterilization(999);
        setShowSterilizationReminder(true);
      }
    }
  }, [entries, loading]);

  // Check for bathing reminder (every 3 days)
  useEffect(() => {
    if (!loading) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Find last bathing entry
      const bathingEntries = entries
        .filter(entry => entry.bathing)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (bathingEntries.length > 0) {
        const lastBathing = bathingEntries[0].dateTime;
        const lastBathingDay = new Date(lastBathing.getFullYear(), lastBathing.getMonth(), lastBathing.getDate());
        const diffTime = today.getTime() - lastBathingDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysSinceLastBathing(diffDays);
        setShowBathingReminder(diffDays >= 3);
      } else {
        // No bathing recorded yet - show reminder
        setDaysSinceLastBathing(999);
        setShowBathingReminder(true);
      }
    }
  }, [entries, loading]);

  // Update current time every minute for live stopwatch
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate last bottle feeding and elapsed time
  useEffect(() => {
    if (!loading && entries.length > 0) {
      const bottleFeedings = entries
        .filter(e => e.breastMilkMl > 0 || e.formulaMl > 0)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (bottleFeedings.length > 0) {
        const lastFeeding = bottleFeedings[0];
        const diff = currentTime.getTime() - lastFeeding.dateTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setLastBottleFeedingData({
          entry: lastFeeding,
          hours,
          minutes,
        });
      } else {
        setLastBottleFeedingData(null);
      }
    }
  }, [entries, currentTime, loading]);

  const loadBabyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('baby_profile')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        // If profile doesn't exist, it should have been created by migration
        console.error('Error loading baby profile:', error);
        return;
      }

      if (data) {
        const profile = dbToBabyProfile(data as BabyProfileDB);
        setBabyProfile(profile);
      }
    } catch (error) {
      console.error('Error loading baby profile:', error);
    }
  };

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

  const updateBabyProfile = async (updatedProfile: BabyProfile) => {
    try {
      const dbProfile = babyProfileToDB(updatedProfile);
      const { error } = await supabase
        .from('baby_profile')
        .update(dbProfile)
        .eq('id', updatedProfile.id);

      if (error) throw error;

      setBabyProfile(updatedProfile);
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating baby profile:', error);
      alert('Chyba pri aktualizácii profilu');
    }
  };

  const addMeasurement = async (weightGrams: number, heightCm: number, notes: string) => {
    if (!babyProfile) return;

    const newMeasurement: Measurement = {
      id: new Date().toISOString() + Math.random(),
      babyProfileId: babyProfile.id,
      measuredAt: new Date(),
      weightGrams: weightGrams,
      heightCm: heightCm,
      notes: notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const dbMeasurement = measurementToDB(newMeasurement);
      const { error } = await supabase
        .from('measurements')
        .insert([dbMeasurement]);

      if (error) throw error;

      setMeasurements(prev => [newMeasurement, ...prev]);
      setShowMeasurementModal(false);
    } catch (error) {
      console.error('Error adding measurement:', error);
      alert('Chyba pri pridávaní merania');
    }
  };

  const loadMeasurements = async () => {
    if (!babyProfile) return;

    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('baby_profile_id', babyProfile.id)
        .order('measured_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const measurements = data.map(dbToMeasurement);
        setMeasurements(measurements);
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const saveTummyTime = async (seconds: number) => {
    const now = new Date();
    const newEntry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
      dateTime: now.toISOString(),
      poop: false,
      pee: false,
      breastMilkMl: 0,
      breastfed: false,
      formulaMl: 0,
      vomit: false,
      vitaminD: false,
      tummyTime: true,
      sterilization: false,
      notes: `Tummy Time: ${Math.floor(seconds / 60)} min ${seconds % 60} sek`,
    };

    await addEntry(newEntry);
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
                  {babyProfile?.name || 'Loading...'}
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-sm text-slate-400 hover:text-teal-500 transition-colors"
                    title="Upraviť profil"
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
                onClick={() => setShowMeasurementModal(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                title="Zaznamenať miery"
              >
                <i className="fas fa-ruler-combined mr-2"></i>
                Zaznamenať miery
              </button>
              <button
                onClick={() => setShowTummyTimeStopwatch(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                title="Tummy Time stopky"
              >
                <i className="fas fa-stopwatch mr-2"></i>
                Tummy Time
              </button>
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

      {/* Profile Modal */}
      {showProfileModal && babyProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Profil bábätka</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const birthDate = formData.get('birthDate') as string;
                const birthTime = formData.get('birthTime') as string;
                const birthWeightGrams = parseInt(formData.get('birthWeightGrams') as string);
                const birthHeightCm = parseFloat(formData.get('birthHeightCm') as string);
                
                if (name.trim() && birthDate && birthTime && birthWeightGrams && birthHeightCm) {
                  const updatedProfile: BabyProfile = {
                    ...babyProfile,
                    name: name.trim(),
                    birthDate: new Date(birthDate),
                    birthTime: birthTime,
                    birthWeightGrams: birthWeightGrams,
                    birthHeightCm: birthHeightCm,
                  };
                  updateBabyProfile(updatedProfile);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-user mr-2"></i>Meno bábätka
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={babyProfile.name}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Napr. Markus Drajna"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-calendar mr-2"></i>Dátum narodenia
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    defaultValue={babyProfile.birthDate.toISOString().split('T')[0]}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="birthTime" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-clock mr-2"></i>Čas narodenia
                  </label>
                  <input
                    type="time"
                    id="birthTime"
                    name="birthTime"
                    defaultValue={babyProfile.birthTime}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="birthWeightGrams" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-weight mr-2"></i>Váha pri narodení (g)
                  </label>
                  <input
                    type="number"
                    id="birthWeightGrams"
                    name="birthWeightGrams"
                    defaultValue={babyProfile.birthWeightGrams}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Napr. 3030"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="birthHeightCm" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-ruler-vertical mr-2"></i>Výška pri narodení (cm)
                  </label>
                  <input
                    type="number"
                    id="birthHeightCm"
                    name="birthHeightCm"
                    defaultValue={babyProfile.birthHeightCm}
                    step="0.01"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Napr. 51"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  <i className="fas fa-save mr-2"></i>Uložiť
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>Zrušiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Measurement Modal */}
      {showMeasurementModal && babyProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                <i className="fas fa-ruler-combined mr-2 text-pink-500"></i>
                Zaznamenať miery
              </h2>
              <button
                onClick={() => setShowMeasurementModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const weightGrams = parseInt(formData.get('weightGrams') as string);
                const heightCm = parseFloat(formData.get('heightCm') as string);
                const notes = (formData.get('notes') as string) || '';
                
                if (weightGrams && heightCm) {
                  addMeasurement(weightGrams, heightCm, notes);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="weightGrams" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-weight mr-2 text-pink-500"></i>Váha (g)
                  </label>
                  <input
                    type="number"
                    id="weightGrams"
                    name="weightGrams"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. 3500"
                    min="0"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-1">Pri narodení: {babyProfile.birthWeightGrams}g</p>
                </div>
                
                <div>
                  <label htmlFor="heightCm" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-ruler-vertical mr-2 text-pink-500"></i>Výška (cm)
                  </label>
                  <input
                    type="number"
                    id="heightCm"
                    name="heightCm"
                    step="0.1"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. 52.5"
                    min="0"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Pri narodení: {babyProfile.birthHeightCm}cm</p>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-note-sticky mr-2 text-pink-500"></i>Poznámka (voliteľné)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. Po kŕmení, pred spánkom..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                  <i className="fas fa-save mr-2"></i>Uložiť meranie
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeasurementModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>Zrušiť
                </button>
              </div>
            </form>

            {/* Recent Measurements */}
            {measurements.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  <i className="fas fa-clock-rotate-left mr-2"></i>Posledné merania
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {measurements.slice(0, 5).map((measurement) => (
                    <div key={measurement.id} className="bg-slate-50 p-3 rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700">
                          {new Date(measurement.measuredAt).toLocaleDateString('sk-SK')}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(measurement.measuredAt).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex gap-4 text-slate-600">
                        <span>
                          <i className="fas fa-weight text-pink-500 mr-1"></i>
                          {measurement.weightGrams}g
                        </span>
                        <span>
                          <i className="fas fa-ruler-vertical text-pink-500 mr-1"></i>
                          {measurement.heightCm}cm
                        </span>
                      </div>
                      {measurement.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic">{measurement.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tummy Time Stopwatch */}
      {showTummyTimeStopwatch && (
        <TummyTimeStopwatch
          onClose={() => setShowTummyTimeStopwatch(false)}
          onSave={saveTummyTime}
        />
      )}

      {/* Reminders */}
      <div className="container mx-auto px-4 pt-4 space-y-3">
        {showVitaminDReminder && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-sun text-3xl text-orange-500"></i>
              <div>
                <p className="font-bold text-orange-800">Pripomienka: Vitamín D</p>
                <p className="text-sm text-orange-700">Nezabudnite dnes dať {babyProfile?.name || 'bábätku'} vitamín D!</p>
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

        {showBathingReminder && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-bath text-3xl text-blue-500"></i>
              <div>
                <p className="font-bold text-blue-800">Pripomienka: Kúpanie</p>
                <p className="text-sm text-blue-700">
                  {daysSinceLastBathing >= 999 
                    ? 'Ešte ste nezaznamenali kúpanie!' 
                    : `Posledné kúpanie pred ${daysSinceLastBathing} ${daysSinceLastBathing === 1 ? 'dňom' : 'dňami'}. Čas na kúpanie!`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBathingReminder(false)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Zavrieť pripomienku"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        )}

        {/* Last Bottle Feeding Stopwatch */}
        {lastBottleFeedingData && (
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">
                  <i className="fas fa-bottle-baby mr-2"></i>
                  Posledné kŕmenie fľašou
                </p>
                <p className="text-4xl font-bold mb-2">
                  {lastBottleFeedingData.hours}h {lastBottleFeedingData.minutes}m
                </p>
                <p className="text-sm opacity-90">
                  <i className="fas fa-clock mr-1"></i>
                  {lastBottleFeedingData.entry.dateTime.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                  {' | '}
                  {lastBottleFeedingData.entry.breastMilkMl > 0 && `${lastBottleFeedingData.entry.breastMilkMl}ml materské`}
                  {lastBottleFeedingData.entry.breastMilkMl > 0 && lastBottleFeedingData.entry.formulaMl > 0 && ' + '}
                  {lastBottleFeedingData.entry.formulaMl > 0 && `${lastBottleFeedingData.entry.formulaMl}ml umelé`}
                </p>
              </div>
              <div className="text-5xl opacity-80">
                <i className="fas fa-stopwatch"></i>
              </div>
            </div>
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
            babyProfile ? <DevelopmentGuide birthDate={babyProfile.birthDate} /> : <div>Loading...</div>
          ) : showWHO ? (
            babyProfile ? <WHOGuidelines entries={entries} birthDate={babyProfile.birthDate} /> : <div>Loading...</div>
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
