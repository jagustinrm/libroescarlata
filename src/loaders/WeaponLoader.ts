import { useEffect, useState } from "react";

const WeaponLoader = () => {
    const [weapons, setWeapons] = useState([]);

    useEffect(() => {
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

    return { weapons };
}

export default WeaponLoader;
