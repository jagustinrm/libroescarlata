// Diccionario que mapea tipos de armas a sonidos
const weaponSoundDictionary: { [key: string]: string } = {
  espada: '/music/attacks/sword-sound.mp3',
  arco: '/music/attacks/bow.mp3',
  hacha: '/music/attacks/sword-sound.mp3',
  lanza: '/music/attacks/spear.mp3',
  daga: '/music/attacks/sword-sound.mp3',
  bastón: '/music/attacks/staff.mp3',
};

// Tipo de las armas disponibles
type WeaponType = 'espada' | 'arco' | 'hacha' | 'lanza' | 'daga' | 'bastón';

// Función que obtiene el sonido basado en el tipo de arma
export function getWeaponSound(randomWeaponType: string): string {
  // Convertir el tipo de arma a minúsculas para hacer la comparación insensible a mayúsculas
  const weaponType = randomWeaponType.toLowerCase() as WeaponType;

  // Retornar el sonido correspondiente o un sonido por defecto si no se encuentra
  return weaponSoundDictionary[weaponType] || '/music/attacks/default.wav';
}
