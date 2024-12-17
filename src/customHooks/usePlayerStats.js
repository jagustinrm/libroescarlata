import { useState, useEffect } from 'react';

export function usePlayerStats() {
  const [xpTable, setXpTable] = useState({});

  // Estados para additionalData

  const [armorClass, setArmorClass] = useState(
    () => localStorage.getItem('armorClass') || '',
  );
  const [baseAttackBonus, setBaseAttackBonus] = useState(
    () => localStorage.getItem('baseAttackBonus') || '',
  );

  const [saves, setSaves] = useState(() => {
    const savedSaves = localStorage.getItem('saves');
    return savedSaves
      ? JSON.parse(savedSaves)
      : { fortitude: '', reflex: '', will: '' };
  });
  const [classFeatures, setClassFeatures] = useState(() => {
    const savedFeatures = localStorage.getItem('classFeatures');
    return savedFeatures ? JSON.parse(savedFeatures) : [];
  });
}
