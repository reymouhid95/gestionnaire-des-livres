import React from 'react';
import SidebarComponent from './SidebarComponent';
import { menu } from './Utils';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


function Sidebar() {
  return (
    <div className='vh-100 sidebar p-2'>
        <div className="m-2" id='logo'>
            <AutoStoriesIcon className='fs-2' />
            <span className='brand-name fs-1 fw-bold mx-2'>eBook</span>
        </div>
        <hr className='text-white border-3 mt-5' style={{color: "#fff"}} />
        <div className="list-group list-group-flush">
          {menu.map((elem, index) => (
              <SidebarComponent {...elem} key={index}/>
          ))}
        </div>
    </div>
  )
}

export default Sidebar