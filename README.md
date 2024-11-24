El libro escarlata

Cosas para hacer:
PONER EN EL FIGHTSCENE EL 
setUpdateEnemy(false) 
para que vuelva la est

Bestiario de criaturas derrotadas y cantidad.
Imágenes de clases
Carga y descarga de personaje

Agregarle un chat

Enemigos: hada
troll
elfo
mascota: dragón bebé
POCIONES
Huevo de dragón

PARA CENTRALIZAR MANEJO DE LOCALSTORAGE


3. Centralizar el manejo de localStorage:
Para evitar inconsistencias, considera mover toda la lógica de manejo de deletedEnemies a un único lugar, como un hook o función reutilizable. Por ejemplo:

tsx
Copiar código
const useDeletedEnemies = () => {
    const [enemiesDeleted, setEnemiesDeleted] = useState<Array<EnemieDeleted>>(() => {
        const storageEnemiesDeleted = localStorage.getItem('deletedEnemies');
        return storageEnemiesDeleted ? JSON.parse(storageEnemiesDeleted) as Array<EnemieDeleted> : [];
    });

    const updateDeletedEnemies = (updatedEnemies: Array<EnemieDeleted>) => {
        setEnemiesDeleted(updatedEnemies);
        localStorage.setItem('deletedEnemies', JSON.stringify(updatedEnemies));
    };

    return { enemiesDeleted, updateDeletedEnemies };
};

