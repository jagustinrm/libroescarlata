import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase (copiada desde la consola)
const firebaseConfig = {
  apiKey: "AIzaSyDzZ3hoJs2D5-WOv5OyCHuy2qE4r4HEMfw",
  authDomain: "el-libro-escarlata.firebaseapp.com",
  projectId: "el-libro-escarlata",
  storageBucket: "el-libro-escarlata.firebasestorage.app",
  messagingSenderId: "399923124576",
  appId: "1:399923124576:web:d6c27db4c79916e8a32605",
  measurementId: "G-7W7NMHHWM2"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa la base de datos
export const database = getDatabase(app);