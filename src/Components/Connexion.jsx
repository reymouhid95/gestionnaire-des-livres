/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// Importation des outils nécessaires
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LockIcon from "@mui/icons-material/Lock";
import MailLockIcon from "@mui/icons-material/MailLock";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../Components/AuthGoogle";
import PasswordReset from "../Components/Reset";
import Auth from "../assets/auth-illustration.svg";
import { auth } from "../firebase-config";

// Méthode principale du composant
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("utilisateur")) {
      navigate("/user/dashboard");
    }
  }, []);
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
        localStorage.setItem("utilisateur", JSON.stringify(user));
        setEmail("");
        setPassword("");
        toast.success("Utilisateur connecté!");
        if (email === "serigne@gmail.com") {
          navigate("/admin/dashboardAdmin");
        } else {
          navigate("/user/dashboardUser");
        }
      })
      .catch((error) => {
        toast.error("Vérifiez les identifiants!");
        setEmail("");
      });
  };

  // Méthode de récupération de l'email saisi dans le champ
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
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
            <h1 className="mb-2">Connexion</h1>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <MailLockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Email"
                aria-label="Usermail"
                aria-describedby="basic-addon1"
                value={email}
                onChange={handleEmailChange}
                type="email"
                required
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <LockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Mot de passe"
                aria-label="Userpassword"
                aria-describedby="basic-addon1"
                value={password}
                onChange={handlePasswordChange}
                type="password"
                required
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
            <p className="fw-bold">
              Vous n'avez pas de compte ?{" "}
              <Link to="/inscription">
                <span className="text-info fw-bold">Cliquez ici</span>
              </Link>
            </p>
          </Form>
        </Col>
        <Col md={6} className="backThree text-center text-light fw-bold">
          <h1 className="my-3">Welcome to eBook</h1>
          <p className="my-3">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <img src={Auth} alt="Image-auth" className="img-fluid" />
        </Col>
      </Row>
    </>
  );
}

export default SignIn;
