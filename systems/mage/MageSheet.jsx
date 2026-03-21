import React from 'react';
import { SharedData, MageData } from '../../data/sharedData';
import { useCharacterManager } from '../../hooks/useCharacterManager';
import { SheetControls } from '../../components/ui/SheetControls';
import { TraitSection } from '../../components/ui/TraitSection';
import { ListTrait } from '../../components/ui/ListTrait';
import { HealthBox } from '../../components/ui/HealthBox';
import { StorageModals } from '../../components/ui/StorageModals';
import { DotRating } from '../../components/ui/DotRating';

const getEmptyMage = () => ({
  info: { Name: "", Spieler: "", Chronik: "", Wesen: "", Verhalten: "", Tradition: "", Essenz: "", Konzept: "", Kabale: "" },
  attributes: {
    körperlich: { Körperkraft: 1, Geschick: 1, Widerstandsfähigkeit: 1 },
    gesellschaftlich: { Charisma: 1, Manipulation: 1, Erscheinungsbild: 1 },
    geistig: { Wahrnehmung: 1, Intelligenz: 1, Geistesschärfe: 1 }
  },
  abilities: {
    talente: { Aufmerksamkeit: 0, Ausflüchte: 0, Ausweichen: 0, Bewusstsein: 0, Einschüchtern: 0, Empathie: 0, Führungsqualitäten: 0, Handgemenge: 0, Sportlichkeit: 0, Szenekenntnis: 0 },
    fertigkeiten: { Etikette: 0, Fahren: 0, Handwerk: 0, Heimlichkeit: 0, Meditation: 0, Nahkampf: 0, Schusswaffen: 0, Technologie: 0, Überleben: 0 },
    kenntnisse: { Akademisches_Wissen: 0, Computer: 0, Enigmas: 0, Gesetzeskenntnis: 0, Kosmologie: 0, Linguistik: 0, Medizin: 0, Naturwissenschaften: 0, Okkultismus: 0 }
  },
  advantages: {
    sphären: MageData.spheres.reduce((acc, curr) => ({...acc, [curr]: 0}), {}),
    hintergründe: [{ name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }, { name: "", value: 0 }],
  },
  status: { arete: 1, willenskraft: 1, quintessenz: 5, paradox: 0, gesundheit: JSON.parse(JSON.stringify(SharedData.initialHealth)) },
});

export const MageSheet = () => {
  const mngr = useCharacterManager(getEmptyMage(), 'mta');
  const { character, setCharacter, gmMode, updateStat } = mngr;

  return (
    <div className="text-purple-300 font-serif">
      <SheetControls title="Mage" subtitle="The Ascension" theme="purple" mngr={mngr} />

      <div className="border-2 border-purple-900/50 bg-[#060208]/95 p-8 shadow-2xl relative">
        <header className="text-center mb-12 border-b border-purple-900/30 pb-6">
          <h1 className="text-5xl font-bold tracking-[0.2em] text-purple-500 uppercase mb-2">Mage</h1>
        </header>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-8">
          {Object.entries(character.info).map(([key, val]) => (
            <div key={key} className="flex flex-col border-b border-purple-900/30">
              <label className="text-[9px] uppercase text-purple-700 font-bold">{key}</label>
              {key === "Tradition" || key === "Essenz" ? (
                <select value={val} onChange={(e) => setCharacter(p => ({...p, info: {...p.info, [key]: e.target.value}}))} className="bg-transparent text-purple-100 outline-none py-1 cursor-pointer">
                  <option value="" className="bg-black text-purple-500">Wähle...</option>
                  {(key === "Tradition" ? MageData.traditions : MageData.essences).map(c => <option key={c} value={c} className="bg-black text-purple-100">{c}</option>)}
                </select>
              ) : (
                <input type="text" value={val} onChange={(e) => setCharacter(p => ({...p, info: {...p.info, [key]: e.target.value}}))} className="bg-transparent outline-none py-1 text-purple-100" />
              )}
            </div>
          ))}
        </div>

        <TraitSection title="Attribute" data={character.attributes} theme="purple" gmMode={gmMode} onChange={(cat, name, v) => updateStat('attributes', cat, name, v)} isAttr={true} />
        <TraitSection title="Fähigkeiten" data={character.abilities} theme="purple" gmMode={gmMode} onChange={(cat, name, v) => updateStat('abilities', cat, name, v)} />

        {/* MAGE ADVANTAGES */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-purple-500 text-center py-2 mb-6 bg-purple-950/20">Vorteile</h2>
          <div className="grid grid-cols-2 gap-12">
            <div>
               <h3 className="text-xs font-bold text-purple-700 uppercase mb-4 text-center">Sphären</h3>
               <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                 {Object.entries(character.advantages.sphären).map(([name, val]) => (
                    <div key={name} className="flex justify-between items-center">
                      <span className="text-xs">{name}</span>
                      <DotRating theme="purple" value={val} onChange={(v) => setCharacter(p => ({...p, advantages: {...p.advantages, sphären: {...p.advantages.sphären, [name]: v}}}))} />
                    </div>
                 ))}
               </div>
            </div>
            <div>
              <ListTrait block={character.advantages.hintergründe} title="Hintergründe" theme="purple" 
                onChange={(i, name, v) => {
                  const nl = [...character.advantages.hintergründe];
                  if(name !== undefined) nl[i].name = name;
                  if(v !== undefined) nl[i].value = v;
                  setCharacter(p => ({...p, advantages: {...p.advantages, hintergründe: nl}}));
                }} />
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="grid grid-cols-2 gap-12 border-t border-purple-900/50 pt-8">
          <div className="space-y-6">
             <div className="text-center">
               <h3 className="text-xs text-purple-700 uppercase font-bold mb-2">Arete</h3>
               <div className="flex justify-center"><DotRating theme="purple" value={character.status.arete} max={10} onChange={v => setCharacter(p=>({...p, status: {...p.status, arete: v}}))} /></div>
             </div>
             <div className="text-center">
               <h3 className="text-xs text-purple-700 uppercase font-bold mb-2">Willenskraft</h3>
               <div className="flex justify-center"><DotRating theme="purple" value={character.status.willenskraft} max={10} onChange={v => setCharacter(p=>({...p, status: {...p.status, willenskraft: v}}))} /></div>
               <div className="flex justify-center space-x-1.5 mt-2">{[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 border border-purple-900" />)}</div>
             </div>
             <div className="text-center">
               <h3 className="text-xs text-purple-700 uppercase font-bold mb-2">Quintessenz / Paradox</h3>
               <div className="flex justify-center items-center space-x-4">
                 <div className="text-right">
                    <span className="text-[10px] uppercase text-purple-400">Quintessenz</span>
                    <div className="flex space-x-1 justify-end">{[...Array(20)].map((_, i) => <div key={i} onClick={()=>setCharacter(p=>({...p, status:{...p.status, quintessenz: i+1}}))} className={`w-3 h-3 border border-purple-500 cursor-pointer ${i < character.status.quintessenz ? 'bg-purple-500' : ''}`} />).slice(0,10)}</div>
                    <div className="flex space-x-1 justify-end mt-1">{[...Array(20)].map((_, i) => <div key={i} onClick={()=>setCharacter(p=>({...p, status:{...p.status, quintessenz: i+1}}))} className={`w-3 h-3 border border-purple-500 cursor-pointer ${i < character.status.quintessenz ? 'bg-purple-500' : ''}`} />).slice(10,20)}</div>
                 </div>
                 <div className="w-px h-10 bg-purple-900/50"></div>
                 <div className="text-left">
                    <span className="text-[10px] uppercase text-red-500">Paradox</span>
                    <div className="flex space-x-1">{[...Array(20)].map((_, i) => <div key={i} onClick={()=>setCharacter(p=>({...p, status:{...p.status, paradox: i+1}}))} className={`w-3 h-3 border border-red-900 cursor-pointer ${i < character.status.paradox ? 'bg-red-500' : ''}`} />).slice(0,10)}</div>
                    <div className="flex space-x-1 mt-1">{[...Array(20)].map((_, i) => <div key={i} onClick={()=>setCharacter(p=>({...p, status:{...p.status, paradox: i+1}}))} className={`w-3 h-3 border border-red-900 cursor-pointer ${i < character.status.paradox ? 'bg-red-500' : ''}`} />).slice(10,20)}</div>
                 </div>
               </div>
             </div>
          </div>
          <HealthBox health={character.status.gesundheit} theme="purple" setCharacter={setCharacter} />
        </section>
      </div>
      <StorageModals mngr={mngr} theme="purple" />
    </div>
  );
};