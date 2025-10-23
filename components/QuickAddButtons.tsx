import React, { useState } from 'react';
import type { LogEntry } from '../types';
import { hapticLight } from '../utils/haptic';

interface QuickAddButtonsProps {
  onQuickAdd: (entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string }) => Promise<void>;
}

type ButtonState = 'idle' | 'loading' | 'success';

const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onQuickAdd }) => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});
  
  const quickAddFeeding = async (ml: number, isFormula: boolean = false) => {
    const buttonId = `feeding-${isFormula ? 'formula' : 'breast'}-${ml}`;
    hapticLight();
    setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
    
    const now = new Date();
    const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
      dateTime: now.toISOString(),
      poop: false,
      pee: false,
      breastMilkMl: isFormula ? 0 : ml,
      breastfed: false,
      formulaMl: isFormula ? ml : 0,
      vomit: false,
      vitaminD: false,
      tummyTime: false,
      sterilization: false,
      bathing: false,
      sabSimplex: false,
      notes: `Rýchle pridanie: ${isFormula ? 'Umelé' : 'Materské'} mlieko ${ml}ml`,
    };
    
    await onQuickAdd(entry);
    
    setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [buttonId]: 'idle' }));
    }, 1500);
  };

  const quickAddDiaper = async (type: 'pee' | 'poop' | 'both') => {
    const buttonId = `diaper-${type}`;
    hapticLight();
    setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
    
    const now = new Date();
    const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
      dateTime: now.toISOString(),
      poop: type === 'poop' || type === 'both',
      pee: type === 'pee' || type === 'both',
      breastMilkMl: 0,
      breastfed: false,
      formulaMl: 0,
      vomit: false,
      vitaminD: false,
      tummyTime: false,
      sterilization: false,
      bathing: false,
      sabSimplex: false,
      notes: type === 'both' ? 'Rýchle pridanie: Moč + Stolica' : type === 'pee' ? 'Rýchle pridanie: Moč' : 'Rýchle pridanie: Stolica',
    };
    
    await onQuickAdd(entry);
    
    setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [buttonId]: 'idle' }));
    }, 1500);
  };

  const quickAddBreastfeeding = async () => {
    const buttonId = 'breastfeeding';
    hapticLight();
    setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
    
    const now = new Date();
    const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
      dateTime: now.toISOString(),
      poop: false,
      pee: false,
      breastMilkMl: 0,
      breastfed: true,
      formulaMl: 0,
      vomit: false,
      vitaminD: false,
      tummyTime: false,
      sterilization: false,
      bathing: false,
      sabSimplex: false,
      notes: 'Rýchle pridanie: Dojčenie',
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
        {/* Feeding Buttons */}
        <button
          onClick={() => quickAddFeeding(90, false)}
          disabled={buttonStates['feeding-breast-90'] === 'loading' || buttonStates['feeding-breast-90'] === 'success'}
          className={getButtonClass('feeding-breast-90', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('feeding-breast-90', 'fas fa-bottle-droplet', 'Materské 90ml')}
        </button>

        <button
          onClick={() => quickAddFeeding(90, true)}
          disabled={buttonStates['feeding-formula-90'] === 'loading' || buttonStates['feeding-formula-90'] === 'success'}
          className={getButtonClass('feeding-formula-90', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('feeding-formula-90', 'fas fa-prescription-bottle', 'Umelé 90ml')}
        </button>

        <button
          onClick={quickAddBreastfeeding}
          disabled={buttonStates['breastfeeding'] === 'loading' || buttonStates['breastfeeding'] === 'success'}
          className={getButtonClass('breastfeeding', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('breastfeeding', 'fas fa-heart', 'Dojčenie')}
        </button>

        {/* Diaper Buttons */}
        <button
          onClick={() => quickAddDiaper('pee')}
          disabled={buttonStates['diaper-pee'] === 'loading' || buttonStates['diaper-pee'] === 'success'}
          className={getButtonClass('diaper-pee', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-pee', 'fas fa-tint', 'Moč')}
        </button>

        <button
          onClick={() => quickAddDiaper('poop')}
          disabled={buttonStates['diaper-poop'] === 'loading' || buttonStates['diaper-poop'] === 'success'}
          className={getButtonClass('diaper-poop', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-poop', 'fas fa-poo', 'Stolica')}
        </button>

        <button
          onClick={() => quickAddDiaper('both')}
          disabled={buttonStates['diaper-both'] === 'loading' || buttonStates['diaper-both'] === 'success'}
          className={getButtonClass('diaper-both', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('diaper-both', 'fas fa-baby', 'Moč + Stolica')}
        </button>

        {/* Vitamin D */}
        <button
          onClick={async () => {
            const buttonId = 'vitamin-d';
            hapticLight();
            setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
            const now = new Date();
            const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
              dateTime: now.toISOString(),
              poop: false,
              pee: false,
              breastMilkMl: 0,
              breastfed: false,
              formulaMl: 0,
              vomit: false,
              vitaminD: true,
              tummyTime: false,
              sterilization: false,
              bathing: false,
              sabSimplex: false,
              notes: 'Rýchle pridanie: Vitamín D',
            };
            await onQuickAdd(entry);
            setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
            setTimeout(() => {
              setButtonStates(prev => ({ ...prev, [buttonId]: 'idle' }));
            }, 1500);
          }}
          disabled={buttonStates['vitamin-d'] === 'loading' || buttonStates['vitamin-d'] === 'success'}
          className={getButtonClass('vitamin-d', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('vitamin-d', 'fas fa-sun', 'Vitamín D')}
        </button>

        {/* SAB Simplex */}
        <button
          onClick={async () => {
            const buttonId = 'sab-simplex';
            hapticLight();
            setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
            const now = new Date();
            const entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
              dateTime: now.toISOString(),
              poop: false,
              pee: false,
              breastMilkMl: 0,
              breastfed: false,
              formulaMl: 0,
              vomit: false,
              vitaminD: false,
              tummyTime: false,
              sterilization: false,
              bathing: false,
              sabSimplex: true,
              notes: 'Rýchle pridanie: SAB Simplex',
            };
            await onQuickAdd(entry);
            setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
            setTimeout(() => {
              setButtonStates(prev => ({ ...prev, [buttonId]: 'idle' }));
            }, 1500);
          }}
          disabled={buttonStates['sab-simplex'] === 'loading' || buttonStates['sab-simplex'] === 'success'}
          className={getButtonClass('sab-simplex', 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30')}
        >
          {getButtonContent('sab-simplex', 'fas fa-pills', 'SAB Simplex')}
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

