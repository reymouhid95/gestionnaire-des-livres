import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc , updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Button, Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";


function HomeCard({
  img,
  title,
  description,
  auth,
  genre,
  onBorrowBook,
  id,
  archived,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [books, setBooks] = useState([]);
  // const [stocks, setStocks] = useState({});

  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      alert(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);


  const borrowBook = (id) => {
    books.find((book) => {
      if (book.id === id) {
        console.log(book.stock);
        return true;
      }
      return false;
    });
  };


  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <Card data-aos="fade-up" className="col-md-3 mx-4 py-3 mb-4" id="card">
      <div id="cardImgContent">
        <Card.Img variant="top" src={img} onClick={handleShow} id="cardImg" />
      </div>
      <Card.Body className="d-flex justify-content-between">
        <div className="d-flex flex-column block1 align-items-stretch">
          <Card.Title id="title">{title}</Card.Title>
          <div>
            <Button
              role="button"
              onClick={() => borrowBook(id)}
              className="text-white mt-3 bouton rounded-pill bg-warning border-0"
            >
              Emprunter
            </Button>
          </div>

          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title data-aos="fade-left">Détails du livre</Modal.Title>
            </Modal.Header>
            <Modal.Body className="content-modal">
              <ul className="list-unstyled" data-aos="fade-left">
                <li className="mb-3">
                  <span className="h6 fw-bold">Titre:</span> {title}
                </li>
                <li className="mb-3">
                  <span className="h6 fw-bold">Auteur:</span> {auth}
                </li>
                <li className="mb-3">
                  <span className="h6 fw-bold">Genre:</span> {genre}
                </li>
                <li>
                  <span className="h6 fw-bold">Description:</span> {description}
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose} className="text-white bg-secondary">
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Card.Text className="w-50 d-flex flex-column justify-content-end align-items-end p-0 bolck2">
          <div>
            <p className="text-end w-100 flex-nowrap">
              <i className="bi bi-star text-warning mx-1"></i>
              <i className="bi bi-star text-warning mx-1"></i>
              <i className="bi bi-star text-warning"></i>
            </p>
          </div>
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
