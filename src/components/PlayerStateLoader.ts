import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

const PlayerStateLoader = () => {
  const { playerActions } = usePlayerStore();

  useEffect(() => {
    // Verifica si hay un 'playerState' en localStorage al cargar el componente
    const storedPlayerState = localStorage.getItem('playerState');
    
    if (storedPlayerState) {
      const parsedPlayerState = JSON.parse(storedPlayerState);

      playerActions.setP_LeftHealth(parsedPlayerState.p_LeftHealth);
      playerActions.setP_MaxHealth(parsedPlayerState.p_MaxHealth);
      playerActions.setPlayerName(parsedPlayerState.name);
      playerActions.setPlayerLevel(parsedPlayerState.level);
      playerActions.setPlayerMaterial(parsedPlayerState.playerMaterial);
      playerActions.setPlayerExp(parsedPlayerState.playerExp);
      playerActions.setP_ExpToNextLevel(parsedPlayerState.p_ExpToNextLevel);
      playerActions.setP_ExpPrevLevel(parsedPlayerState.p_ExpPrevLevel);
      playerActions.setArmorClass(parsedPlayerState.armorClass);
      playerActions.setBaseAttackBonus(parsedPlayerState.baseAttackBonus);
      playerActions.updateSaves(parsedPlayerState.saves);
      playerActions.addClassFeature(parsedPlayerState.classFeatures);
      parsedPlayerState.classes.forEach((newClass: string) => {
          playerActions.addClasses(newClass);
      });
      playerActions.setP_SelectedPet(parsedPlayerState.selectedPet);
      playerActions.setP_SelectedWeapon(parsedPlayerState.selectedWeapon); 
    }
  }, []); 

  return null; 
};

export default PlayerStateLoader;
