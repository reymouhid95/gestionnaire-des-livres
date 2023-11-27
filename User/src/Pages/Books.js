import React from 'react';
import CardBooks from '../Components/CardBooks';
import { Link } from 'react-router-dom';

function Books() {
  return (
    <Link to="/user/books" style={{textDecoration: "none"}}>
        <h1 className='title fw-bold py-3 px-3'>BOOKS</h1>
        <CardBooks />
    </Link>
  )
}

export default Books