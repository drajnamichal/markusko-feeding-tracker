import React, { useState } from 'react';
import type { BabyProfile } from '../types';

interface WelcomeSetupProps {
  onCreateProfile: (profile: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const WelcomeSetup: React.FC<WelcomeSetupProps> = ({ onCreateProfile }) => {
  const [saveState, setSaveState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const birthDate = formData.get('birthDate') as string;
    const birthTime = formData.get('birthTime') as string;
    const birthWeightGrams = parseInt(formData.get('birthWeightGrams') as string, 10);
    const birthHeightCm = parseFloat(formData.get('birthHeightCm') as string);

    if (name && birthDate && birthTime && !isNaN(birthWeightGrams) && !isNaN(birthHeightCm)) {
      try {
        setSaveState('loading');
        await onCreateProfile({
          name,
          birthDate: new Date(birthDate),
          birthTime,
          birthWeightGrams,
          birthHeightCm,
        });
        setSaveState('success');
      } catch (error) {
        console.error('Error creating profile:', error);
        setSaveState('idle');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-4">
            <i className="fas fa-baby text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Vitajte v aplikácii!
          </h1>
          <p className="text-slate-600">
            Začnime s vytvorením profilu vášho bábätka
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-2">
              <i className="fas fa-user mr-2 text-indigo-500"></i>Meno bábätka
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Napr. Markus Drajna"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-slate-600 mb-2">
              <i className="fas fa-calendar mr-2 text-indigo-500"></i>Dátum narodenia
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthTime" className="block text-sm font-medium text-slate-600 mb-2">
              <i className="fas fa-clock mr-2 text-indigo-500"></i>Čas narodenia
            </label>
            <input
              type="time"
              id="birthTime"
              name="birthTime"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthWeightGrams" className="block text-sm font-medium text-slate-600 mb-2">
              <i className="fas fa-weight mr-2 text-indigo-500"></i>Váha pri narodení (g)
            </label>
            <input
              type="number"
              id="birthWeightGrams"
              name="birthWeightGrams"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Napr. 3030"
              min="0"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthHeightCm" className="block text-sm font-medium text-slate-600 mb-2">
              <i className="fas fa-ruler-vertical mr-2 text-indigo-500"></i>Výška pri narodení (cm)
            </label>
            <input
              type="number"
              id="birthHeightCm"
              name="birthHeightCm"
              step="0.01"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Napr. 51"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saveState === 'loading' || saveState === 'success'}
            className={`
              w-full text-white py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105
              ${saveState === 'loading' ? 'bg-slate-400 cursor-wait' : saveState === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'}
            `}
          >
            {saveState === 'loading' && (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>Vytváram profil...
              </>
            )}
            {saveState === 'success' && (
              <>
                <i className="fas fa-check mr-2"></i>Profil vytvorený!
              </>
            )}
            {saveState === 'idle' && (
              <>
                <i className="fas fa-baby mr-2"></i>Vytvoriť profil
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            Tieto informácie môžete neskôr upraviť v nastaveniach profilu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSetup;

