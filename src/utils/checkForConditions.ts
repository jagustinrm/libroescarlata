import { getGlobalState } from "../customHooks/useGlobalState";



export const checkForConditions = () => {
  const { creature } = getGlobalState();
  // Lista de condiciones típicas que quieres comprobar
  const typicalConditions = ['aturdir', 'dormir', 'paralizar'];
  // Verifica si el array 'creature.c_Conditions' tiene alguna condición típica
  return creature.c_Conditions.some(condition =>
    typicalConditions.includes(condition.name)
    
  );
};