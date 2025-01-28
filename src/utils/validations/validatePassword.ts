export function ValidatePassword(password: string, username: string): string {

    if (password.length === 0 && username.length === 0) {
        return ''
    }
    // Regla 1: Longitud mínima y máxima
    if (password.length < 8 || password.length > 20) {
      return "La contraseña debe tener entre 8 y 20 caracteres.";
    }
  
    // Regla 2: Contener al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
  
    // Regla 3: Contener al menos una minúscula
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
  
    // Regla 4: Contener al menos un número
    if (!/\d/.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
  
    // Regla 5: Contener al menos un carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
    }
  
    // Regla 6: No debe contener espacios
    if (/\s/.test(password)) {
      return "La contraseña no debe contener espacios.";
    }
  
    // Regla 7: No contener el nombre de usuario
    if (password.toLowerCase().includes(username.toLowerCase())) {
      return "La contraseña no puede contener el nombre de usuario.";
    }
  
    // Si pasa todas las validaciones, la contraseña es válida
    return '';
  }
  