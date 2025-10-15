# 📱 Návod na inštaláciu PWA aplikácie na iPhone

## 🎯 Čo je PWA?
**Progressive Web App** (PWA) je webová aplikácia, ktorá sa správa ako natívna mobilná aplikácia. Môžete ju nainštalovať na home screen a používať offline!

---

## 📲 Inštalácia na iPhone (Safari)

### Krok 1: Otvorte aplikáciu v Safari
1. Na vašom iPhone otvorte **Safari**
2. Prejdite na URL aplikácie (napr. `https://markusko-feeding-tracker.vercel.app`)

### Krok 2: Pridajte na Home Screen
1. Kliknite na tlačidlo **Share** (štvorec so šípkou nahor) 📤
2. Scrollujte nadol a nájdite **"Add to Home Screen"** ➕
3. Kliknite na **"Add to Home Screen"**

### Krok 3: Pomenujte aplikáciu
1. Uvidíte ikonu a navrhované meno: **"Markusík"**
2. Môžete zmeniť meno alebo ponechať pôvodné
3. Kliknite **"Add"** v pravom hornom rohu

### ✅ Hotovo!
- Aplikácia sa objaví na vašom home screen
- Ikona vyzerá ako bežná aplikácia
- Kliknutím na ikonu sa otvorí aplikácia na celú obrazovku (bez Safari UI)

---

## 🎨 Funkcie PWA

✅ **Fullscreen režim** - žiadny browser UI  
✅ **Offline podpora** - funguje aj bez internetu  
✅ **Rýchle načítanie** - cachované súbory  
✅ **Natívny pocit** - ako skutočná aplikácia  
✅ **Automatické aktualizácie** - vždy najnovšia verzia  

---

## 🔄 Ako funguje offline?

Aplikácia používa **Service Worker**, ktorý:
- Cachuje dôležité súbory pre offline použitie
- Umožňuje prezerať históriu aj bez internetu
- Synchronizuje dáta, keď sa pripojíte späť

---

## 📊 Čo funguje offline?

✅ Prezeranie starých záznamov  
✅ Prezeranie štatistík  
⚠️ Pridávanie nových záznamov vyžaduje internet (Supabase)  

---

## 🔧 Riešenie problémov

### Aplikácia sa nezobrazuje na home screen
1. Uistite sa, že používate **Safari** (nie Chrome/Firefox)
2. Skúste refreshnúť stránku (F5)
3. Vyčistite cache Safari

### Ikona vypadá zle
1. Počkajte pár sekúnd po inštalácii
2. Reštartujte iPhone
3. Ikony sa načítavajú postupne

### Aplikácia nefunguje offline
1. Otvorte aplikáciu aspoň raz s internetom
2. Service Worker potrebuje čas na cache-ovanie
3. Skontrolujte konzolu pre chyby

---

## 🎉 Výhody oproti web verzii

| Funkcia | Web (Safari) | PWA App |
|---------|-------------|---------|
| Fullscreen | ❌ | ✅ |
| Home screen ikona | ❌ | ✅ |
| Offline prístup | ❌ | ✅ |
| Rýchle načítanie | ⚠️ | ✅ |
| Natívny pocit | ❌ | ✅ |

---

## 📱 Inštalácia na Android

### Postup pre Android (Chrome):
1. Otvorte aplikáciu v **Chrome**
2. Kliknite na menu (3 bodky)
3. Vyberte **"Add to Home screen"**
4. Potvrďte pridanie
5. Ikona sa objaví na home screen

---

## 🚀 Čo ďalej?

Po inštalácii môžete:
- 📊 Používať aplikáciu kedykoľvek
- 🔔 Dostávať pripomienky (ak povolíte notifikácie)
- 💾 Mať prístup k dátam offline
- ⚡ Rýchlejšie načítanie

---

## ❓ FAQ

**Q: Potrebujem App Store?**  
A: Nie! PWA sa inštaluje priamo z webu.

**Q: Zaberie to veľa miesta?**  
A: Minimálne, len pár MB pre cache.

**Q: Môžem ju odinštalovať?**  
A: Áno, dlhým podržaním ikony a "Remove App".

**Q: Funguje to aj na iPade?**  
A: Áno, rovnaký postup!

**Q: Potrebujem iOS 16+?**  
A: Nie, funguje od iOS 11.3+.

---

## 💡 Tipy

- Po inštalácii **zavrite Safari verziu** a používajte iba PWA
- PWA sa automaticky aktualizuje pri otvorení s internetom
- Môžete mať PWA aj web verziu súčasne
- Dáta sú zdieľané medzi PWA a web verziou (Supabase)

---

**Enjoy your new mobile app! 🎉**

