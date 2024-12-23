export interface DialogOption {
    id: string; // Identificador único de la opción
    text: string; // Texto que muestra la opción
    nextDialogId?: string; // ID del próximo diálogo después de seleccionar esta opción (opcional por ahora)
    outcome?: string; // Resultado de seleccionar esta opción
  }
  
  export interface DialogLine {
    speaker?: string; // Quién habla en esta línea (opcional)
    text: string; // Texto del diálogo
    // options?: DialogOption[]; // Opciones de diálogo si las hay
    event: string;
    unlockCondition?: { chapterId: number; eventId: string }; // Condición para desbloquear el diálogo (opcional)
  }
  
  export interface Dialog {
    id: string; // Identificador único del diálogo
    lines: DialogLine[]; // Array de líneas que componen el diálogo
  }
  