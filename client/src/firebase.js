import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey:import.meta.env.VITE_APP_apiKey,
    authDomain:import.meta.env.VITE_APP_authDomain,
    projectId:import.meta.env.VITE_APP_projectId,
    storageBucket:import.meta.env.VITE_APP_storageBucket,
    messagingSenderId:import.meta.env.VITE_APP_measurementId,
    appId:import.meta.env.VITE_APP_appId,
    measurementId:import.meta.env.VITE_APP_measurementId
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user; 
};

export const logout = () => signOut(auth);
