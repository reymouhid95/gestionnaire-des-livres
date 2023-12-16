import React from "react";

function TestimonialComp({ img, name }) {
  return (
    <div className="col-md-6 py-3">
      <div className="testimonialText py-4 px-4">
        <p className="text-white">
          Editors now use Lorem Ipsum as their default model text, and a search
          for 'lorem ipsum' will uncover many web sites still in their infancy.
          Various versions have evolved over the years, sometimes by
        </p>
        <i
          className="bi bi-quote"
          style={{ color: "#44b89d", fontSize: "30px" }}
        ></i>
      </div>
      <div className="d-flex py-3">
        <img src={img} alt="img" className="img-fluid rounded-circle image" />
        <div className="mx-3 py-3">
          <p className="h4 text-dark">{name}</p>
          <p className="text-dark">Student</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialComp;
