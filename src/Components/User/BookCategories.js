import React from "react";
import CategoriesComp from "./CategoriesComp";
import { infoCategories } from "./Utils";

function BookCategories() {
  return (
    <div className="container-fluid py-3 booksCategories">
      <div className="py-4">
        <h1 className="fw-bold text-dark text-center">Books Categories</h1>
        <p className="text-center text-dark">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration
        </p>
      </div>
      <div className="row d-flex flex-wrap">
        {infoCategories.map((info, index) => (
          <CategoriesComp {...info} key={index} />
        ))}
      </div>
    </div>
  );
}

export default BookCategories;
