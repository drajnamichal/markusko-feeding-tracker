# 👶 Aplikácia na sledovanie novorodenca

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)

Komplexná PWA aplikácia pre sledovanie denných aktivít novorodenca s integrovaným AI asistentom.

</div>

---

## 📋 Obsah

- [O aplikácii](#o-aplikácii)
- [Funkcie](#funkcie)
- [Inštalácia](#inštalácia)
- [Konfigurácia](#konfigurácia)
- [AI Doktor](#ai-doktor)
- [Technológie](#technológie)
- [Vývoj](#vývoj)
- [License](#license)

---

## 🎯 O aplikácii

Moderná Progressive Web App (PWA) navrhnutá pre rodičov novorodencov, ktorá umožňuje jednoduché a prehľadné sledovanie všetkých dôležitých aktivít dieťaťa. Aplikácia kombinuje praktické funkcie na sledovanie kŕmenia, spánku a vývoja s inteligentným AI asistentom pre konzultácie.

### 🌟 Hlavné výhody

- ✅ **Offline režim**: Funguje aj bez pripojenia na internet
- ✅ **Inštalovateľná**: Môžete si ju nainštalovať ako mobilnú aplikáciu
- ✅ **Synchronizácia**: Automatická synchronizácia dát cez Supabase
- ✅ **AI Asistent**: Integrovaný AI Doktor pre zdravotné konzultácie
- ✅ **Slovenčina**: Plne lokalizovaná do slovenského jazyka

---

## ⚡ Funkcie

### 📊 Základné sledovanie

#### 🍼 Kŕmenie
- Sledovanie dojčenia
- Zaznamenávanie materského mlieka (ml)
- Zaznamenávanie umelého mlieka (ml)
- Denný prehľad príjmu mlieka s odporúčaniami (150-180 ml/kg)
- Časovač od posledného kŕmenia
- Notifikácie po 2 hodinách od posledného kŕmenia

#### 😴 Spánok
- Stopky pre meranie spánku
- História spánkových relácií
- Štatistiky spánku za posledných 24 hodín
- Grafy spánkových vzorcov

#### 👶 Aktivita
- **Tummy Time**: Stopky pre cvičenie na bruchu (cieľ 3x denne)
- **Stolica a moč**: Sledovanie vyprázdňovania
- **Zvracanie**: Zaznamenávanie epizód
- **Kúpanie**: Pripomienka každé 2 dni
- **Sterilizácia fliaš**: Pripomienka každé 2 dni

#### 💊 Lieky a vitamíny
- **Vitamín D**: Denné sledovanie
- **SAB Simplex**: Sledovanie dávok (4x denne každé 4 hodiny)
- Upozornenia na odporúčané dávkovanie

### 📈 Merania a vývoj

#### 📏 Fyzické merania
- Sledovanie váhy (g)
- Sledovanie výšky (cm)
- História všetkých meraní
- Porovnanie s hodnotami pri narodení

#### 📊 Štatistiky
- Denné prehľady kŕmenia
- Týždenné trendy spánku
- Grafy váhového a výškového prírastku
- Prehľady vyprázdňovania

### 📚 Príručky a sprievodcovia

#### 🌍 WHO usmernenia
- Odporúčané hodnoty pre váhu a výšku podľa WHO
- Percentily rastu
- Vývojové míľniky

#### 🍼 Dávkovanie mlieka
- Tabuľka odporúčaného príjmu podľa váhy
- Kalkulačka objemu kŕmenia
- Frekvencie kŕmenia podľa veku

#### 🏃 Cvičenia a vývoj
- Vývojové aktivity podľa veku
- Návrhy cvičení
- Míľniky vývoja

#### 🎵 White Noise
- Integrovaný generátor bieleho šumu
- Pomáha ukľudniť bábätko
- Ovládanie hlasitosti

### 🩺 AI Doktor (NOVÉ!)

Inteligentný asistent pre zdravotné konzultácie využívajúci OpenAI GPT-4 technológiu.

#### ✨ Funkcie AI Doktora
- 🔍 **Analýza zdravotného stavu**: Komplexné vyhodnotenie na základe všetkých údajov
- 🍼 **Analýza kŕmenia**: Posúdenie príjmu a frekvencie
- 😴 **Analýza spánku**: Vyhodnotenie spánkových návykov
- 📊 **Váhový vývoj**: Kontrola rastu a prírastku
- 💬 **Personalizované rady**: Konkrétne odporúčania pre vaše dieťa
- 🗂️ **Kontext-aware**: AI má prístup k všetkým údajom o vašom dieťati

#### 📖 Dokumentácia
Detailný návod na použitie AI Doktora nájdete v [AI_DOCTOR_GUIDE.md](./AI_DOCTOR_GUIDE.md)

**Hlavné témy:**
- Získanie OpenAI API kľúča
- Nastavenie a konfigurácia
- Príklady použitia
- Bezpečnosť a súkromie
- Náklady a ceny
- Časté otázky a riešenie problémov

---

## 🚀 Inštalácia

### Požiadavky

- **Node.js**: v20.17.0 alebo vyššia
- **npm**: v10.8.2 alebo vyššia
- **Supabase účet**: Pre databázu ([supabase.com](https://supabase.com))

### Lokálna inštalácia

1. **Klonujte repozitár:**
   ```bash
   git clone <repository-url>
   cd newborn-feeding-tracker
   ```

2. **Nainštalujte závislosti:**
   ```bash
   npm install
   ```

3. **Vytvorte `.env.local` súbor:**
   ```bash
   cp .env.example .env.local
   ```

4. **Nakonfigurujte environment premenné:**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Spustite vývojový server:**
   ```bash
   npm run dev
   ```

6. **Otvorte aplikáciu:**
   Navštívte [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Konfigurácia

### Supabase nastavenie

1. **Vytvorte nový projekt** na [supabase.com](https://supabase.com)

2. **Spustite migrácie:**
   - Otvorte SQL Editor v Supabase Dashboard
   - Spustite migračné skripty zo zložky `supabase-migrations/`

3. **Získajte credentials:**
   - Project URL: `Settings` → `API` → `Project URL`
   - Anon Key: `Settings` → `API` → `anon/public`

4. **Nastavte environment premenné** (viď vyššie)

### PWA konfigurácia

Aplikácia je automaticky nakonfigurovaná ako PWA:
- ✅ Service Worker
- ✅ Offline cache
- ✅ Manifest súbor
- ✅ Ikony pre všetky platformy

**Inštalácia na zariadenie:**
- **Android**: Kliknite na "Pridať na plochu" v Chrome
- **iOS**: Safari → Share → "Add to Home Screen"
- **Desktop**: Ikona + v adresnej lište

---

## 🩺 AI Doktor - Rýchly štart

### 1. Získajte OpenAI API kľúč

1. Navštívte [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Prihláste sa / zaregistrujte sa
3. Vytvorte nový API kľúč
4. Skopírujte kľúč (začína na `sk-...`)

### 2. Nastavte v aplikácii

1. Otvorte menu (☰)
2. Kliknite na "AI Doktor"
3. Vložte váš API kľúč
4. Kliknite "Uložiť a pokračovať"

### 3. Začnite konzultáciu

Použite navrhované otázky alebo napíšte vlastné:
- "Posúďte prosím celkový zdravotný stav môjho dieťaťa"
- "Je kŕmenie dostatočné?"
- "Spí moje dieťa dosť?"
- "Váhový prírastok je v poriadku?"

### ⚠️ Dôležité upozornenia

- AI Doktor je len informatívny nástroj
- Nenahradí reálneho pediatra
- Pri vážnych symptómoch kontaktujte lekára
- Detailný návod: [AI_DOCTOR_GUIDE.md](./AI_DOCTOR_GUIDE.md)

---

## 🛠️ Technológie

### Frontend
- **React 19.2.0**: UI knižnica
- **TypeScript 5.8.2**: Typová bezpečnosť
- **Vite 6.2.0**: Build tool a dev server
- **TailwindCSS**: Styling (via inline classes)
- **Font Awesome**: Ikony

### Backend & Databáza
- **Supabase**: PostgreSQL databáza, Auth, Real-time
- **OpenAI API**: AI Doktor funkcionality

### Testing
- **Vitest**: Unit testing framework
- **Testing Library**: React komponent testing
- **jsdom**: DOM simulation

### PWA
- **Service Worker**: Offline podpora
- **Web App Manifest**: Inštalovateľnosť
- **Cache API**: Asset caching

---

## 👨‍💻 Vývoj

### Dostupné skripty

```bash
# Vývojový server
npm run dev

# Production build
npm run build

# Preview production buildu
npm run preview

# Spustenie testov
npm run test

# Testy s UI
npm run test:ui

# Test coverage
npm run test:coverage
```

### Štruktúra projektu

```
newborn-feeding-tracker/
├── components/           # React komponenty
│   ├── AIDoctor.tsx     # AI Doktor komponent
│   ├── EntryForm.tsx    # Formulár pre záznamy
│   ├── LogList.tsx      # Zoznam záznamov
│   ├── Statistics.tsx   # Štatistiky
│   ├── SleepTracker.tsx # Sledovanie spánku
│   └── ...
├── src/
│   └── test/            # Unit testy
├── public/              # Statické súbory (ikony, manifest)
├── dist/                # Production build
├── supabase-migrations/ # Database migrations
├── App.tsx              # Hlavný komponent
├── types.ts             # TypeScript types
├── supabaseClient.ts    # Supabase konfigurácia
└── vite.config.ts       # Vite konfigurácia
```

### Testovanie

```bash
# Spustenie všetkých testov
npm run test

# Spustenie konkrétneho testu
npm run test -- src/test/feedingTime.test.ts

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage
```

### Pridanie nových funkcií

1. Vytvorte nový komponent v `components/`
2. Pridajte types do `types.ts`
3. Aktualizujte `App.tsx` pre integráciu
4. Vytvorte testy v `src/test/`
5. Aktualizujte dokumentáciu

---

## 📱 Funkcie PWA

### Offline režim
- ✅ Všetky komponenty fungujú offline
- ✅ Dáta sa synchronizujú po obnovení pripojenia
- ✅ Service Worker cache pre rýchle načítanie

### Push notifikácie
- ⏰ Pripomienky kŕmenia (každé 2 hodiny)
- 🔔 Možnosť zapnúť/vypnúť v menu
- 📱 Podporované na Android a Desktop (iOS obmedzene)

### Inštalácia
- 📲 Pridať na plochu z prehliadača
- 🖥️ Desktop inštalácia (Chrome, Edge)
- 🍎 iOS "Add to Home Screen"

---

## 🔒 Bezpečnosť a súkromie

### Ukladanie dát
- 🔐 Všetky dáta šifrované v Supabase
- 🏠 API kľúče uložené lokálne v prehliadači
- 🚫 Žiadne dáta sa nezdieľajú s tretími stranami (okrem OpenAI pre AI Doktor)

### OpenAI API
- ✅ Priame volania z prehliadača
- ✅ OpenAI neuchováva dáta pre tréning
- ✅ Možnosť kedykoľvek odstrániť API kľúč

### Odporúčania
- 🔑 Nepoužívajte zdieľané OpenAI účty
- 📊 Sledujte spotrebu API na OpenAI platforme
- 🔒 Pravidelne kontrolujte Supabase Access Logs

---

## 📖 Dokumentácia

- **[AI_DOCTOR_GUIDE.md](./AI_DOCTOR_GUIDE.md)** - Kompletný návod pre AI Doktor
- **[PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)** - Inštalácia ako PWA aplikácia
- **API dokumentácia**: Inline JSDoc komentáre v kóde

---

## 🐛 Riešenie problémov

### Aplikácia sa nenačíta
```bash
# Skontrolujte Supabase prihlasovacie údaje
# Overte, že .env.local obsahuje správne hodnoty
cat .env.local
```

### AI Doktor nefunguje
- Overte API kľúč na [platform.openai.com](https://platform.openai.com)
- Skontrolujte kredit na OpenAI účte
- Pozrite si konzolu prehliadača (F12) pre chyby

### Notifikácie nefungujú
- Povolte notifikácie v nastaveniach prehliadača
- Na iOS Safari má obmedzenia pre PWA notifikácie
- Skontrolujte, či máte zapnuté "Notifikácie ON" v menu

---

## 🤝 Príspevky

Príspevky sú vítané! 

1. Forkujte repozitár
2. Vytvorte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commitnite zmeny (`git commit -m 'Add some AmazingFeature'`)
4. Pushnite do branchu (`git push origin feature/AmazingFeature`)
5. Otvorte Pull Request

---

## 📝 License

Tento projekt je licencovaný pod MIT License - viď [LICENSE](LICENSE) súbor pre detaily.

---

## 👏 Poďakovanie

- **React Team** za skvelý framework
- **Supabase** za backend infraštruktúru
- **OpenAI** za GPT-4 technológiu
- **Font Awesome** za ikony
- **WHO** za vývojové usmernenia

---

## 📞 Kontakt

Pre otázky, problémy alebo návrhy vytvorte Issue v GitHub repozitári.

---

<div align="center">

**Vyrobené s ❤️ pre rodičov a ich malých zázrakov**

![Baby](https://img.shields.io/badge/Made%20for-Babies-ff69b4?style=for-the-badge)
![React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-3178C6?style=for-the-badge&logo=typescript)

</div>
