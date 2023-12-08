/* eslint-disable no-unused-vars */
import Aos from "aos";
import "aos/dist/aos.css";
import { addSeconds, differenceInSeconds, isPast } from "date-fns";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";

function HomeCard({ img, title, description, auth, genre }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [books, setBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  // Méthode pour emprunter et rendre un livre
  const borrowBook = async (borrowedBookTitle) => {
    const userName = localStorage.getItem("userName");
    const borrowedBook = books.find((book) => book.title === borrowedBookTitle);
    if (borrowedBook && borrowedBook.isBorrowed) {
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock + 1,
        isBorrowed: false,
        returnDate: null,
      });
      toast.info(`${userName} a rendu le livre ${borrowedBookTitle}!`);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${userName} a rendu le livre ${borrowedBookTitle}!`,
      ]);
      loadBooks();
    } else if (borrowedBook && borrowedBook.stock > 0) {
      const returnDate = addSeconds(new Date(), 10);
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock - 1,
        isBorrowed: true,
        returnDate: returnDate.toISOString(),
      });
      toast.success(
        `Le livre ${borrowedBookTitle} a été emprunté par ${userName} pour une durée de 30 secondes!`
      );
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Le livre ${borrowedBookTitle} a été emprunté par ${userName} pour une durée de 30 secondes!`,
      ]);
      loadBooks();
    } else if (borrowedBook) {
      toast.warning(`Stock épuisé pour le livre : ${borrowedBookTitle}!`);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Stock épuisé pour le livre : ${borrowedBookTitle}!`,
      ]);
    } else {
      toast.warning(`Livre ${borrowedBookTitle} non trouvé!`);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Livre ${borrowedBookTitle} non trouvé!`,
      ]);
    }
  };

  useEffect(() => {
    const checkReturnStatus = async () => {
      const borrowedBooks = books.filter((book) => book.isBorrowed);
      for (const borrowedBook of borrowedBooks) {
        const returnDate = new Date(borrowedBook.returnDate);
        const secondsUntilReturn = differenceInSeconds(returnDate, new Date());
        if (isPast(returnDate)) {
          await updateDoc(doc(db, "books", borrowedBook.id), {
            stock: borrowedBook.stock + 1,
            isBorrowed: false,
            returnDate: null,
          });
          toast.info(
            `Délai dépassé. Le livre ${borrowedBook.title} a été recupéré!`
          );
          loadBooks();
        } else {
          toast.warning(
            `Expiration du délai de l'emprunt du livre ${borrowedBook.title} imminente.`
          );
        }
      }
    };

    // Déclaration de l'intervalle pour récupérer le livre
    const interval = setInterval(checkReturnStatus, 3000);
    return () => clearInterval(interval);
  }, [books, loadBooks]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const bookBorrowed = books.find(
    (book) => book.title === title && book.isBorrowed
  );

  // Affichage
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
