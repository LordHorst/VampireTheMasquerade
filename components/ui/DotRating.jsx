import React from 'react';

export const DotRating = ({ value, max = 5, onChange, min = 0, disabled = false, readOnly = false, theme = "emerald" }) => {
  const colors = {
    emerald: "border-emerald-900 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] hover:bg-emerald-900/40",
    amber: "border-amber-900 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] hover:bg-amber-900/40",
    purple: "border-purple-900 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)] hover:bg-purple-900/40"
  };
  const activeColor = colors[theme].split(' ')[1] + " " + colors[theme].split(' ')[2];
  const inactiveColor = "bg-black/40 " + colors[theme].split(' ')[3];
  const borderColor = colors[theme].split(' ')[0];

  return (
    <div className={`flex space-x-1.5 items-center ${disabled ? 'opacity-20' : ''}`}>
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          onClick={() => {
            if (disabled || readOnly) return;
            const newVal = i + 1;
            onChange(newVal === value ? Math.max(min, value - 1) : newVal);
          }}
          className={`w-3.5 h-3.5 rounded-full border ${borderColor} transition-all cursor-pointer
            ${i < value ? `${activeColor} scale-110` : inactiveColor}`}
        />
      ))}
    </div>
  );
};