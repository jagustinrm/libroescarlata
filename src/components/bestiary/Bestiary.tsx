import React, { useState } from 'react';
import useGlobalState from '../../customHooks/useGlobalState';
import BackButton from '../UI/BackButton';
import './Bestiary.css';
import ButtonEdited from '../UI/ButtonEdited';

export default function Bestiary() {
    const { creatures, player } = useGlobalState();
    
    // Estado para la página actual
    const [currentPage, setCurrentPage] = useState(1);
    const creaturesPerPage = 8;

    // Calcular los índices de inicio y fin para la página actual
    const indexOfLastCreature = currentPage * creaturesPerPage;
    const indexOfFirstCreature = indexOfLastCreature - creaturesPerPage;
    const currentCreatures = creatures.slice(indexOfFirstCreature, indexOfLastCreature);

    // Número total de páginas
    const totalPages = Math.ceil(creatures.length / creaturesPerPage);

    // Cambiar de página
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderCreatureImages = () => (
        <div className="bestiaryGrid">
            {currentCreatures.map(c => {
                const isDefeated = player.enemiesDeleted?.some(ed => ed.name === c.name);
                console.log()
                const cant = player.enemiesDeleted.find(ed => ed.name === c.name)?.count;
                return (
                    <div key={c.name} className="creatureCard">
                        <img
                            className="creatureImgCard"
                            style={{ filter: isDefeated ? "brightness(1)" : "brightness(0)" }}
                            src={c.img}
                            alt={c.name}
                        />
                        <p style={{ display: isDefeated ? "auto" : "none" }} className="creatureName">{c.name}</p>
                        <p style={{ display: isDefeated ? "auto" : "none" }} className="creatureName">Cantidad: {cant}</p>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="bestiaryContainer rpgui-container framed-golden-2">
            {renderCreatureImages()}
            
            <div className="pagination">
            <div style={{ marginTop: '5px' }}>
              <ButtonEdited
                label="Anterior"
                width="130px"
                height="33px"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              />
            </div>
                <span>Página {currentPage} de {totalPages}</span>
                <div style={{ marginTop: '5px' }}>
              <ButtonEdited
                label="Siguiente"
                width="130px"
                height="33px"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              />
            </div>     
            </div>
            
            <BackButton />
        </div>
    );
}
