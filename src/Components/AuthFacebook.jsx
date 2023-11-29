// Importation des outils nécessaires
import { useState } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { Button, Spinner } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

// Méthode principale du compsant
const FacebookAuth = () => {
  const [loading, setLoading] = useState(false);

  // Méthode pour pouvoir se connecter
  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Méthode pour pouvoir se déconnecter
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // L'affichage du composant
  return (
    <div className="mb-3">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : auth.currentUser ? (
        <Button
          variant="outline-primary"
          onClick={handleSignOut}
          className="btn-lg"
        >
          Log Out
        </Button>
      ) : (
        <Button
          variant="outline-primary"
          onClick={handleSignIn}
          className="log"
        >
          <span className="px-2">
            <Icon.Facebook size={25} />
          </span>
          With Facebook
        </Button>
      )}
    </div>
  );
};

export default FacebookAuth;
