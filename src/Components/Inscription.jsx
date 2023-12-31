/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LockIcon from "@mui/icons-material/Lock";
import MailLockIcon from "@mui/icons-material/MailLock";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import GoogleAuth from "../Components/AuthGoogle";
import Auth from "../assets/signup.svg";
import { auth, db } from "../firebase-config";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [existingEmails, setExistingEmails] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleSignUp = async () => {
    if (isEmailUnique) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        // Ajouter l'utilisateur dans le firestore
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          name: name,
          email: email,
          bloqued: false,
        });
        localStorage.setItem("userName", name);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        toast.success("Succesful registration!");
        setTimeout(() => {
          navigate("/connexion");
        }, 3000);
      } catch (error) {
        console.error("Registration error :", error.message);
        toast.error("Failed! enrollment");
      } finally {
        setLoading(false);
        setLoadingComplete(true);
      }
    } else {
      toast.error("Failed! enrollment!");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailUnique(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(newEmail));

    const invalidEmailSuffixRegex = /\.com[0-9a-zA-Z]+$/;
    if (invalidEmailSuffixRegex.test(newEmail)) {
      setIsEmailValid(false);
      toast.error(
        "The e-mail address cannot contain characters after the '.com'. Please remove it so you can register!"
      );
    }

    if (existingEmails.includes(newEmail)) {
      setIsEmailUnique(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && password === confirmPassword) {
      handleSignUp();
    } else if (!isEmailValid) {
      toast.error("Please enter a valid email address!!");
    } else if (!isEmailUnique) {
      toast.error("This email address is already in use!!");
    } else {
      toast.error("Passwords don't match!!");
    }
  };

  return (
    <>
      <ToastContainer />
      <Row className="m-0 inscription">
        <Col md={6} className="backThree text-center text-light fw-bold">
          <h1 className="my-3">Welcome to eBook</h1>
          <p className="my-3">
            The platform that will make you autonomous in your studies.
          </p>
          <img src={Auth} alt="Image-auth" className="sign" />
        </Col>
        <Col md={6} className="backTwo">
          <Form className="form color" onSubmit={handleSubmit}>
            <span className="fs-1 fw-bold">
              <AutoStoriesIcon className="mb-3 logo" />
              eBook
            </span>
            <h1 className="mb-2">Registration</h1>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <PersonIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={name}
                onChange={handleNameChange}
                required
                type="text"
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
                required
                type="email"
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
                required
                type="password"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <LockIcon />
              </InputGroup.Text>
              <Form.Control
                placeholder="Confirm password"
                aria-label="Userpassword"
                aria-describedby="basic-addon1"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                type="password"
              />
            </InputGroup>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              className="mb-3"
              disabled={loading}
            >
              Sign Up
              {!loadingComplete && loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {loading && loadingComplete ? "Inscription..." : null}
            </Button>
            {/* <p className="text-uppercase">Or</p>
            <GoogleAuth /> */}
            <p className="fw-bold">
              Already have an account ?{" "}
              <Link to="/connexion">
                <span className="text-info fw-bold">Click here</span>
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default SignUp;
