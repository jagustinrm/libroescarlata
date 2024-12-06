import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from './firebaseConfig';
import { usePlayerStore } from '../stores/playerStore';

const LoadPlayerFromFirebase = () => {
  const { playerActions } = usePlayerStore(); // Accedemos a playerActions
  const navigate = useNavigate();
  const { playerName } = useParams();

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playerRef = ref(database, `players/${playerName}`);
        const snapshot = await get(playerRef);

        if (snapshot.exists()) {
          const playerData = snapshot.val();
          // Carga los datos en el store utilizando las acciones de playerActions
          playerActions.setPlayerName(playerData.name);
          playerActions.setPlayerLevel(playerData.level);
          playerActions.setPlayerMaterial(playerData.playerMaterial);
          playerActions.setPlayerExp(playerData.playerExp);
          playerActions.setP_ExpToNextLevel(playerData.p_ExpToNextLevel);
          playerActions.setP_ExpPrevLevel(playerData.p_ExpPrevLevel);
          playerActions.setArmorClass(playerData.armorClass);
          playerActions.setBaseAttackBonus(playerData.baseAttackBonus);
          playerActions.updateSaves(playerData.saves);
          playerActions.setClassFeature(playerData.classFeatures);
          
          playerData.classes.forEach((newClass: string) => {
            playerActions.addClasses(newClass);
          });

          playerActions.setP_SelectedPet(playerData.selectedPet);
          playerActions.setP_SelectedWeapon(playerData.selectedWeapon);
          playerActions.setStats(playerData.stats);
          playerActions.setStatsLeftPoints(playerData.leftPoints);
          playerActions.setSpell(playerData.spells);

          console.log('Datos del jugador cargados desde Firebase:', playerData);
          navigate('/home'); // Redirige a /home después de cargar los datos
        } else {
          console.error(`No se encontraron datos para el jugador: ${playerName}`);
          alert(`No se encontraron datos para el jugador: ${playerName}`);
        }
      } catch (error) {
        console.error('Error al obtener los datos del jugador desde Firebase:', error);
      }
    };

    if (playerName) {
      fetchPlayerData();
    }
  }, [playerName, playerActions, navigate]);

  return null; // Este componente no necesita renderizar nada
};

export default LoadPlayerFromFirebase;
