import React from "react";
import imgBanner1 from "../../assets/banner21.jpg";
import imgBanner2 from "../../assets/banner22.jpg";
import imgBanner3 from "../../assets/banner23.jpg";
import TestimonialComp from "./TestimonialComp";
import { testimonialLastElem, testimonials } from "./Utils";
function Testimonials() {
  return (
    <div className="container-fluid testimonials p-0">
      <div className="px-3 pt-5">
        <h2 className="fw-bold text-dark text-center">What Says Customers</h2>
        <div className="row d-flex justify-content-aroud flex-wrap py-3">
          {testimonials.map((tes, index) => (
            <TestimonialComp {...tes} key={index} />
          ))}
        </div>
        <div className="row d-flex justify-content-center">
          {testimonialLastElem.map((tes, index) => (
            <TestimonialComp {...tes} key={index} />
          ))}
        </div>
      </div>
      <div className="d-flex ">
        <div className="col-6">
          <div className="photoBanner">
            <img src={imgBanner1} alt="img" className="img-fluid w-100" />
          </div>
        </div>
        <div className="col-6 d-flex flex-column justify-content-between">
          <div>
            <img src={imgBanner2} alt="img" className="img-fluid" />
          </div>
          <div>
            <img src={imgBanner3} alt="img" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
