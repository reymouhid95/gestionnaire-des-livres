import React from "react";
import { Link } from "react-router-dom";
import BookBorrowed from "../../Components/User/BookBorrowed";

function BookBorrowedContent() {
  return (
    <Link to="/user/bookBorrowed" style={{ textDecoration: "none" }}>
      <h1 className="title fw-bold py-3 px-3">Livres empruntés</h1>
      <div>
        <BookBorrowed />
      </div>
    </Link>
  );
}

export default BookBorrowedContent;
