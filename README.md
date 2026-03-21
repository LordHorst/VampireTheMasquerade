# White Wolf Editor

Ein moderner **World of Darkness** Charakterbogen-Editor, entwickelt mit React und Tailwind CSS. Unterstützt drei klassische WoD-Systeme mit authentischem Dark Gothic Design.

## 🎭 Features

- **Drei Spielsysteme:**
  - 🧛 **Vampire: The Masquerade** - Vollständige Charaktererstellung mit Clan-spezifischen Disziplinen
  - 🐺 **Werewolf: The Apocalypse** - Stamm-, Vorzeichen- und Rassen-Auswahl
  - 🔮 **Mage: The Ascension** - Traditionen und Sphären-System

- **Intelligente Charaktererstellung:**
  - Automatische Punkteverteilung nach WoD-Regeln
  - Freebie-Point-System für Anpassungen
  - Clan-spezifische Beschränkungen (z.B. Nosferatu)
  - Validierung von Attribut- und Fähigkeitslimits

- **Persistente Speicherung:**
  - Lokaler Browser-Speicher für bis zu 10 Charaktere pro System
  - JSON Import/Export für Backup und Sharing
  - Automatische Speicher-Verwaltung

## 🚀 Installation

```shell script
# Repository klonen
git clone [repository-url]
cd white-wolf-editor

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```


## 🎲 Spielsystem-Details

### Vampire: The Masquerade
- **15 Clans** aus Camarilla, Sabbat und Unabhängigen
- Automatische Disziplinen-Zuordnung
- Nosferatu-Schwäche (Erscheinungsbild = 0)
- Tugenden → Menschlichkeit/Willenskraft-Berechnung
- Blutvorrat-Tracking

### Werewolf: The Apocalypse
- **13 Stämme** mit individuellen Eigenschaften
- **5 Vorzeichen** (Ragabash bis Ahroun)
- **3 Rassen** (Homid, Metis, Lupus)
- Gaben-System mit variablen Stufen
- Renown-Tracking (Ruhm, Ehre, Weisheit)

### Mage: The Ascension
- **9 Traditionen** der Magier
- **4 Essenzen** (Dynamisch, Muster, etc.)
- **9 Sphären** der Magie
- Arete und Quintessenz/Paradox-System

## 🎨 Design-Features

- **Responsive Design** für Desktop und Mobile
- **System-spezifische Farbthemen:**
  - Vampire: Smaragdgrün
  - Werewolf: Bernstein
  - Mage: Violett
- **Gothic UI** mit Custom Fonts
- **Smooth Transitions** und Hover-Effekte

## 🛠️ Technologie-Stack

- **React 18** mit Hooks und Context
- **Tailwind CSS** für Styling
- **Lucide React** für Icons
- **Vite** als Build-Tool
- **localStorage** für Persistierung

## 📱 Nutzung

1. **System wählen:** Hamburger-Menü öffnen und gewünschtes System auswählen
2. **Charakter erstellen:** Grunddaten eingeben und Punkte nach WoD-Regeln verteilen
3. **Freebies nutzen:** Optional 15 Freebie-Points für Anpassungen verwenden
4. **Speichern:** Lokal speichern oder als JSON exportieren

## 🔧 Konfiguration

Das Projekt verwendet Standard-Vite-Konfiguration. Anpassungen in:
- `vite.config.js` - Build-Einstellungen
- `tailwind.config.js` - Design-System
- `src/data/sharedData.js` - Spieldaten

## 🤝 Beitragen

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` Datei für Details.

Alle Rechte an der **World of Darkness** liegen bei **Paradox Interactive**. Dieses Projekt ist ein Fan-Tool und nicht offiziell lizenziert.
