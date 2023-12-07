import React from "react";
import { Link } from "react-router-dom";
import BookBorrowed from "../../Components/User/BookBorrowed";

function BookBorrowedContent() {
  return (
    <Link to="/user/bookBorrowed" style={{ textDecoration: "none" }}>
      <div>
        <BookBorrowed />
      </div>
    </Link>
  );
}

export default BookBorrowedContent;
