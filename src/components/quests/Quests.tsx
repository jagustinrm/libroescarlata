
import './Quests.css';
import { useLoadQuests } from "../../customHooks/useLoadQuests";


export default function Quests() {

    const {quests} = useLoadQuests();

    function closeWindow() {
        window.close();
    }

    return (
        <>
            <h1>Misiones</h1>
            <div className="questContainer">
                {/* Renderiza las misiones de historia */}
                <div className="quests-category">
                    <h2>Misiones de historia</h2>
                    <ul>
                        {quests?.questTree.history.map((quest, index) => (
                            <li key={index}>
                                <label>{quest.name}</label>
                                <p>{quest.description}</p>
                                <p>Objetivo: {quest.objective}</p>
                                <p>Cantidad: {quest.progress}/{quest.counter}</p>
                                <p>Recompensa: {quest.reward} puntos</p>
                                <input 
                                    type="checkbox" 
                                    id={quest.name} 
                                    checked={quest.finished}  // Aquí se usa el valor de 'finished'
                                    readOnly 
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Renderiza las misiones secundarias */}
                <div className="quests-category">
                    <h2>Misiones secundarias</h2>
                    <ul>
                        {quests?.questTree.secondary.map((quest, index) => (
                            <li key={index}>
                                <label>{quest.name}</label>
                                <p>{quest.description}</p>
                                <p>Objetivo: {quest.objective}</p>
                                <p>Recompensa: {quest.reward} puntos</p>
                                <p>Cantidad: {quest.progress}/{quest.counter}</p>
                                <input 
                                    type="checkbox" 
                                    id={quest.name} 
                                    checked={quest.finished}  // Aquí se usa el valor de 'finished'
                                    readOnly 
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Renderiza las misiones otras */}
                <div className="quests-category">
                    <h2>Otras misiones</h2>
                    <ul>
                        {quests?.questTree.others && quests?.questTree.others.length > 0 ? (
                            quests.questTree.others.map((quest, index) => (
                                <li key={index}>
                                    <label>{quest.name}</label>
                                    <p>{quest.description}</p>
                                    <p>Objetivo: {quest.objective}</p>
                                    <p>Recompensa: {quest.reward} puntos</p>
                                    <p>Cantidad: {quest.progress}/{quest.counter}</p>
                                    <input 
                                        type="checkbox" 
                                        id={quest.name} 
                                        checked={quest.finished}  // Aquí se usa el valor de 'finished'
                                        readOnly 
                                    />
                                </li>
                            ))
                        ) : (
                            <p>No hay misiones en esta categoría.</p>
                        )}
                    </ul>
                </div>

            </div>
            <button className='closeWindow' onClick={closeWindow}> ❌ Cerrar</button>
        </>
    );
}
