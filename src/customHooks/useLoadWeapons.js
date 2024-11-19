import { useEffect, useState } from "react";



export function useLoadWeapons() {
    const [initialWeapons, setInitialWeapons] = useState([]);
    const [charWeapon, setCharWeapon] = useState(null);

    useEffect(() => {
        // Cargar armas desde el archivo JSON
        const loadInitWeapons = async () => {
            try {
                const res = await fetch('/mocks/weapons.json');
                const data = await res.json();
                setInitialWeapons(data.weapons || []);
            } catch (error) {
                console.error("Error loading weapons:", error);
                setInitialWeapons([]); 
            }
        };

        loadInitWeapons();
    }, []);

    useEffect(() => {
        // Buscar el arma del personaje una vez que las armas iniciales estén cargadas
        const charWeaponId = localStorage.getItem('charWeaponId');
        
        if (charWeaponId && initialWeapons.length > 0) {
            console.log(initialWeapons)
            const weapon = initialWeapons.find(w => w.id === parseInt(charWeaponId));
            if (weapon) {
                setCharWeapon(weapon.name); // Asigna el nombre del arma al estado
            } else {
                console.warn(`Arma con ID ${charWeaponId} no encontrada`);
                setCharWeapon(null); // Limpia el estado si no se encuentra el arma
            }
        }
    }, [initialWeapons]); // Dependemos de que las armas iniciales estén cargadas

    return { initialWeapons, charWeapon };
}
