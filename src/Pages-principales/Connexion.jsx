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
import Auth from "../assets/auth-illustration.svg";
import toast from "react-hot-toast";
import PasswordReset from "../Components/Reset";
import GoogleAuth from "../Components/AuthGoogle";
import FacebookAuth from "../Components/AuthFacebook";
import { Link, useNavigate } from 'react-router-dom';

// Méthode principale du composant
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
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
      .then(() => {
        setEmail("");
        setPassword("");
        toast.success("Utilisateur connecté!");
        navigate("/user/dashboard")
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
      <Row className="m-0 connexion">
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

export default SignIn;
