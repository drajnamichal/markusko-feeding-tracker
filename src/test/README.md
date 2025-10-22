# Unit Tests

Táto aplikácia obsahuje unit testy pre zabezpečenie správnej funkčnosti kľúčových funkcií.

## Spustenie testov

### Spustenie všetkých testov
```bash
npm test
```

### Spustenie testov s UI
```bash
npm run test:ui
```

### Spustenie testov s coverage
```bash
npm run test:coverage
```

## Test súbory

### `supabaseClient.test.ts`
Testuje konverzné funkcie medzi aplikačnými dátovými typmi a databázovým formátom:
- **LogEntry** konverzie (logEntryToDB, dbToLogEntry)
- **BabyProfile** konverzie (babyProfileToDB, dbToBabyProfile)
- **Measurement** konverzie (measurementToDB, dbToMeasurement)
- Round-trip konverzie (data → DB → data)
- Správne mapovanie polí (snake_case ↔ camelCase)

### `tummyTime.test.ts`
Testuje funkcionalitu Tummy Time stopiek a validáciu záznamov:
- **Vytvorenie záznamu** - všetky požadované polia (vrátane sabSimplex, bathing)
- **Formátovanie času** - konverzia sekúnd na "X min Y sek"
- **Databázová konverzia** - bezchybné ukladanie do DB
- **Round-trip konverzia** - data → DB → data pre Tummy Time
- **Validácia polí** - zabezpečenie, že všetky polia sú prítomné
- **Regression test** - ochrana pred chýbajúcimi poľami pri vytváraní záznamov

### `statistics.test.ts`
Testuje výpočty štatistík:
- **Počet kŕmení** - správne počítanie dojčení a kŕmení z fľaše
- **Celkové ml** - súčet materského a umelého mlieka
- **Počty aktivít** - stolica, moč, vracanie, vitamín D, tummy time
- **Filtrovanie dátumov** - dnes, posledných 7 dní
- **Kombinované kŕmenie** - dojčenie + fľaša = 1 záznam

### `ageCalculation.test.ts`
Testuje výpočet veku bábätka:
- **Dni (0-29 dní)** - správne skloňovanie "deň/dni/dní"
- **Mesiace a dni (30+ dní)** - správne skloňovanie "mesiac/mesiace/mesiacov"
- **Edge cases** - rovnaký deň (0 dní), priestupné roky

## Testovací framework

- **Vitest** - rýchly test runner optimalizovaný pre Vite
- **@testing-library/react** - nástroje na testovanie React komponentov
- **@testing-library/jest-dom** - dodatočné matchery pre DOM
- **jsdom** - simulácia browsera v Node.js

### `sleepTracking.test.ts`
Testuje sledovanie spánku:
- **SleepSession** konverzie (sleepSessionToDB, dbToSleepSession)
- **Trvanie spánku** - výpočet minút, hodín
- **Štatistiky spánku** - celkový čas, priemer, najdlhší spánok
- **Prebiehajúce vs. ukončené** spánky

### `reminders.test.ts`
Testuje logiku pripomienok:
- **Vitamín D** - denná pripomienka
- **Tummy Time** - 3x denne
- **Sterilizácia** - každé 2 dni
- **Kúpanie** - každé 2 dni
- **Dátumové výpočty** - dni od poslednej aktivity

### `feedingTime.test.ts`
Testuje výpočty kŕmenia:
- **Posledné kŕmenie** - vyhľadanie najnovšieho
- **Čas od kŕmenia** - hodiny a minúty
- **Ďalšie kŕmenie** - výpočet času + 2h
- **Priemerný interval** - medzi kŕmeniami
- **Notifikácie** - presne po 2 hodinách
- **Detekcia fľašového kŕmenia**

## Štatistiky testov

```
✓ 80 testov passed
✓ 7 test suites
✓ 100% pass rate
```

### Pokrytie:
- ✅ Data conversion functions (supabaseClient, sleep sessions)
- ✅ Statistics calculations
- ✅ Age calculation with Slovak grammar
- ✅ Date filtering
- ✅ Activity counts
- ✅ Sleep tracking and statistics
- ✅ Reminders logic (Vitamin D, Tummy Time, Sterilization, Bathing)
- ✅ Feeding time calculations and notifications
- ✅ Tummy Time stopwatch and entry creation
- ✅ Field validation and regression tests

## Pridanie nových testov

1. Vytvorte nový súbor v `src/test/`
2. Importujte `describe`, `it`, `expect` z `vitest`
3. Napíšte testy:

```typescript
import { describe, it, expect } from 'vitest';

describe('Moja funkcia', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

4. Spustite testy: `npm test`

## CI/CD

Testy sa môžu automaticky spúšťať pri každom push do git repository pomocou GitHub Actions alebo iného CI/CD nástroja.

