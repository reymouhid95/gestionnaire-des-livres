import React from 'react';
import CardBooks from '../Components/CardBooks';
import { Link } from 'react-router-dom';
import SearchBooks from '../Components/SearchBooks';

function Books() {
  return (
    <Link to="/user/books" style={{textDecoration: "none"}}>
        <h1 className='title fw-bold py-3 px-3'>BOOKS</h1>
        <div className="container m-0 px-0 homeCard w-100">
            <SearchBooks />
            <CardBooks />
        </div>
    </Link>
  )
}

export default Books