/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
//Importattion des outils nécessaires
import { useState } from "react";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Form, Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

// Méthode princiaple du composant
const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  // Méthodes de contrôle du modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Méthode pour pouvoir réinitialiser le mot de passe
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail("");
        toast.success("Mail envoyé dans votre boite mail!");
        setShow(false);
      })
      .catch(() => {
        toast.error("Merci de vérifier l'adresse email saisie.");
      });
  };

  // Méthode de contôle du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // L'affichage du composant
  return (
    <div className="mb-3">
      <div>
        <a href="#" onClick={handleShow} className="mx-2 fw-bold">
          Mot de place oublié ? <span className="text-info">cliquez ici!</span>
        </a>
      </div>

      <Modal show={show} onHide={handleClose} className="text-center">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <span className="fs-1 fw-bold">
              <AutoStoriesIcon className="mb-3 logo" />
              eBook
            </span>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="mb-5 formulaire"
            />
            <Button
              variant="outline-secondary"
              onClick={handlePasswordReset}
              className="btn-lg mb-5"
            >
              Reset
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PasswordReset;
