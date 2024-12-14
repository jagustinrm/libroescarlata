// OJO QUE AMOUNT ES UN STRING, ES UN DADO
// HABRÍA QUE AGREGAR VALUE PARA LAS OTRAS POCIONES QUE NO SON DE CURACIÓN
export interface PotionEffect {
    type: string
    amount?: string;
    stat?: string;
    duration?: string;
    description?: string;
}

export interface Potion {
    id: string;
    name: string;
    effect?:  PotionEffect; 
    cost: number;
    weight: string;
    description: string;
    img: string;
    levelRequirement?: number;
}


export interface PotionStore {
    potions: Potion[];                          
    arePotionsLoaded: boolean;                  
    setPotions: (potions: Potion[]) => void;    
    addNewPotion: (newPotion: Potion) => void;  
    updatePotion: (updatedPotion: Potion) => void; 
}
