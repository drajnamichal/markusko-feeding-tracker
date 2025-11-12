# Databázové migrácie

## Ako spustiť migrácie v Supabase

Keď pridávame nové polia do databázy, musíme spustiť migračné SQL skripty v Supabase.

### Postup:

1. **Prihláste sa do Supabase Dashboard**
   - Otvorte [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Vyberte váš projekt

2. **Otvorte SQL Editor**
   - V ľavom menu kliknite na `SQL Editor`
   - Alebo priamo: `https://supabase.com/dashboard/project/[PROJECT_ID]/sql/new`

3. **Spustite migračné skripty**
   - Skopírujte obsah každého SQL súboru zo zložky `supabase-migrations/`
   - Vložte ho do SQL Editora
   - Kliknite na `Run` alebo stlačte `Ctrl+Enter` / `Cmd+Enter`

### Aktuálne nevykonané migrácie:

Ak dostávate chybu "Chyba pri pridávaní záznamu", pravdepodobne chýbajú tieto migrácie:

#### 1. Vitamin C pole
```sql
-- Súbor: supabase-migrations/add_vitamin_c_field.sql
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS vitamin_c BOOLEAN NOT NULL DEFAULT FALSE;
```

#### 2. Probiotic pole
```sql
-- Súbor: supabase-migrations/add_probiotic_field.sql
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS probiotic BOOLEAN NOT NULL DEFAULT FALSE;
```

### Overenie úspešného spustenia:

Po spustení migrácií môžete overiť, že stĺpce boli pridané:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'log_entries'
ORDER BY ordinal_position;
```

Mali by ste vidieť stĺpce `vitamin_c` a `probiotic` typu `boolean`.

### Alternatívne: Spustenie všetkých migrácií naraz

Ak chcete spustiť všetky migrácie naraz, môžete skopírovať tento SQL:

```sql
-- Add vitamin_c field
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS vitamin_c BOOLEAN NOT NULL DEFAULT FALSE;

-- Add probiotic field
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS probiotic BOOLEAN NOT NULL DEFAULT FALSE;
```

## Časté problémy

### "Chyba pri pridávaní záznamu"
- **Príčina**: Databáza nemá potrebné stĺpce
- **Riešenie**: Spustite vyššie uvedené migrácie

### "column does not exist"
- **Príčina**: Migrácie neboli spustené alebo zlyhali
- **Riešenie**: Overte v SQL Editore, či existujú potrebné stĺpce

### Migrácie pri vývoji nových funkcií

Pri pridávaní nových boolean polí do `LogEntry`:

1. Pridajte pole do `types.ts` (`LogEntry` interface)
2. Pridajte pole do `supabaseClient.ts` (`LogEntryDB` interface a mapovanie)
3. Vytvorte migračný SQL súbor v `supabase-migrations/`
4. Spustite migráciu v Supabase Dashboard
5. Aktualizujte komponenty (`EntryForm.tsx`, `LogList.tsx`, atď.)
6. Napíšte testy pre novú funkcionalitu

## Automatizácia migrácií (budúcnosť)

V budúcnosti môžeme zvážiť:
- Použitie Supabase CLI pre automatické migrácie
- GitHub Actions pre automatické nasadenie migrácií
- Version control pre databázovú schému

