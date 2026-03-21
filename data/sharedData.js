export const SharedData = {
  firstNames: ["Viktor", "Elena", "Julian", "Sophia", "Marcus", "Clara", "Dimitri", "Isabel", "Arthur", "Lilith"],
  lastNames: ["Vane", "Dragos", "Blackwood", "Holloway", "Moretti", "Crowley", "Sterling", "Nightshade", "Petrov"],
  concepts: ["Außenseiter", "Drifter", "Gefallener Adeliger", "Künstler", "Okultist", "Privatdetektiv", "Söldner", "Gelehrter"],
  natures: ["Architekt", "Autokrat", "Einzelgänger", "Fanatiker", "Kapitalist", "Kind", "Rebell", "Überlebender", "Visionär"],
  initialHealth: [
    { label: "Blaue Flecken", penalty: 0, checked: false },
    { label: "Verletzt", penalty: -1, checked: false },
    { label: "Schwer Verletzt", penalty: -1, checked: false },
    { label: "Verwundet", penalty: -2, checked: false },
    { label: "Schwer Verwundet", penalty: -2, checked: false },
    { label: "Verkrüppelt", penalty: -5, checked: false },
    { label: "Außer Gefecht", penalty: "X", checked: false }
  ]
};

export const VampireData = {
  clans: {
    "Camarilla": {
      "Brujah": ["Geschwindigkeit", "Stärke", "Präsenz"],
      "Gangrel": ["Tierhaftigkeit", "Seelenstärke", "Gestaltwandel"],
      "Malkavianer": ["Auspex", "Irrsinn", "Verdunkelung"],
      "Nosferatu": ["Tierhaftigkeit", "Verdunkelung", "Stärke"],
      "Toreador": ["Auspex", "Geschwindigkeit", "Präsenz"],
      "Tremere": ["Auspex", "Beherrschung", "Thaumaturgie"],
      "Ventrue": ["Beherrschung", "Präsenz", "Seelenstärke"]
    },
    "Sabbat": {
      "Lasombra": ["Beherrschung", "Schattenspiele", "Stärke"],
      "Tzimisce": ["Auspex", "Fleischformen", "Tierhaftigkeit"]
    },
    "Unabhängige": {
      "Assamiten": ["Geschwindigkeit", "Verdunkelung", "Quietus"],
      "Giovanni": ["Beherrschung", "Nekromantie", "Stärke"],
      "Jünger des Seth": ["Präsenz", "Serpentis", "Verdunkelung"],
      "Ravnos": ["Seelenstärke", "Schimären", "Tierhaftigkeit"]
    },
    "Sonstige": {
      "Caitiff": [], // Keine festen Disziplinen
      "Pander": []   // Keine festen Disziplinen (Sabbat)
    }
  }
};

// Hilfsfunktion, um die Disziplinen eines Clans zu finden, egal in welcher Kategorie er steckt
export const getClanDisciplines = (clanName) => {
  for (const category in VampireData.clans) {
    if (VampireData.clans[category][clanName]) {
      return VampireData.clans[category][clanName];
    }
  }
  return [];
};

export const WerewolfData = {
  tribes: ["Black Furies", "Bone Gnawers", "Children of Gaia", "Fianna", "Get of Fenris", "Glass Walkers", "Red Talons", "Shadow Lords", "Silent Striders", "Silver Fangs", "Stargazers", "Uktena", "Wendigo"],
  auspices: ["Ragabash", "Theurge", "Philodox", "Galliard", "Ahroun"],
  breeds: ["Homid", "Metis", "Lupus"]
};

export const MageData = {
  traditions: ["Akashic Brotherhood", "Celestial Chorus", "Cult of Ecstasy", "Dreamspeakers", "Euthanatos", "Order of Hermes", "Sons of Ether", "Verbena", "Virtual Adepts"],
  essences: ["Dynamisch", "Muster", "Primordial", "Suchend"],
  spheres: ["Entropie", "Geist", "Kräfte", "Leben", "Materie", "Gedanken", "Kern", "Verbindung", "Zeit"]
};