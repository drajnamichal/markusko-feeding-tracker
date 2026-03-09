import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type AgeKey = 'month5' | 'month7' | 'month10';

interface AgeTabData {
  title: string;
  milestones: string[];
  actions: string[];
}

const ageData: Record<AgeKey, AgeTabData> = {
  month5: {
    title: '5 – 6 Mesiacov: Objavovanie rúk a hlasu',
    milestones: [
      'Pretáča sa z bruška na chrbát (a naopak).',
      'Začína sedieť s oporou.',
      'Všetko dáva do úst – hlavný spôsob spoznávania sveta.',
      'Vokalizuje, džavoce (ba-ba, ma-ma bez významu).',
    ],
    actions: [
      '<strong>Tréning:</strong> Umiestňujte hračky tesne mimo jeho dosahu na zemi, aby ste ho motivovali k pohybu a naťahovaniu sa.',
      '<strong>Strava:</strong> Začnite zavádzať prvé príkrmy (zelenina) podľa odporúčaní pediatra. Umožnite mu chytať jedlo rukami (zmyslový rozvoj).',
      '<strong>Komunikácia:</strong> Hrajte sa hru „Kukuk" (schovajte si tvár za dlane). Začína chápať, že veci nezmiznú, keď ich nevidí.',
    ],
  },
  month7: {
    title: '7 – 9 Mesiacov: Doba pohybu a úzkosti z cudzích',
    milestones: [
      'Samo sedí bez opory.',
      'Plazí sa alebo začína štvornožkovať.',
      'Buduje sa „pinzetový úchop" (palec a ukazovák).',
      'Začína rozumieť slovu „NIE" a svojmu menu.',
      'Separačná úzkosť a strach z cudzích ľudí (znak zdravého vývoja a väzby na vás!).',
    ],
    actions: [
      '<strong>Bezpečnosť:</strong> „Baby-proof" domácnosť – teraz sa dostane všade. Zabezpečte zásuvky a hrany.',
      '<strong>Hra:</strong> Ponúknite nádobu, do ktorej môže vhadzovať a vyberať predmety (tréning pinzetového úchopu a pochopenia objemu).',
      '<strong>Reakcia na úzkosť:</strong> Ak plače, keď odchádzate z miestnosti, neplížte sa preč. Povedzte „Idem vedľa, hneď sa vrátim" a vráťte sa. Budujete dôveru.',
    ],
  },
  month10: {
    title: '10 – 12 Mesiacov: Malý vedec a prvé kroky',
    milestones: [
      'Stavia sa popri nábytku, robí kroky s oporou.',
      'Ukazuje prstom na veci, ktoré chce alebo ho zaujímajú (kľúčový sociálny míľnik!).',
      'Skúša prvé zmysluplné slová („mama", „tata", „daj").',
      'Testuje hranice a príčinu–následok (zhodí hračku zo stoličky a pozerá, čo urobíte).',
    ],
    actions: [
      '<strong>Reakcia na ukazovanie:</strong> Keď na niečo ukáže, pomenujte to. „Áno, to je pes. Hav-hav." Potvrdzujete zdieľanú pozornosť.',
      '<strong>Fyzická podpora:</strong> Nenúťte ho chodiť za ruky, ak to samo nevyhľadáva. Radšej strategicky rozmiestnite stabilný nábytok, aby mohol ručkovať.',
      '<strong>Hranice:</strong> Ak robí niečo nežiaduce, pokojne zasiahnite, povedzte pevné „Nie, to bolí" a presmerujte pozornosť inam.',
    ],
  },
};

const brainChartData = [
  { age: 'Narodenie', zmysly: 10, kognitíva: 5 },
  { age: '3 mes.', zmysly: 30, kognitíva: 10 },
  { age: '6 mes.', zmysly: 80, kognitíva: 20 },
  { age: '9 mes.', zmysly: 100, kognitíva: 40 },
  { age: '1 rok', zmysly: 95, kognitíva: 60 },
  { age: '2 roky', zmysly: 80, kognitíva: 90 },
  { age: '5 rokov', zmysly: 70, kognitíva: 100 },
];

const tabs: { key: AgeKey; label: string }[] = [
  { key: 'month5', label: '5–6 Mesiacov (Teraz)' },
  { key: 'month7', label: '7–9 Mesiacov' },
  { key: 'month10', label: '10–12 Mesiacov' },
];

const BabyProgressGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgeKey>('month5');
  const tabData = ageData[activeTab];

  return (
    <div className="space-y-10 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Rozvoj dieťaťa: Vedecký sprievodca prvým rokom</h2>
        <p className="text-sm opacity-90">
          Sprievodca pre rodičov 5-mesačného syna. Založené na poznatkoch z neurovedy, vývinovej
          psychológie a odporúčaniach pediatrov pre optimálny sociálny a mentálny rozvoj.
        </p>
      </div>

      {/* Section 1: Veda */}
      <section>
        <div className="mb-6 border-l-4 border-teal-500 pl-4">
          <h3 className="text-xl font-bold text-slate-800">Prečo je prvý rok kritický: Pohľad vedy</h3>
          <p className="text-slate-600 mt-1 text-sm">
            Pochopenie neuroplasticity je kľúčom k efektívnej výchove.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Science cards */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <h4 className="font-bold text-teal-700 mb-2">1. Neuroplasticita a synapsie</h4>
              <p className="text-sm text-slate-700">
                V prvom roku života sa mozog vyvíja rýchlejšie ako kedykoľvek inokedy. Každú sekundu
                vzniká viac ako <strong>1 milión nových nervových spojení</strong>. Tieto spojenia sú
                formované skúsenosťami a interakciami s vami.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <h4 className="font-bold text-teal-700 mb-2">2. Koncept „Serve and Return" (Podnet a odozva)</h4>
              <p className="text-sm text-slate-700">
                Podľa Harvardského centra pre vývoj dieťaťa je toto najdôležitejší prvok. Dieťa vyšle
                „podnet" (bľabotanie, pohľad, úsmev) a vy „vrátite" odozvu (očný kontakt, slovo,
                objatie). Toto buduje architektúru mozgu.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <h4 className="font-bold text-teal-700 mb-2">3. Bezpečná vzťahová väzba (Attachment)</h4>
              <p className="text-sm text-slate-700">
                Základom pre budúceho „dobrého človeka" (empatia, odolnosť, sebavedomie) je, že svet
                vníma ako bezpečné miesto.{' '}
                <strong>Citlivo a konzistentne reagujte na jeho potreby vrátane plaču.</strong> Dieťa
                do 1 roka sa nedá rozmaznať nosením alebo reakciou na plač.
              </p>
            </div>
          </div>

          {/* Brain chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
            <h4 className="text-center font-bold mb-4 text-slate-800">
              Rýchlosť tvorby mozgových spojení
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={brainChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="age" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${name} (relatívna intenzita)`,
                    '',
                  ]}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="zmysly"
                  name="Zmysly a Jazyk"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="kognitíva"
                  name="Vyššie kognitívne funkcie"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-slate-500 mt-2">
              Zdroj: Adaptované z Nelson, C.A. (2000). Senzorické dráhy a jazyk kulminujú v prvom
              roku.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Denná prax */}
      <section>
        <div className="mb-6 border-l-4 border-amber-400 pl-4">
          <h3 className="text-xl font-bold text-slate-800">Najlepšie výchovné postupy: Čo robiť DENS</h3>
          <p className="text-slate-600 mt-1 text-sm">
            Praktické, vedecky podložené kroky pre rozvoj kognitívnych a sociálnych zručností.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-teal-500">
            <div className="text-3xl mb-3 text-center">🗣️</div>
            <h4 className="font-bold text-lg mb-3 text-center">Jazyk a komunikácia</h4>
            <ul className="text-sm space-y-2 text-slate-700">
              <li>
                <span className="font-bold text-teal-600">Parentese:</span> Hovorte trochu vyšším,
                melodickým hlasom s predĺženými samohláskami. Mozog dojčiat je na to evolučne
                nastavený.
              </li>
              <li>
                <span className="font-bold text-teal-600">Komentátor:</span> Opisujte všetko, čo
                robíte. Budujete pasívnu slovnú zásobu.
              </li>
              <li>
                <span className="font-bold text-teal-600">Pauza na odpoveď:</span> Hovorte, potom
                urobte pauzu 5–10 sekúnd a nechajte ho „odpovedať".
              </li>
            </ul>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-amber-400">
            <div className="text-3xl mb-3 text-center">🤸‍♂️</div>
            <h4 className="font-bold text-lg mb-3 text-center">Fyzický a kognitívny rozvoj</h4>
            <ul className="text-sm space-y-2 text-slate-700">
              <li>
                <span className="font-bold text-amber-600">Život na zemi:</span> Zem je najlepšie
                laboratórium. Minimalizujte čas v lehátkach a autosedačkách.
              </li>
              <li>
                <span className="font-bold text-amber-600">Voľný pohyb:</span> Nepoužívajte
                pavúky/chodítka – narúšajú prirodzený motorický vývoj.
              </li>
              <li>
                <span className="font-bold text-amber-600">Čítanie:</span> Začnite čítať hneď.
                Nejde o dej, ale o spoločný čas a počúvanie jazyka.
              </li>
            </ul>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-slate-600">
            <div className="text-3xl mb-3 text-center">❤️</div>
            <h4 className="font-bold text-lg mb-3 text-center">Sociálno-emocionálny rozvoj</h4>
            <ul className="text-sm space-y-2 text-slate-700">
              <li>
                <span className="font-bold text-slate-700">Zrkadlenie emócií:</span> Keď sa usmeje,
                usmejte sa. Keď je frustrovaný, pomenujte to pokojným hlasom.
              </li>
              <li>
                <span className="font-bold text-slate-700">Očný kontakt:</span> Pri kŕmení
                a prebaľovaní odložte telefón.
              </li>
              <li>
                <span className="font-bold text-slate-700">Žiadne obrazovky:</span> AAP odporúča
                nula pasívneho času pred obrazovkou do 18–24 mesiacov.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Vývoj podľa veku (Interactive tabs) */}
      <section className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-800">Cielený vývoj: Čo očakávať a ako reagovať</h3>
          <p className="text-slate-600 mt-1 text-sm">
            Vyberte vekové obdobie. Pamätajte, každé dieťa sa vyvíja vlastným tempom.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap focus:outline-none transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-teal-500 text-teal-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-48">
          <h4 className="text-lg font-bold text-teal-600 mb-4">{tabData.title}</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-slate-700 mb-3 border-b pb-1 text-sm">
                Čo sa učí (Míľniky)
              </h5>
              <ul className="space-y-2 text-sm text-slate-600">
                {tabData.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold mt-0.5">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h5 className="font-bold text-amber-600 mb-3 border-b pb-1 text-sm">
                Ako ho podporiť (Vaša rola)
              </h5>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                {tabData.actions.map((a, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: a }} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Hračky */}
      <section>
        <div className="mb-6 border-l-4 border-teal-500 pl-4">
          <h3 className="text-xl font-bold text-slate-800">Odporúčané hračky a pomôcky</h3>
          <p className="text-slate-600 mt-1 text-sm">
            Pravidlo:{' '}
            <strong className="text-teal-600">Najlepšie hračky sú tie, ktoré robia najmenej.</strong>{' '}
            Hračka, ktorá robia z dieťaťa aktívneho hráča, je cennejšia ako blikajúca elektronika.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              emoji: '🪞',
              title: 'Nerozbitné zrkadlo',
              text: 'Ideálne pre 5-mesačné dieťa. Podporuje hru na brušku, sociálny vývoj a neskôr sebauvedomenie.',
            },
            {
              emoji: '📚',
              title: 'Knihy a leporelá',
              text: 'Kontrastné čiernobiele knihy (teraz), neskôr pevné leporelá s 1 reálnou fotkou na stranu.',
            },
            {
              emoji: '🧱',
              title: 'Drevené kocky a poháriky',
              text: 'Najlepší nástroj na učenie príčiny a následku, úchopu a priestorového vnímania.',
            },
            {
              emoji: '🥄',
              title: 'Domáce potreby',
              text: 'Drevená varecha, plastová miska, šatka. Skúmanie materiálov zo skutočného sveta.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-4 rounded-lg shadow border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3 shadow-inner">
                {item.emoji}
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 mt-2">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-red-50 border-l-4 border-red-500 p-4 rounded-r text-sm">
          <p className="font-bold text-red-700">Čomu sa určite vyhnúť:</p>
          <p className="text-red-900 mt-1">
            1. <strong>Chodítka/Pavúky:</strong> Nútia dieťa do neprirodzenej polohy, preťažujú
            chrbticu a sú hlavnou príčinou úrazov dojčiat.
            <br />
            2. <strong>Tablety/Telefóny ako „zabávače":</strong> Mozog v tomto veku nedokáže
            preložiť 2D obraz obrazovky do reálneho sveta – rozvíja iba závislosť na dopamínových
            stimuloch.
          </p>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center text-xs text-slate-500 pt-2">
        <p>
          Zdroje: Harvard Center on the Developing Child, WHO, American Academy of Pediatrics (AAP),
          Nelson C.A. (2000)
        </p>
        <p className="mt-1 text-slate-400">
          Tieto informácie nenahrádzajú odbornú lekársku starostlivosť. Pri pochybnostiach sa vždy
          poraďte so svojím pediatrom.
        </p>
      </div>
    </div>
  );
};

export default BabyProgressGuide;
