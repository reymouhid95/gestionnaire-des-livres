// Importation des outils nécessaires
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

// Méthode principale du composant
const GoogleAuth = () => {
  const [user, setUser] = useState(null);

  // Pour vérfier l'état
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

    return () => {
      unsubscribe();
    };
  }, []);

  // Méthode pour pouvoir se connecter
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  // Méthode pour pouvoir se déconnecter
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  // L'affichage du composant
  return (
    <div className="mb-3">
      {user ? (
        <Button variant="outline-danger" onClick={signOut} className="btn-lg">
          Log Out
        </Button>
      ) : (
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
      )}
    </div>
  );
};

export default GoogleAuth;
