/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
//Importattion des outils nécessaires
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "../firebase-config";

// Méthode princiaple du composant
const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Méthodes de contrôle du modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Méthode pour pouvoir réinitialiser le mot de passe
  const handlePasswordReset = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail("");
        toast.success("Email sent to your inbox!");
        setTimeout(() => {
          setShow(false);
        }, 3000);
      })
      .catch(() => {
        toast.error("Please check the email address entered!");
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setLoadingComplete(true);
        }, 2000);
      });
  };

  // Méthode de contôle du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // L'affichage du composant
  return (
    <div className="mb-3">
      <ToastContainer />
      <div>
        <a href="#" onClick={handleShow} className="mx-2 fw-bold">
          Forgot password ? <span className="text-info">click here!</span>
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
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handlePasswordReset}
              className="mb-3"
              disabled={loading}
            >
              Send{" "}
              {!loadingComplete && loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {loading && loadingComplete ? "Envoie..." : null}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PasswordReset;
