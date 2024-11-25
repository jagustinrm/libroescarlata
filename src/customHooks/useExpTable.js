import { useState, useEffect } from "react";
export default function useExpTable () {
    const [expTable, setExpTable] = useState()
    
    useEffect(() => {
        // Cargar el JSON al montar el componente
        const loadXpTable = async () => {
            try {
                const response = await fetch('/mocks/levelDictionary.json');
                const data = await response.json();
                setExpTable(data); // Guardar el JSON en el estado
            } catch (error) {
                console.error("Error loading XP table:", error);
            }
        };

        loadXpTable();
    }, []);

    return {expTable, setExpTable} 
}