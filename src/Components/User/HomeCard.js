import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc , updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Button, Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";

function HomeCard({
  img,
  title,
  description,
  auth,
  genre,
  toastComp,
  stock,
  onBorrowBook,
  Id,
  archived,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [books, setBooks] = useState([]);

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

  
  const borrowBook = async (borrowedBookTitle) => {
    const borrowedBook = books.find((book) => book.title === borrowedBookTitle);
    if (borrowedBook && borrowedBook.isBorrowed) {
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock + 1,
        isBorrowed: false,
      });
      alert(`Livre rendu : ${borrowedBookTitle}`);
      loadBooks();
    }else if (borrowedBook && borrowedBook.stock > 0) {
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock - 1,
        isBorrowed: true
      });
      alert(`Livre emprunté : ${borrowedBookTitle}`);
      loadBooks();
    } else if (borrowedBook) {
      alert(`Stock épuisé pour le livre : ${borrowedBookTitle}`);
    } else {
      alert(`Livre non trouvé avec l'ID : ${borrowedBookTitle}`);
    }
  };

  // const handleBorrowBook = () => {
  //   borrowBook(title);
  // };

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const bookBorrowed = books.find(
    (book) => book.title === title && book.isBorrowed
  );
;

  return (
    <Card
      data-aos="fade-up"
      className={
        bookBorrowed
          ? "col-md-3 mx-4 py-1 mb-4 btn-borrowed"
          : "col-md-3 mx-4 py-1 mb-4"
      }
      id="card"
    >
      <div id="cardImgContent">
        <Card.Img variant="top" src={img} onClick={handleShow} id="cardImg" />
      </div>
      <Card.Body className="d-flex justify-content-between">
        <div className="d-flex flex-column block1 align-items-stretch">
          <Card.Title id="title">{title}</Card.Title>
          <div>
            <Button
              role="button"
              onClick={() => borrowBook(title)}
              className={
                bookBorrowed
                  ? "text-white mt-3 bouton rounded-pill btn-success border-0"
                  : "text-white mt-3 bouton rounded-pill bg-warning border-0"
              }
            >
              {bookBorrowed ? "Rendre" : "Emprunter"}
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
