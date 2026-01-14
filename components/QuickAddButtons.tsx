import React, { useState } from 'react';
import type { LogEntry } from '../types';
import { hapticLight } from '../utils/haptic';

interface QuickAddButtonsProps {
  onQuickAdd: (entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string }) => Promise<void>;
}

type ButtonState = 'idle' | 'loading' | 'success';

const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onQuickAdd }) => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});
  
  const createBaseEntry = (now: Date): Omit<LogEntry, 'id' | 'dateTime' | 'babyProfileId'> => ({
    poop: false,
    pee: false,
    breastMilkMl: 0,
    breastfed: false,
    formulaMl: 0,
    vomit: false,
    vitaminD: false,
    vitaminC: false,
    probiotic: false,
    tummyTime: false,
    sterilization: false,
    bathing: false,
    sabSimplex: false,
    maltofer: false,
    notes: '',
  });

  const handleQuickAdd = async (buttonId: string, entryData: Partial<Omit<LogEntry, 'id' | 'dateTime' | 'babyProfileId'>>, notePrefix: string) => {
    hapticLight();
    setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
    
    const now = new Date();
    const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
      ...createBaseEntry(now),
      ...entryData,
      dateTime: now.toISOString(),
      notes: `Rýchle pridanie: ${notePrefix}`,
    };
    
    await onQuickAdd(entry);
    
    setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [buttonId]: 'idle' }));
    }, 1500);
  };

  const getButtonClass = (buttonId: string, baseClass: string) => {
    const state = buttonStates[buttonId] || 'idle';
    if (state === 'loading') {
      return `${baseClass} opacity-70 cursor-wait`;
    }
    if (state === 'success') {
      return `${baseClass} bg-green-500/30 border-green-400`;
    }
    return baseClass;
  };

  const getButtonContent = (buttonId: string, icon: string, label: string) => {
    const state = buttonStates[buttonId] || 'idle';
    if (state === 'loading') {
      return (
        <>
          <i className="fas fa-spinner fa-spin text-2xl"></i>
          <span className="text-xs font-semibold">Pridávam...</span>
        </>
      );
    }
    if (state === 'success') {
      return (
        <>
          <i className="fas fa-check text-2xl"></i>
          <span className="text-xs font-semibold">Pridané!</span>
        </>
      );
    }
    return (
      <>
        <i className={`${icon} text-2xl`}></i>
        <span className="text-xs font-semibold">{label}</span>
      </>
    );
  };

  return (
    <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <i className="fas fa-bolt"></i>
          Rýchle pridanie
        </h3>
        <span className="text-white/70 text-xs">One-tap akcie</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {/* Feeding Button */}
        <button
          onClick={() => handleQuickAdd('feeding-formula-166', { formulaMl: 166 }, 'Umelé mlieko 166ml')}
          disabled={buttonStates['feeding-formula-166'] === 'loading' || buttonStates['feeding-formula-166'] === 'success'}
          className={getButtonClass('feeding-formula-166', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('feeding-formula-166', 'fas fa-prescription-bottle', 'Umelé 166ml')}
        </button>

        {/* Diaper Buttons */}
        <button
          onClick={() => handleQuickAdd('diaper-pee', { pee: true }, 'Moč')}
          disabled={buttonStates['diaper-pee'] === 'loading' || buttonStates['diaper-pee'] === 'success'}
          className={getButtonClass('diaper-pee', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-pee', 'fas fa-tint', 'Moč')}
        </button>

        <button
          onClick={() => handleQuickAdd('diaper-poop', { poop: true }, 'Stolica')}
          disabled={buttonStates['diaper-poop'] === 'loading' || buttonStates['diaper-poop'] === 'success'}
          className={getButtonClass('diaper-poop', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-poop', 'fas fa-poo', 'Stolica')}
        </button>

        <button
          onClick={() => handleQuickAdd('diaper-both', { pee: true, poop: true }, 'Moč + Stolica')}
          disabled={buttonStates['diaper-both'] === 'loading' || buttonStates['diaper-both'] === 'success'}
          className={getButtonClass('diaper-both', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-both', 'fas fa-baby', 'Moč + Stolica')}
        </button>

        {/* Medication Buttons */}
        <button
          onClick={() => handleQuickAdd('vitamin-d', { vitaminD: true }, 'Vitamín D')}
          disabled={buttonStates['vitamin-d'] === 'loading' || buttonStates['vitamin-d'] === 'success'}
          className={getButtonClass('vitamin-d', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('vitamin-d', 'fas fa-sun', 'Vitamín D')}
        </button>

        <button
          onClick={() => handleQuickAdd('maltofer', { maltofer: true }, 'Maltofer (železo)')}
          disabled={buttonStates['maltofer'] === 'loading' || buttonStates['maltofer'] === 'success'}
          className={getButtonClass('maltofer', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('maltofer', 'fas fa-droplet', 'Maltofer')}
        </button>

      </div>

      <p className="text-white/60 text-xs mt-3 text-center">
        <i className="fas fa-info-circle mr-1"></i>
        Upraviť môžeš kliknutím na záznam v zozname
      </p>
    </div>
  );
};

export default QuickAddButtons;
