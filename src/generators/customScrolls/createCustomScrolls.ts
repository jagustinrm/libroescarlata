import { generateUniqueId } from '../generateUniqueId';
import useSpellStore from '../../stores/spellsStore';
import { Scroll } from '../../stores/types/scrolls';
import useScrollStore from '../../stores/scrollStore';
import { useState } from 'react';

export async function createCustomScroll(): Promise<Scroll | null> {
  const { spells } = useSpellStore.getState();

  if (!spells || spells.length === 0) {
    console.warn('No hay hechizos disponibles para crear un pergamino.');
    return null;
  }

  const randomIndex = Math.floor(Math.random() * spells.length);
  const selectedSpell = spells[randomIndex];

  const id = await generateUniqueId('scrolls');

  const numberSpell = selectedSpell.id.replace(/\D+/g, '');

  const customScroll = {
    ...selectedSpell,
    id,
    name: `Pergamino de ${selectedSpell.name}`,
    img: `img/scrolls/scroll-${numberSpell}.png`, // Usa numberSpell en la URL
    cost: 30,
    deleteable: true,
    color: '#F8F8F8',
    weight: 1,
    playerOwner: false,
  };

  return customScroll;
}

export const useCreateCustomScrolls = () => {
  const [generatedScrolls, setGeneratedScrolls] = useState<Scroll[]>([]);

  const createScrolls = async (quantity: number) => {
    const scrolls: Scroll[] = [];

    for (let i = 0; i < quantity; i++) {
      const newScroll = await createCustomScroll();
      if (newScroll) {
        scrolls.push(newScroll);
      }
    }

    setGeneratedScrolls(scrolls); // Actualiza el estado local
    return scrolls; // Devuelve las scrolls generadas
  };
  return { generatedScrolls, createScrolls };
};
