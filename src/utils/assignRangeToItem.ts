import { WeaponType } from '../stores/types/weapons';

export default function assignRangeToItem(itemType: WeaponType) {
  const rangeOfWeapons: Record<WeaponType, number> = {
    Espada: 5,
    Hacha: 5,
    Lanza: 10,
    Arco: 30,
    Daga: 5,
    Bastón: 5,
  };

  return rangeOfWeapons[itemType];
}
