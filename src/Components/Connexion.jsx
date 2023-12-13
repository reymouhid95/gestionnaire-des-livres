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
import { useCallback, useEffect, useState } from "react";
import { Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import GoogleAuth from "../Components/AuthGoogle";
import PasswordReset from "../Components/Reset";
import Auth from "../assets/signin2.svg";
import { auth, db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

// Composant principal
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem("utilisateur"));
    if (user) {
      if (user.email === "serigne@gmail.com") {
        navigate("/admin/dashboardAdmin");
      } else {
        navigate("/user/dashboardUser");
      }
    }
  }, [navigate]);

  const loadUsers = useCallback(async () => {
    try {
      const bookCollection = collection(db, "users");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);


  useEffect(() => {
    loadUsers();
  }, [loadUsers]);



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

    setLoading(true);

    // Connecter l'utilisateur
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userBlocked = users.find((user) => user.email === email);
        if (userBlocked.bloqued) {
          setLoading(false);
          toast.error("Votre compte a été bloqué!");
          return;
        }
        const user = userCredential.user;
        localStorage.setItem("utilisateur", JSON.stringify(user));
        localStorage.setItem("userName", user.displayName || "");
        setEmail("");
        setPassword("");

        toast.success(
          email === "serigne@gmail.com"
            ? "Connection in progress!"
            : "Connection in progress!"
        );
        setTimeout(() => {
          if (email === "serigne@gmail.com") {
            navigate("/admin/dashboardAdmin");
          }else {
            navigate("/user/dashboardUser");
          }
        }, 3000);
      })
      .catch((error) => {
        toast.error("Vérifiez les identifiants!");
        setPassword("");
      })
      .finally(() => {
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

  // Affichage
  return (
    <>
      <ToastContainer />
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
                placeholder="Password"
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
              Sign In{" "}
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
              Don't have a account ?{" "}
              <Link to="/inscription">
                <span className="text-info fw-bold">Click here</span>
              </Link>
            </p>
          </Form>
        </Col>
        <Col md={6} className="backThree text-center text-light fw-bold">
          <h1 className="my-3">Welcome to eBook</h1>
          <p className="my-3">
            The platform that will make you autonomous in your studies.
          </p>
          <img src={Auth} alt="Image-auth" className="img-fluid sign" />
        </Col>
      </Row>
    </>
  );
}

export default SignIn;
