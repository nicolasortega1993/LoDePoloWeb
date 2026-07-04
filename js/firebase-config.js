// ============================================================
// CONFIGURACIÓN DE FIREBASE
// ============================================================
// 1. Andá a https://console.firebase.google.com
// 2. Creá un proyecto nuevo (gratis, sin tarjeta) llamado por ej. "lo-de-polo"
// 3. Dentro del proyecto: ⚙️ Configuración del proyecto > tus apps > </> (Web)
//    Registrá una app y Firebase te va a dar un objeto igual a este.
// 4. Reemplazá los valores de abajo por los tuyos.
// 5. Activá Firestore Database (modo producción) y Authentication
//    (método Email/contraseña) desde el menú lateral de Firebase.
//    Los pasos detallados están en el README.md
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAc4uhpLWbxwLtyT08LA-CDch3dweJQSNc",
  authDomain: "lo-de-polo.firebaseapp.com",
  projectId: "lo-de-polo",
  storageBucket: "lo-de-polo.firebasestorage.app",
  messagingSenderId: "524296596056",
  appId: "1:524296596056:web:906dfad73a1c5c4038382d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
