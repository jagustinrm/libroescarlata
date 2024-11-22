El libro escarlata

Cosas para hacer:



Bestiario de criaturas derrotadas y cantidad.
Imágenes de clases
Carga y descarga de personaje

Agregarle un chat




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

