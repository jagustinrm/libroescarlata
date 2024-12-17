export function calculateInitialHealth(hitDie) {
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
    default:
      return 5;
  }
}
