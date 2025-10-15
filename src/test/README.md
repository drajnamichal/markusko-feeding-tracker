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

## Štatistiky testov

```
✓ 35 testov passed
✓ 3 test suites
✓ 100% pass rate
```

### Pokrytie:
- ✅ Data conversion functions (supabaseClient)
- ✅ Statistics calculations
- ✅ Age calculation with Slovak grammar
- ✅ Date filtering
- ✅ Activity counts

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

