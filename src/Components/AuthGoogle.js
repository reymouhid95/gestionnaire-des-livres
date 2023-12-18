/* eslint-disable no-unused-vars */
import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase-config";

// Méthode principale du composant
const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Stocker les données dans le local storage
        localStorage.setItem("user", JSON.stringify(authUser));

        setUser(authUser);

        // Rediriger vers le dashboard/user une fois connecté
        // navigate("/user/dashboardUser"); // Assurez-vous que "/dashboard/user" est le chemin correct
      } else {
        // Supprimer les données du local storage en cas de déconnexion
        localStorage.removeItem("user");

        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
