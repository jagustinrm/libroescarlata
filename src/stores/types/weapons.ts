export interface Weapon {
    id: number;             // Identificador único del arma
    name: string;           // Nombre del arma
    type: string;           // Tipo de arma (Cuerpo a cuerpo, Distancia)
    damage: string;         // Daño del arma (por ejemplo, "1d8")
    critical: string;       // Crítico del arma (por ejemplo, "19-20/x2")
    weight: string;         // Peso del arma (por ejemplo, "4 lb")
    cost: number;           
    description: string;    // Descripción del arma
    range?: string;         // Alcance del arma (opcional, solo para armas a distancia)
}

export interface WeaponStore {
    weapons: Weapon[];                        // Lista de armas
    areWeaponsLoaded: boolean;                // Indica si las armas están cargadas
    setWeapons: (weapons: Weapon[]) => void;   // Función para establecer las armas en el estado
    addNewWeapon: (newWeapon: Weapon) => void; // Función para agregar una nueva arma
    updateWeapon: (updatedWeapon: Weapon) => void; // Función para actualizar una arma existente
}