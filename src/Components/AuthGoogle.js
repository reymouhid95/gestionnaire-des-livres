/* eslint-disable no-unused-vars */
// Importation des outils nécessaires
import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { auth, googleProvider } from "../firebase-config";

// Méthode principale du composant
const GoogleAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // L'utilisateur est connecté
        setUser(authUser);
      } else {
        // L'utilisateur n'est pas connecté
        setUser(null);
      }
    });

    // Nettoyez le listener lors du démontage du composant
    return () => unsubscribe();
  }, []);

  // Méthode pour pouvoir se connecter
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  // L'affichage du composant
  return (
    <div className="mb-3">
      <Button
        variant="outline-danger"
        onClick={signInWithGoogle}
        className="log"
      >
        <span className="px-2">
          <Icon.Google size={25} />
        </span>
        With Google
      </Button>
    </div>
  );
};

export default GoogleAuth;
