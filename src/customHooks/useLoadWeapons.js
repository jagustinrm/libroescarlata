import { useEffect, useState } from "react";

export function useLoadWeapons() {
    const [weapons, setWeapons] = useState([]);

    useEffect(() => {
        // Cargar armas desde el archivo JSON
        const loadInitWeapons = async () => {
            try {
                const res = await fetch('/mocks/weapons.json');
                const data = await res.json();
                setWeapons(data.weapons || []);
            } catch (error) {
                console.error("Error loading weapons:", error);
                setWeapons([]); 
            }
        };

        loadInitWeapons();
    }, []);

    // useEffect(() => {
    //     // Buscar el arma del personaje una vez que las armas iniciales estén cargadas
    //     const charWeaponId = localStorage.getItem('charWeaponId');
        
    //     if (charWeaponId && weapons.length > 0) {
    //         const weapon = weapons.find(w => w.id === parseInt(charWeaponId));
    //         if (weapon) {
                
    //             localStorage.setItem("charActualWeapon", JSON.stringify(weapon));
    //         } else {
    //             console.warn(`Arma con ID ${charWeaponId} no encontrada`);
  
    //         }
    //     }
    // }, [weapons]); // Dependemos de que las armas iniciales estén cargadas

    return { weapons };
}
