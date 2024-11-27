// import React from 'react';
import GridMap from './GridMap';
import BackButton from '../UI/backButton';
// import Inventory from './Inventory';



export default function TownMap() {


    return (
        <div style={{ padding: '10px', backgroundColor: 'lightgreen' }}> 
            <h2>Mi Hogar</h2>
            <GridMap />
            {/* <Inventory /> */}
           {/* <a href="/home"><button>Volver</button></a>  */}
           <BackButton/>
        </div>
    );

}