# Changelog

Všetky významné zmeny v projekte budú dokumentované v tomto súbore.

Formát je založený na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a tento projekt dodržiava [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

