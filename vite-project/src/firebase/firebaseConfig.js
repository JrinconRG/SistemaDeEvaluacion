// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBeF7N2MU0uOYjMDnqSK4fRsY41G_E0tEo",
  authDomain: "gestionclara-ba588.firebaseapp.com",
  projectId: "gestionclara-ba588",
  storageBucket: "gestionclara-ba588.appspot.com", 
  messagingSenderId: "981589252785",
  appId: "1:981589252785:web:4d24c8a96fd89e7bef6090",
  measurementId: "G-2GB0RX9NX0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Autenticación
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistencia configurada"))
  .catch((error) => console.error("Error configurando persistencia:", error));

// Firestore
const db = getFirestore(app);

export { app, auth, db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where };

export default app; 
