import React from 'react';

export const HealthBox = ({ health, theme, setCharacter }) => {
  const colors = {
    emerald: "border-emerald-900 bg-emerald-950/10 text-emerald-500",
    amber: "border-amber-900 bg-amber-950/10 text-amber-600",
    purple: "border-purple-900 bg-purple-950/10 text-purple-500"
  };
  return (
    <div className={`p-6 border rounded-lg ${colors[theme]}`}>
      <h3 className="text-[11px] font-bold uppercase mb-6 text-center italic">Gesundheit</h3>
      {health.map((h, i) => (
        <div key={i} className="flex justify-between items-center text-xs mb-3 cursor-pointer group" onClick={() => {
          const newHealth = health.map((item, idx) => ({
            ...item,
            checked: idx <= i
          }));
          setCharacter(p => ({...p, status: {...p.status, gesundheit: newHealth}}));
        }}>
          <span className="font-semibold text-stone-400 group-hover:text-stone-200">{h.label}</span>
          <div className="flex items-center space-x-4">
            <span className="opacity-60">{h.penalty !== 0 ? h.penalty : ""}</span>
            <div className={`w-5 h-5 border-2 border-${theme}-900 flex items-center justify-center ${h.checked ? `bg-${theme}-700` : 'bg-black/40'}`}>
              {h.checked && <span className="text-white text-[10px] font-bold">X</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}