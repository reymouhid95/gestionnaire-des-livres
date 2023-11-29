import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Aos from 'aos';
import 'aos/dist/aos.css';

function HomeCard({ img, title, description, auth }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    Aos.init({duration:2000})
  }, [])

  return (
    <Card data-aos="fade-up"  className="col-md-3 mx-4 py-3 mb-4">
      <div id="cardImgContent">
        <Card.Img variant="top" src={img}  onClick={handleShow} id="cardImg"/>
      </div>
      <Card.Body className="d-flex justify-content-between">
        <div>
          <Card.Title id="title">{title}</Card.Title>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title data-aos="fade-left">DETAILS DU LIVRE</Modal.Title>
            </Modal.Header>
            <Modal.Body className="content-modal">
              <ul className="list-unstyled" data-aos="fade-left">
                <li className="mb-3"><span className="h6 fw-bold">Titre:</span> {title}</li>
                <li className="mb-3"><span className="h6 fw-bold">Auteur:</span> {auth}</li>
                <li><span className="h6 fw-bold">Description:</span> {description}</li>
              </ul>
            </Modal.Body>
            <Modal.Footer >
              <Button
                variant="secondary"
                onClick={handleClose}
                className="text-white"
              >
                Close
              </Button>
              <Button
                variant="warning"
                onClick={handleClose}
                className="text-white"
              >
                Emprunter
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Card.Text className="w-50 d-flex flex-column justify-content-end">
          <p className="text-end w-100 flex-nowrap">
            <i className="bi bi-star text-warning mx-1"></i>
            <i className="bi bi-star text-warning mx-1"></i>
            <i className="bi bi-star text-warning"></i>
          </p>
          <div className="text-end">
            <i
              className="bi bi-eye-fill text-info fs-3"
              onClick={handleShow}
              role="button"
            ></i>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default HomeCard;