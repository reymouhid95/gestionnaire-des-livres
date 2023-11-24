/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Importation des outils nécessaires
import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import MailLockIcon from "@mui/icons-material/MailLock";
import LockIcon from "@mui/icons-material/Lock";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Auth from "../assets/auth-illustration.svg";
import GoogleAuth from "../Components/AuthGoogle";
import FacebookAuth from "../Components/AuthFacebook";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

// Méthode principale du composant
function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [existingEmails, setExistingEmails] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const navigate = useNavigate();

  // Méthode pour pouvoir s'inscrire
  const handleSignUp = () => {
    if (isEmailUnique) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setName("");
          toast.success("Utilisateur inscrit avec succès!");
          navigate("/connexion");
        })
        .catch((error) => {
          console.error("Login error:", error.message);
          toast.error("Cette adresse e-mail est déjà utilisée !");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setName("");
        });
    } else {
      toast.error("L'utilisateur n'a pas pu être inscrit !");
    }
  };

  // Méthode de récupération du nom saisi dans le champ
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  // Méthode de récupération de l'email saisi dans le champ
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailUnique(true);

    // Expression régulière pour valider l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Vérifie si l'e-mail est au format valide
    setIsEmailValid(emailRegex.test(newEmail));

    // Vérifie si l'e-mail se termine par un chiffre ou une lettre après le .com
    const invalidEmailSuffixRegex = /\.com[0-9a-zA-Z]+$/;
    if (invalidEmailSuffixRegex.test(newEmail)) {
      setIsEmailValid(false);

      // Ajoutez ici votre logique pour gérer l'invalidité de l'e-mail
      toast.error(
        "L'adresse e-mail ne peut pas contenir de caractères après le '.com'. Veuillez l'enlever pour pouvoir vous inscrire !"
      );
    }

    if (existingEmails.includes(newEmail)) {
      setIsEmailUnique(false);
    }
  };

  // Méthode de récupération du mot de passe saisi dans le champ
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Méthode de récupération du mot de passe confirmé saisi dans le champ
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Méthode de contôle du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && password === confirmPassword) {
      toast.success("Utilisateur inscrit avec succès!");
      handleSignUp();
    } else if (!isEmailValid) {
      toast.error("Veuillez saisir une adresse e-mail valide !");
    } else if (!isEmailUnique) {
      toast.error("Cette adresse e-mail est déjà utilisée !");
    } else {
      toast.error("Les mots de passe ne correspondent pas !");
    }
  };

  // Rendu du composant
  return (
    <>
      <Row className="m-0 inscription">
        <Col md={6} className=" backOne text-center text-light fw-bold m-0 p-0">
          <h1>Welcome to eBook</h1>
          <p className="mt-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <img src={Auth} alt="Imahe-auth" className="img-fluid" />
        </Col>
        <Col md={6} className="backTwo">
          <Form onSubmit={handleSubmit} className="form color">
            <span className="fs-1 fw-bold">
              <AutoStoriesIcon className="mb-3 logo" />
              eBook
            </span>
            <h1 className="mb-5 fw-bold">Inscription</h1>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <PersonIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Nom"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={name}
                onChange={handleNameChange}
              />
            </InputGroup>
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
                placeholder="Créer un mot de passe"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={password}
                onChange={handlePasswordChange}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <LockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Confirmer le mot de passe"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </InputGroup>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              className="mb-3"
            >
              S'inscrire
            </Button>
            <p className="text-uppercase">Or</p>
            <GoogleAuth />
            <FacebookAuth />
            <p>Si vous avez déjà un compte connectez-vous</p>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default SignUp;
