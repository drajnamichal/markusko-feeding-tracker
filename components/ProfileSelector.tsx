import React, { useState, useEffect } from 'react';
import type { BabyProfile } from '../types';
import { supabase, dbToBabyProfile, type BabyProfileDB } from '../supabaseClient';

interface ProfileSelectorProps {
  currentProfileId: string | null;
  onSelectProfile: (profileId: string) => void;
  onCreateNew: () => void;
  showNameInButton?: boolean; // If true, shows profile name in button
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ 
  currentProfileId, 
  onSelectProfile, 
  onCreateNew,
  showNameInButton = true
}) => {
  const [profiles, setProfiles] = useState<BabyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('baby_profile')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const loadedProfiles = data.map(dbToBabyProfile);
        setProfiles(loadedProfiles);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className={`flex items-center gap-2 text-slate-700 hover:text-teal-600 transition-colors ${
          showNameInButton 
            ? 'px-4 py-2 hover:bg-slate-100 rounded-lg' 
            : 'px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200'
        }`}
        title="Zmeniť profil"
      >
        {showNameInButton && <i className="fas fa-baby text-indigo-500"></i>}
        {showNameInButton && <span className="font-medium">{currentProfile?.name || 'Výber profilu'}</span>}
        {!showNameInButton && (
          <>
            <i className="fas fa-users text-xs text-indigo-600"></i>
            <span className="text-xs font-medium text-indigo-700">Profily</span>
          </>
        )}
        <i className={`fas fa-chevron-${showSelector ? 'up' : 'down'} text-xs ${
          showNameInButton ? 'text-slate-400' : 'text-indigo-600'
        }`}></i>
      </button>

      {showSelector && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSelector(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-screen max-w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[320px] sm:max-w-sm">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                Profily bábätiek
              </div>
              {profiles.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-500 text-center">
                  Žiadne profily
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        onSelectProfile(profile.id);
                        setShowSelector(false);
                      }}
                      className={`
                        w-full text-left px-3 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3
                        ${currentProfileId === profile.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}
                      `}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentProfileId === profile.id 
                            ? 'bg-indigo-500' 
                            : 'bg-slate-200'
                        }`}>
                          <i className={`fas fa-baby ${
                            currentProfileId === profile.id 
                              ? 'text-white' 
                              : 'text-slate-500'
                          }`}></i>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${
                          currentProfileId === profile.id 
                            ? 'text-indigo-700' 
                            : 'text-slate-700'
                        }`}>
                          {profile.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {new Date(profile.birthDate).toLocaleDateString('sk-SK')}
                        </div>
                      </div>
                      {currentProfileId === profile.id && (
                        <i className="fas fa-check text-indigo-500"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <div className="border-t border-slate-200 p-2">
                <button
                  onClick={() => {
                    setShowSelector(false);
                    onCreateNew();
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  <span>Pridať nový profil</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSelector;

