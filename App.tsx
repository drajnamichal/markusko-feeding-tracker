
import React, { useState, useEffect } from 'react';
import type { LogEntry, BabyProfile, Measurement, SleepSession } from './types';
import { INITIAL_ENTRIES } from './constants';
import EntryForm from './components/EntryForm';
import LogList from './components/LogList';
import Statistics from './components/Statistics';
import WhiteNoise from './components/WhiteNoise';
import WHOGuidelines from './components/WHOGuidelines';
import WHOPercentileCharts from './components/WHOPercentileCharts';
import DevelopmentGuide from './components/DevelopmentGuide';
import TummyTimeStopwatch from './components/TummyTimeStopwatch';
import SleepTracker from './components/SleepTracker';
import FormulaGuide from './components/FormulaGuide';
import AIDoctor from './components/AIDoctor';
import QuickAddButtons from './components/QuickAddButtons';
import { useToast } from './components/Toast';
import { AppLoadingSkeleton, ComponentLoadingSkeleton } from './components/SkeletonLoader';
import { supabase, logEntryToDB, dbToLogEntry, babyProfileToDB, dbToBabyProfile, measurementToDB, dbToMeasurement, sleepSessionToDB, dbToSleepSession, type BabyProfileDB, type MeasurementDB, type SleepSessionDB } from './supabaseClient';

function App() {
  const toast = useToast();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showWhiteNoise, setShowWhiteNoise] = useState(false);
  const [showWHO, setShowWHO] = useState(false);
  const [showWHOPercentiles, setShowWHOPercentiles] = useState(false);
  const [showDevelopment, setShowDevelopment] = useState(false);
  const [showFormulaGuide, setShowFormulaGuide] = useState(false);
  const [showAIDoctor, setShowAIDoctor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tummyTimeCount, setTummyTimeCount] = useState(0);
  const [showTummyTimeReminder, setShowTummyTimeReminder] = useState(false);
  const [showSterilizationReminder, setShowSterilizationReminder] = useState(false);
  const [daysSinceLastSterilization, setDaysSinceLastSterilization] = useState(0);
  const [showBathingReminder, setShowBathingReminder] = useState(false);
  const [daysSinceLastBathing, setDaysSinceLastBathing] = useState(0);
  const [sabSimplexTodayCount, setSabSimplexTodayCount] = useState(0);
  const [hoursSinceLastSabSimplex, setHoursSinceLastSabSimplex] = useState<number | null>(null);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showTummyTimeStopwatch, setShowTummyTimeStopwatch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastBottleFeedingData, setLastBottleFeedingData] = useState<{
    entry: LogEntry;
    hours: number;
    minutes: number;
  } | null>(null);
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [showSleepTracker, setShowSleepTracker] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [feedingNotificationsEnabled, setFeedingNotificationsEnabled] = useState(() => {
    return localStorage.getItem('feedingNotificationsEnabled') === 'true';
  });
  const [showMenu, setShowMenu] = useState(false);
  const [todayMilkIntake, setTodayMilkIntake] = useState({ current: 0, target150: 0, target180: 0, weight: 0 });

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setFeedingNotificationsEnabled(true);
        localStorage.setItem('feedingNotificationsEnabled', 'true');
      }
    }
  };

  // Send notification
  const sendFeedingNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('⏰ Čas na kŕmenie!', {
        body: 'Už 2 hodiny od posledného kŕmenia',
        icon: '/icons/192.png',
        badge: '/icons/72.png',
        tag: 'feeding-reminder',
        renotify: true,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

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
      loadSleepSessions();
    }
  }, [babyProfile]);

  // Initialize notification permission state
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Check for feeding reminder every minute
  useEffect(() => {
    if (!feedingNotificationsEnabled || !entries.length) return;

    const checkFeedingTime = () => {
      const now = new Date();
      const feedings = entries
        .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (feedings.length > 0) {
        const lastFeeding = feedings[0];
        const hoursSinceLastFeeding = (now.getTime() - lastFeeding.dateTime.getTime()) / (1000 * 60 * 60);

        // Send notification if 2 hours have passed
        if (hoursSinceLastFeeding >= 2 && hoursSinceLastFeeding < 2.02) { // Small window to avoid multiple notifications
          sendFeedingNotification();
        }
      }
    };

    // Check immediately and then every minute
    checkFeedingTime();
    const interval = setInterval(checkFeedingTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [entries, feedingNotificationsEnabled]);

  // Calculate today's milk intake
  useEffect(() => {
    if (!loading && entries.length > 0 && measurements.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get today's bottle feedings
      const todayBottleFeedings = entries.filter(e => {
        const entryDate = new Date(e.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && (e.breastMilkMl > 0 || e.formulaMl > 0);
      });

      // Calculate total ml today
      const currentMl = todayBottleFeedings.reduce((sum, e) => sum + e.breastMilkMl + e.formulaMl, 0);

      // Get latest weight (in grams, convert to kg)
      const latestMeasurement = measurements
        .filter(m => m.weightGrams > 0)
        .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())[0];

      if (latestMeasurement) {
        const weightKg = latestMeasurement.weightGrams / 1000;
        const target150 = Math.round(weightKg * 150);
        const target180 = Math.round(weightKg * 180);

        setTodayMilkIntake({
          current: currentMl,
          target150: target150,
          target180: target180,
          weight: latestMeasurement.weightGrams
        });
      }
    }
  }, [entries, measurements, loading]);

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

  // Check for bathing reminder (every 2 days)
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
        setShowBathingReminder(diffDays >= 2);
      } else {
        // No bathing recorded yet - show reminder
        setDaysSinceLastBathing(999);
        setShowBathingReminder(true);
      }
    }
  }, [entries, loading]);

  // Check SAB Simplex doses
  useEffect(() => {
    if (!loading) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sabSimplexEntries = entries.filter(e => {
        const entryDate = new Date(e.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && e.sabSimplex;
      });

      setSabSimplexTodayCount(sabSimplexEntries.length);

      // Calculate time since last dose
      const allSabSimplexEntries = entries
        .filter(e => e.sabSimplex)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (allSabSimplexEntries.length > 0) {
        const lastDose = allSabSimplexEntries[0];
        const hoursSince = (currentTime.getTime() - lastDose.dateTime.getTime()) / (1000 * 60 * 60);
        setHoursSinceLastSabSimplex(hoursSince);
      } else {
        setHoursSinceLastSabSimplex(null);
      }
    }
  }, [entries, currentTime, loading]);

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
      toast.error('Chyba pri načítaní dát z databázy');
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
      toast.success('Záznam pridaný');
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Chyba pri pridávaní záznamu');
    }
  };
  
  const deleteEntry = async (id: string) => {
    // Find the entry before deleting
    const entryToDelete = entries.find(entry => entry.id === id);
    if (!entryToDelete) {
      toast.error('Záznam nenájdený');
      return;
    }

    try {
      const { error } = await supabase
        .from('log_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      
      // Show undo toast
      toast.showUndoToast('Záznam vymazaný', async () => {
        // Undo: restore the entry
        try {
          const dbEntry = logEntryToDB(entryToDelete);
          const { error: restoreError } = await supabase
            .from('log_entries')
            .insert([dbEntry]);

          if (restoreError) throw restoreError;

          // Add back to state
          setEntries(prevEntries => [entryToDelete, ...prevEntries].sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()));
          toast.success('Záznam obnovený');
        } catch (undoError) {
          console.error('Error restoring entry:', undoError);
          toast.error('Chyba pri obnovení záznamu');
        }
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Chyba pri mazaní záznamu');
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
      toast.success('Záznam aktualizovaný');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Chyba pri aktualizácii záznamu');
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
      toast.success('Profil aktualizovaný');
    } catch (error) {
      console.error('Error updating baby profile:', error);
      toast.error('Chyba pri aktualizácii profilu');
    }
  };

  const addMeasurement = async (weightGrams: number, heightCm: number | null, headCircumferenceCm: number | null, notes: string) => {
    if (!babyProfile) return;

    const newMeasurement: Measurement = {
      id: new Date().toISOString() + Math.random(),
      babyProfileId: babyProfile.id,
      measuredAt: new Date(),
      weightGrams: weightGrams || 0,
      heightCm: heightCm || 0,
      headCircumferenceCm: headCircumferenceCm || 0,
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
      toast.success('Meranie pridané');
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast.error('Chyba pri pridávaní merania');
    }
  };

  const updateMeasurement = async (updatedMeasurement: Measurement) => {
    try {
      const dbMeasurement = measurementToDB(updatedMeasurement);
      const { error } = await supabase
        .from('measurements')
        .update(dbMeasurement)
        .eq('id', updatedMeasurement.id);

      if (error) throw error;

      setMeasurements(prev => 
        prev.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m)
          .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())
      );
      setEditingMeasurement(null);
      setShowMeasurementModal(false);
      toast.success('Meranie aktualizované');
    } catch (error) {
      console.error('Error updating measurement:', error);
      toast.error('Chyba pri aktualizácii merania');
    }
  };

  const deleteMeasurement = async (id: string) => {
    if (!confirm('Naozaj chcete vymazať toto meranie?')) return;

    try {
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeasurements(prev => prev.filter(m => m.id !== id));
      toast.success('Meranie vymazané');
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error('Chyba pri mazaní merania');
    }
  };

  const startEditMeasurement = (measurement: Measurement) => {
    setEditingMeasurement(measurement);
    setShowMeasurementModal(true);
  };

  const cancelEditMeasurement = () => {
    setEditingMeasurement(null);
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
      bathing: false,
      sabSimplex: false,
      notes: `Tummy Time: ${Math.floor(seconds / 60)} min ${seconds % 60} sek`,
    };

    await addEntry(newEntry);
  };

  const loadSleepSessions = async () => {
    if (!babyProfile) return;

    try {
      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('baby_profile_id', babyProfile.id)
        .order('start_time', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const sessions = data.map(dbToSleepSession);
        setSleepSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading sleep sessions:', error);
    }
  };

  const saveSleepSession = async (startTime: Date, endTime: Date, durationMinutes: number) => {
    if (!babyProfile) return;

    const newSession: SleepSession = {
      id: new Date().toISOString() + Math.random(),
      babyProfileId: babyProfile.id,
      startTime: startTime,
      endTime: endTime,
      durationMinutes: durationMinutes,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const dbSession = sleepSessionToDB(newSession);
      const { error } = await supabase
        .from('sleep_sessions')
        .insert([dbSession]);

      if (error) throw error;

      setSleepSessions(prev => [newSession, ...prev]);
      setShowSleepTracker(false);
      toast.success('Spánok uložený');
    } catch (error) {
      console.error('Error saving sleep session:', error);
      toast.error('Chyba pri ukladaní spánku');
    }
  };

  // Navigate to home screen
  const goToHome = () => {
    setShowAIDoctor(false);
    setShowStats(false);
    setShowWhiteNoise(false);
    setShowWHO(false);
    setShowWHOPercentiles(false);
    setShowDevelopment(false);
    setShowFormulaGuide(false);
    setShowMenu(false);
  };

  // Check if we're on home screen
  const isHomeScreen = !showAIDoctor && !showStats && !showWhiteNoise && !showWHO && !showWHOPercentiles && !showDevelopment && !showFormulaGuide;


  if (loading) {
    return <AppLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">👶</div>
              <div>
                <h1 
                  className="text-2xl font-bold text-slate-700 flex items-center gap-2 cursor-pointer hover:text-teal-600 transition-colors"
                  onClick={goToHome}
                  title="Späť na hlavnú stránku"
                >
                  {babyProfile?.name || 'Loading...'}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileModal(true);
                    }}
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
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-teal-500 text-white hover:bg-teal-600"
                title="Menu"
              >
                <i className={`fas ${showMenu ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  
                  {/* Menu Panel */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="py-2">
                      {/* Home Button */}
                      <button
                        onClick={goToHome}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${isHomeScreen ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-home text-lg ${isHomeScreen ? 'text-teal-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${isHomeScreen ? 'text-teal-600' : 'text-slate-700'}`}>Domov</span>
                      </button>
                      
                      <div className="border-t border-slate-100 my-1"></div>
                      
                      {/* Notifications Button */}
                      <button
                        onClick={() => {
                          if (notificationPermission === 'granted') {
                            const newState = !feedingNotificationsEnabled;
                            setFeedingNotificationsEnabled(newState);
                            localStorage.setItem('feedingNotificationsEnabled', String(newState));
                          } else {
                            requestNotificationPermission();
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <i className={`fas ${feedingNotificationsEnabled ? 'fa-bell' : 'fa-bell-slash'} text-lg ${feedingNotificationsEnabled ? 'text-amber-500' : 'text-slate-400'}`}></i>
                        <span className="text-slate-700 font-medium">{feedingNotificationsEnabled ? 'Notifikácie ON' : 'Notifikácie OFF'}</span>
                      </button>
                      
                      <div className="border-t border-slate-100 my-1"></div>
                      
                      {/* Measurement Button */}
                      <button
                        onClick={() => {
                          setShowMeasurementModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <i className="fas fa-ruler-combined text-lg text-pink-500"></i>
                        <span className="text-slate-700 font-medium">Zaznamenať miery</span>
                      </button>
                      
                      {/* Tummy Time Button */}
                      <button
                        onClick={() => {
                          setShowTummyTimeStopwatch(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <i className="fas fa-stopwatch text-lg text-indigo-500"></i>
                        <span className="text-slate-700 font-medium">Tummy Time</span>
                      </button>
                      
                      {/* Sleep Button */}
                      <button
                        onClick={() => {
                          setShowSleepTracker(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <i className="fas fa-moon text-lg text-blue-500"></i>
                        <span className="text-slate-700 font-medium">Spánok</span>
                      </button>
                      
                      <div className="border-t border-slate-100 my-1"></div>
                      
                      {/* AI Doctor Button */}
                      <button
                        onClick={() => {
                          setShowAIDoctor(!showAIDoctor);
                          setShowStats(false);
                          setShowWhiteNoise(false);
                          setShowWHO(false);
                          setShowWHOPercentiles(false);
                          setShowDevelopment(false);
                          setShowFormulaGuide(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showAIDoctor ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-user-doctor text-lg ${showAIDoctor ? 'text-teal-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showAIDoctor ? 'text-teal-600' : 'text-slate-700'}`}>AI Doktor</span>
                      </button>
                      
                      {/* Statistics Button */}
                      <button
                        onClick={() => {
                          setShowStats(!showStats);
                          setShowWhiteNoise(false);
                          setShowWHO(false);
                          setShowWHOPercentiles(false);
                          setShowDevelopment(false);
                          setShowFormulaGuide(false);
                          setShowAIDoctor(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showStats ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-chart-bar text-lg ${showStats ? 'text-teal-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showStats ? 'text-teal-600' : 'text-slate-700'}`}>Štatistiky</span>
                      </button>
                      
                      {/* WHO Button */}
                      <button
                        onClick={() => {
                          setShowWHO(!showWHO);
                          setShowStats(false);
                          setShowWhiteNoise(false);
                          setShowDevelopment(false);
                          setShowFormulaGuide(false);
                          setShowAIDoctor(false);
                          setShowWHOPercentiles(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showWHO ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-stethoscope text-lg ${showWHO ? 'text-blue-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showWHO ? 'text-blue-600' : 'text-slate-700'}`}>WHO</span>
                      </button>
                      
                      {/* WHO Percentiles Button */}
                      <button
                        onClick={() => {
                          setShowWHOPercentiles(!showWHOPercentiles);
                          setShowStats(false);
                          setShowWhiteNoise(false);
                          setShowWHO(false);
                          setShowDevelopment(false);
                          setShowFormulaGuide(false);
                          setShowAIDoctor(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showWHOPercentiles ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-chart-line text-lg ${showWHOPercentiles ? 'text-blue-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showWHOPercentiles ? 'text-blue-600' : 'text-slate-700'}`}>WHO Percentily</span>
                      </button>
                      
                      {/* Formula Guide Button */}
                      <button
                        onClick={() => {
                          setShowFormulaGuide(!showFormulaGuide);
                          setShowStats(false);
                          setShowWhiteNoise(false);
                          setShowWHO(false);
                          setShowWHOPercentiles(false);
                          setShowDevelopment(false);
                          setShowAIDoctor(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showFormulaGuide ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-table text-lg ${showFormulaGuide ? 'text-pink-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showFormulaGuide ? 'text-pink-600' : 'text-slate-700'}`}>Dávkovanie mlieka</span>
                      </button>
                      
                      {/* Development Button */}
                      <button
                        onClick={() => {
                          setShowDevelopment(!showDevelopment);
                          setShowStats(false);
                          setShowWhiteNoise(false);
                          setShowWHO(false);
                          setShowWHOPercentiles(false);
                          setShowFormulaGuide(false);
                          setShowAIDoctor(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showDevelopment ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-baby-carriage text-lg ${showDevelopment ? 'text-green-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showDevelopment ? 'text-green-600' : 'text-slate-700'}`}>Cvičenia</span>
                      </button>
                      
                      {/* White Noise Button */}
                      <button
                        onClick={() => {
                          setShowWhiteNoise(!showWhiteNoise);
                          setShowStats(false);
                          setShowWHO(false);
                          setShowWHOPercentiles(false);
                          setShowDevelopment(false);
                          setShowFormulaGuide(false);
                          setShowAIDoctor(false);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${showWhiteNoise ? 'bg-slate-50' : ''}`}
                      >
                        <i className={`fas fa-music text-lg ${showWhiteNoise ? 'text-purple-500' : 'text-slate-400'}`}></i>
                        <span className={`font-medium ${showWhiteNoise ? 'text-purple-600' : 'text-slate-700'}`}>White Noise</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                {editingMeasurement ? 'Upraviť miery' : 'Zaznamenať miery'}
              </h2>
              <button
                onClick={() => {
                  setShowMeasurementModal(false);
                  setEditingMeasurement(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const weightGramsStr = formData.get('weightGrams') as string;
                const heightCmStr = formData.get('heightCm') as string;
                const headCircumferenceCmStr = formData.get('headCircumferenceCm') as string;
                const weightGrams = weightGramsStr ? parseInt(weightGramsStr) : 0;
                const heightCm = heightCmStr ? parseFloat(heightCmStr) : null;
                const headCircumferenceCm = headCircumferenceCmStr ? parseFloat(headCircumferenceCmStr) : null;
                const notes = (formData.get('notes') as string) || '';
                
                if (weightGrams > 0 || (heightCm && heightCm > 0) || (headCircumferenceCm && headCircumferenceCm > 0)) {
                  if (editingMeasurement) {
                    updateMeasurement({
                      ...editingMeasurement,
                      weightGrams: weightGrams,
                      heightCm: heightCm || 0,
                      headCircumferenceCm: headCircumferenceCm || 0,
                      notes: notes,
                      updatedAt: new Date(),
                    });
                  } else {
                    addMeasurement(weightGrams, heightCm, headCircumferenceCm, notes);
                  }
                } else {
                  toast.warning('Zadajte aspoň jednu mieru');
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="weightGrams" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-weight mr-2 text-pink-500"></i>Váha (g) <span className="text-xs text-slate-400">(voliteľné)</span>
                  </label>
                  <input
                    type="number"
                    id="weightGrams"
                    name="weightGrams"
                    defaultValue={editingMeasurement?.weightGrams > 0 ? editingMeasurement.weightGrams : ''}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. 3500"
                    min="0"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-1">Pri narodení: {babyProfile.birthWeightGrams}g</p>
                </div>
                
                <div>
                  <label htmlFor="heightCm" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-ruler-vertical mr-2 text-pink-500"></i>Výška (cm) <span className="text-xs text-slate-400">(voliteľné)</span>
                  </label>
                  <input
                    type="number"
                    id="heightCm"
                    name="heightCm"
                    step="0.1"
                    defaultValue={editingMeasurement?.heightCm > 0 ? editingMeasurement.heightCm : ''}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. 52.5"
                    min="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">Pri narodení: {babyProfile.birthHeightCm}cm</p>
                </div>
                
                <div>
                  <label htmlFor="headCircumferenceCm" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-brain mr-2 text-pink-500"></i>Obvod hlavy (cm) <span className="text-xs text-slate-400">(voliteľné)</span>
                  </label>
                  <input
                    type="number"
                    id="headCircumferenceCm"
                    name="headCircumferenceCm"
                    step="0.1"
                    defaultValue={editingMeasurement?.headCircumferenceCm > 0 ? editingMeasurement.headCircumferenceCm : ''}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Napr. 35.5"
                    min="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">Normálne: 32-37 cm pri narodení</p>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-2">
                    <i className="fas fa-note-sticky mr-2 text-pink-500"></i>Poznámka (voliteľné)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    defaultValue={editingMeasurement?.notes || ''}
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
                  <i className="fas fa-save mr-2"></i>{editingMeasurement ? 'Uložiť zmeny' : 'Uložiť meranie'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMeasurementModal(false);
                    setEditingMeasurement(null);
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>Zrušiť
                </button>
              </div>
              
              {/* Delete button when editing */}
              {editingMeasurement && (
                <button
                  type="button"
                  onClick={() => {
                    if (editingMeasurement) {
                      deleteMeasurement(editingMeasurement.id);
                      setShowMeasurementModal(false);
                      setEditingMeasurement(null);
                    }
                  }}
                  className="w-full mt-3 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-200"
                >
                  <i className="fas fa-trash mr-2"></i>Vymazať meranie
                </button>
              )}
            </form>

            {/* Recent Measurements */}
            {measurements.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  <i className="fas fa-clock-rotate-left mr-2"></i>Posledné merania
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {measurements.slice(0, 5).map((measurement) => (
                    <div key={measurement.id} className="bg-slate-50 p-3 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700">
                          {new Date(measurement.measuredAt).toLocaleDateString('sk-SK')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {new Date(measurement.measuredAt).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => startEditMeasurement(measurement)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Upraviť"
                          >
                            <i className="fas fa-pen text-xs"></i>
                          </button>
                          <button
                            onClick={() => deleteMeasurement(measurement.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Vymazať"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-slate-600 flex-wrap">
                        {measurement.weightGrams > 0 && (
                          <span>
                            <i className="fas fa-weight text-pink-500 mr-1"></i>
                            {measurement.weightGrams}g
                          </span>
                        )}
                        {measurement.heightCm > 0 && (
                          <span>
                            <i className="fas fa-ruler-vertical text-pink-500 mr-1"></i>
                            {measurement.heightCm}cm
                          </span>
                        )}
                        {measurement.headCircumferenceCm > 0 && (
                          <span>
                            <i className="fas fa-brain text-pink-500 mr-1"></i>
                            {measurement.headCircumferenceCm}cm
                          </span>
                        )}
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

      {showSleepTracker && (
        <SleepTracker
          onClose={() => setShowSleepTracker(false)}
          onSave={saveSleepSession}
          recentSleeps={sleepSessions}
        />
      )}

      {/* Quick Add Buttons - Only on Home Screen */}
      {isHomeScreen && (
        <div className="container mx-auto px-4 pt-4">
          <QuickAddButtons onQuickAdd={addEntry} />
        </div>
      )}

      {/* Reminders - Only on Home Screen */}
      {isHomeScreen && (
        <div className="container mx-auto px-4 pt-4 space-y-3">

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
                <p className="text-sm text-cyan-700">Čas na novú sterilizáciu!</p>
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

        {/* SAB Simplex - Initial reminder (no doses today) */}
        {sabSimplexTodayCount === 0 && (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-pills text-3xl text-purple-500"></i>
              <div>
                <p className="font-bold text-purple-800">💊 Nezabudni dať SAB Simplex</p>
                <p className="text-sm text-purple-700">10 kvapiek do mlieka</p>
                <p className="text-xs text-purple-600 mt-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  Dávkovanie: 4x denne, každé 4 hodiny
                </p>
              </div>
            </div>
            <button
              onClick={() => {/* User will add entry */}}
              className="text-purple-500 hover:text-purple-700 transition-colors"
              aria-label="Info"
            >
              <i className="fas fa-info-circle text-xl"></i>
            </button>
          </div>
        )}

        {/* SAB Simplex - Tracking widget (after first dose) */}
        {sabSimplexTodayCount > 0 && (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <i className="fas fa-pills text-3xl text-purple-500"></i>
              <div className="flex-1">
                <p className="font-bold text-purple-800 mb-1">💊 SAB Simplex</p>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>
                    Dnes: <span className="font-bold text-lg">{sabSimplexTodayCount}/4</span> dávok
                    {sabSimplexTodayCount < 4 && (
                      <span className="ml-2">(ešte {4 - sabSimplexTodayCount}x)</span>
                    )}
                  </p>
                  {hoursSinceLastSabSimplex !== null && (
                    <p>
                      Od poslednej dávky: <span className="font-bold">{hoursSinceLastSabSimplex.toFixed(1)}h</span>
                      {hoursSinceLastSabSimplex >= 4 ? (
                        <span className="ml-2 text-green-600 font-bold">✓ Môžete podať ďalšiu dávku</span>
                      ) : (
                        <span className="ml-2 text-amber-600">
                          Ďalšia dávka za {(4 - hoursSinceLastSabSimplex).toFixed(1)}h
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-purple-600 mt-2">
                    <i className="fas fa-info-circle mr-1"></i>
                    Dávkovanie: 4x10 kvapiek do mlieka (každé 4 hodiny)
                  </p>
                </div>
              </div>
            </div>
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

        {/* Daily Milk Intake Widget */}
        {todayMilkIntake.weight > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">
                  <i className="fas fa-chart-line mr-2"></i>
                  Denný príjem mlieka (váha: {todayMilkIntake.weight}g)
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-4xl font-bold">
                    {todayMilkIntake.current} ml
                  </p>
                  <p className="text-lg opacity-90">
                    / {todayMilkIntake.target150}-{todayMilkIntake.target180} ml
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (todayMilkIntake.current / todayMilkIntake.target180) * 100)}%` 
                    }}
                  ></div>
                </div>
                
                {/* Status text */}
                <div className="flex items-center gap-2 text-sm">
                  {todayMilkIntake.current < todayMilkIntake.target150 ? (
                    <>
                      <i className="fas fa-arrow-up"></i>
                      <span>Potrebujete ešte {todayMilkIntake.target150 - todayMilkIntake.current} ml (minimum)</span>
                    </>
                  ) : todayMilkIntake.current < todayMilkIntake.target180 ? (
                    <>
                      <i className="fas fa-check-circle"></i>
                      <span>V norme! Môžete pridať až {todayMilkIntake.target180 - todayMilkIntake.current} ml</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i>
                      <span>Cieľ splnený!</span>
                    </>
                  )}
                </div>
                
                {/* Calculation info */}
                <div className="border-t border-white/20 pt-2 mt-2">
                  <p className="text-xs opacity-75">
                    <i className="fas fa-info-circle mr-1"></i>
                    Odporúčaný denný príjem: 150-180 ml/kg (8 dávok/deň)
                  </p>
                </div>
              </div>
              <div className="text-5xl opacity-80">
                <i className="fas fa-baby-bottle"></i>
              </div>
            </div>
          </div>
        )}

        {/* Last Bottle Feeding Stopwatch */}
        {lastBottleFeedingData && (() => {
          const nextFeedingTime = new Date(lastBottleFeedingData.entry.dateTime.getTime() + (2 * 60 * 60 * 1000));
          return (
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
                  <p className="text-sm opacity-90 mb-2">
                    <i className="fas fa-clock mr-1"></i>
                    {lastBottleFeedingData.entry.dateTime.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                    {' | '}
                    {lastBottleFeedingData.entry.breastMilkMl > 0 && `${lastBottleFeedingData.entry.breastMilkMl}ml materské`}
                    {lastBottleFeedingData.entry.breastMilkMl > 0 && lastBottleFeedingData.entry.formulaMl > 0 && ' + '}
                    {lastBottleFeedingData.entry.formulaMl > 0 && `${lastBottleFeedingData.entry.formulaMl}ml umelé`}
                  </p>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <p className="text-sm opacity-90">
                      <i className="fas fa-clock mr-1"></i>
                      <span className="font-semibold">Nasledujúce kŕmenie:</span> {nextFeedingTime.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-5xl opacity-80">
                  <i className="fas fa-stopwatch"></i>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      )}

      <main className={`container mx-auto p-4 md:p-8 ${isHomeScreen ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : 'max-w-6xl'}`}>
        {isHomeScreen && (
          <div className="lg:col-span-1">
            <EntryForm 
              onAddEntry={addEntry} 
              editingEntry={editingEntry}
              onUpdateEntry={updateEntry}
              onCancelEdit={cancelEdit}
            />
          </div>
        )}
        <div className={isHomeScreen ? 'lg:col-span-2' : ''}>
          {showAIDoctor ? (
            babyProfile ? (
              <AIDoctor 
                babyProfile={babyProfile}
                entries={entries}
                measurements={measurements}
                sleepSessions={sleepSessions}
              />
            ) : <ComponentLoadingSkeleton type="ai" />
          ) : showWHOPercentiles ? (
            babyProfile ? <WHOPercentileCharts babyProfile={babyProfile} measurements={measurements} /> : <ComponentLoadingSkeleton type="percentiles" />
          ) : showDevelopment ? (
            babyProfile ? <DevelopmentGuide birthDate={babyProfile.birthDate} /> : <ComponentLoadingSkeleton type="development" />
          ) : showWHO ? (
            babyProfile ? <WHOGuidelines entries={entries} birthDate={babyProfile.birthDate} /> : <ComponentLoadingSkeleton type="who" />
          ) : showFormulaGuide ? (
            <FormulaGuide currentWeight={measurements.length > 0 ? measurements[0].weightGrams : undefined} />
          ) : showWhiteNoise ? (
            <WhiteNoise />
          ) : showStats ? (
            <Statistics entries={entries} sleepSessions={sleepSessions} />
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
