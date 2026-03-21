import React from 'react';
import { SharedData, WerewolfData } from '../../data/sharedData';
import { useCharacterManager } from '../../hooks/useCharacterManager';
import { SheetControls } from '../../components/ui/SheetControls';
import { TraitSection } from '../../components/ui/TraitSection';
import { ListTrait } from '../../components/ui/ListTrait';
import { HealthBox } from '../../components/ui/HealthBox';
import { StorageModals } from '../../components/ui/StorageModals';
import { DotRating } from '../../components/ui/DotRating';

const getEmptyWerewolf = () => ({
  info: { Name: "", Spieler: "", Chronik: "", Rasse: "", Vorzeichen: "", Stamm: "", Rudel: "", Totem: "", Konzept: "" },
  attributes: {
    körperlich: { Körperkraft: 1, Geschick: 1, Widerstandsfähigkeit: 1 },
    gesellschaftlich: { Charisma: 1, Manipulation: 1, Erscheinungsbild: 1 },
    geistig: { Wahrnehmung: 1, Intelligenz: 1, Geistesschärfe: 1 }
  },
  abilities: {
    talente: { Aufmerksamkeit: 0, Ausflüchte: 0, Ausweichen: 0, Einschüchtern: 0, Empathie: 0, Führungsqualitäten: 0, Handgemenge: 0, Instinkte: 0, Sportlichkeit: 0, Szenekenntnis: 0 },
    fertigkeiten: { Etikette: 0, Fahren: 0, Handwerk: 0, Heimlichkeit: 0, Nahkampf: 0, Schusswaffen: 0, Tierkunde: 0, Überleben: 0, Vortrag: 0 },
    kenntnisse: { Akademisches_Wissen: 0, Computer: 0, Enigmas: 0, Gesetzeskenntnis: 0, Linguistik: 0, Medizin: 0, Nachforschungen: 0, Naturwissenschaften: 0, Okkultismus: 0, Riten: 0 }
  },
  advantages: {
    gaben: [{ name: "", value: 1 }, { name: "", value: 1 }, { name: "", value: 1 }],
    hintergründe: [{ name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }],
    renown: { Ruhm: 0, Ehre: 0, Weisheit: 0 }
  },
  status: { zorn: 1, gnosis: 1, willenskraft: 1, gesundheit: JSON.parse(JSON.stringify(SharedData.initialHealth)) },
});

export const WerewolfSheet = () => {
  const mngr = useCharacterManager(getEmptyWerewolf(), 'wta');
  const { character, setCharacter, gmMode, updateStat } = mngr;

  return (
    <div className="text-amber-300 font-serif">
      <SheetControls title="Werewolf" subtitle="The Apocalypse" theme="amber" mngr={mngr} />

      <div className="border-2 border-amber-900/50 bg-[#0a0502]/95 p-8 shadow-2xl relative">
        <header className="text-center mb-12 border-b border-amber-900/30 pb-6">
          <h1 className="text-5xl font-bold tracking-[0.2em] text-amber-600 uppercase mb-2">Werewolf</h1>
        </header>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-8">
          {Object.entries(character.info).map(([key, val]) => (
            <div key={key} className="flex flex-col border-b border-amber-900/30">
              <label className="text-[9px] uppercase text-amber-700 font-bold">{key}</label>
              {key === "Stamm" || key === "Vorzeichen" || key === "Rasse" ? (
                <select value={val} onChange={(e) => setCharacter(p => ({...p, info: {...p.info, [key]: e.target.value}}))} className="bg-transparent text-amber-100 outline-none py-1 cursor-pointer">
                  <option value="" className="bg-black text-amber-500">Wähle...</option>
                  {(key === "Stamm" ? WerewolfData.tribes : key === "Vorzeichen" ? WerewolfData.auspices : WerewolfData.breeds).map(c => <option key={c} value={c} className="bg-black text-amber-100">{c}</option>)}
                </select>
              ) : (
                <input type="text" value={val} onChange={(e) => setCharacter(p => ({...p, info: {...p.info, [key]: e.target.value}}))} className="bg-transparent outline-none py-1 text-amber-100" />
              )}
            </div>
          ))}
        </div>

        <TraitSection title="Attribute" data={character.attributes} theme="amber" gmMode={gmMode} onChange={(cat, name, v) => updateStat('attributes', cat, name, v)} isAttr={true} />
        <TraitSection title="Fähigkeiten" data={character.abilities} theme="amber" gmMode={gmMode} onChange={(cat, name, v) => updateStat('abilities', cat, name, v)} />

        {/* WEREWOLF ADVANTAGES */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-amber-600 text-center py-2 mb-6 bg-amber-950/20">Vorteile</h2>
          <div className="grid grid-cols-3 gap-8">
            <ListTrait block={character.advantages.gaben} title="Gaben" theme="amber" max={5}
              onChange={(i, name, v) => {
                const nl = [...character.advantages.gaben];
                if(name !== undefined) nl[i].name = name;
                if(v !== undefined) nl[i].value = v;
                setCharacter(p => ({...p, advantages: {...p.advantages, gaben: nl}}));
              }} />
            <ListTrait block={character.advantages.hintergründe} title="Hintergründe" theme="amber" 
              onChange={(i, name, v) => {
                const nl = [...character.advantages.hintergründe];
                if(name !== undefined) nl[i].name = name;
                if(v !== undefined) nl[i].value = v;
                setCharacter(p => ({...p, advantages: {...p.advantages, hintergründe: nl}}));
              }} />
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase mb-4">Renown</h3>
              {Object.entries(character.advantages.renown).map(([name, val]) => (
                <div key={name} className="flex justify-between items-center mb-3">
                  <span className="text-xs">{name}</span>
                  <DotRating theme="amber" value={val} max={10} onChange={(v) => setCharacter(p => ({...p, advantages: {...p.advantages, renown: {...p.advantages.renown, [name]: v}}}))} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="grid grid-cols-2 gap-12 border-t border-amber-900/50 pt-8">
          <div className="space-y-6">
             {["Zorn", "Gnosis", "Willenskraft"].map(stat => (
               <div key={stat} className="text-center">
                 <h3 className="text-xs text-amber-700 uppercase font-bold mb-2">{stat}</h3>
                 <div className="flex justify-center"><DotRating theme="amber" value={character.status[stat.toLowerCase()]} max={10} onChange={v => setCharacter(p=>({...p, status: {...p.status, [stat.toLowerCase()]: v}}))} /></div>
                 <div className="flex justify-center space-x-1.5 mt-2">{[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 border border-amber-900" />)}</div>
               </div>
             ))}
          </div>
          <HealthBox health={character.status.gesundheit} theme="amber" setCharacter={setCharacter} />
        </section>
      </div>
      <StorageModals mngr={mngr} theme="amber" />
    </div>
  );
};