import React from 'react';
import { DotRating } from './DotRating';

export const TraitSection = ({ title, data, theme, onChange, isAttr = false, disabledFields = {}, groupStats = {} }) => {
  const tColor = theme === 'emerald' ? 'text-emerald-500 border-emerald-900 bg-emerald-950/10' : theme === 'amber' ? 'text-amber-600 border-amber-900 bg-amber-950/10' : 'text-purple-500 border-purple-900 bg-purple-950/10';
  const hColor = theme === 'emerald' ? 'text-emerald-800 border-emerald-900/20' : theme === 'amber' ? 'text-amber-800 border-amber-900/20' : 'text-purple-800 border-purple-900/20';

  return (
    <section className="mb-8">
      <h2 className={`text-xl font-bold uppercase tracking-widest text-center border-y py-2 mb-6 ${tColor}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(data).map(([cat, fields]) => {
          const stats = groupStats[cat];
          const statsLabel = stats ? ` (${stats.bonus}/${stats.limit})` : '';
          return (
            <div key={cat} className="space-y-2">
              <h3 className={`text-[11px] font-bold uppercase italic border-b pb-1 ${hColor}`}>
                {cat}{statsLabel}
              </h3>
              {Object.entries(fields).map(([name, val]) => {
                const isDisabled = disabledFields[cat]?.[name] || false;
                return (
                  <div key={name} className="flex justify-between items-center">
                    <span className="text-xs text-stone-400 hover:text-stone-100">{name.replace('_', ' ')}</span>
                    <DotRating
                      theme={theme}
                      value={val}
                      min={isAttr ? 1 : 0}
                      onChange={(v) => onChange(cat, name, v)}
                      disabled={isDisabled}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};