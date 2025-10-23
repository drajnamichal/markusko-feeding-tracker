import React from 'react';
import type { LogEntry } from '../types';

interface QuickAddButtonsProps {
  onQuickAdd: (entry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string }) => void;
}

const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onQuickAdd }) => {
  
  const quickAddFeeding = (ml: number, isFormula: boolean = false) => {
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
    onQuickAdd(entry);
  };

  const quickAddDiaper = (type: 'pee' | 'poop' | 'both') => {
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
    onQuickAdd(entry);
  };

  const quickAddBreastfeeding = () => {
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
    onQuickAdd(entry);
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
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-bottle-droplet text-2xl"></i>
          <span className="text-xs font-semibold">Materské 90ml</span>
        </button>

        <button
          onClick={() => quickAddFeeding(90, true)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-prescription-bottle text-2xl"></i>
          <span className="text-xs font-semibold">Umelé 90ml</span>
        </button>

        <button
          onClick={quickAddBreastfeeding}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-heart text-2xl"></i>
          <span className="text-xs font-semibold">Dojčenie</span>
        </button>

        {/* Diaper Buttons */}
        <button
          onClick={() => quickAddDiaper('pee')}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-tint text-2xl"></i>
          <span className="text-xs font-semibold">Moč</span>
        </button>

        <button
          onClick={() => quickAddDiaper('poop')}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-poo text-2xl"></i>
          <span className="text-xs font-semibold">Stolica</span>
        </button>

        <button
          onClick={() => quickAddDiaper('both')}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-baby text-2xl"></i>
          <span className="text-xs font-semibold">Moč + Stolica</span>
        </button>

        {/* Vitamin D */}
        <button
          onClick={() => {
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
            onQuickAdd(entry);
          }}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-sun text-2xl"></i>
          <span className="text-xs font-semibold">Vitamín D</span>
        </button>

        {/* SAB Simplex */}
        <button
          onClick={() => {
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
            onQuickAdd(entry);
          }}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg p-3 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1 border border-white/30"
        >
          <i className="fas fa-pills text-2xl"></i>
          <span className="text-xs font-semibold">SAB Simplex</span>
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

