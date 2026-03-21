import React, { useState } from 'react';
import { Menu, X, Moon, Flame, Sparkles } from 'lucide-react';
import { VampireSheet } from './systems/vampire/VampireSheet';
import { WerewolfSheet } from './systems/werewolf/WerewolfSheet';
import { MageSheet } from './systems/mage/MageSheet';

const App = () => {
  const [activeSystem, setActiveSystem] = useState('vampire');
  const [menuOpen, setMenuOpen] = useState(false);

  const systems = [
    { id: 'vampire', name: 'Vampire: The Masquerade', icon: <Moon size={18} />, color: 'hover:text-emerald-400 hover:bg-emerald-900/20' },
    { id: 'werewolf', name: 'Werewolf: The Apocalypse', icon: <Flame size={18} />, color: 'hover:text-amber-500 hover:bg-amber-900/20' },
    { id: 'mage', name: 'Mage: The Ascension', icon: <Sparkles size={18} />, color: 'hover:text-purple-400 hover:bg-purple-900/20' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-stone-300 font-sans flex">
      
      {/* SIDEBAR (Hamburger Menu) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">System Wählen</h2>
            <button onClick={() => setMenuOpen(false)} className="text-stone-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="space-y-2">
            {systems.map(sys => (
              <button 
                key={sys.id}
                onClick={() => { setActiveSystem(sys.id); setMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-left transition-colors
                  ${activeSystem === sys.id ? 'bg-white/10 text-white font-bold' : `text-stone-400 ${sys.color}`}`}
              >
                {sys.icon}
                <span className="text-sm">{sys.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-6 text-[9px] text-stone-600 uppercase tracking-widest">
          World of Darkness Editor v2.1
        </div>
      </div>

      {/* OVERLAY WENN MENÜ OFFEN */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* HAUPTINHALT */}
      <div className="flex-1 transition-all duration-300 relative">
        <button 
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-20 p-2 bg-black/50 border border-white/10 text-stone-400 hover:text-white rounded backdrop-blur-sm shadow-xl"
        >
          <Menu size={20} />
        </button>
        
        <div className="pt-16 p-4 md:p-8 max-w-5xl mx-auto">
          {activeSystem === 'vampire' && <VampireSheet />}
          {activeSystem === 'werewolf' && <WerewolfSheet />}
          {activeSystem === 'mage' && <MageSheet />}
        </div>
      </div>

    </div>
  );
};

export default App;