import { useState } from 'react';
import './PetStore.css';
import '../UI/designRpg.css';
import { usePlayerStore } from '../../stores/playerStore';
import { Pet } from '../../stores/types/pets';
import BackButton from '../UI/BackButton';
import MessageBox from '../UI/MessageBox';
import PetsList from './PetsList';
import PetDetails from './PetsDetails';
import useAppStore from '../../stores/appStore';

export default function PetStore() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isContainerOpen, setIsContainerOpen] = useState(false); 
  const { playerActions, player } = usePlayerStore();
  const [isBuyable, setIsBuyable] = useState(false);
  const {setMessage, message, clearMessage} = useAppStore();
  const handleSelectedPet = () => {
    if (selectedPet) {
      playerActions.setP_SelectedPet(selectedPet);
      setMessage(
        '¡Seleccionaste a ' + selectedPet.name + '!',
        'success'
      )
    }
  };

  const handleBuy = (petName: string, petCost: number) => {
    if (player.playerMaterial >= petCost) {
      playerActions.addPetsName(petName);
      playerActions.setPlayerMaterial(player.playerMaterial - petCost);
      setMessage(
        '¡Adoptaste a ' + petName + '!',
        'success'
      )
      setIsBuyable(false);
    } else {
      setMessage(
        'Te falta materiales',
        'warning'
      )
    }
  };

  return (
    <section className="petSection rpgui-container framed-golden-2">
      <div className="sectionPet">
        <PetsList
        setSelectedPet={setSelectedPet}
        setIsContainerOpen={setIsContainerOpen}
        setIsBuyable={setIsBuyable}
        />
      <div className={`containerPets ${isContainerOpen ? 'open' : ''}`}>
      <PetDetails
        selectedPet={selectedPet}
        isContainerOpen={isContainerOpen}
        isBuyable={isBuyable}
        handleBuy={handleBuy}
        handleSelectedPet={handleSelectedPet}
      />
      </div>
      </div>
      <BackButton />
      {message.showMessage && (
        <MessageBox
          message={message.content}
          type={message.type as 'error' | 'warning' | 'success'}
          onClose={() => clearMessage()}
        />
      )}
    </section>
  );
}
