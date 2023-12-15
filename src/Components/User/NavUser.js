import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { db } from "../../firebase-config";
import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

function NavUser({ Toggle }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [authUser, setAuthUser] = React.useState(null);
  const [notifs, setNotifs] = React.useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = React.useState(0);

  const isMenuOpen = Boolean(anchorEl);
  const isMenuOpenNotif = Boolean(anchorElNotif);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  React.useEffect(() => {
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
        alert(
          "Erreur de chargement. Veuillez vérifier votre connexion internet!"
        );
      }
    };

    fetchData();
  }, []);

  const loadNotifications = React.useCallback(() => {
    try {
      const displayName = authUser ? authUser.displayName : null;
      const notifCollection = collection(db, "notifications");
      const unsubscribe = onSnapshot(
        query(
          notifCollection,
          where("name", "==", displayName),
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
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, [authUser]);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  React.useEffect(() => {
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

  // const navigate = useNavigate();
  const deconnexion = () => {
    localStorage.removeItem("utilisateur");
    window.location.replace("/connexion");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
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
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={deconnexion}>Déconnexion</MenuItem>
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
          {notifs.map((notif, index) => (
            <MenuItem key={notif.id}>
              <p
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
          aria-label=""
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
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="box-navabar">
      <AppBar position="static">
        <Toolbar className="navbar py-4">
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
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
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
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderMenuNotif}
    </Box>
  );
}

export default NavUser;
