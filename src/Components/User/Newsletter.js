import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import contactImg from "../../assets/contact-img.png";

function Newsletter() {
  return (
    <div className="newsLetter px-3">
      <div className="d-flex flex-wrap">
        <div className="col-md-6 col-12 d-flex flex-column justify-content-center">
          <h1 className="text-dark fw-bold pb-4">Newsletter</h1>
          <div className="col-md-11">
            <InputGroup className="">
              <Form.Control
                placeholder="Enter your email"
                aria-label="Usermail"
                type="email"
                required
                className="rounded-pill py-3"
                style={{ fontFamily: "sans-serif" }}
              />
            </InputGroup>
            <button
              className="btn rounded-5 px-4 btn-lg mt-3 col-md-4 col-12"
              style={{
                background: "hsl(182, 81%, 28%)",
                color: "white",
                fontFamily: "sans-serif",
              }}
            >
              SEND
            </button>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center pt-3">
          <img src={contactImg} alt="img" />
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
