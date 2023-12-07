/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LockIcon from "@mui/icons-material/Lock";
import MailLockIcon from "@mui/icons-material/MailLock";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import GoogleAuth from "../Components/AuthGoogle";
import PasswordReset from "../Components/Reset";
import Auth from "../assets/auth-illustration.svg";
import { auth } from "../firebase-config";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem("utilisateur"));

    if (user) {
      // Si l'utilisateur est connecté, redirigez-le vers le tableau de bord approprié
      if (user.email === "serigne@gmail.com") {
        navigate("/admin/dashboardAdmin");
      } else {
        navigate("/user/dashboardUser");
      }
    }
  }, [navigate]);
  // Connecter un utilisateur
  const handleSignIn = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    // Set loading to true when starting the sign-in process
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("utilisateur", JSON.stringify(user));
        setEmail("");
        setPassword("");
        toast.success(
          email === "serigne@gmail.com"
            ? "Administrateur connecté!"
            : "Utilisateur connecté!"
        );
        setTimeout(() => {
          if (email === "serigne@gmail.com") {
            navigate("/admin/dashboardAdmin");
          } else {
            navigate("/user/dashboardUser");
          }
        }, 3000);
      })
      .catch((error) => {
        toast.error("Vérifiez les identifiants!");
        setEmail("");
      })
      .finally(() => {
        // Reset loading to false after the sign-in process is completed
        setTimeout(() => {
          setLoading(false);
          setLoadingComplete(true);
        }, 2000);
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
              disabled={loading}
            >
              Se connecter{" "}
              {!loadingComplete && loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {loading && loadingComplete ? "Connexion..." : null}
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
          <h1 className="my-3">Bienvenue sur eBook</h1>
          <p className="my-3">
            La plateforme qui vous rendra autonome dans vos études.
          </p>
          <img src={Auth} alt="Image-auth" className="img-fluid" />
        </Col>
      </Row>
    </>
  );
}

export default SignIn;
