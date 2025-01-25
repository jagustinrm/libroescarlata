export const darkenHex = (
  hex: string,
  amount: number = 80,
  alpha: number = 0.4,
): string => {
  // Eliminar el símbolo '#' si está presente
  const color = hex.startsWith('#') ? hex.slice(1) : hex;

  // Asegurarse de que el input sea válido (6 caracteres para RGB)
  if (color.length !== 6) {
    throw new Error('El color hexadecimal debe tener 6 caracteres.');
  }

  // Dividir en componentes RGB
  const r = Math.max(0, parseInt(color.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(color.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(color.slice(4, 6), 16) - amount);

  // Convertir a formato RGBA si alpha es menor que 1
  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Reconstruir el color en formato hexadecimal
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};
