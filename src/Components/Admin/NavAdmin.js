/* eslint-disable no-unused-vars */
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase-config";

function NavAdmin({ Toggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMenuOpenNotif = Boolean(anchorElNotif);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const loadNotifications = useCallback(() => {
    try {
      const notifCollection = collection(db, "notifications");
      const unsubscribe = onSnapshot(
        query(notifCollection, orderBy("timestamp", "desc")),
        (snapshot) => {
          const notifData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifs(notifData);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Error loading. Please check your internet connection!");
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const loadAvatar = useCallback((userId) => {
    const profileImageRef = ref(
      storage,
      `path/to/admin/${userId}/profile-image.jpg`
    );
    getDownloadURL(profileImageRef)
      .then((url) => setAvatarImage(url))
      .catch((error) => {
        console.error("Error loading profile image:", error.message);
      });
  }, []);

  const loadUserDetails = useCallback(
    (user) => {
      setUserId(user.id);
      setUserName(user.name);
      setUserEmail(user.email);
      loadAvatar(user.id);
    },
    [loadAvatar]
  );

  const loadUsers = useCallback(async () => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(userCollection);
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);

      const currentUser = userData[0];
      if (currentUser) {
        loadUserDetails(currentUser);
        loadAvatar(currentUser.id);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Loading error. Please check your internet connection!");
    }
  }, [loadUserDetails, loadAvatar]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    // Récupérer les notifications lues depuis le stockage local
    const readNotifications =
      JSON.parse(localStorage.getItem("readNotifications")) || [];

    // Filtrer les nouvelles notifications qui ne sont pas lues
    const newUnreadNotifications = notifs.filter(
      (notif) => !readNotifications.includes(notif.id)
    );

    // Mettre à jour le compteur de nouvelles notifications
    setNewNotificationsCount(newUnreadNotifications.length);
  }, [notifs]);

  const signalNewNotif = async (date) => {
    // Récupérez la première notification non lue
    const firstUnreadNotif = notifs.find((notif) => notif.timestamp === date);
    console.log(firstUnreadNotif);
    // Si une notification non lue a été trouvée, mettez à jour le document Firestore
    await updateDoc(doc(db, "notifications", firstUnreadNotif.id), {
      newNotif: false,
    });
  };

  const handleModalOpen = () => setOpenModal(true);

  const handleModalClose = () => setOpenModal(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
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

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const profileImageRef = ref(
        storage,
        `path/to/admin/${userId}/profile-image.jpg`
      );
      uploadBytes(profileImageRef, file)
        .then(() => loadAvatar(userId))
        .catch((error) => {
          console.error("Error uploading profile image:", error.message);
        });
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
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
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
        {notifs.map((notif, index) => (
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
              className={`notifs px-2 py-2 rounded ${
                index === notifs.length - 1 ? "last-notification" : ""
              }`}
            >
              {notif.messageForAdmin}
            </p>
          </MenuItem>
        ))}
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
        <Dialog open={openModal} onClose={handleModalClose}>
          <DialogTitle>Profile</DialogTitle>
          <DialogContent>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <p>Name: {userName}</p>
            <p>Email: {userEmail}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleModalClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderMenuNotif}
    </Box>
  );
}

export default NavAdmin;
