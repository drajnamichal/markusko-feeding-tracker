import React, { useMemo } from 'react';

interface DevelopmentGuideProps {
  birthDate: Date;
}

interface Milestone {
  title: string;
  description: string;
  icon: string;
  achieved?: boolean;
}

interface Exercise {
  title: string;
  description: string;
  howTo: string;
  duration: string;
  icon: string;
  color: string;
}

interface AgeGroup {
  minDays: number;
  maxDays: number;
  title: string;
  description: string;
  milestones: Milestone[];
  exercises: Exercise[];
  tips: string[];
}

const DevelopmentGuide: React.FC<DevelopmentGuideProps> = ({ birthDate }) => {
  const ageInDays = useMemo(() => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [birthDate]);

  const ageGroups: AgeGroup[] = [
    {
      minDays: 0,
      maxDays: 30,
      title: '0-1 mesiac (Novorodenec)',
      description: 'Bábätko sa prispôsobuje svetu mimo maternice. Reflexy sú hlavným spôsobom interakcie.',
      milestones: [
        {
          title: 'Motorika',
          description: 'Reflexné pohyby, silný úchopový reflex, krátke zdvihnutie hlavy na bruchu',
          icon: 'fa-hand-fist'
        },
        {
          title: 'Zrak',
          description: 'Zaostrenie na 20-30 cm, sledovanie tvárí, uprednostňovanie kontrastov',
          icon: 'fa-eye'
        },
        {
          title: 'Sluch',
          description: 'Upokojenie pri známom hlase, reakcia na hlasné zvuky',
          icon: 'fa-ear-listen'
        },
        {
          title: 'Sociálne',
          description: 'Úsmev pri pohode, kontakt očami pri kŕmení',
          icon: 'fa-smile'
        }
      ],
      exercises: [
        {
          title: 'Tummy Time (Na bruchu)',
          description: 'Najdôležitejšie cvičenie pre rozvoj svalov krku, ramien a chrbtice.',
          howTo: 'Položte bábätko na brucho na pevnú podložku 2-3 minúty, 2-3x denne. Vy ležte oproti nemu a rozprávajte sa. Postupne predlžujte na 10-15 minút denne.',
          duration: '2-3 min, 2-3x denne',
          icon: 'fa-baby',
          color: 'bg-indigo-500'
        },
        {
          title: 'Kontakt očami',
          description: 'Rozvoj vizuálneho sledovania a väzby.',
          howTo: 'Pri kŕmení a prebaľovaní udržujte oči 20-30 cm od tváre bábätka. Pomaly pohybujte hlavou zo strany na stranu.',
          duration: 'Počas každého kŕmenia',
          icon: 'fa-eye',
          color: 'bg-blue-500'
        },
        {
          title: 'Jemný dotyk a masáže',
          description: 'Stimulácia zmyslov a upokojenie.',
          howTo: 'Jemne masírujte chodidlá, bruško, chrbát. Rozprávajte sa pri tom alebo spievajte. Ideálne po kúpeli.',
          duration: '5-10 minút denne',
          icon: 'fa-hand-holding-heart',
          color: 'bg-pink-500'
        },
        {
          title: 'Sledovanie predmetov',
          description: 'Rozvoj zrakového sledovania.',
          howTo: 'Ukážte kontrastnú hračku alebo čierno-biely obrázok 20-30 cm od očí. Pomaly ho pohybujte doľava a doprava.',
          duration: '2-3 minúty, 2x denne',
          icon: 'fa-shapes',
          color: 'bg-purple-500'
        }
      ],
      tips: [
        'Bábätko sa učí najmä cez zmysly - hlas, dotyk, tváre sú najdôležitejšie.',
        'Reflexy sú normálne - úchopový, saciaci, Moro (roztiahnutie rúk pri prekvapení).',
        'Čierny a biely kontrast vidí najlepšie.',
        'Kožný kontakt je kľúčový pre rozvoj a upokojenie.'
      ]
    },
    {
      minDays: 31,
      maxDays: 60,
      title: '1-2 mesiace',
      description: 'Bábätko začína viac komunikovať, úsmevy sú častejšie a úmyselné.',
      milestones: [
        {
          title: 'Motorika',
          description: 'Zdvihnutie hlavy na 45° na bruchu, začína sa striedanie pohľadu rukami',
          icon: 'fa-hand-fist'
        },
        {
          title: 'Sociálne',
          description: 'Sociálny úsmev (reakcia na úsmev), začína vydávať zvuky "áá", "óó"',
          icon: 'fa-smile'
        },
        {
          title: 'Zrak',
          description: 'Sledovanie pohybu očami na 180°, rozpoznávanie tvárí',
          icon: 'fa-eye'
        }
      ],
      exercises: [
        {
          title: 'Tummy Time - pokročilé',
          description: 'Predlžovanie času na bruchu pre silnejšie svaly.',
          howTo: 'Predlžte tummy time na 15-20 minút rozdelených počas dňa. Použite zrkadlo alebo kontrastné hračky na povzbudenie.',
          duration: '15-20 min rozdelene',
          icon: 'fa-baby',
          color: 'bg-indigo-500'
        },
        {
          title: 'Konverzácia a spev',
          description: 'Rozvoj komunikácie a jazyka.',
          howTo: 'Rozprávajte sa s bábätkom, keď vydá zvuk, zopakujte ho. Spievajte jednoduché pesničky. Počkajte na odpoveď.',
          duration: 'Po celý deň',
          icon: 'fa-comments',
          color: 'bg-green-500'
        },
        {
          title: 'Cvičenie dosahu',
          description: 'Podpora koordinácie oko-ruka.',
          howTo: 'Držte hračku 15-20 cm nad bábätkom (na chrbte). Povzbudzujte ho, aby sa po nej natiahlo.',
          duration: '5 minút, 2x denne',
          icon: 'fa-hand-pointer',
          color: 'bg-orange-500'
        },
        {
          title: 'Bicyklovanie nožičiek',
          description: 'Uvoľnenie plynu a posilnenie nôh.',
          howTo: 'Bábätko na chrbte, jemne pohybujte nožičkami v kruhu ako pri bicyklovaní. Spievajte pri tom.',
          duration: '2-3 minúty pred každým kŕmením',
          icon: 'fa-bicycle',
          color: 'bg-cyan-500'
        }
      ],
      tips: [
        'Sociálny úsmev je veľký míľnik - oslavujte ho!',
        'Rozprávajte sa počas každej aktivity - bábätko sa učí jazyk.',
        'Rôzne pozície (na chrbte, na bruchu, vertikálne) sú dôležité.',
        'Sledujte signály únavy - prerušenia sú v poriadku.'
      ]
    },
    {
      minDays: 61,
      maxDays: 90,
      title: '2-3 mesiace',
      description: 'Bábätko je aktívnejšie, smieje sa a experimentuje s hlasmi.',
      milestones: [
        {
          title: 'Motorika',
          description: 'Hlava na 90° na bruchu, začína sa otáčať na stranu, koordinovanejšie pohyby rúk',
          icon: 'fa-hand-fist'
        },
        {
          title: 'Komunikácia',
          description: 'Smiech, gúľanie, "rozhovor" s rodičom',
          icon: 'fa-comment-dots'
        },
        {
          title: 'Hranie',
          description: 'Úmyselné chytanie predmetov, hranie si s rukami',
          icon: 'fa-dice'
        }
      ],
      exercises: [
        {
          title: 'Asistované posadenie',
          description: 'Posilnenie svalov krku a trupu.',
          howTo: 'Bábätko na chrbte, chyťte za ruky a pomaly ťahajte do sedenia (hlava by mala nasledovať telo). Pomaly položte späť.',
          duration: '3-5x, 2x denne',
          icon: 'fa-chair',
          color: 'bg-teal-500'
        },
        {
          title: 'Hračky na chytanie',
          description: 'Rozvoj jemnej motoriky.',
          howTo: 'Ponúknite ľahké hračky s textúrou. Držte ich v dosahu a povzbudzujte chytanie. Striedajte pravú/ľavú ruku.',
          duration: '10 minút, 3x denne',
          icon: 'fa-hand-holding',
          color: 'bg-purple-500'
        },
        {
          title: 'Mini sit-upy',
          description: 'Posilnenie core svalov.',
          howTo: 'Držte bábätko v 45° uhle (podopierajte hlavu). Nechajte ho pozorovať okolie. Postupne zvyšujte čas.',
          duration: '5-10 minút, 2-3x denne',
          icon: 'fa-person',
          color: 'bg-red-500'
        },
        {
          title: 'Zrkadlové hry',
          description: 'Rozvoj sebapoznania a vizuálneho sledovania.',
          howTo: 'Držte bábätko pred zrkadlom. Usmievajte sa, robte grimasy. Rozprávajte sa s odrazom.',
          duration: '5 minút denne',
          icon: 'fa-mirror',
          color: 'bg-pink-500'
        }
      ],
      tips: [
        'Kontrola hlavy by mala byť teraz stabilnejšia.',
        'Začína sa objavovať vzorec spánku.',
        'Bábätko začína chápať príčinu a následok.',
        'Pestré farby a textúry sú zaujímavé.'
      ]
    }
  ];

  const currentAgeGroup = useMemo(() => {
    return ageGroups.find(group => ageInDays >= group.minDays && ageInDays <= group.maxDays) || ageGroups[0];
  }, [ageInDays, ageGroups]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Vývoj a Cvičenia</h2>
            <p className="text-sm opacity-90">
              Míľniky vývoja a aktivity podporujúce zdravý rast
            </p>
          </div>
          <div className="text-center bg-white/20 rounded-xl p-4">
            <div className="text-4xl font-bold">{ageInDays}</div>
            <div className="text-xs mt-1">dní</div>
          </div>
        </div>
      </div>

      {/* Current Age Group */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{currentAgeGroup.title}</h3>
        <p className="text-slate-600 text-sm">{currentAgeGroup.description}</p>
      </div>

      {/* Milestones */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="fas fa-flag-checkered text-green-600"></i>
          Vývojové míľniky v tomto veku
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAgeGroup.milestones.map((milestone, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${milestone.icon}`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-1">{milestone.title}</h4>
                  <p className="text-sm text-slate-600">{milestone.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="fas fa-dumbbell text-purple-600"></i>
          Odporúčané cvičenia a aktivity
        </h3>
        <div className="space-y-4">
          {currentAgeGroup.exercises.map((exercise, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`${exercise.color} text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas ${exercise.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-800">{exercise.title}</h4>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      <i className="fas fa-clock mr-1"></i>
                      {exercise.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{exercise.description}</p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-blue-700">Ako na to:</span> {exercise.howTo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <i className="fas fa-lightbulb text-amber-600"></i>
          Dôležité tipy pre tento vek
        </h3>
        <ul className="space-y-2">
          {currentAgeGroup.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
              <i className="fas fa-star text-amber-500 mt-1"></i>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* All Age Groups Navigation */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Preskúmať iné vekové kategórie</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ageGroups.map((group, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                group === currentAgeGroup
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
              }`}
              onClick={() => {
                // This would navigate to that age group
                // For now, just visual indication
              }}
            >
              <div className="font-semibold text-slate-800 mb-1">{group.title}</div>
              <div className="text-xs text-slate-500">
                {group.milestones.length} míľnikov • {group.exercises.length} cvičení
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
          <i className="fas fa-exclamation-triangle text-red-600"></i>
          Bezpečnosť na prvom mieste
        </h3>
        <ul className="space-y-1 text-sm text-red-900">
          <li>• Nikdy nenechávajte bábätko bez dozoru počas cvičení</li>
          <li>• Vždy podopierajte hlavu a krk novorodenca</li>
          <li>• Prerušte cvičenie ak je bábätko unavené alebo plačlivé</li>
          <li>• Pri pochybnostiach sa poraďte s pediatrom</li>
        </ul>
      </div>

      {/* Source */}
      <div className="text-center text-xs text-slate-500">
        <p>
          Zdroje: WHO, American Academy of Pediatrics (AAP), CDC
          <br />
          <a 
            href="https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-500 hover:underline"
          >
            who.int/infant-and-young-child-feeding
          </a>
        </p>
      </div>
    </div>
  );
};

export default DevelopmentGuide;

