El libro escarlata

Cosas para hacer:

Aliado para pelear en la tienda
Dropeo de enemigos
Huevo de dragón
Dependiendo la hora del día quiero que cambie de color el fondo.
Box dialog design rpg
Mailbox
Cambiar el diseño de las misiones, que sea parecido a de los mensajes
Bestiario de criaturas derrotadas y cantidad.
Imágenes de clases
Carga y descarga de personaje
Agregarle un chat



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

