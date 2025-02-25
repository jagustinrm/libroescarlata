
import useCreatureStore from "../stores/creatures";

export const reduceDurationFromConditions = () => {
    const {setC_Conditions, creature} = useCreatureStore.getState();
    if (creature?.c_Conditions?.length > 0) {
      const updatedConditions = creature.c_Conditions.map((condition) => {
        if (condition.duration > 0) {
          return { ...condition, duration: condition.duration - 1 };
        }
        return condition; // Si la duración es 0, la dejamos como está (puedes filtrarla si no quieres mantenerla)
      });

      // Actualizar las condiciones en el estado
      setC_Conditions(updatedConditions.filter((condition) => condition.duration > 0)); // Filtra condiciones con duración 0 si es necesario
    }
  }