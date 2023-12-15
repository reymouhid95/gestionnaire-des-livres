import React from "react";
import imgAbout from "../../assets/about-img.png";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="container-fluid aboutUs py-5">
      <div className="row d-flex flex-wrap py-5">
        <div className="col-md-6">
          <img src={imgAbout} alt="img" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold text-dark">About Our Bookstore</h2>
          <p className="text-dark">
            At cumque tenetur iste molestiae, vel eum reiciendis assumenda!
            Numquam, repudiandae. Consequuntur obcaecati recusandae aliquam,
            amet doloribus eius dolores officiis cumque? Quibusdam praesentium
            pariatur sapiente mollitia, amet hic iusto voluptas! Iusto quo earum
            vitae excepturi, ipsam aliquid deleniti assumenda culpa deserunt.
          </p>

          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(182, 81%, 28%)", color: "white" }}
            >
              Discovery
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
