// type HitDie = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export function calculateInitialHealth(hitDie: string): number {
  switch (hitDie) {
    case 'd4':
      return 4;
    case 'd6':
      return 6;
    case 'd8':
      return 8;
    case 'd10':
      return 10;
    case 'd12':
      return 12;
    case 'd20':
      return 20;
    default:
      return 5; // Valor por defecto en caso de un error inesperado
  }
}
