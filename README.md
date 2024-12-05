El libro escarlata

Cosas para hacer:
STORAGE ENEMIGOS

PROBAR BASE DE DATOS 
Musica en el juego


Estadísticas
Verificar doble cartel de peleas
Que haya una opción desplegable cuando paso por arriba del arma actual.
Traducir tienda
Mejorar tema de misiones ( que no sean botones)
Cuando mato al boss del dungeon me debería preguntar si quiero seguir o salir.
Que las misiones den recompenza.
Aliado para pelear en la tienda
Dropeo de enemigos.
Animación cunado ataca.
Huevo de dragón
Dependiendo la hora del día quiero que cambie de color el fondo.
Box dialog design rpg
Mailbox
Bestiario de criaturas derrotadas y cantidad.
Imágenes de clases
Carga y descarga de personaje
Agregarle un chat



Configurar Firebase:

Ve a Firebase Console y crea un nuevo proyecto.
Activa Firestore Database.
Obtén las credenciales de configuración para tu aplicación.
Instalar Firebase en tu proyecto: Si estás usando Node.js o React:

bash
Copiar código
npm install firebase
Configurar Firebase en tu código:

javascript
Copiar código
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_DOMINIO.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_BUCKET.appspot.com",
    messagingSenderId: "TU_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
Guardar información:

javascript
Copiar código
const guardarDatos = async () => {
    try {
        await addDoc(collection(db, "miColeccion"), {
            nombre: "Ejemplo",
            edad: 25,
        });
        console.log("¡Documento añadido!");
    } catch (e) {
        console.error("Error al añadir el documento: ", e);
    }
};
Recuperar información:

javascript
Copiar código
const obtenerDatos = async () => {
    const querySnapshot = await getDocs(collection(db, "miColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
};
