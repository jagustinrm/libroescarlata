export function validateUsername(name: string): string {
  console.log(`[validateUsername] Executing for name: "${name}"`);
  // Regla 1: Longitud entre 3 y 15 caracteres
  if (name.length === 0) {
    console.log('[validateUsername] Name is empty. Returning ""');
    return '';
  }
  if (name.length < 3 || name.length > 15) {
    console.log('[validateUsername] Name length is invalid. Returning error.');
    return 'El nombre debe tener entre 3 y 15 caracteres.';
  }

  // Regla 2: Solo caracteres alfanuméricos, guiones y guiones bajos
  const validCharacters = /^[a-zA-Z0-9-_]+$/;
  if (!validCharacters.test(name)) {
    console.log('[validateUsername] Name has invalid characters. Returning error.');
    return 'El nombre solo puede contener caracteres alfanuméricos, guiones (-) y guiones bajos (_).';
  }

  // Regla 3: No puede empezar o terminar con un número
  if (/^\d/.test(name) || /\d$/.test(name)) {
    console.log('[validateUsername] Name starts or ends with a number. Returning error.');
    return 'El nombre no puede comenzar ni terminar con un número.';
  }

  // Regla 4: Distinguir entre mayúsculas y minúsculas (esto se maneja automáticamente con el uso de test)
  // (Solo estamos permitiendo caracteres en mayúsculas y minúsculas, no afecta la validación)

  // Regla 5: No puede contener espacios



  // Regla 6: No permitir caracteres especiales (esto ya se controla con la expresión regular anterior)

  console.log('[validateUsername] Name is valid. Returning ""');
  return '';
}
