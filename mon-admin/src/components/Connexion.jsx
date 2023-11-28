/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// Importation des outils nécessaires
import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MailLockIcon from "@mui/icons-material/MailLock";
import LockIcon from "@mui/icons-material/Lock";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Auth from "../assets/images/auth-illustration.svg";
import toast from "react-hot-toast";
import PasswordReset from "./Reset.jsx";
import GoogleAuth from "./AuthGoogle.jsx";
import FacebookAuth from "./AuthFacebook.jsx";

// Méthode principale du composant
function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Méthode pour pouvoir se connecter
  const handleSignIn = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Vérifier l'email de l'utilisateur
        if (user.mail === "adminexemple@gmail.com") {
          toast.success("Admin logged in");
        } else {
          toast.success("User logged in");
        }

        setEmail("");
        setPassword("");
        toast.success("Utilisateur connecté!");
      })
      .catch((error) => {
        toast.error("Vérifiez les identifiants!");
        setEmail("");
        setPassword("");
      });
  };

  // Méthode de récupération de l'email saisi dans le champ
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Méthode de récupération du mot de passe saisi dans le champ
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Méthode de contôle du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      handleSignIn();
    }
  };

  // Rendu du composant
  return (
    <>
      <Row className="mt-5">
        <Col md={6} className="backTwo">
          <Form className="form color" onSubmit={handleSubmit}>
            <span className="fs-1 fw-bold">
              <AutoStoriesIcon className="mb-3 logo" />
              eBook
            </span>
            <h1 className="mb-5">Connexion</h1>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <MailLockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={email}
                onChange={handleEmailChange}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <LockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Mot de passe"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={password}
                onChange={handlePasswordChange}
              />
            </InputGroup>
            <PasswordReset />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              className="mb-3"
            >
              Se connecter
            </Button>
            <p className="text-uppercase">Or</p>
            <GoogleAuth />
            <FacebookAuth />
          </Form>
        </Col>
        <Col md={6} className="backThree text-center text-light fw-bold mt-4">
          <h1>Welcome to eBook</h1>
          <p className="mt-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <img src={Auth} alt="Image-auth" className="img-fluid" />
        </Col>
      </Row>
    </>
  );
}

export default Connexion;
