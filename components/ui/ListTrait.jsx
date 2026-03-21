import React from 'react';
import { DotRating } from './DotRating';

export const ListTrait = ({ block, title, theme, onChange, max = 5 }) => (
  <div>
    <h3 className={`text-xs font-bold uppercase mb-4 text-${theme}-700`}>{title}</h3>
    {block.map((item, i) => (
      <div key={i} className="flex justify-between items-center mb-3">
        <input className={`bg-transparent border-b border-${theme}-900/30 text-xs outline-none w-24 text-stone-400`} value={item.name} onChange={(e) => onChange(i, e.target.value, undefined)} />
        <DotRating theme={theme} value={item.value} max={max} onChange={(v) => onChange(i, undefined, v)} />
      </div>
    ))}
  </div>
);