import { useState, useRef, useEffect } from 'react';

export function useCharacterManager(defaultEmptyChar, systemKey) {
  const [character, setCharacter] = useState(defaultEmptyChar);
  const [gmMode, setGmMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [savedChars, setSavedChars] = useState([]);
  const timeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const storageKey = `wod_${systemKey}_saved_characters`;

  useEffect(() => {
    const localData = localStorage.getItem(storageKey);
    if (localData) {
      try { setSavedChars(JSON.parse(localData)); } catch (e) { console.error(e); }
    }
  }, [storageKey]);

  const showToast = (msg, type = 'error') => {
    setNotification({ msg, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setNotification(null), 3000);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const dlNode = document.createElement('a');
    dlNode.setAttribute("href", dataStr);
    dlNode.setAttribute("download", `${character.info.Name?.replace(/[^a-z0-9]/gi, '_') || "char"}_${systemKey}.json`);
    document.body.appendChild(dlNode); dlNode.click(); dlNode.remove();
    showToast("Charakter exportiert", "success");
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (ev) => {
      try {
        setCharacter(JSON.parse(ev.target.result));
        showToast("Charakter importiert", "success");
      } catch (err) { showToast("Fehler beim Einlesen", "error"); }
    };
    e.target.value = null; 
  };

  const saveToLocal = () => {
    if (savedChars.length >= 10) return showToast("Speicher voll (Max. 10).", "error");
    const newEntry = {
      id: Date.now(),
      name: character.info.Name || "Unbekannt",
      subInfo: character.info.Clan || character.info.Tribe || character.info.Tradition || "",
      date: new Date().toLocaleDateString(),
      data: character
    };
    const updated = [...savedChars, newEntry];
    setSavedChars(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    showToast("Lokal gespeichert.", "success");
  };

  const loadFromLocal = (data) => {
    setCharacter(data); setStorageModalOpen(false); showToast("Geladen.", "success");
  };

  const deleteFromLocal = (id) => {
    const updated = savedChars.filter(c => c.id !== id);
    setSavedChars(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const updateStat = (cat, sub, f, v) => setCharacter(p => ({
    ...p, [cat]: { ...p[cat], [sub]: { ...p[cat][sub], [f]: v } }
  }));

  return {
    character, setCharacter, gmMode, setGmMode, notification, storageModalOpen, setStorageModalOpen,
    savedChars, fileInputRef, showToast, exportJSON, importJSON, saveToLocal, loadFromLocal, deleteFromLocal, updateStat
  };
}