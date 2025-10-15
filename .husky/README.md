# Git Hooks

Tento projekt používa [Husky](https://typicode.github.io/husky/) na automatické spúšťanie úloh pri Git operáciách.

## Nastavené hooks

### 🔒 Pre-push hook

**Čo robí:**
- Spustí všetky unit testy (`npm test -- --run`)
- Ak testy zlyhajú, push je zrušený
- Ak testy prejdú, push pokračuje

**Prečo:**
- Zabráni pushnutiu kódu s chybami do repozitára
- Udržuje master branch stabilný
- Odhalí problémy skôr, než sa dostanú do produkcie

**Výstup:**
```bash
🧪 Spúšťam testy pred pushom...

 ✓ src/test/ageCalculation.test.ts (15 tests)
 ✓ src/test/statistics.test.ts (12 tests)
 ✓ src/test/supabaseClient.test.ts (8 tests)

 Test Files  3 passed (3)
      Tests  35 passed (35)

✅ Všetky testy prešli! Push pokračuje...
```

## Preskočenie hookov (nie je odporúčané!)

Ak naozaj potrebujete preskočiť testy (napr. work-in-progress commit), môžete použiť:

```bash
git push --no-verify
```

**⚠️ Upozornenie:** Toto preskočí všetky kontroly a môže viesť k problémom v produkčnom kóde!

## Riešenie problémov

### Hook sa nespustil

1. Uistite sa, že je hook spustiteľný:
   ```bash
   chmod +x .husky/pre-push
   ```

2. Reinstalujte husky:
   ```bash
   npm run prepare
   ```

### Testy zlyhali

1. Spustite testy lokálne:
   ```bash
   npm test
   ```

2. Opravte chyby v kóde

3. Commitnite opravy a pushnite znova

## Lokálny vývoj

Pri klonovaní projektu sa husky automaticky nastaví pomocou `npm install`, ktorý spustí `prepare` script.

```bash
git clone <repo>
cd newborn-feeding-tracker
npm install  # Automaticky nastaví husky hooks
```

