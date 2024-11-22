El libro escarlata

Cosas para hacer:



Bestiario de criaturas derrotadas y cantidad.
Imágenes de clases
Carga y descarga de personaje
Pueod buscar otro enemigo cuando fui derrotado

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




ARBOL DE MISIONES

MISIONES HISTORIA (por ahora matar bosses)
MISIONES SECUNDARIAS (por ahora  matar criaturas)
MISIONES OTRAS (por ahora nada)

Tienen nombre, descripción, contador, objetivo, tipo
Ejemplo: 
Cazar lobo
Hay que cazar 5 lobos
Contador: 5
Objetivo: lobo
recompenza: 5
Tipo: kill