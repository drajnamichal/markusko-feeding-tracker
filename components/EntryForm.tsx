
import React, { useState, useEffect } from 'react';
import type { LogEntry } from '../types';

interface EntryFormProps {
  onAddEntry: (entry: Omit<LogEntry, 'id' | 'dateTime' | 'babyProfileId'> & { dateTime: string }) => Promise<void>;
  editingEntry?: LogEntry | null;
  onUpdateEntry?: (entry: LogEntry) => Promise<void>;
  onCancelEdit?: () => void;
}

type ButtonState = 'idle' | 'loading' | 'success';

// Helper function to get current time as ISO string for datetime-local input
const getCurrentDateTimeString = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const EntryForm: React.FC<EntryFormProps> = ({ onAddEntry, editingEntry, onUpdateEntry, onCancelEdit }) => {
  const [dateTime, setDateTime] = useState(getCurrentDateTimeString());
  const [poop, setPoop] = useState(false);
  const [pee, setPee] = useState(false);
  const [breastfed, setBreastfed] = useState(false);
  const [vomit, setVomit] = useState(false);
  const [vitaminD, setVitaminD] = useState(false);
  const [vitaminC, setVitaminC] = useState(false);
  const [tummyTime, setTummyTime] = useState(false);
  const [sterilization, setSterilization] = useState(false);
  const [bathing, setBathing] = useState(false);
  const [breastMilkMl, setBreastMilkMl] = useState('');
  const [formulaMl, setFormulaMl] = useState('');
  const [notes, setNotes] = useState('');
  const [saveButtonState, setSaveButtonState] = useState<ButtonState>('idle');

  // Update time when app comes back from background (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !editingEntry) {
        // App is visible again and not editing - update time to current
        setDateTime(getCurrentDateTimeString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [editingEntry]);

  // Update time every minute (for long-running sessions)
  useEffect(() => {
    if (editingEntry) return; // Don't update time when editing

    const interval = setInterval(() => {
      setDateTime(getCurrentDateTimeString());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, [editingEntry]);

  // Populate form when editing
  useEffect(() => {
    if (editingEntry) {
      const editDate = new Date(editingEntry.dateTime);
      editDate.setMinutes(editDate.getMinutes() - editDate.getTimezoneOffset());
      setDateTime(editDate.toISOString().slice(0, 16));
      setPoop(editingEntry.poop);
      setPee(editingEntry.pee);
      setBreastfed(editingEntry.breastfed);
      setVomit(editingEntry.vomit);
      setVitaminD(editingEntry.vitaminD);
      setVitaminC(editingEntry.vitaminC);
      setTummyTime(editingEntry.tummyTime);
      setSterilization(editingEntry.sterilization);
      setBathing(editingEntry.bathing);
      setBreastMilkMl(editingEntry.breastMilkMl > 0 ? String(editingEntry.breastMilkMl) : '');
      setFormulaMl(editingEntry.formulaMl > 0 ? String(editingEntry.formulaMl) : '');
      setNotes(editingEntry.notes);
    }
  }, [editingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveButtonState('loading');

    try {
      if (editingEntry && onUpdateEntry) {
        // Update existing entry
        await onUpdateEntry({
          ...editingEntry,
          dateTime: new Date(dateTime),
          poop,
          pee,
          breastfed,
          vomit,
          vitaminD,
          vitaminC,
          tummyTime,
          sterilization,
          bathing,
          breastMilkMl: Number(breastMilkMl) || 0,
          formulaMl: Number(formulaMl) || 0,
          notes,
        });
      } else {
        // Add new entry
        await onAddEntry({
          dateTime,
          poop,
          pee,
          breastfed,
          vomit,
          vitaminD,
          vitaminC,
          tummyTime,
          sterilization,
          bathing,
          sabSimplex: false,
          breastMilkMl: Number(breastMilkMl) || 0,
          formulaMl: Number(formulaMl) || 0,
          notes,
        });
      }

      setSaveButtonState('success');
      setTimeout(() => {
        setSaveButtonState('idle');
      }, 1500);

      // Reset form
      resetForm();
    } catch (error) {
      setSaveButtonState('idle');
      // Error is already handled by parent component
    }
  };

  const resetForm = () => {
    setPoop(false);
    setPee(false);
    setBreastfed(false);
    setVomit(false);
    setVitaminD(false);
    setVitaminC(false);
    setTummyTime(false);
    setSterilization(false);
    setBathing(false);
    setBreastMilkMl('');
    setFormulaMl('');
    setNotes('');
    setDateTime(getCurrentDateTimeString());
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-slate-700">
        {editingEntry ? 'Upraviť záznam' : 'Pridať nový záznam'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-slate-600 mb-1">Dátum a čas</label>
          <input
            type="datetime-local"
            id="datetime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={poop} onChange={(e) => setPoop(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <span className="text-slate-700">Stolica</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={pee} onChange={(e) => setPee(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <span className="text-slate-700">Moč</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={breastfed} onChange={(e) => setBreastfed(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <span className="text-slate-700">Dojčenie</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={vomit} onChange={(e) => setVomit(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"/>
                <span className="text-slate-700">Vracanie</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={vitaminD} onChange={(e) => setVitaminD(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"/>
                <span className="text-slate-700">Vitamín D</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={vitaminC} onChange={(e) => setVitaminC(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"/>
                <span className="text-slate-700">Vitamín C</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={tummyTime} onChange={(e) => setTummyTime(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400"/>
                <span className="text-slate-700">Tummy Time</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={sterilization} onChange={(e) => setSterilization(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-400"/>
                <span className="text-slate-700">Sterilizácia fliaš</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-md hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={bathing} onChange={(e) => setBathing(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"/>
                <span className="text-slate-700">Kúpanie</span>
            </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="breast-milk" className="block text-sm font-medium text-slate-600 mb-1">Materské mlieko (ml)</label>
                <input type="number" id="breast-milk" value={breastMilkMl} onChange={(e) => setBreastMilkMl(e.target.value)} min="0" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
                <label htmlFor="formula" className="block text-sm font-medium text-slate-600 mb-1">Umelé mlieko (ml)</label>
                <input type="number" id="formula" value={formulaMl} onChange={(e) => setFormulaMl(e.target.value)} min="0" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-1">Poznámky</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            placeholder="napr., Stolica 2x, zelená farba..."
          ></textarea>
        </div>
        
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={saveButtonState === 'loading' || saveButtonState === 'success'}
            className={`
              flex-1 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-md
              ${saveButtonState === 'loading' ? 'bg-slate-400 cursor-wait' : saveButtonState === 'success' ? 'bg-green-500' : 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500'}
            `}
          >
            {saveButtonState === 'loading' && (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {editingEntry ? 'Ukladám...' : 'Pridávam...'}
              </>
            )}
            {saveButtonState === 'success' && (
              <>
                <i className="fas fa-check mr-2"></i>
                {editingEntry ? 'Uložené!' : 'Pridané!'}
              </>
            )}
            {saveButtonState === 'idle' && (
              <>
                <i className={`fas ${editingEntry ? 'fa-check' : 'fa-plus'} mr-2`}></i> 
                {editingEntry ? 'Uložiť' : 'Pridať záznam'}
              </>
            )}
          </button>
          {editingEntry && (
            <button 
              type="button" 
              onClick={handleCancel}
              disabled={saveButtonState === 'loading' || saveButtonState === 'success'}
              className="px-4 py-3 bg-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
