import React from 'react';
// import { Link } from 'react-router-dom';

function Template(props) {
  // const [toggle, setToggle] = useState(false);
  // const Toggle = () => {
  //   setToggle(!toggle) 
  // }
  return (
      <div className="container-fluid nin-vh-100 template">
        <div className='row d-flex contenu'>
          {props.toggle && <div className='col-4 col-md-2 vh-100 position-fixed m-0 p-0' id='sidebarDiv'>
            {props.sidebar}      
          </div>}
          {props.toggle && <div className='col-4 col-md-2'></div>}
          <div className='col p-0 m-0'>
            {props.navbar}
            {props.children}
          </div>
        </div>
      </div>
  )
}

export default Template