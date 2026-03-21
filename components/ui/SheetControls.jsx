import React from 'react';
import { Upload, Download, FolderOpen, Shield, ShieldOff } from 'lucide-react';
import { FreebiePanel } from './FreebiePanel';

export const SheetControls = ({ title, subtitle, theme, mngr, freebieState }) => {
  const colors = {
    emerald: "text-emerald-500 border-emerald-900 hover:bg-emerald-900/20",
    amber: "text-amber-600 border-amber-900 hover:bg-amber-900/20",
    purple: "text-purple-500 border-purple-900 hover:bg-purple-900/20"
  };
  const btnClass = `flex items-center space-x-1 px-3 py-1.5 border bg-black/40 transition-all rounded text-[10px] font-bold uppercase tracking-widest ${colors[theme]}`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-2 gap-4">
      <div className={`text-[10px] uppercase tracking-[0.3em] font-bold ${colors[theme].split(' ')[0]}`}>{title} • {subtitle}</div>
      <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
        {freebieState && (
          <FreebiePanel
            points={freebieState.freebiePoints}
            active={freebieState.freebiesActive}
            onToggle={freebieState.setFreebiesActive}
            theme={theme}
          />
        )}
        <input type="file" accept=".json" ref={mngr.fileInputRef} onChange={mngr.importJSON} className="hidden" />
        <button onClick={() => mngr.fileInputRef.current?.click()} className={btnClass}><Upload size={14} /><span className="hidden sm:inline">Import</span></button>
        <button onClick={mngr.exportJSON} className={btnClass}><Download size={14} /><span className="hidden sm:inline">Export</span></button>
        <button onClick={() => mngr.setStorageModalOpen(true)} className={btnClass}><FolderOpen size={14} /><span>Speicher</span></button>
        <button onClick={() => mngr.setGmMode(!mngr.gmMode)} className={btnClass}>
          {mngr.gmMode ? <Shield size={14} /> : <ShieldOff size={14} />}<span className="hidden sm:inline">{mngr.gmMode ? 'GM Edit' : 'Normal'}</span>
        </button>
      </div>
    </div>
  );
};