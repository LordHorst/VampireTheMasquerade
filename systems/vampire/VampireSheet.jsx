import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { SharedData, VampireData, getClanDisciplines } from '../../data/sharedData';
import { useCharacterManager } from '../../hooks/useCharacterManager';
import { SheetControls } from '../../components/ui/SheetControls';
import { FreebiePanel } from '../../components/ui/FreebiePanel';
import { TraitSection } from '../../components/ui/TraitSection';
import { ListTrait } from '../../components/ui/ListTrait';
import { HealthBox } from '../../components/ui/HealthBox';
import { StorageModals } from '../../components/ui/StorageModals';
import { DotRating } from '../../components/ui/DotRating';
import { useFreebies } from '../../hooks/useFreebies';


// Kosten pro Kategorie (werden später im Hook verwendet)
const freebieCosts = {
  attribute: 5,
  ability: 2,
  discipline: 7,
  background: 1,
  virtue: 2,
  humanity: 2,
  willpower: 1,
};

const getEmptyVampire = () => ({
  info: { Name: "", Spieler: "", Chronik: "", Wesen: "", Verhalten: "", Clan: "", Generation: "13", Zuflucht: "", Konzept: "" },
  attributes: {
    körperlich: { Körperkraft: 1, Geschick: 1, Widerstandsfähigkeit: 1 },
    gesellschaftlich: { Charisma: 1, Manipulation: 1, Erscheinungsbild: 1 },
    geistig: { Wahrnehmung: 1, Intelligenz: 1, Geistesschärfe: 1 }
  },
  abilities: {
    talente: { Ausdruck: 0, Aufmerksamkeit: 0, Ausflüchte: 0, Ausweichen: 0, Einschüchtern: 0, Empathie: 0, Führungsqualitäten: 0, Handgemenge: 0, Sportlichkeit: 0, Szenekenntnis: 0 },
    fertigkeiten: { Etikette: 0, Fahren: 0, Handwerk: 0, Heimlichkeit: 0, Nahkampf: 0, Schusswaffen: 0, Sicherheit: 0, Tierkunde: 0, Überleben: 0, Vortrag: 0 },
    kenntnisse: { Akademisches_Wissen: 0, Computer: 0, Finanzen: 0, Gesetzeskenntnis: 0, Linguistik: 0, Medizin: 0, Nachforschungen: 0, Naturwissenschaften: 0, Okkultismus: 0, Politik: 0 }
  },
  advantages: {
    disziplinen: [{ name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }],
    hintergründe: [{ name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }],
    tugenden: { Gewissen: 1, Selbstbeherrschung: 1, Mut: 1 }
  },
  status: { menschlichkeit: 2, willenskraft: 1, blutvorrat: 10, gesundheit: JSON.parse(JSON.stringify(SharedData.initialHealth)) },
  extra: { erfahrung: "", vorzügeSchwächen: [] }
});

// ---------- Hilfsfunktionen für Attribute ----------
const getBonusPoints = (value) => Math.max(0, value - 1);

const calculateGroupBonusPoints = (character) => {
  const attrs = character.attributes;
  const isNosferatu = character.info.Clan === 'Nosferatu';

  const calcGroup = (group) => {
    let sum = 0;
    for (const [name, val] of Object.entries(group)) {
      if (isNosferatu && name === 'Erscheinungsbild') continue;
      sum += getBonusPoints(val);
    }
    return sum;
  };

  return {
    körperlich: calcGroup(attrs.körperlich),
    gesellschaftlich: calcGroup(attrs.gesellschaftlich),
    geistig: calcGroup(attrs.geistig),
  };
};

const getGroupLimits = (bonusPoints) => {
  const sorted = Object.entries(bonusPoints).sort((a, b) => b[1] - a[1]);
  const limits = {
    [sorted[0][0]]: 7, // Primär
    [sorted[1][0]]: 5, // Sekundär
    [sorted[2][0]]: 3, // Tertiär
  };
  return limits;
};

// ---------- Hilfsfunktionen für Fähigkeiten ----------
const calculateAbilityTotals = (character) => {
  const abilities = character.abilities;
  const totals = {};
  for (const [group, fields] of Object.entries(abilities)) {
    let sum = 0;
    for (const val of Object.values(fields)) {
      sum += val;
    }
    totals[group] = sum;
  }
  return totals;
};

const getAbilityLimits = (totals) => {
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const limits = {
    [sorted[0][0]]: 13, // Primär
    [sorted[1][0]]: 9,  // Sekundär
    [sorted[2][0]]: 5,  // Tertiär
  };
  return limits;
};

// ---------- Hilfsfunktionen für Vorteile ----------
const sumDisciplines = (disciplines) => disciplines.reduce((sum, d) => sum + d.value, 0);
const sumBackgrounds = (backgrounds) => backgrounds.reduce((sum, b) => sum + b.value, 0);
const sumVirtues = (virtues) => Object.values(virtues).reduce((sum, v) => sum + v, 0);

export const VampireSheet = () => {
  const mngr = useCharacterManager(getEmptyVampire(), 'vtm');
  const { character, setCharacter, gmMode, updateStat, showToast } = mngr;
  const [showRules, setShowRules] = useState(false);
  const freebie = useFreebies(15, freebieCosts);

  // ---------- Nosferatu-Logik (Erscheinungsbild auf 0) ----------
  useEffect(() => {
    const clan = character.info.Clan;
    const appearanceValue = character.attributes.gesellschaftlich?.Erscheinungsbild;
    
    if (clan === 'Nosferatu') {
      if (appearanceValue !== 0) {
        setCharacter(p => ({
          ...p,
          attributes: {
            ...p.attributes,
            gesellschaftlich: {
              ...p.attributes.gesellschaftlich,
              Erscheinungsbild: 0
            }
          }
        }));
      }
    } else {
      if (appearanceValue === 0) {
        setCharacter(p => ({
          ...p,
          attributes: {
            ...p.attributes,
            gesellschaftlich: {
              ...p.attributes.gesellschaftlich,
              Erscheinungsbild: 1
            }
          }
        }));
      }
    }
  }, [character.info.Clan, character.attributes.gesellschaftlich?.Erscheinungsbild, setCharacter]);

  // ---------- Tugenden → Menschlichkeit & Willenskraft (Mindestwerte) ----------
  useEffect(() => {
    const gewissen = character.advantages.tugenden.Gewissen;
    const selbstbeherrschung = character.advantages.tugenden.Selbstbeherrschung;
    const minHumanity = gewissen + selbstbeherrschung;
    const currentHumanity = character.status.menschlichkeit;
    
    if (currentHumanity < minHumanity) {
      setCharacter(p => ({
        ...p,
        status: { ...p.status, menschlichkeit: minHumanity }
      }));
    }
  }, [character.advantages.tugenden.Gewissen, character.advantages.tugenden.Selbstbeherrschung, character.status.menschlichkeit, setCharacter]);

  useEffect(() => {
    const mut = character.advantages.tugenden.Mut;
    const currentWill = character.status.willenskraft;
    
    if (currentWill < mut) {
      setCharacter(p => ({
        ...p,
        status: { ...p.status, willenskraft: mut }
      }));
    }
  }, [character.advantages.tugenden.Mut, character.status.willenskraft, setCharacter]);

  // ---------- Attribute: Punktestände und Limits ----------
  const bonusPoints = calculateGroupBonusPoints(character);
  const attrLimits = getGroupLimits(bonusPoints);
  const attrGroupStats = {};
  for (const [group, bonus] of Object.entries(bonusPoints)) {
    attrGroupStats[group] = { bonus, limit: attrLimits[group] };
  }

  const validateAndApplyAttributeChange = (cat, name, newValue) => {
    const currentValue = character.attributes[cat][name];
    if (newValue === currentValue) return;

    // Wenn Freebies aktiv, prüfe Kosten
    if (freebie.freebiesActive) {
      const cost = freebie.getCost('attribute', currentValue, newValue);
      if (cost > freebie.freebiePoints) {
        showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
        return;
      }
      updateStat('attributes', cat, name, newValue);
      freebie.spend('attribute', currentValue, newValue);
      return;
    }

    // Normales Limit prüfen
    const testChar = JSON.parse(JSON.stringify(character));
    testChar.attributes[cat][name] = newValue;
    const newBonus = calculateGroupBonusPoints(testChar);
    const newLimits = getGroupLimits(newBonus);
    let valid = true;
    for (const [group, bonus] of Object.entries(newBonus)) {
      if (bonus > newLimits[group]) {
        valid = false;
        break;
      }
    }
    if (valid) {
      updateStat('attributes', cat, name, newValue);
    } else {
      showToast(`Punktelimit überschritten! In "${cat}" dürfen max. ${attrLimits[cat]} Zusatzpunkte vergeben werden.`, 'error');
    }
  };

  // ---------- Fähigkeiten: Punktestände und Limits ----------
  const abilityTotals = calculateAbilityTotals(character);
  const abilityLimits = getAbilityLimits(abilityTotals);
  const abilityGroupStats = {};
  for (const [group, total] of Object.entries(abilityTotals)) {
    abilityGroupStats[group] = { bonus: total, limit: abilityLimits[group] };
  }

  const validateAndApplyAbilityChange = (cat, name, newValue) => {
    const currentValue = character.abilities[cat][name];
    if (newValue === currentValue) return;

    if (freebie.freebiesActive) {
      const cost = freebie.getCost('ability', currentValue, newValue);
      if (cost > freebie.freebiePoints) {
        showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
        return;
      }
      updateStat('abilities', cat, name, newValue);
      freebie.spend('ability', currentValue, newValue);
      return;
    }

    // Normales Limit
    const testChar = JSON.parse(JSON.stringify(character));
    testChar.abilities[cat][name] = newValue;
    const newTotals = calculateAbilityTotals(testChar);
    const newLimits = getAbilityLimits(newTotals);
    let valid = true;
    for (const [group, total] of Object.entries(newTotals)) {
      if (total > newLimits[group]) {
        valid = false;
        break;
      }
    }
    if (valid) {
      updateStat('abilities', cat, name, newValue);
    } else {
      showToast(`Punktelimit überschritten! In "${cat}" dürfen max. ${abilityLimits[cat]} Punkte vergeben werden.`, 'error');
    }
  };

  // ---------- Disziplinen: max 3 Punkte ----------
  const disciplinesTotal = sumDisciplines(character.advantages.disziplinen);
  const handleDisciplinesChange = (index, name, value) => {
    const newList = [...character.advantages.disziplinen];
    if (name !== undefined) newList[index].name = name;
    if (value !== undefined) {
      const oldValue = newList[index].value;
      newList[index].value = value;
      const newTotal = sumDisciplines(newList);

      if (freebie.freebiesActive) {
        const cost = freebie.getCost('discipline', oldValue, value);
        if (cost > freebie.freebiePoints) {
          newList[index].value = oldValue;
          showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
          return;
        }
        setCharacter(p => ({ ...p, advantages: { ...p.advantages, disziplinen: newList } }));
        freebie.spend('discipline', oldValue, value);
      } else {
        // Normales Limit prüfen
        if (newTotal <= 3) {
          setCharacter(p => ({ ...p, advantages: { ...p.advantages, disziplinen: newList } }));
        } else {
          newList[index].value = oldValue;
          showToast(`Maximal 3 Punkte in Disziplinen erlaubt (aktuell ${newTotal}).`, 'error');
        }
      }
    } else {
      setCharacter(p => ({ ...p, advantages: { ...p.advantages, disziplinen: newList } }));
    }
  };

  // ---------- Hintergründe: max 5 Punkte ----------
  const backgroundsTotal = sumBackgrounds(character.advantages.hintergründe);
  const handleBackgroundsChange = (index, name, value) => {
    const newList = [...character.advantages.hintergründe];
    if (name !== undefined) newList[index].name = name;
    if (value !== undefined) {
      const oldValue = newList[index].value;
      newList[index].value = value;
      const newTotal = sumBackgrounds(newList);

      if (freebie.freebiesActive) {
        const cost = freebie.getCost('background', oldValue, value);
        if (cost > freebie.freebiePoints) {
          newList[index].value = oldValue;
          showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
          return;
        }
        setCharacter(p => ({ ...p, advantages: { ...p.advantages, hintergründe: newList } }));
        freebie.spend('background', oldValue, value);
      } else {
        if (newTotal <= 5) {
          setCharacter(p => ({ ...p, advantages: { ...p.advantages, hintergründe: newList } }));
        } else {
          newList[index].value = oldValue;
          showToast(`Maximal 5 Punkte in Hintergründen erlaubt (aktuell ${newTotal}).`, 'error');
        }
      }
    } else {
      setCharacter(p => ({ ...p, advantages: { ...p.advantages, hintergründe: newList } }));
    }
  };

  // ---------- Tugenden: max 7 zusätzliche Punkte (Gesamtsumme max 10) ----------
  const virtuesTotal = sumVirtues(character.advantages.tugenden);
  const virtuesExtra = virtuesTotal - 3; // Punkte über den Grundwerten (1 je Tugend)
  const handleVirtueChange = (name, newValue) => {
    const oldValue = character.advantages.tugenden[name];
    if (newValue === oldValue) return;

    const newVirtues = { ...character.advantages.tugenden, [name]: newValue };
    const newTotal = sumVirtues(newVirtues);

    if (freebie.freebiesActive) {
      const cost = freebie.getCost('virtue', oldValue, newValue);
      if (cost > freebie.freebiePoints) {
        showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
        return;
      }
      setCharacter(p => ({ ...p, advantages: { ...p.advantages, tugenden: newVirtues } }));
      freebie.spend('virtue', oldValue, newValue);
    } else {
      if (newTotal <= 10) {
        setCharacter(p => ({ ...p, advantages: { ...p.advantages, tugenden: newVirtues } }));
      } else {
        showToast(`Maximal 7 zusätzliche Punkte für Tugenden (Gesamt max. 10).`, 'error');
      }
    }
  };

  // ---------- Menschlichkeit & Willenskraft (mit Mindestwerten + Freebies) ----------
  const handleHumanityChange = (newValue) => {
    const current = character.status.menschlichkeit;
    if (newValue === current) return;
    const minHumanity = character.advantages.tugenden.Gewissen + character.advantages.tugenden.Selbstbeherrschung;
    if (newValue < minHumanity) {
      showToast(`Menschlichkeit kann nicht unter ${minHumanity} sinken (Gewissen + Selbstbeherrschung).`, 'error');
      return;
    }
    if (freebie.freebiesActive) {
      const cost = freebie.getCost('humanity', current, newValue);
      if (cost > freebie.freebiePoints) {
        showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
        return;
      }
      setCharacter(p => ({ ...p, status: { ...p.status, menschlichkeit: newValue } }));
      freebie.spend('humanity', current, newValue);
    } else {
      setCharacter(p => ({ ...p, status: { ...p.status, menschlichkeit: newValue } }));
    }
  };

  const handleWillpowerChange = (newValue) => {
    const current = character.status.willenskraft;
    if (newValue === current) return;
    const minWill = character.advantages.tugenden.Mut;
    if (newValue < minWill) {
      showToast(`Willenskraft kann nicht unter ${minWill} sinken (Mut).`, 'error');
      return;
    }
    if (freebie.freebiesActive) {
      const cost = freebie.getCost('willpower', current, newValue);
      if (cost > freebie.freebiePoints) {
        showToast(`Nicht genug Freebies (${cost} benötigt, ${freebie.freebiePoints} verfügbar).`, 'error');
        return;
      }
      setCharacter(p => ({ ...p, status: { ...p.status, willenskraft: newValue } }));
      freebie.spend('willpower', current, newValue);
    } else {
      setCharacter(p => ({ ...p, status: { ...p.status, willenskraft: newValue } }));
    }
  };

  const disabledFields = character.info.Clan === 'Nosferatu' 
    ? { gesellschaftlich: { Erscheinungsbild: true } }
    : {};

  // Optional: Freebies zurücksetzen, wenn neuer Charakter geladen wird
  useEffect(() => {
    freebie.reset(15);
  }, [character.info.Name]); // einfache Erkennung eines neuen Charakters

  return (
    <div className="text-emerald-300 font-serif">
      <SheetControls 
        title="Vampire" 
        subtitle="Die Maskerade" 
        theme="emerald" 
        mngr={mngr}
        freebieState={freebie}
      />

      <div className="border-2 border-emerald-900/50 bg-[#051a11]/95 p-8 shadow-2xl relative">
        <header className="text-center mb-12 border-b border-emerald-900/30 pb-6 relative">
          <h1 className="text-5xl font-bold tracking-[0.2em] text-emerald-500 uppercase mb-2">Vampire</h1>
          <button
            onClick={() => setShowRules(!showRules)}
            className="absolute top-0 right-0 p-2 text-emerald-400 hover:text-emerald-200 transition-colors"
            title="Regeln anzeigen"
          >
            <Info size={20} />
          </button>
        </header>

        {/* Regel‑Infobox */}
        {showRules && (
          <div className="mb-8 p-4 bg-black/60 border border-emerald-800/50 rounded text-xs space-y-2">
            <p><strong>📜 Attribut‑Punkteverteilung</strong><br />
            Jeder Charakter beginnt mit <strong>1 Punkt</strong> in jedem Attribut (Basis).<br />
            Zusätzlich können <strong>7, 5 und 3 Punkte</strong> auf die drei Kategorien (körperlich, gesellschaftlich, geistig) verteilt werden.<br />
            Die Kategorie mit den <strong>meisten Zusatzpunkten</strong> gilt als <strong>Primär</strong> (max. 7 Zusatzpunkte), die zweitmeiste als <strong>Sekundär</strong> (max. 5), die dritte als <strong>Tertiär</strong> (max. 3).<br />
            Die Limits werden automatisch anhand der verteilten Punkte bestimmt – eine Überschreitung wird verhindert.</p>
            <p><strong>⚙️ Fähigkeiten‑Punkteverteilung</strong><br />
            Alle Fähigkeiten starten bei <strong>0</strong>. Die drei Gruppen (Talente, Fertigkeiten, Kenntnisse) erhalten <strong>13, 9 und 5 Punkte</strong> – ebenfalls automatisch nach der höchsten, zweithöchsten und niedrigsten Gesamtpunktzahl zugeordnet.</p>
            <p><strong>✨ Vorteile</strong><br />
            <strong>Disziplinen:</strong> 3 Punkte insgesamt (beliebig auf die drei Disziplinen verteilbar).<br />
            <strong>Hintergründe:</strong> 5 Punkte insgesamt (max. 5 pro Hintergrund).<br />
            <strong>Tugenden:</strong> 7 Punkte zusätzlich zu den Grundwerten 1 (max. 5 pro Tugend, Gesamtsumme max. 10).</p>
            <p><strong>🧛 Nosferatu‑Schwäche</strong><br />
            Der Clan Nosferatu setzt das Attribut <strong>Erscheinungsbild</strong> auf <strong>0</strong>. Dieser Wert zählt <strong>nicht</strong> zu den Punkte‑Limits und kann nicht erhöht werden.</p>
            <p><strong>💖 Menschlichkeit & Willenskraft</strong><br />
            <strong>Menschlichkeit</strong> entspricht mindestens <strong>Gewissen + Selbstbeherrschung</strong>.<br />
            <strong>Willenskraft</strong> entspricht mindestens <strong>Mut</strong>.<br />
            Beide können später durch Freebies erhöht werden, fallen aber nie unter diese Mindestwerte.</p>
            <p><strong>⭐ Freebies</strong><br />
            Aktiviere den <strong>Freebie‑Modus</strong>, um zusätzliche Punkte zu vergeben. Es stehen <strong>15 Freebies</strong> zur Verfügung. Kosten: Attribut 5, Fähigkeit 2, Disziplin 7, Hintergrund 1, Tugend 2, Menschlichkeit 2, Willenskraft 1 pro Punkt.</p>
            <p><em>Die aktuellen Punktestände werden neben den Gruppenüberschriften angezeigt.</em></p>
          </div>
        )}

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-8">
          {Object.entries(character.info).map(([key, val]) => (
            <div key={key} className="flex flex-col border-b border-emerald-900/30">
              <label className="text-[9px] uppercase text-emerald-700 font-bold">{key}</label>
              {key === "Clan" ? (
                <select 
                  value={val} 
                  onChange={(e) => {
                    const newClan = e.target.value;
                    const clanDisciplines = getClanDisciplines(newClan);
                    
                    setCharacter(p => ({
                      ...p, 
                      info: {...p.info, Clan: newClan},
                      advantages: {
                        ...p.advantages, 
                        disziplinen: clanDisciplines.length > 0 
                          ? clanDisciplines.map(d => ({name: d, value: 0})) 
                          : p.advantages.disziplinen
                      }
                    }));
                  }} 
                  className="bg-transparent text-emerald-100 outline-none py-1 cursor-pointer"
                >
                  <option value="" className="bg-black text-emerald-500 italic">Wähle...</option>
                  {Object.entries(VampireData.clans).map(([category, clans]) => (
                    <optgroup key={category} label={category} className="bg-black text-emerald-600 font-bold italic">
                      {Object.keys(clans).map(c => (
                        <option key={c} value={c} className="bg-black text-emerald-100 font-normal not-italic">{c}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <input type="text" value={val} onChange={(e) => setCharacter(p => ({...p, info: {...p.info, [key]: e.target.value}}))} className="bg-transparent outline-none py-1 text-emerald-100" />
              )}
            </div>
          ))}
        </div>

        {/* Attribute */}
        <TraitSection 
          title="Attribute" 
          data={character.attributes} 
          theme="emerald" 
          onChange={validateAndApplyAttributeChange}
          isAttr={true}
          disabledFields={disabledFields}
          groupStats={attrGroupStats}
        />
        
        {/* Fähigkeiten */}
        <TraitSection 
          title="Fähigkeiten" 
          data={character.abilities} 
          theme="emerald" 
          onChange={validateAndApplyAbilityChange}
          groupStats={abilityGroupStats}
        />

        {/* VAMPIRE ADVANTAGES */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-500 text-center py-2 mb-6 bg-emerald-950/20">Vorteile</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <ListTrait 
                block={character.advantages.disziplinen} 
                title={`Disziplinen (${disciplinesTotal}/3)`} 
                theme="emerald" 
                onChange={handleDisciplinesChange}
                max={5}
              />
            </div>
            <div>
              <ListTrait 
                block={character.advantages.hintergründe} 
                title={`Hintergründe (${backgroundsTotal}/5)`} 
                theme="emerald" 
                onChange={handleBackgroundsChange}
                max={5}
              />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-700 uppercase mb-4">Tugenden ({virtuesExtra}/7)</h3>
              {Object.entries(character.advantages.tugenden).map(([name, val]) => (
                <div key={name} className="flex justify-between items-center mb-3">
                  <span className="text-xs">{name}</span>
                  <DotRating 
                    theme="emerald" 
                    value={val} 
                    min={1} 
                    max={5} 
                    onChange={(v) => handleVirtueChange(name, v)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="grid grid-cols-2 gap-12 border-t border-emerald-900/50 pt-8">
          <div className="space-y-8">
            <div className="text-center">
               <h3 className="text-xs text-emerald-700 uppercase font-bold mb-2">Menschlichkeit</h3>
               <div className="flex justify-center">
                 <DotRating 
                   theme="emerald" 
                   value={character.status.menschlichkeit} 
                   max={10} 
                   onChange={handleHumanityChange} 
                 />
               </div>
               <div className="text-[9px] text-emerald-600 mt-1">
                 Min: {character.advantages.tugenden.Gewissen + character.advantages.tugenden.Selbstbeherrschung}
               </div>
            </div>
            <div className="text-center">
               <h3 className="text-xs text-emerald-700 uppercase font-bold mb-2">Willenskraft</h3>
               <div className="flex justify-center">
                 <DotRating 
                   theme="emerald" 
                   value={character.status.willenskraft} 
                   max={10} 
                   onChange={handleWillpowerChange} 
                 />
               </div>
               <div className="text-[9px] text-emerald-600 mt-1">
                 Min: {character.advantages.tugenden.Mut}
               </div>
               <div className="flex justify-center space-x-1.5 mt-2">{[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 border border-emerald-900" />)}</div>
            </div>
            <div className="text-center">
               <h3 className="text-xs text-emerald-700 uppercase font-bold mb-2">Blutvorrat</h3>
              <div className="flex justify-center space-x-1.5 flex-wrap px-8 gap-y-2">
                {[...Array(20)].map((_, i) => (
                  <React.Fragment key={i}>
                    <div
                      onClick={i < 10 ? () => setCharacter(p => ({...p, status: {...p.status, blutvorrat: i+1}})) : undefined}
                      className={`w-5 h-5 border border-emerald-900 ${i < character.status.blutvorrat ? 'bg-emerald-700' : ''} ${i < 10 ? 'cursor-pointer' : 'cursor-default'}`}
                    />
                    {i % 10 === 9 && <div key={`break-${i}`} className="w-full"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <HealthBox health={character.status.gesundheit} theme="emerald" setCharacter={setCharacter} />
        </section>
      </div>
      <StorageModals mngr={mngr} theme="emerald" />
    </div>
  );
};