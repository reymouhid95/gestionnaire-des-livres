import React from "react";

function CategoriesComp({ img, category }) {
  return (
    <div className="col-md-4 py-3">
      <div className="d-flex justify-content-center align-items-center">
        <div className="imgDiv py-3 px-4 rounded-circle">
          <img src={img} alt="img" className="img-fluid img-categories" />
        </div>
      </div>
      <div className="text-center">
        <h3 className=" my-2">{category}</h3>
        <p className="">
          fact that a reader will be distracted by the readable content of a
          page when looking at its layout. The point of using
        </p>
      </div>
    </div>
  );
}

export default CategoriesComp;
