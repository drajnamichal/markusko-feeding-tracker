# 🩺 AI Doktor - Návod na použitie

## Prehľad
AI Doktor je inteligentný asistent integrovaný do aplikácie na sledovanie novorodenca, ktorý poskytuje analýzu zdravotného stavu dieťaťa pomocou OpenAI GPT-4 technológie.

## Funkcie

### 🎯 Hlavné funkcie
- **Analýza zdravotného stavu**: Vyhodnotenie celkového zdravia dieťaťa na základe všetkých zaznamenaných údajov
- **Analýza kŕmenia**: Posúdenie príjmu mlieka, frekvencie kŕmenia a odporúčania
- **Analýza spánku**: Vyhodnotenie spánkových návykov a kvalitu spánku
- **Váhový a rastový vývoj**: Porovnanie váhového a výškového prírastku s odporúčanými hodnotami
- **Personalizované rady**: Konkrétne odporúčania na základe veku a stavu dieťaťa

### 📊 Dáta ktoré AI Doktor analyzuje
- Profil dieťaťa (meno, dátum narodenia, váha a výška pri narodení)
- Aktuálne miery (posledné meranie váhy a výšky)
- História kŕmenia (dojčenie, materské a umelé mlieko)
- Spánkové záznamy (dĺžka spánku, počet relácií)
- Vyprázdňovanie (stolica, moč)
- Ďalšie aktivity (tummy time, kúpanie, lieky)

## Nastavenie

### 1️⃣ Získanie OpenAI API kľúča

1. Navštívte [platform.openai.com](https://platform.openai.com/api-keys)
2. Prihláste sa alebo vytvorte nový účet
3. Prejdite do sekcie "API Keys"
4. Kliknite na "Create new secret key"
5. Pomenujte kľúč (napr. "Baby Tracker AI Doctor")
6. Skopírujte vygenerovaný kľúč (začína na `sk-...`)

⚠️ **Dôležité**: API kľúč si uložte na bezpečné miesto! Po zatvorení okna ho už nebudete môcť znovu vidieť.

### 2️⃣ Vloženie API kľúča do aplikácie

1. Otvorte aplikáciu
2. Kliknite na menu (☰) v pravom hornom rohu
3. Vyberte "AI Doktor"
4. Do poľa vložte váš OpenAI API kľúč
5. Kliknite na "Uložiť a pokračovať"

🔒 **Bezpečnosť**: API kľúč sa ukladá len lokálne vo vašom prehliadači a nikdy sa neposiela na iný server okrem OpenAI.

## Použitie

### 💬 Spustenie konverzácie

Po prvom otvorení AI Doktora sa zobrazí úvodná obrazovka s navrhovanými otázkami:

- **Posúdiť zdravotný stav**: Komplexná analýza zdravia dieťaťa
- **Analyzovať kŕmenie**: Vyhodnotenie príjmu mlieka a frekvencie kŕmenia
- **Spánkové návyky**: Posúdenie kvality a dĺžky spánku
- **Váhový prírastok**: Kontrola, či dieťa rastie správne

### 📝 Príklady otázok

```
✅ Dobre formulované otázky:
- "Môžete mi prosím posúdiť celkový zdravotný stav môjho dieťaťa?"
- "Je kŕmenie môjho dieťaťa dostatočné?"
- "Moje dieťa veľa zvracia. Je to normálne?"
- "Spí moje dieťa dosť hodín denne?"
- "Váhový prírastok je v poriadku?"
- "Ako často by malo mať stolicu?"
- "Koľko by malo prijať mlieka za deň?"
```

### 🎯 Tipy pre efektívnu komunikáciu

1. **Buďte konkrétni**: Pýtajte sa na konkrétne oblasti (kŕmenie, spánok, stolica...)
2. **Uveďte symptómy**: Ak pozorujete niečo nezvyčajné, opíšte to
3. **Nadviažte na predošlé odpovede**: AI si pamätá celú konverzáciu
4. **Požiadajte o vysvetlenie**: Ak niečomu nerozumiete, pýtajte sa ďalej

## Ceny a náklady

### 💰 Náklady na API

OpenAI účtuje za použitie API na základe počtu tokenov (slov):

- **Model GPT-4o-mini** (používaný v aplikácii):
  - Input: ~$0.15 / 1M tokenov
  - Output: ~$0.60 / 1M tokenov

### 📊 Odhad nákladov

- **1 krátka otázka + odpoveď**: ~$0.001 - $0.003 (0.07 - 0.21 Sk)
- **10 otázok**: ~$0.01 - $0.03 (0.70 - 2.10 Sk)
- **100 otázok**: ~$0.10 - $0.30 (7 - 21 Sk)

💡 **Tip**: Začnite s malým kreditom (~$5) a sledujte spotrebu na [platform.openai.com/usage](https://platform.openai.com/usage)

## Bezpečnosť a súkromie

### 🔒 Ochrana údajov

- ✅ API kľúč sa ukladá **len lokálne** v prehliadači
- ✅ Dáta sa posielajú **priamo na OpenAI** (nie cez náš server)
- ✅ OpenAI **neuchováva** dáta pre tréning modelov (pri API použití)
- ✅ Môžete **kedykoľvek odstrániť** API kľúč z aplikácie

### ⚠️ Dôležité upozornenia

1. **AI nie je lekár**: Rady sú len informatívneho charakteru
2. **Vážne symptómy**: Pri akýchkoľvek vážnych príznakoch kontaktujte pediatra
3. **Nezávažné situácie**: Nepoužívajte v núdzových situáciách
4. **Overenie**: Dôležité rady si overte s reálnym lekárom

## Časté otázky (FAQ)

### ❓ Je AI Doktor spoľahlivý?
AI Doktor je postavený na najmodernejšej GPT-4 technológii a poskytuje rady založené na všeobecných lekárskych znalostí. Je však **len informatívny nástroj** a nenahradí reálneho pediatra.

### ❓ Aké dáta AI vidí?
AI má prístup k všetkým dátam zaznamenaným v aplikácii:
- Profil dieťaťa
- Posledných 20 záznamov kŕmenia a aktivít
- Posledných 10 spánkových relácií
- História meraní
- Denné štatistiky

### ❓ Môžem používať AI Doktor offline?
Nie, AI Doktor vyžaduje pripojenie na internet pre komunikáciu s OpenAI API.

### ❓ Čo ak API kľúč prestane fungovať?
1. Skontrolujte kredit na vašom OpenAI účte
2. Overte, že kľúč nebol deaktivovaný
3. Skúste vygenerovať nový kľúč
4. V aplikácii kliknite na ikonu kľúča (🔑) a zadajte nový

### ❓ Môžem zdieľať môj API kľúč?
**NIE!** API kľúč je osobný a nemal by sa zdieľať. Každý, kto má prístup k vášmu kľúču, môže ho používať a vy budete platiť za ich použitie.

### ❓ Ako vymažem históriu konverzácie?
Kliknite na ikonu koša (🗑️) v pravom hornom rohu AI Doktor okna.

### ❓ Ako odstránim API kľúč?
Kliknite na ikonu kľúča (🔑) v pravom hornom rohu a kľúč bude odstránený z prehliadača.

## Riešenie problémov

### 🚨 Chybové hlásenia

#### "Chyba: Invalid API key"
- ✅ Skontrolujte, či ste správne skopírovali API kľúč
- ✅ Overte, že kľúč začína na `sk-`
- ✅ Skontrolujte, či kľúč nebol deaktivovaný na OpenAI platforme

#### "Chyba: Insufficient quota"
- ✅ Doplňte kredit na vašom OpenAI účte
- ✅ Skontrolujte si spotrebu na [platform.openai.com/usage](https://platform.openai.com/usage)

#### "Chyba: Rate limit exceeded"
- ✅ Počkajte chvíľu a skúste znova (príliš veľa požiadaviek v krátkom čase)

## Podpora

Pri problémoch alebo otázkach:
1. Prečítajte si tento návod
2. Skontrolujte FAQ sekciu
3. Navštívte [OpenAI dokumentáciu](https://platform.openai.com/docs)

---

**Verzia**: 1.0  
**Posledná aktualizácia**: Október 2025  
**Model**: GPT-4o-mini

