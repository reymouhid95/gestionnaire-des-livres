<<<<<<< HEAD
import React, { useEffect } from 'react';
import SidebarComponent from './SidebarComponent';
import { menuUser } from './Utils';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';

=======
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";
import { menuUser } from "./Utils";
>>>>>>> 5e16f57db24a314ab87b8ad55896011a493ffa10

function SidebarUser() {
  const deconnexion = () => {
    localStorage.removeItem("utilisateur");
    window.location.replace("/connexion");
  };
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div className="vh-100 sidebar p-2">
      <div className="m-2">
        <AutoStoriesIcon className="fs-2" />
        <span className="brand-name fs-1 fw-bold mx-2">eBook</span>
      </div>
      <hr className="text-white border-3 mt-5" style={{ color: "#fff" }} />
      <div data-aos="fade-left" className="list-group list-group-flush">
        {menuUser.map((elem, index) => (
          <SidebarComponent {...elem} key={index} />
        ))}
        <Link
          style={{ textDecoration: "none" }}
<<<<<<< HEAD
          className="py-3 my-2  list-group-item"
          onClick={deconnexion}
        >
          <i className="bi bi-box-arrow-right fs-5 me-3"></i>
          <span className="fs-5">Logout</span>
=======
          className="py-3 my-2 rounded"
          onClick={deconnexion}
        >
          <a className="list-group-item">
            <i className="bi bi-box-arrow-right fs-5 me-3"></i>
            <span className="fs-5">Logout</span>
          </a>
>>>>>>> 5e16f57db24a314ab87b8ad55896011a493ffa10
        </Link>
      </div>
    </div>
  );
}

export default SidebarUser;
