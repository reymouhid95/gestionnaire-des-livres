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
import { Form, Spinner } from "react-bootstrap";
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
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMenuOpenNotif = Boolean(anchorElNotif);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUser(user);
          } else {
            setAuthUser(null);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading. Please check your internet connection!");
      }
    };

    fetchData();
  }, []);

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

  // Récupération des données de lutilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser({
          name: authUser.displayName,
          email: authUser.email,
          uid: authUser.uid,
        });

        // Charger la photo depuis le stockage Firebase
        const photoRef = ref(storage, `profilePhotos/${authUser.uid}`);

        try {
          const photoUrl = await getDownloadURL(photoRef);
          setUser((prevUser) => ({ ...prevUser, photoUrl }));
          setAvatarImage(photoUrl);
        } catch (error) {
          console.error("Error loading profile photo:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleUpdateProfile = async () => {
    // Mettre à jour le profil dans Firebase Auth
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });

    // Mettre à jour le nom dans l'état local
    setUser((prevUser) => ({ ...prevUser, name: newName }));

    // Mettre à jour la photo dans le stockage Firebase
    if (newPhoto) {
      const photoRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(photoRef, newPhoto);

      // Charger la nouvelle photo depuis le stockage Firebase
      const newPhotoUrl = await getDownloadURL(photoRef);

      // Mettre à jour la photo dans l'état local
      setUser((prevUser) => ({ ...prevUser, photoUrl: newPhotoUrl }));
      setAvatarImage(newPhotoUrl);
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setLoadingComplete(true);
      setOpenModal(false);
      toast.success("Profile updated!");
    }, 2000);
  };

  // Télécharger la photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
  };

  // Contôler la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setNewName("");
    setNewEmail("");
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
          onChange={handlePhotoChange}
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
            onChange={handlePhotoChange}
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
            <DialogTitle>Edit profile</DialogTitle>
            <DialogContent>
              <div>
                {openModal && (
                  <div>
                    <div>
                      <img
                        src={user.photoUrl}
                        alt="User"
                        style={{ borderRadius: "50%", width: 50, height: 50 }}
                      />
                    </div>
                    <p className="fw-bold"> {user.name}</p>
                    <p className="fw-bold"> {user.email}</p>
                    <Form.Control
                      name="file"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="mb-3"
                    />
                    <Form.Control
                      name="name"
                      type="text"
                      placeholder="New name"
                      onChange={(e) => setNewName(e.target.value)}
                      className="mb-3"
                    />
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="New email"
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="mb-3"
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleUpdateProfile}
                      disabled={loading}
                    >
                      Update
                      {!loadingComplete && loading && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      {loading && loadingComplete ? "Loading..." : null}
                    </Button>
                  </div>
                )}
              </div>
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
