# Generovanie ikon pre PWA

## 🎨 Potrebujete vytvoriť ikony v týchto veľkostiach:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## ⚡ Rýchly spôsob - Online generátor:

### Možnosť 1: PWA Asset Generator
1. Choďte na: https://www.pwabuilder.com/imageGenerator
2. Nahrajte váš obrázok (512x512px alebo väčší)
3. Stiahnite vygenerované ikony
4. Skopírujte do tohto adresára

### Možnosť 2: RealFaviconGenerator
1. Choďte na: https://realfavicongenerator.net/
2. Nahrajte váš obrázok
3. Vygenerujte ikony
4. Stiahnite package
5. Skopírujte ikony do tohto adresára

### Možnosť 3: ImageMagick (lokálne)
Ak máte ImageMagick nainštalovaný:

```bash
# Z jedného source obrázka (napr. icon.png)
convert icon.png -resize 72x72 icon-72x72.png
convert icon.png -resize 96x96 icon-96x96.png
convert icon.png -resize 128x128 icon-128x128.png
convert icon.png -resize 144x144 icon-144x144.png
convert icon.png -resize 152x152 icon-152x152.png
convert icon.png -resize 192x192 icon-192x192.png
convert icon.png -resize 384x384 icon-384x384.png
convert icon.png -resize 512x512 icon-512x512.png
```

## 🎨 Odporúčanie pre design:

- **Pozadie:** Farba #14b8a6 (teal) alebo gradient
- **Ikona:** 👶 emoji alebo vlastný design
- **Štýl:** Zaoblené rohy (iOS style)
- **Text:** "M" alebo "👶" alebo meno bábätka

## 🚀 Quick Fix - Dočasné ikony:

Vytvorte jednoduchý PNG obrázok 512x512px s emoji 👶 na teal pozadí.
Potom použite online generátor na vytvorenie všetkých veľkostí.

## 📱 Pre iPhone:

iPhone potrebuje najmä:
- icon-152x152.png (iPad)
- icon-180x180.png (iPhone)
- icon-192x192.png (fallback)

Všetky ikony by mali byť **bez priehľadného pozadia** (iOS nepodporuje transparenciu pre app ikony).

