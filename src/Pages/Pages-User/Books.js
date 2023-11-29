import React from 'react';
import { Link } from 'react-router-dom';
import CardBooks from '../../Components/User/CardBooks';

function Books() {
  return (
    <Link to="/user/books" style={{textDecoration: "none"}}>
        <h1 className='title fw-bold py-3 px-3'>BOOKS</h1>
        <CardBooks />
    </Link>
  )
}

export default Books