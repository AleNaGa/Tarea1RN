import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAXOe0MJGI7RiC5mTt9Fcne8mihE2IgCoI",
    authDomain: "vedrunaapp-47a59.firebaseapp.com",
    projectId: "vedrunaapp-47a59",
    storageBucket: "vedrunaapp-47a59.firebasestorage.app",
    messagingSenderId: "433750452436",
    appId: "1:433750452436:web:56545de33c66d1c5157341"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la autenticación
export const auth = getAuth(app);
