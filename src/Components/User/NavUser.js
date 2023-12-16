/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../firebase-config";

function NavUser({ Toggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  // const auth = getAuth();

  const isMenuOpen = Boolean(anchorEl);
  const isMenuOpenNotif = Boolean(anchorElNotif);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const getAvatarUrl = async () => {
      try {
        if (authUser) {
          const profileImageRef = ref(
            storage,
            `path/to/users/${authUser.uid}/profile-image.jpg`
          );
          const url = await getDownloadURL(profileImageRef);
          setProfileImage(url);
        }
      } catch (error) {
        console.error("Error getting profile image URL:", error.message);
      }
    };

    getAvatarUrl();
  }, [authUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // L'utilisateur est connecté
            setAuthUser(user);
          } else {
            // L'utilisateur n'est pas connecté
            setAuthUser(null);
          }
        });

        return () => unsubscribe(); // Nettoyage lors du démontage du composant
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading. Please check your internet connection!");
      }
    };

    fetchData();
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const userCollection = collection(db, "users");
      const unsubscribe = onSnapshot(userCollection, (snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Loading error. Please check your internet connection!!");
    }

    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const loadNotifications = useCallback(() => {
    try {
      const displayName = authUser ? authUser.displayName : null;
      const notifCollection = collection(db, "notifications");
      const unsubscribe = onSnapshot(
        query(
          notifCollection,
          where("name", "==", displayName),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          const notifData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifs(notifData);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Error loading. Please check your internet connection!");
    }
  }, [authUser]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Mise à jour du profil
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // L'utilisateur est connecté, récupérer ses données
        setUser({
          name: authUser.displayName,
          email: authUser.email,
          uid: authUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleUpdateProfile = async () => {
    try {
      // Mettez à jour le profil de l'utilisateur avec les nouvelles données
      await updateProfile(auth.currentUser, {
        displayName: newName,
        email: newEmail,
      });

      // Mettre à jour l'état local avec les nouvelles données de manière immuable
      setUser((prevUser) => ({
        ...prevUser,
        name: newName,
        email: newEmail,
      }));

      // Effacez les champs de saisie
      setNewName("");
      setNewEmail("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error.message);
    }
  };

  // Contôler la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.error("User not found.");
        return;
      }

      if (!newName || !newEmail) {
        console.error("Name and email cannot be empty.");
        return;
      }

      // Vérifier si le nom ou l'email a été modifié
      const isNameChanged = newName !== user.name;
      const isEmailChanged = newEmail !== user.email;

      if (!isNameChanged && !isEmailChanged) {
        console.log("No changes detected.");
        return;
      }

      // Mettre à jour le profil uniquement avec les champs modifiés
      const updatedFields = {};
      if (isNameChanged) updatedFields.name = newName;
      if (isEmailChanged) updatedFields.email = newEmail;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedFields);

      // Mettre à jour localement
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedFields,
      }));

      // Mettre à jour le profil Firebase
      await updateProfile(auth.currentUser, {
        displayName: newName,
        email: newEmail,
      });

      // Fermer le Modal
      setOpenModal(false);

      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Error updating profile. Please try again!");
    }
  };

  useEffect(() => {
    // Récupérer les notifications lues depuis le stockage local
    const readNotifications =
      JSON.parse(localStorage.getItem("readNotifications")) || [];

    // Filtrer les nouvelles notifications qui ne sont pas lues
    const newUnreadNotifications = notifs
      .filter((notif) => notif.message)
      .filter((notif) => !readNotifications.includes(notif.id));

    // Mettre à jour le compteur de nouvelles notifications
    setNewNotificationsCount(newUnreadNotifications.length);
  }, [notifs]);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = async () => {
    // Réinitialiser les valeurs en cas d'annulation
    setAvatarImage(null);

    // Fermer le Modal
    setOpenModal(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const signalNewNotif = async (date) => {
    // Récupérez la première notification non lue
    const firstUnreadNotif = notifs.find((notif) => notif.timestamp === date);
    console.log(firstUnreadNotif);
    // Si une notification non lue a été trouvée, mettez à jour le document Firestore
    await updateDoc(doc(db, "notifications", firstUnreadNotif.id), {
      newNotif: false,
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElNotif(null);
    handleMobileMenuClose();
    setNewNotificationsCount(0);

    // Stocker les notifications lues dans le stockage local
    const readNotifications = notifs.map((notif) => notif.id);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(readNotifications)
    );
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleAvatarChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const profileImageRef = ref(
          storage,
          `path/to/users/${authUser.uid}/profile-image.jpg`
        );

        // Téléchargez uniquement si nécessaire, sinon utilisez l'URL existante
        const shouldUpload = !avatarImage;

        if (shouldUpload) {
          await uploadBytes(profileImageRef, file);
        }

        // Mettez à jour localement l'URL de l'image
        const url = await getDownloadURL(profileImageRef);
        setAvatarImage(url);

        // Mettez à jour les informations de l'utilisateur dans Firebase uniquement si nécessaire
        if (shouldUpload) {
          await updateDoc(doc(db, "users", authUser.uid), {
            avatarUrl: url,
          });
        }

        console.log("Profile image updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile image:", error.message);
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </MenuItem>
    </Menu>
  );

  const renderMenuNotif = (
    <Menu
      anchorEl={anchorElNotif}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isMenuOpenNotif}
      onClose={handleMenuClose}
      className="notifsContent"
    >
      <div>
        <h6 className="text-center fw-bold">Notifications</h6>
        <hr />
        <div className="menuItem">
          {notifs
            .filter((mess) => mess.message)
            .map((notif, index) => (
              <MenuItem
                key={notif.id}
                onClick={() => signalNewNotif(notif.timestamp)}
              >
                {notif.newNotif ? (
                  <p className="rounded-circle p-1 bg-primary mx-2"></p>
                ) : (
                  ""
                )}
                <p
                  role="button"
                  className={`notifs px-2 py-2 rounded ${
                    index === notifs.length - 1 ? "last-notification" : ""
                  }`}
                >
                  {notif.message}
                </p>
              </MenuItem>
            ))}
        </div>
      </div>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      style={{ width: "100px !important" }}
    >
      <MenuItem onClick={handleProfileMenuOpenNotif}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          {newNotificationsCount > 0 ? (
            <Badge badgeContent={newNotificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          ) : (
            <NotificationsIcon />
          )}
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {avatarImage ? (
            <img
              src={avatarImage}
              alt="Avatar"
              style={{ borderRadius: "50%", width: 32, height: 32 }}
            />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem>
        <Form>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Form>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="box-navabar">
      <AppBar position="static">
        <Toolbar className="navbar py-3">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={Toggle} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <span className="brand-name fs-3 mx-2 fw-bold">Dashboard</span>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              onClick={handleProfileMenuOpenNotif}
              aria-controls={menuId}
              aria-label="show 17 new notifications"
              color="inherit"
            >
              {newNotificationsCount > 0 ? (
                <Badge badgeContent={newNotificationsCount} color="error">
                  <NotificationsIcon />
                </Badge>
              ) : (
                <NotificationsIcon />
              )}
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleModalOpen}
              color="inherit"
            >
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt="Avatar"
                  style={{ borderRadius: "50%", width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Dialog
          open={openModal}
          onClose={handleModalClose}
          className="text-center"
        >
          <Form onSubmit={handleSubmit}>
            <DialogTitle>Profile</DialogTitle>
            <DialogContent>
              <div>
                {user ? (
                  <div>
                    <p>Nom: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <div>
                      {" "}
                      <TextField
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mb-3"
                        fullWidth
                      />
                      <TextField
                        type="text"
                        id="outlined-basic"
                        label="New Name"
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mb-3"
                        fullWidth
                      />
                      <TextField
                        type="email"
                        id="outlined-basic"
                        label="New Email"
                        variant="outlined"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="mb-3"
                        fullWidth
                      />{" "}
                      <div className="d-flex justify-content-center my-2">
                        <Button
                          type="submit"
                          variant="contained"
                          endIcon={<SendIcon onClick={handleUpdateProfile} />}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Connectez-vous pour voir votre profil.</p>
                )}
              </div>
              <div></div>
            </DialogContent>
          </Form>
        </Dialog>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderMenuNotif}
    </Box>
  );
}

export default NavUser;
