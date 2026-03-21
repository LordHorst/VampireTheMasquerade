import React from 'react';
import { X, CheckCircle, AlertCircle, FolderOpen, Save, Trash2 } from 'lucide-react';

export const StorageModals = ({ mngr, theme }) => {
  const { notification, storageModalOpen, setStorageModalOpen, savedChars, saveToLocal, loadFromLocal, deleteFromLocal } = mngr;
  const tc = theme === 'emerald' ? 'text-emerald-500 border-emerald-900' : theme === 'amber' ? 'text-amber-500 border-amber-900' : 'text-purple-500 border-purple-900';
  
  return (
    <>
      {notification && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded shadow-2xl flex items-center space-x-3 z-50 border bg-black/95 ${notification.type === 'success' ? tc : 'border-red-600 text-red-200'}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} className="text-red-500" />}
          <span className="text-xs font-bold uppercase tracking-wider">{notification.msg}</span>
        </div>
      )}
      {storageModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-black border rounded p-6 max-w-lg w-full relative ${tc}`}>
            <button onClick={() => setStorageModalOpen(false)} className="absolute top-4 right-4 hover:opacity-50"><X size={20} /></button>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center"><FolderOpen className="mr-3" size={24} /> Gespeicherte Charaktere</h2>
            <button onClick={saveToLocal} disabled={savedChars.length >= 10} className={`w-full flex items-center justify-center space-x-2 py-3 border rounded transition-colors mb-6 uppercase text-[10px] font-bold tracking-widest hover:bg-white/10 ${tc}`}>
              <Save size={16} /><span>Charakter lokal speichern ({savedChars.length}/10)</span>
            </button>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {savedChars.length === 0 && <p className="text-sm text-center italic py-4 opacity-50">Leer.</p>}
              {savedChars.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 border border-white/20 bg-black/40 rounded">
                  <div>
                    <div className="font-bold text-sm">{c.name}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-60">{c.subInfo} • {c.date}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => loadFromLocal(c.data)} className="p-2 hover:bg-white/20 rounded"><FolderOpen size={16} /></button>
                    <button onClick={() => deleteFromLocal(c.id)} className="p-2 text-red-500 hover:bg-red-900/40 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};