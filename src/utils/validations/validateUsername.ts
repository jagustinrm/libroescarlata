export function validateUsername(name: string): boolean {
    console.log(name)
    // Regla 1: Longitud entre 3 y 15 caracteres
    if (name.length === 0) {
        return true
    }
        if (name.length < 3 || name.length > 15) {
      console.log("El nombre debe tener entre 3 y 15 caracteres.");
      return false;
    }
  
    // Regla 2: Solo caracteres alfanuméricos, guiones y guiones bajos
    const validCharacters = /^[a-zA-Z0-9-_]+$/;
    if (!validCharacters.test(name)) {
      console.log("El nombre solo puede contener caracteres alfanuméricos, guiones (-) y guiones bajos (_).");
      return false;
    }
  
    // Regla 3: No puede empezar o terminar con un número
    if (/^\d/.test(name) || /\d$/.test(name)) {
      console.log("El nombre no puede comenzar ni terminar con un número.");
      return false;
    }
  
    // Regla 4: Distinguir entre mayúsculas y minúsculas (esto se maneja automáticamente con el uso de test)
    // (Solo estamos permitiendo caracteres en mayúsculas y minúsculas, no afecta la validación)
  
    // Regla 5: No puede contener espacios
    if (name.includes(" ")) {
      console.log("El nombre no puede contener espacios.");
      return false;
    }
  
    // Regla 6: No permitir caracteres especiales (esto ya se controla con la expresión regular anterior)
  
    console.log("Nombre de usuario válido.");
    return true;
  }
  