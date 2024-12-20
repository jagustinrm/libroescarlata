import React, { useEffect, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import BackButton from "../UI/BackButton";
import { Dialog, DialogLine } from "../../stores/types/dialog";
import { useNavigate } from "react-router-dom";
interface NPCDialogProps {
  dialogId: string; // ID del diálogo inicial
  onDialogEnd?: () => void; // Callback cuando el diálogo termina
}

const NPCDialog: React.FC<NPCDialogProps> = ({ dialogId, onDialogEnd }) => {
  const { getDialogById, dialogs } = useDialogStore(); // Obtener la función para buscar diálogos
  const [currentLineIndex, setCurrentLineIndex] = useState(0); // Índice de la línea actual
  const [currentLine, setCurrentLine] = useState<DialogLine | null>(null); // Línea actual
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null); // Diálogo actual
  const navigate = useNavigate();
  // Inicializar el diálogo al montar el componente o cambiar el dialogId
  useEffect(() => {
    const dialog = getDialogById(dialogId); // Buscar el diálogo por ID
    if (dialog) {
      setCurrentDialog(dialog); // Establecer el diálogo actual
      setCurrentLine(dialog.lines[0]); // Primera línea del diálogo
    } else {
      console.error(`Dialog with ID "${dialogId}" not found.`);
    }
  }, [dialogId, dialogs]);

  // Actualizar la línea actual cuando el índice cambia
  useEffect(() => {
    if (currentDialog) {
      setCurrentLine(currentDialog.lines[currentLineIndex]);
    }
  }, [currentLineIndex, currentDialog]);

  // Manejar la selección de una opción
  const handleOptionSelect = (outcome: string) => {
    console.log(`Opción seleccionada: ${outcome}`);
    if (outcome === "fight") {
        navigate("/fightScene?enemy=Goblin")
    }
    if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (onDialogEnd) {
      onDialogEnd(); // Llamar al callback cuando el diálogo termina
    }
  };

  // Manejar el botón de continuar
  const handleContinue = () => {
    if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (onDialogEnd) {
      onDialogEnd(); // Llamar al callback cuando el diálogo termina
    }
  };

  // Renderizar "Cargando..." si el diálogo o la línea actual no están disponibles
  if (!currentLine || !currentDialog) {
    return <div className="npc-dialog">Cargando...</div>;
  }
  console.log(currentDialog.lines[currentLineIndex])
  return (
    <div className="npc-dialog">
      {/* Mostrar la línea actual del diálogo */}
      <div className="dialog-bar rpgui-container framed-golden-2">
        <p>
          <strong>{currentLine.speaker}:</strong> {currentLine.text}
        </p>
      </div>

      {/* Mostrar opciones si están disponibles */}
      {currentDialog.lines[currentLineIndex].options && currentDialog.lines[currentLineIndex].options.length > 0 ? (
        <div className="dialog-options">
          {currentDialog.lines[currentLineIndex].options.map((option) => (
             <button
              key={option.id} // Usar ID como clave única
              onClick={() => option.outcome && handleOptionSelect(option.outcome)}
              className="dialog-option"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        // Mostrar botón de continuar si no hay opciones
        <button className="dialog-continue" onClick={handleContinue}>
          Continuar
        </button>
      )}

      {/* Botón para volver */}
      <BackButton />
    </div>
  );
};

export default NPCDialog;
