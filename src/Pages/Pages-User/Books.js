import React from 'react';
import { Link } from 'react-router-dom';
import CardBooks from '../../Components/User/CardBooks';

function Books() {
  return (
    <Link to="/user/books" style={{textDecoration: "none"}}>
        <CardBooks />
    </Link>
  )
}

export default Books