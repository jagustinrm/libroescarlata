import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

const PlayerStateLoader = () => {
  const { playerActions } = usePlayerStore();

  useEffect(() => {
    // Verifica si hay un 'playerState' en localStorage al cargar el componente
    const storedPlayerState = localStorage.getItem('playerState');
    
    if (storedPlayerState) {
      const parsedPlayerState = JSON.parse(storedPlayerState);

      playerActions.setP_LeftHealth(parseInt(parsedPlayerState.p_LeftHealth));
      playerActions.setP_MaxHealth(parseInt(parsedPlayerState.p_MaxHealth));
      playerActions.setPlayerName(parsedPlayerState.name);
      playerActions.setPlayerLevel(parsedPlayerState.level);
      playerActions.setPlayerMaterial(parsedPlayerState.playerMaterial);
      playerActions.setPlayerExp(parsedPlayerState.playerExp);
      playerActions.setP_ExpToNextLevel(parsedPlayerState.p_ExpToNextLevel);
      playerActions.setP_ExpPrevLevel(parsedPlayerState.p_ExpPrevLevel);
      playerActions.setArmorClass(parsedPlayerState.armorClass);
      playerActions.setBaseAttackBonus(parsedPlayerState.baseAttackBonus);
      playerActions.updateSaves(parsedPlayerState.saves);
      playerActions.setClassFeature(parsedPlayerState.classFeatures);
      parsedPlayerState.classes.forEach((newClass: string) => {
          playerActions.addClasses(newClass);
      });
      playerActions.setP_SelectedPet(parsedPlayerState.selectedPet);
      playerActions.setP_SelectedWeapon(parsedPlayerState.selectedWeapon); 
      playerActions.setStats(parsedPlayerState.stats)
      playerActions.setStatsLeftPoints(parsedPlayerState.leftPoints)
      playerActions.setSpell(parsedPlayerState.spells)

    }
  }, []); 

  return null; 
};

export default PlayerStateLoader;
