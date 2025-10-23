# 🔄 Ako updatnúť PWA aplikáciu

## ⚡ Rýchla metóda (odporúčaná)

### **iOS (iPhone/iPad):**
```
1. Zavri PWA aplikáciu úplne (swipe up v App Switcher)
2. Nastavenia → Safari → Vymazať históriu a dáta webových stránok
3. Potvrď "Vymazať históriu a dáta"
4. Otvor PWA znova z Home Screen
```

### **Android (Chrome):**
```
1. Zavri PWA aplikáciu
2. Nastavenia → Aplikácie → "Markusík" → Úložisko
3. Vymazať cache (Clear Cache)
4. Vymazať dáta (Clear Data) - iba ak cache clear nepomohol
5. Otvor PWA znova
```

### **Desktop (Chrome/Edge):**
```
1. Otvor PWA aplikáciu
2. Stlač: Cmd+Shift+R (Mac) alebo Ctrl+Shift+R (Windows)
3. Alebo: Dev Tools (F12) → Application → Service Workers → Unregister
4. Refresh stránku
```

---

## 🔍 Ako overiť či máš najnovšiu verziu?

Po update by si mal vidieť:

✅ **Loading States** na buttonoch:
- Quick Add buttony ukazujú "⏳ Pridávam..." → "✓ Pridané!"
- Save button ukazuje "⏳ Ukladám..." → "✓ Uložené!"
- Zelený checkmark po úspechu

✅ **Verzia v Console:**
```javascript
// Otvor Dev Tools (F12) → Console
// Malo by byť: "[SW] Installing new version: markusik-tracker-v29-loading-states"
```

---

## 🛠️ Riešenie problémov

### **Stále vidím staré verzie?**

**iOS Safari:**
```
1. Nastavenia → Safari → Pokročilé → Dáta webových stránok
2. Nájdi svoju doménu a vymaž ju
3. Reštartuj Safari
4. Otvor PWA znova
```

**Android Chrome:**
```
1. Odinstaluj PWA aplikáciu (dlhý press → Odstrániť)
2. Vymaž cache v Chrome:
   Chrome → Nastavenia → Súkromie → Vymazať údaje prehliadania
3. Znova nainštaluj PWA z webovej stránky
```

**Desktop:**
```
1. Odinstaluj PWA: Three dots → Uninstall
2. Vymaž cache: Settings → Privacy → Clear browsing data
3. Znova nainštaluj PWA
```

---

## 📱 Ako to funguje teraz?

**Pred fixom (v28):**
- ❌ Cache First pre všetko
- ❌ Zmeny sa neprejavili
- ❌ Musel si manuálne vymazať cache

**Po fixe (v29-loading-states):**
- ✅ Network First pre HTML/JS/CSS
- ✅ Okamžité načítanie nových verzií
- ✅ Offline support stále funguje
- ✅ Assets (ikony) rýchle z cache

---

## 🎯 Budúce updaty

Od teraz by sa aplikácia mala aktualizovať **automaticky** pri každom otvorení (ak máš internet):

1. Otvoríš PWA → Stiahne najnovšiu verziu
2. Service worker sa automaticky update-ne
3. Zmeny sú okamžite viditeľné
4. Offline režim stále funguje

---

## 💡 Tip pre vývojárov

Ak vyvíjaš:
```bash
# Vždy rebuild pred testovaním PWA
npm run build

# Skopíruj nový SW do dist/
cp public/sw.js dist/sw.js

# Alebo použij
npm run dev  # pre development (hot reload)
```

---

**Potrebuješ pomoc?** Otvor issue na GitHub! 🚀

