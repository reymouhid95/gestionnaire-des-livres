/* eslint-disable jsx-a11y/anchor-is-valid */
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Link } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";
import { menuAdmin } from "./Utils";

function SidebarAdmin() {
  const deconnexion = () => {
    localStorage.removeItem("utilisateur");
    window.location.replace("/connexion");
  };
  return (
    <div className="vh-100 sidebar p-2">
      <div className="m-2" id="logo">
        <AutoStoriesIcon className="fs-1" />
        <span className="brand-name fs-1 fw-bold mx-1">eBook</span>
      </div>
      <hr className="text-white border-3 mt-5" style={{ color: "#fff" }} />
      <div className="linkSidebar" id="linkSidebar">
        {menuAdmin.map((elem, index) => (
          <SidebarComponent {...elem} key={index} />
        ))}
        <Link
          style={{ textDecoration: "none" }}
          className="py-4 ps-2 my-2 rounded items"
          onClick={deconnexion}
        >
          <i className="bi bi-box-arrow-right fs-5 me-3"></i>
          <span className="fs-5">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default SidebarAdmin;
