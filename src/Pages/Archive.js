import React from 'react';
import { Link } from 'react-router-dom';

function Books() {
  return (
    <Link to="/user/archived" style={{textDecoration: "none"}}>
        <h1 className='title fw-bold py-3 px-3'>Archived</h1>
    </Link>
  )
}

export default Books