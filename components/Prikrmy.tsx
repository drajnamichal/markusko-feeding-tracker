import React, { useState, useMemo } from 'react';
import type { SolidFoodEntry } from '../types';

interface PrikrmyProps {
  entries: SolidFoodEntry[];
  onAddEntry: (entry: Omit<SolidFoodEntry, 'id' | 'babyProfileId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateEntry: (entry: SolidFoodEntry) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
}

const FOOD_CATEGORIES = [
  { value: 'zelenina', label: 'Zelenina', icon: '🥕' },
  { value: 'ovocie', label: 'Ovocie', icon: '🍌' },
  { value: 'mäso', label: 'Mäso', icon: '🍗' },
  { value: 'obilniny', label: 'Obilniny', icon: '🌾' },
  { value: 'mliečne', label: 'Mliečne výrobky', icon: '🧀' },
  { value: 'strukoviny', label: 'Strukoviny', icon: '🫘' },
  { value: 'other', label: 'Ostatné', icon: '🍽️' },
];

const getCategoryLabel = (value: string) => {
  return FOOD_CATEGORIES.find(c => c.value === value) ?? { label: 'Ostatné', icon: '🍽️' };
};

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
};

type SaveState = 'idle' | 'loading' | 'success';

const Prikrmy: React.FC<PrikrmyProps> = ({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }) => {
  const [editingEntry, setEditingEntry] = useState<SolidFoodEntry | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Form state
  const [date, setDate] = useState(getTodayString());
  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState('zelenina');
  const [amountG, setAmountG] = useState('');
  const [allergyReaction, setAllergyReaction] = useState(false);
  const [allergyDetails, setAllergyDetails] = useState('');
  const [stoolNotes, setStoolNotes] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setDate(getTodayString());
    setFoodName('');
    setFoodCategory('zelenina');
    setAmountG('');
    setAllergyReaction(false);
    setAllergyDetails('');
    setStoolNotes('');
    setNotes('');
    setEditingEntry(null);
  };

  const startEdit = (entry: SolidFoodEntry) => {
    setEditingEntry(entry);
    const d = entry.date;
    setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    setFoodName(entry.foodName);
    setFoodCategory(entry.foodCategory);
    setAmountG(entry.amountG !== null ? String(entry.amountG) : '');
    setAllergyReaction(entry.allergyReaction);
    setAllergyDetails(entry.allergyDetails);
    setStoolNotes(entry.stoolNotes);
    setNotes(entry.notes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setSaveState('loading');
    try {
      const entryData = {
        date: new Date(date),
        foodName: foodName.trim(),
        foodCategory,
        amountG: amountG ? parseInt(amountG) : null,
        allergyReaction,
        allergyDetails: allergyReaction ? allergyDetails.trim() : '',
        stoolNotes: stoolNotes.trim(),
        notes: notes.trim(),
      };

      if (editingEntry) {
        await onUpdateEntry({ ...editingEntry, ...entryData });
      } else {
        await onAddEntry(entryData);
      }

      setSaveState('success');
      setTimeout(() => {
        setSaveState('idle');
        resetForm();
      }, 1200);
    } catch {
      setSaveState('idle');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group entries by date string, newest first
  const grouped = useMemo(() => {
    const map = new Map<string, SolidFoodEntry[]>();
    [...entries]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .forEach(entry => {
        const key = entry.date.toISOString().split('T')[0];
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(entry);
      });
    return map;
  }, [entries]);

  // Stats: unique foods introduced
  const uniqueFoods = useMemo(() => {
    const seen = new Set<string>();
    entries.forEach(e => seen.add(e.foodName.toLowerCase()));
    return seen.size;
  }, [entries]);

  const reactionCount = entries.filter(e => e.allergyReaction).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{uniqueFoods}</p>
          <p className="text-xs text-green-700">Potravín vyskúšaných</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
          <p className="text-xs text-blue-700">Záznamov celkom</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{reactionCount}</p>
          <p className="text-xs text-red-700">Reakcií</p>
        </div>
      </div>

      {/* Add / Edit form */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          {editingEntry ? (
            <><i className="fas fa-pen mr-2 text-teal-500"></i>Upraviť príkrm</>
          ) : (
            <><i className="fas fa-plus mr-2 text-teal-500"></i>Pridať príkrm</>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date + Food name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                <i className="fas fa-calendar mr-1"></i>Dátum
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                <i className="fas fa-utensils mr-1"></i>Potravina
              </label>
              <input
                type="text"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                placeholder="napr. Mrkva, Banán..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Category + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                <i className="fas fa-tag mr-1"></i>Kategória
              </label>
              <select
                value={foodCategory}
                onChange={e => setFoodCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {FOOD_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                <i className="fas fa-weight mr-1"></i>Množstvo (g) <span className="text-xs text-slate-400">voliteľné</span>
              </label>
              <input
                type="number"
                value={amountG}
                onChange={e => setAmountG(e.target.value)}
                placeholder="napr. 30"
                min="0"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Allergy reaction */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={allergyReaction}
                onChange={e => setAllergyReaction(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="font-medium text-slate-700">
                <i className="fas fa-triangle-exclamation text-red-500 mr-1"></i>
                Alergická / nepriaznivá reakcia
              </span>
            </label>
            {allergyReaction && (
              <textarea
                value={allergyDetails}
                onChange={e => setAllergyDetails(e.target.value)}
                rows={2}
                placeholder="Opíšte reakciu: vyrážka, začervenanie, zvracanie..."
                className="w-full mt-2 p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm"
              />
            )}
          </div>

          {/* Stool notes */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              <i className="fas fa-notes-medical mr-1"></i>Stolica <span className="text-xs text-slate-400">voliteľné</span>
            </label>
            <input
              type="text"
              value={stoolNotes}
              onChange={e => setStoolNotes(e.target.value)}
              placeholder="napr. zelená, riedka, po 4 hodinách..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* General notes */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              <i className="fas fa-note-sticky mr-1"></i>Poznámky <span className="text-xs text-slate-400">voliteľné</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="napr. Jedol s chuťou, odmietol, dal sme menej..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saveState === 'loading' || saveState === 'success'}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all ${
                saveState === 'loading' ? 'bg-slate-400 cursor-wait' :
                saveState === 'success' ? 'bg-green-500' :
                'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              {saveState === 'loading' && <><i className="fas fa-spinner fa-spin mr-2"></i>Ukladám...</>}
              {saveState === 'success' && <><i className="fas fa-check mr-2"></i>Uložené!</>}
              {saveState === 'idle' && (
                editingEntry
                  ? <><i className="fas fa-save mr-2"></i>Uložiť zmeny</>
                  : <><i className="fas fa-plus mr-2"></i>Pridať príkrm</>
              )}
            </button>
            {editingEntry && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Timeline */}
      {grouped.size === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <i className="fas fa-bowl-food text-5xl mb-3"></i>
          <p className="font-medium">Zatiaľ žiadne príkrmy</p>
          <p className="text-sm mt-1">Pridajte prvý príkrm vyššie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([dateKey, dayEntries]) => {
            const dayDate = dayEntries[0].date;
            const dayHasReaction = dayEntries.some(e => e.allergyReaction);

            return (
              <div key={dateKey} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Day header */}
                <div className={`px-4 py-3 flex items-center justify-between ${
                  dayHasReaction ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-400'
                }`}>
                  <div>
                    <p className="font-bold text-slate-700 capitalize">
                      {formatDate(dayDate)}
                      {isToday(dayDate) && (
                        <span className="ml-2 text-xs font-normal bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Dnes</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {dayEntries.length} {dayEntries.length === 1 ? 'príkrm' : dayEntries.length < 5 ? 'príkrmy' : 'príkrmov'}
                      {dayHasReaction && <span className="ml-2 text-red-600 font-medium"><i className="fas fa-triangle-exclamation mr-1"></i>Reakcia</span>}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${dayHasReaction ? 'bg-red-400' : 'bg-green-400'}`}></div>
                </div>

                {/* Entries for this day */}
                <div className="divide-y divide-slate-100">
                  {dayEntries.map(entry => {
                    const cat = getCategoryLabel(entry.foodCategory);
                    const isExpanded = expandedIds.has(entry.id);
                    const hasDetails = entry.allergyReaction || entry.stoolNotes || entry.notes;

                    return (
                      <div key={entry.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-2xl mt-0.5 flex-shrink-0">{cat.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-800">{entry.foodName}</span>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{cat.label}</span>
                                {entry.amountG && (
                                  <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{entry.amountG}g</span>
                                )}
                                {entry.allergyReaction && (
                                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                    <i className="fas fa-triangle-exclamation mr-1"></i>Reakcia
                                  </span>
                                )}
                              </div>

                              {/* Expandable details */}
                              {hasDetails && isExpanded && (
                                <div className="mt-2 space-y-1">
                                  {entry.allergyReaction && entry.allergyDetails && (
                                    <p className="text-sm text-red-700 bg-red-50 rounded p-2">
                                      <i className="fas fa-triangle-exclamation mr-1"></i>
                                      {entry.allergyDetails}
                                    </p>
                                  )}
                                  {entry.stoolNotes && (
                                    <p className="text-sm text-slate-600">
                                      <i className="fas fa-notes-medical mr-1 text-slate-400"></i>
                                      <strong>Stolica:</strong> {entry.stoolNotes}
                                    </p>
                                  )}
                                  {entry.notes && (
                                    <p className="text-sm text-slate-600">
                                      <i className="fas fa-note-sticky mr-1 text-slate-400"></i>
                                      {entry.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {hasDetails && (
                              <button
                                onClick={() => toggleExpand(entry.id)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                title={isExpanded ? 'Skryť' : 'Zobraziť detaily'}
                              >
                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-sm`}></i>
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(entry)}
                              className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                              title="Upraviť"
                            >
                              <i className="fas fa-pen text-sm"></i>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Vymazať záznam "${entry.foodName}"?`)) {
                                  onDeleteEntry(entry.id);
                                }
                              }}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                              title="Vymazať"
                            >
                              <i className="fas fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Prikrmy;
