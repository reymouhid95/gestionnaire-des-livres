import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Aos from 'aos';
import 'aos/dist/aos.css';

function HomeCard({ img, title }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    Aos.init({duration:2000})
  }, [])

  return (
    <Card data-aos="fade-up" className="col-md-3 mx-4 py-3">
      <Card.Img variant="top" src={img}  onClick={handleShow} id="cardImg"/>
      <Card.Body className="d-flex justify-content-between">
        <div>
          <Card.Title>{title}</Card.Title>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Informations membres</Modal.Title>
            </Modal.Header>
            <Modal.Body>{title}</Modal.Body>
            <Modal.Footer>
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
        <Card.Text>
          <p>
            <i className="bi bi-star text-warning mx-1"></i>
            <i className="bi bi-star text-warning mx-1"></i>
            <i className="bi bi-star text-warning mx-1"></i>
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
