export function validatePassword(password: string, username: string): string {
  console.log(`[validatePassword] Executing for password: "${password}", username: "${username}"`);
  if (password.length === 0) {
    console.log('[validatePassword] Password is empty. Returning ""');
    return '';
  }
  // Regla 1: Longitud mínima y máxima
  if (password.length < 8 || password.length > 20) {
    console.log('[validatePassword] Password length is invalid. Returning error.');
    return 'La contraseña debe tener entre 8 y 20 caracteres.';
  }

  // Regla 2: Contener al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    console.log('[validatePassword] Password missing uppercase. Returning error.');
    return 'La contraseña debe contener al menos una letra mayúscula.';
  }

  // Regla 3: Contener al menos una minúscula
  if (!/[a-z]/.test(password)) {
    console.log('[validatePassword] Password missing lowercase. Returning error.');
    return 'La contraseña debe contener al menos una letra minúscula.';
  }

  // Regla 4: Contener al menos un número
  if (!/\d/.test(password)) {
    console.log('[validatePassword] Password missing number. Returning error.');
    return 'La contraseña debe contener al menos un número.';
  }

  // Regla 5: Contener al menos un carácter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    console.log('[validatePassword] Password missing special character. Returning error.');
    return 'La contraseña debe contener al menos un carácter especial.';
  }

  // Regla 6: No debe contener espacios
  if (/\s/.test(password)) {
    console.log('[validatePassword] Password has spaces. Returning error.');
    return 'La contraseña no debe contener espacios.';
  }

  // Regla 7: No contener el nombre de usuario
  if (username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) {
    console.log('[validatePassword] Password contains username. Returning error.');
    return 'La contraseña no puede contener el nombre de usuario.';
  }

  // Si pasa todas las validaciones, la contraseña es válida

  console.log('[validatePassword] Password is valid. Returning ""');
  return '';
}
