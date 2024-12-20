import  { useEffect } from "react";
import useDialogStore from "../stores/dialogStore";

export default function DialogLoader() {
  const { loadDialogs } = useDialogStore();

  useEffect(() => {
    // Función para cargar los diálogos desde un endpoint
    const fetchDialogs = async () => {
      try {
        const response = await fetch("/mocks/dialogs.json"); // Cambia la URL por la de tu API
        if (!response.ok) {
          throw new Error("Error al cargar los diálogos");
        }
        const dialogs = await response.json();
        loadDialogs(dialogs); // Guardar los diálogos en el store
      } catch (error) {
        console.error("Error al obtener los diálogos:", error);
      }
    };

    fetchDialogs();
  }, [loadDialogs]);

  return null; // No renderizamos nada
}
