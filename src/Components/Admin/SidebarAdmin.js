import React from 'react';
import SidebarComponent from './SidebarComponent';
import { menuAdmin } from './Utils';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Link} from 'react-router-dom';


function SidebarAdmin() {
  const deconnexion = () =>{
    localStorage.removeItem('utilisateur');
    window.location.replace("/connexion");
  }
  return (
    <div className="vh-100 sidebar p-2">
      <div className="m-2" id="logo">
        <AutoStoriesIcon className="fs-2" />
        <span className="brand-name fs-1 fw-bold mx-2">eBook</span>
      </div>
      <hr className="text-white border-3 mt-5" style={{ color: "#fff" }} />
      <div className="list-group list-group-flush">
        {menuAdmin.map((elem, index) => (
          <SidebarComponent {...elem} key={index} />
        ))}
        <Link
          style={{ textDecoration: "none" }}
          className="py-3 my-2 rounded list-group-item"
          onClick={deconnexion}
        >
          <i className="bi bi-box-arrow-right fs-5 me-3"></i>
          <span className="fs-5">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default SidebarAdmin