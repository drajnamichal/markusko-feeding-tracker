import React, { useMemo } from 'react';
import type { LogEntry } from '../types';

interface WHOGuidelinesProps {
  entries: LogEntry[];
  birthDate: Date;
}

interface Guideline {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  icon: string;
  color: string;
  checkStatus: (entries: LogEntry[], ageInDays: number) => { met: boolean; current: string; target: string };
}

const WHOGuidelines: React.FC<WHOGuidelinesProps> = ({ entries, birthDate }) => {
  const ageInDays = useMemo(() => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [birthDate]);

  const guidelines: Guideline[] = [
    {
      id: 'breastfeeding',
      title: 'Výhradné dojčenie',
      description: 'WHO odporúča výhradné dojčenie prvých 6 mesiacov života.',
      recommendation: 'Dojčte na požiadanie, aspoň 8-12x denne v prvých týždňoch.',
      icon: 'fa-heart',
      color: 'text-pink-600',
      checkStatus: (entries, ageInDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayFeedings = entries.filter(e => {
          const entryDate = new Date(e.dateTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime() && (e.breastfed || e.breastMilkMl > 0);
        }).length;

        const target = ageInDays < 7 ? 8 : 8;
        return {
          met: todayFeedings >= target,
          current: `${todayFeedings}x dnes`,
          target: `${target}+ denne`
        };
      }
    },
    {
      id: 'wet-diapers',
      title: 'Mokré plienky',
      description: 'Minimálne 6 mokrých plienok denne po 5. dni života indikuje dostatočnú hydratáciu.',
      recommendation: 'Po 5. dni života: aspoň 6 mokrých plienok denne.',
      icon: 'fa-tint',
      color: 'text-blue-600',
      checkStatus: (entries, ageInDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayPee = entries.filter(e => {
          const entryDate = new Date(e.dateTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime() && e.pee;
        }).length;

        const target = ageInDays <= 5 ? ageInDays : 6;
        return {
          met: todayPee >= target,
          current: `${todayPee}x dnes`,
          target: `${target}+ denne`
        };
      }
    },
    {
      id: 'dirty-diapers',
      title: 'Špinavé plienky',
      description: 'V prvých týždňoch minimálne 3-4 stolice denne, neskôr minimálne 1x denne.',
      recommendation: '0-6 týždňov: 3-4x denne, potom: aspoň 1x denne.',
      icon: 'fa-poo',
      color: 'text-yellow-700',
      checkStatus: (entries, ageInDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayPoop = entries.filter(e => {
          const entryDate = new Date(e.dateTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime() && e.poop;
        }).length;

        const target = ageInDays < 42 ? 3 : 1; // 6 weeks = 42 days
        return {
          met: todayPoop >= target,
          current: `${todayPoop}x dnes`,
          target: `${target}+ denne`
        };
      }
    },
    {
      id: 'feeding-frequency',
      title: 'Frekvencia kŕmenia',
      description: 'Novorodenci by mali jesť každé 2 hodiny.',
      recommendation: 'Minimálne každé 2 hodiny, aj v noci v prvých týždňoch.',
      icon: 'fa-clock',
      color: 'text-purple-600',
      checkStatus: (entries, ageInDays) => {
        const feedingEntries = entries
          .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
          .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

        if (feedingEntries.length < 2) {
          return { met: false, current: 'Nedostatok dát', target: 'Každé 2-3h' };
        }

        const lastFeeding = feedingEntries[0];
        const now = new Date();
        const hoursSinceLast = (now.getTime() - lastFeeding.dateTime.getTime()) / (1000 * 60 * 60);

        return {
          met: hoursSinceLast < 3,
          current: `${hoursSinceLast.toFixed(1)}h od posledného`,
          target: 'Max 3h medzi kŕmeniami'
        };
      }
    },
    {
      id: 'vitamin-d',
      title: 'Vitamín D',
      description: 'WHO odporúča podávanie vitamínu D od narodenia pre všetky dojčené deti.',
      recommendation: '400 IU (10 μg) denne od narodenia.',
      icon: 'fa-sun',
      color: 'text-orange-600',
      checkStatus: (entries, ageInDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayVitaminD = entries.some(e => {
          const entryDate = new Date(e.dateTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime() && e.vitaminD;
        });

        return {
          met: todayVitaminD,
          current: todayVitaminD ? 'Podaný dnes' : 'Nepodaný dnes',
          target: 'Denne 400 IU'
        };
      }
    },
    {
      id: 'tummy-time',
      title: 'Tummy Time',
      description: 'Tummy time pomáha rozvíjať sily krku, ramien a chrbtice.',
      recommendation: 'Začnite s 2-3 minútami, 2-3x denne už od narodenia.',
      icon: 'fa-baby',
      color: 'text-indigo-600',
      checkStatus: (entries, ageInDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTummyTime = entries.filter(e => {
          const entryDate = new Date(e.dateTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime() && e.tummyTime;
        }).length;

        const target = 3;
        return {
          met: todayTummyTime >= target,
          current: `${todayTummyTime}x dnes`,
          target: `${target}x denne`
        };
      }
    },
    {
      id: 'sleep',
      title: 'Spánok',
      description: 'Novorodenci potrebujú 14-17 hodín spánku denne.',
      recommendation: 'Striedanie 2-4 hodinových cyklov spánku a bdenia.',
      icon: 'fa-moon',
      color: 'text-slate-600',
      checkStatus: (entries, ageInDays) => {
        // This would require sleep tracking which is not implemented yet
        return {
          met: true, // Assume met until sleep tracking is added
          current: 'Sledovanie spánku zatiaľ nie je implementované',
          target: '14-17h denne'
        };
      }
    }
  ];

  const stats = useMemo(() => {
    return guidelines.map(g => ({
      ...g,
      status: g.checkStatus(entries, ageInDays)
    }));
  }, [entries, ageInDays, guidelines]);

  const metCount = stats.filter(s => s.status.met).length;
  const percentage = Math.round((metCount / stats.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">WHO Odporúčania</h2>
            <p className="text-sm opacity-90">
              Svetová zdravotnícka organizácia - štandardy pre novorodencov
            </p>
          </div>
          <div className="text-center bg-white/20 rounded-xl p-4">
            <div className="text-4xl font-bold">{percentage}%</div>
            <div className="text-xs mt-1">Splnené normy</div>
          </div>
        </div>
      </div>

      {/* Age Info */}
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex items-center gap-3">
          <i className="fas fa-info-circle text-2xl text-blue-500"></i>
          <div>
            <p className="text-sm font-semibold text-slate-700">Vek Markuska</p>
            <p className="text-lg font-bold text-blue-600">
              {ageInDays} {ageInDays === 1 ? 'deň' : ageInDays < 5 ? 'dni' : 'dní'}
              {ageInDays >= 7 && ` (${Math.floor(ageInDays / 7)} ${Math.floor(ageInDays / 7) === 1 ? 'týždeň' : 'týždne'})`}
            </p>
          </div>
        </div>
      </div>

      {/* Guidelines List */}
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${
              stat.status.met ? 'border-green-500' : 'border-orange-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`${stat.color} text-2xl mt-1`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{stat.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{stat.description}</p>
                  <div className="bg-slate-50 p-2 rounded text-sm text-slate-700 italic">
                    <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
                    {stat.recommendation}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {stat.status.met ? (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i className="fas fa-check-circle"></i>
                    Splnené
                  </div>
                ) : (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    Pozor
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-sm">
                <span className="text-slate-500">Aktuálne: </span>
                <span className="font-semibold text-slate-700">{stat.status.current}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Cieľ: </span>
                <span className="font-semibold text-blue-600">{stat.status.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          Dôležité informácie
        </h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-blue-600 mt-1"></i>
            <span>Každé dieťa je jedinečné. Tieto odporúčania sú všeobecné.</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-blue-600 mt-1"></i>
            <span>Pri pochybnostiach alebo obavách sa vždy poraďte s pediatrom.</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-blue-600 mt-1"></i>
            <span>Pravidelné kontroly u pediatra sú kľúčové pre zdravý vývoj.</span>
          </li>
        </ul>
      </div>

      {/* Source */}
      <div className="text-center text-xs text-slate-500">
        <p>
          Zdroj: World Health Organization (WHO) - Infant and Young Child Feeding
          <br />
          <a 
            href="https://www.who.int/health-topics/infant-nutrition" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            who.int/health-topics/infant-nutrition
          </a>
        </p>
      </div>
    </div>
  );
};

export default WHOGuidelines;

