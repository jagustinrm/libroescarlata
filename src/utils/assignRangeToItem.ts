import { WeaponType } from '../stores/types/weapons';

export default function assignRangeToItem(itemType: WeaponType) {
  const rangeOfWeapons: Record<WeaponType, number> = {
    Espada: 5,
    Hacha: 5,
    Lanza: 10,
    Arco: 30,
    Daga: 5,
    Bastón: 5,
    Mandoble: 10,
    Bardiche: 10,
    "Arco Largo": 40,
    "Martillo de guerra": 5,
    Alabarda: 10,
  };

  return rangeOfWeapons[itemType];
}
