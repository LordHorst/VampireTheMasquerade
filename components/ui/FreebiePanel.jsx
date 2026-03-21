// src/components/ui/FreebiePanel.jsx
import React from 'react';
import { Sparkles, Coins } from 'lucide-react';

export const FreebiePanel = ({ points, active, onToggle, theme = "emerald" }) => {
  const colors = {
    emerald: "text-emerald-500 border-emerald-800 bg-emerald-950/30",
    amber: "text-amber-600 border-amber-800 bg-amber-950/30",
    purple: "text-purple-500 border-purple-800 bg-purple-950/30"
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 border rounded text-[10px] font-bold uppercase tracking-widest ${colors[theme]}`}>
      <Coins size={14} />
      <span>Freebies: {points}</span>
      <button
        onClick={onToggle}
        className={`ml-2 flex items-center space-x-1 px-2 py-0.5 rounded transition-colors ${
          active ? 'bg-emerald-700/40 text-emerald-300' : 'bg-stone-800/60 text-stone-400'
        }`}
      >
        <Sparkles size={12} />
        <span>{active ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
};