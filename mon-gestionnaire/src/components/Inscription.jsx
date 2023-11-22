/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// Importation des outils nécessaires
import { useState } from "react";
import { Form } from "react-bootstrap";
// import { auth } from "../firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { Stack, Box, TextField, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";

// Méthode principale du composant
function SignUp() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  // const onSubmit = (data) => {
  //   createUserWithEmailAndPassword(auth, data.email, data.password)
  //     .then(() => {
  //       alert("User signed up successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Sign-up error:", error.message);
  //     });
  // };

  // Rendu du composant
  return (
    <>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
        height={"100vh"}
      >
        <Box
          width={"400px"}
          sx={{
            backgroundColor: "#fff",
            padding: 3,
            borderRadius: 5,
          }}
        >
          <Typography variant="h3">Inscription</Typography>
          <Form>
            <Stack gap={2}>
              <TextField
                id="nomUtilisateur"
                label="Nom"
                variant="filled"
                fullWidth
                size="small"
                type="text"
                // {...register("nomUtilisateur", {
                //   required: "Veuillez saisir un nom",
                //   minLength: {
                //     value: 5,
                //     message: "Veuillez saisir un nom de plus de 5 caractères",
                //   },
                // })}
              />
              <TextField
                id="email"
                label="Email"
                variant="filled"
                fullWidth
                size="small"
                type="email"
                // {...register("email", {
                //   required: "Veuillez saisir une adresse e-mail",
                //   pattern: {
                //     value: /^\S+@\S+$/i,
                //     message: "Veuillez saisir une adresse e-mail valide",
                //   },
                // })}
              />
              <TextField
                id="password"
                label="Créer le mot de passe"
                variant="filled"
                fullWidth
                size="small"
                type="password"
                // {...register("password", {
                //   required: "Veuillez saisir un mot de passe",
                //   minLength: {
                //     value: 8,
                //     message:
                //       "Le mot de passe doit contenir au moins 8 caractères",
                //   },
                // })}
              />
              <TextField
                id="confirmPassword"
                label="Confirmer le mot de passe"
                variant="filled"
                fullWidth
                size="small"
                type="password"
                // {...register("confirmPassword", {
                //   validate: (value) =>
                //     value === password ||
                //     "Les mots de passe ne correspondent pas",
                // })}
              />
              <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                Envoyer
              </Button>
              <p>Si vous avez déjà un compte connectez-vous</p>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </>
  );
}

export default SignUp;
