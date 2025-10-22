# Changelog

Všetky významné zmeny v projekte budú dokumentované v tomto súbore.

Formát je založený na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a tento projekt dodržiava [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-22

### 🆕 Pridané

#### WHO Percentilové grafy
- **WHO Percentilové grafy** - Profesionálne sledovanie rastu dieťaťa podľa WHO štandardov
- **Tri metriky:**
  - 📈 **Váha podľa veku** - Sledovanie váhového prírastku (kg)
  - 📏 **Výška/Dĺžka podľa veku** - Sledovanie výškového rastu (cm)
  - 👶 **Obvod hlavy podľa veku** - Nová metrika pre komplexnejšie sledovanie (cm)
- **Percentily:** P3, P15, P50 (medián), P85, P97
- **Vizualizácia:**
  - Interaktívne grafy s Recharts
  - Percentilové krivky pre porovnanie
  - Detekcia a zvýraznenie aktuálneho veku
  - História všetkých meraní v grafe
- **Automatické vyhodnotenie:**
  - Výpočet aktuálneho percentilu dieťaťa
  - Farebné hodnotenie (zelená = v norme, žltá = mierne mimo, červená = konzultovať lekára)
  - Jasné oznámenia o stave rastu
- **Podpora pohlavia:**
  - Samostatné percentilové dáta pre chlapcov a dievčatá
  - Možnosť prepínania pohlavia
  - Lokálne uloženie nastavenia
- **Tabuľka histórie:**
  - Prehľad všetkých meraní s percentilmi
  - Vek pri každom meraní
  - Všetky tri metriky v jednej tabuľke

#### Obvod hlavy
- **Nové pole v meraniach** - `headCircumferenceCm` v Measurement type
- **Databázová migrácia** - `add_head_circumference_field.sql`
- **Aktualizovaný formulár** - Pole pre zadanie obvodu hlavy pri meraní
- **Zobrazenie v histórii** - Obvod hlavy zobrazený v posledných meraniach

#### WHO Dáta
- **Reálne WHO dáta (2006)** - Oficiálne WHO Child Growth Standards
- **Vekové rozpätie:** 0-24 mesiacov
- **Presné percentily:** P3, P15, P50, P85, P97
- **Kalkulátor percentilu** - Automatický výpočet percentilu pre akúkoľvek hodnotu

### 🔧 Technické detaily

#### Nové súbory
- `components/WHOPercentileCharts.tsx` - Hlavný komponent pre percentilové grafy
- `whoData.ts` - WHO percentilové dáta a utility funkcie
- `supabase-migrations/add_head_circumference_field.sql` - DB migrácia

#### Aktualizované súbory
- `types.ts` - Pridané `headCircumferenceCm` do `Measurement`
- `supabaseClient.ts` - Aktualizované `MeasurementDB` a konverzie
- `App.tsx`:
  - Import `WHOPercentileCharts`
  - Pridaný state `showWHOPercentiles`
  - Aktualizovaná funkcia `addMeasurement` (nový parameter)
  - Nové menu položky
  - Podmienené renderovanie komponentu
  - Aktualizovaný formulár pre merania
  - Zobrazenie obvodu hlavy v histórii meraní

### 📊 Funkcionality

#### WHO Percentilové grafy
1. **Tri typy grafov:**
   - Váha-pre-vek (weight-for-age)
   - Výška-pre-vek (length-for-age)
   - Obvod hlavy-pre-vek (head circumference-for-age)

2. **Status karta:**
   - Aktuálna hodnota metriky
   - Vek dieťaťa v mesiacoch
   - Percentil s farebným hodnotením
   - Jasné hodnotenie stavu

3. **Interaktívny graf:**
   - 5 percentilových kriviek (P3, P15, P50, P85, P97)
   - Body s meraniami dieťaťa
   - Vertikálna čiara pre aktuálny vek
   - Tooltip s detailmi
   - Legenda

4. **Informačný box:**
   - Vysvetlenie percentilov
   - Odporúčania
   - WHO štandardy

### 🎨 UI/UX Vylepšenia
- 🎨 **Farebné rozlíšenie:** Zelená (norma), Žltá (pozor), Červená (konzultovať)
- 📱 **Responzívny dizajn:** Funguje na mobile aj desktop
- 🔄 **Prepínanie metrík:** Jednoduché tlačidlá pre váhu/výšku/obvod hlavy
- ⚥ **Výber pohlavia:** Modal s ikonami pre chlapcov/dievčatá
- 📊 **História meraní:** Tabuľka s posledných 10 meraní

### 🔒 Bezpečnosť a súkromie
- 🔐 Všetky dáta lokálne v Supabase databáze
- 💾 Pohlavie uložené lokálne v localStorage
- 🚫 Žiadne externé API volania (okrem Supabase)

---

## [1.1.0] - 2025-10-21

### 🆕 Pridané

#### AI Doktor
- **Nový AI Doktor komponent** - Inteligentný asistent pre zdravotné konzultácie
- **OpenAI GPT-4o-mini integrácia** - Využitie najnovšej AI technológie
- **Kontextová analýza** - AI má prístup k všetkým údajom o dieťati:
  - Profil dieťaťa (meno, dátum narodenia, váha/výška pri narodení)
  - Aktuálne miery (posledné meranie váhy a výšky)
  - História kŕmenia (posledných 20 záznamov)
  - Spánkové záznamy (posledných 10 relácií)
  - Denné štatistiky (kŕmenie, spánok, vyprázdňovanie)
- **Bezpečné ukladanie API kľúča** - Lokálne uloženie v prehliadači
- **Konverzačné rozhranie** - Prirodzená komunikácia s AI
- **Prednastavené otázky** - Rýchly štart s navrhovanými konzultáciami
- **Správa konverzácií** - Možnosť vymazať históriu
- **Systém upozornení** - Bezpečnostné a zdravotné výstrahy

#### Dokumentácia
- **AI_DOCTOR_GUIDE.md** - Kompletný návod na použitie AI Doktora
  - Získanie OpenAI API kľúča
  - Nastavenie a konfigurácia
  - Príklady použitia
  - Bezpečnosť a súkromie
  - Ceny a náklady
  - FAQ a riešenie problémov
- **Aktualizovaný README.md** - Nová sekcia o AI Doktorovi
- **CHANGELOG.md** - História zmien projektu

#### Menu a UI
- **Nové tlačidlo "AI Doktor"** v hlavnom menu
- **Ikona lekára** (fa-user-doctor) pre ľahšiu identifikáciu
- **Automatické prepínanie** medzi sekciami aplikácie
- **Responzívny dizajn** pre AI Doktor rozhranie

### 🔧 Technické detaily

#### Nové závislosti
```json
{
  "openai": "^4.x.x"
}
```

#### Nové komponenty
- `components/AIDoctor.tsx` - Hlavný komponent AI Doktora
  - State management pre konverzácie
  - OpenAI API integrácia
  - Lokálne ukladanie API kľúča
  - UI pre chat rozhranie

#### Aktualizované komponenty
- `App.tsx`:
  - Import AI Doktor komponentu
  - Nový state `showAIDoctor`
  - Integrácia do menu
  - Podmienené renderovanie

### 🎯 Funkcionality AI Doktora

#### Analyzované údaje
- **Profil**: Vek, váha a výška pri narodení
- **Aktuálne miery**: Váhový a výškový prírastok
- **Kŕmenie**: 
  - Počet kŕmení za deň
  - Celkový príjem mlieka (ml)
  - Čas od posledného kŕmenia
  - Porovnanie s odporúčaniami (150-180 ml/kg)
- **Spánok**: 
  - Celkový čas spánku za 24h
  - Počet a dĺžka spánkových relácií
- **Vyprázdňovanie**: Počet stolíc a močení
- **Aktivita**: Tummy time, zvracanie, kúpanie
- **Lieky**: Vitamín D, SAB Simplex

#### Typy konzultácií
1. **Celkový zdravotný stav** - Komplexná analýza
2. **Analýza kŕmenia** - Príjem a frekvencia
3. **Analýza spánku** - Kvalita a dĺžka spánku
4. **Váhový prírastok** - Rast a vývoj
5. **Vlastné otázky** - Flexibilné konzultácie

### 📊 Systémový prompt

AI Doktor používa špecializovaný systémový prompt:
- **Rola**: Skúsený pediater a detský lekár
- **Jazyk**: Slovenčina
- **Štýl**: Empatický, trpezlivý, podporujúci
- **Kontext**: Všetky relevantné údaje o dieťati
- **Bezpečnosť**: Odporúčania kontaktovať lekára pri vážnych príznakoch

### 🔒 Bezpečnosť

- **API kľúč**: Uložený len lokálne v localStorage
- **Priame volania**: Priamo z prehliadača na OpenAI (nie cez backend)
- **Žiadne ukladanie**: OpenAI neuchováva dáta pre tréning
- **Možnosť odstránenia**: Kedykoľvek možné vymazať API kľúč

### ⚠️ Upozornenia a limity

- AI Doktor je len informatívny nástroj
- Nenahradí reálneho pediatra
- Odporúča sa konzultovať dôležité rozhodnutia s lekárom
- Pri vážnych symptómoch okamžite kontaktovať lekára

### 💰 Náklady

- **Model**: GPT-4o-mini (najlacnejší GPT-4 model)
- **Ceny**: ~$0.15/1M input tokenov, ~$0.60/1M output tokenov
- **Odhad**: 1 konzultácia ~$0.001-$0.003 (0.07-0.21 Sk)
- **Odporúčanie**: Začať s $5 kreditom a sledovať spotrebu

---

## [1.0.0] - 2025-10-01

### Pridané
- Základná funkcionalita aplikácie
- Sledovanie kŕmenia (dojčenie, materské a umelé mlieko)
- Sledovanie spánku so stopkami
- Sledovanie vyprázdňovania (stolica, moč)
- Tummy Time stopky
- Sledovanie liekov (Vitamín D, SAB Simplex)
- Pripomienky (kúpanie, sterilizácia)
- WHO usmernenia
- Dávkovanie mlieka
- Vývojové cvičenia
- White Noise generátor
- Štatistiky a grafy
- PWA podpora (offline režim, inštalácia)
- Push notifikácie pre kŕmenie
- Supabase integrácia
- TypeScript support
- Unit testy (Vitest)

---

## Budúce plány

### [1.2.0] - Plánované
- [ ] Export dát do PDF
- [ ] Grafické prehľady (weekly/monthly)
- [ ] Multi-language support (EN)
- [ ] Zdieľanie dát s lekárom
- [ ] Cloud backup / restore

### [2.0.0] - Dlhodobé ciele
- [ ] Podpora pre viacero detí
- [ ] Komunitné funkcie (fórum, tipy)
- [ ] Integrácia s wearables (smart hodinky)
- [ ] AI predikcie (optimálny čas kŕmenia, spánku)
- [ ] Video konzultácie cez aplikáciu

---

## Typy zmien

- **Pridané** - Nové funkcie
- **Zmenené** - Zmeny v existujúcich funkciách
- **Opravené** - Opravy bugov
- **Odstránené** - Odstránené funkcie
- **Bezpečnosť** - Bezpečnostné opravy
- **Deprecated** - Funkcie označené na odstránenie

---

**Poznámka**: Dátumy sú vo formáte YYYY-MM-DD (ISO 8601)

