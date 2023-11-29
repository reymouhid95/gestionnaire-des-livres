import React, { useEffect } from 'react';
import SidebarComponent from './SidebarComponent';
import { menuUser } from './Utils';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Link, NavLink } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';


function SidebarUser() {
  const deconnexion = () =>{
    localStorage.removeItem('utilisateur');
    window.location.replace("/connexion");
  }
  useEffect(() => {
    Aos.init({duration:2000})
}, [])
  return (
    <div className='vh-100 sidebar p-2'>
        <div className="m-2">
            <AutoStoriesIcon className='fs-2' />
            <span className='brand-name fs-1 fw-bold mx-2'>eBook</span>
        </div>
        <hr className='text-white border-3 mt-5' style={{color: "#fff"}} />
        <div data-aos="fade-left" className="list-group list-group-flush">
          {menuUser.map((elem, index) => (
              <SidebarComponent {...elem} key={index}/>
          ))}
          <Link style={{textDecoration:"none"}} className='py-3 my-2 rounded' onClick={deconnexion}>
            <a className='list-group-item'>
              <i className="bi bi-box-arrow-right fs-5 me-3"></i>
              <span className='fs-5'>Logout</span>
            </a>
          </Link>
        </div>
    </div>
  )
}

export default SidebarUser