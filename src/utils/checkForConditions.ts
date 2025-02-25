import { getGlobalState } from "../customHooks/useGlobalState";



export const checkForConditions = () => {
  const { creature } = getGlobalState();
  // Lista de condiciones típicas que quieres comprobar
  const typicalConditions = ['stun', 'sleep', 'paralyzed'];
  console.log('ESTADO INTERNO DE CHECK')
  console.log(creature)
  console.log(creature.c_Conditions)
  // Verifica si el array 'creature.c_Conditions' tiene alguna condición típica
  return creature.c_Conditions.some(condition =>
    typicalConditions.includes(condition.name)
    
  );
};