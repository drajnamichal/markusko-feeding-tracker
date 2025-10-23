# 🔔 Push Notifications - Používateľská príručka

## ✨ Čo sú Push Notifications?

Push notifikácie sú automatické upozornenia, ktoré ťa informujú o dôležitých udalostiach, aj keď aplikáciu nemáš otvorenú!

---

## 📋 Podporované notifikácie

### 1. **🍼 Čas na kŕmenie**
- **Kedy:** Každé 2 hodiny po poslednom kŕmení fľašou
- **Čo sleduje:** Materské mlieko (ml) alebo Umelé mlieko (ml)
- **Notifikácia:** "🍼 Čas na kŕmenie!"
- **Text:** "Už 2 hodiny od posledného kŕmenia fľašou"

### 2. **💊 SAB Simplex reminder**
- **Kedy:** 4 hodiny po poslednej dávke
- **Čo sleduje:** SAB Simplex záznamy
- **Notifikácia:** "💊 SAB Simplex reminder"
- **Text:** "Uplynulo 4 hodiny od poslednej dávky. Môžete podať ďalších 10 kvapiek."

---

## 🚀 Ako aktivovať notifikácie?

### Krok 1: Otvor menu
1. Klikni na ikonu menu (☰) v pravom hornom rohu
2. Nájdi položku **"Notifikácie OFF"**

### Krok 2: Povoľ notifikácie
1. Klikni na **"Notifikácie OFF"**
2. Prehliadač požiada o povolenie notifikácií
3. Klikni na **"Povoliť"** alebo **"Allow"**

### Krok 3: Hotovo! ✅
- Notifikácie sú zapnuté
- Ikona sa zmení na **"Notifikácie ON"** 🔔
- Bell ikona bude oranžová

---

## 🎵 Funkcie notifikácií

### ✅ Zvuk
- Každá notifikácia má zvukovú výstrahu
- Systémový zvuk (závislý od nastavení zariadenia)

### ✅ Vibrácie
- Vzor: krátka → pauza → krátka → pauza → krátka
- Pattern: `[200ms, 100ms, 200ms]`

### ✅ Trvalé zobrazenie
- Notifikácia zostáva, kým ju nezavreš
- `requireInteraction: true`

### ✅ Kliknuteľné
- Klikni na notifikáciu → aplikácia sa otvorí
- Automaticky sa zatvorí

---

## 🛡️ Anti-Spam ochrana

### Prečo je to dôležité?
Bez ochrany by aplikácia posielala notifikácie každú minútu!

### Ako funguje ochrana?

#### 1. **30-minútový cooldown**
- Po odoslaní notifikácie sa čaká min. 30 minút
- Aj keď uplynú 2 hodiny, notifikácia príde max. raz za 30 min

#### 2. **Príklad:**
```
13:00 - Kŕmenie fľašou
15:00 - ⏰ Notifikácia: "Čas na kŕmenie!"
15:29 - ❌ Žiadna notifikácia (cooldown)
15:30 - ✅ Ďalšia notifikácia možná
```

---

## 📱 Kompatibilita

### ✅ Podporované prehliadače:
- ✅ Chrome (desktop & mobile)
- ✅ Firefox (desktop & mobile)
- ✅ Edge
- ✅ Safari (iOS 16.4+)
- ✅ Opera
- ✅ Samsung Internet

### ❌ Nepodporované:
- ❌ Safari (iOS < 16.4)
- ❌ Staré prehliadače (IE, staré Android)

---

## 🔧 Nastavenia

### Zapnúť notifikácie:
1. Menu → **"Notifikácie OFF"**
2. Povoľ v prehliadači
3. Hotovo! 🎉

### Vypnúť notifikácie:
1. Menu → **"Notifikácie ON"**
2. Prepne na **"OFF"**
3. Notifikácie sú vypnuté 🔕

### Resetovať povolenia:
Ak si omylom klikol "Block":
1. **Chrome:** Nastavenia → Súkromie → Notifikácie → Nájdi aplikáciu → Zmeniť na "Povoliť"
2. **Firefox:** URL bar → (i) ikona → Povolenia → Notifikácie → "Povoliť"
3. **Safari:** Nastavenia → Safari → Notifikácie → Markusík → "Povoliť"

---

## 🧪 Testovanie notifikácií

### Test 1: Feeding reminder
1. Pridaj kŕmenie fľašou (napr. 90ml)
2. Zmeň čas na 2+ hodiny dozadu (edit entry)
3. Počkaj 1 minútu
4. ✅ Notifikácia: "🍼 Čas na kŕmenie!"

### Test 2: SAB Simplex reminder
1. Pridaj SAB Simplex záznam
2. Zmeň čas na 4+ hodiny dozadu (edit entry)
3. Počkaj 1 minútu
4. ✅ Notifikácia: "💊 SAB Simplex reminder"

---

## 🐛 Riešenie problémov

### 1. **Notifikácie neprichádzajú**
**Možný problém:** Notifikácie sú vypnuté v prehliadači
**Riešenie:**
- Skontroluj nastavenia prehliadača
- Pozri sekciu "Resetovať povolenia"

### 2. **Notifikácie prichádzajú príliš často**
**Možný problém:** Bug v aplikácii
**Riešenie:**
- Anti-spam ochrana by mala zabrániť spamu (30min cooldown)
- Ak problém pretrváva, nahláste bug

### 3. **Žiadny zvuk**
**Možný problém:** Zariadenie je v tichom režime
**Riešenie:**
- Skontroluj hlasitosť zariadenia
- Vypni tichý režim (Do Not Disturb)

### 4. **Notifikácie neprichádzajú v pozadí (iOS)**
**Možný problém:** iOS limitácie
**Riešenie:**
- iOS podporuje PWA notifikácie od verzie 16.4+
- Pridaj PWA na domovskú obrazovku
- Musí byť "Standalone" mód

---

## 💡 Tipy & Triky

### 1. **Pridaj PWA na domovskú obrazovku**
- **iOS:** Safari → Share → "Add to Home Screen"
- **Android:** Chrome → Menu (⋮) → "Add to Home Screen"
- PWA funguje ako natívna aplikácia!

### 2. **Testuj notifikácie v dev móde**
- Otvor DevTools → Console
- Spusti: `Notification.requestPermission()`
- Alebo: `new Notification("Test", {body: "Hello"})`

### 3. **Notifikácie fungujú aj offline**
- Service Worker je zaregistrovaný
- Notifikácie prídu aj bez internetu!
- Dáta sú uložené lokálne (localStorage)

---

## 📊 Technické detaily

### Architecture:
```typescript
// State management
const [feedingNotificationsEnabled, setFeedingNotificationsEnabled] = useState(false);
const [lastFeedingNotificationTime, setLastFeedingNotificationTime] = useState(0);
const [lastSabSimplexNotificationTime, setLastSabSimplexNotificationTime] = useState(0);

// Check every minute
useEffect(() => {
  const interval = setInterval(checkFeedingTime, 60000);
  return () => clearInterval(interval);
}, [entries, feedingNotificationsEnabled]);

// Send notification
const sendNotification = (title, body, tag) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/192.png',
      badge: '/icons/72.png',
      vibrate: [200, 100, 200],
      tag,
      renotify: true,
      requireInteraction: true
    });
  }
};
```

### Spam Prevention:
```typescript
const sendFeedingNotification = () => {
  const now = Date.now();
  // 30-minute cooldown
  if (now - lastFeedingNotificationTime < 30 * 60 * 1000) {
    return; // Skip
  }
  sendNotification(...);
  setLastFeedingNotificationTime(now);
};
```

### Persistence:
```typescript
// Save to localStorage
localStorage.setItem('feedingNotificationsEnabled', 'true');

// Load on mount
const [enabled] = useState(() => {
  return localStorage.getItem('feedingNotificationsEnabled') === 'true';
});
```

---

## 🎯 Budúce vylepšenia

### 🔜 Plánované:
- [ ] Vlastné intervaly (napr. 2.5h, 3h)
- [ ] Tiché hodiny (napr. 22:00 - 06:00)
- [ ] Vlastné zvuky notifikácií
- [ ] Snooze tlačidlo (odložiť o 15 min)
- [ ] Štatistiky notifikácií
- [ ] Push cez Service Worker (true push)
- [ ] Multi-reminder (viac typov naraz)
- [ ] Smart reminders (AI predikcia)

---

## 📞 Podpora

Ak máš problémy s notifikáciami, kontaktuj:
- GitHub Issues: [Link]
- Email: [Email]
- Discord: [Link]

---

## 📝 Changelog

### v1.1.0 (2025-01-23)
- ✅ Initial push notification support
- ✅ Feeding reminder (2h)
- ✅ SAB Simplex reminder (4h)
- ✅ Anti-spam protection (30min cooldown)
- ✅ Sound & vibration support
- ✅ Click to open app
- ✅ Persistent storage

---

**Užívaj si automatické upozornenia! 🔔**

