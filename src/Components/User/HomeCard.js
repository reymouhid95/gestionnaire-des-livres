/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Aos from "aos";
import { addSeconds } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../firebase-config";

function HomeCard({ img, title, description, auth, genre }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isReturning, setIsReturning] = useState(false);
  const [lastReturnedTitle, setLastReturnedTitle] = useState("");
  const [stocks, setStocks] = useState({});
  const [books, setBooks] = useState([]);
  const [borrowedBook, setborrowedBook] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    url: "",
    description: "",
    archived: false,
    isBorrowed: false,
    dueDate: null,
    stock: 5,
  });

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  // La fonction handleBorrowBook qui permet d'emprunter un livre
  const handleBorrowBook = async (title) => {
    const currentStock = stocks[title];
    if (currentStock && currentStock > 0) {
      const updatedStock = currentStock - 1;

      // Mettre à jour la base de données avec le nouveau stock
      const bookToUpdate = books.find((book) => book.title === title);
      if (bookToUpdate) {
        await updateDoc(doc(db, "books", bookToUpdate.id), {
          stock: updatedStock,
          isBorrowed: true,
          dueDate: null,
        });

        // Mettre à jour l'état local du stock
        setStocks((prevStocks) => ({ ...prevStocks, [title]: updatedStock }));

        // Mettre à jour l'état local des livres
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookToUpdate.id
              ? {
                  ...book,
                  isBorrowed: true,
                  dueDate: null,
                  stock: updatedStock,
                }
              : book
          )
        );
        toast.success("Livre emprunté pour une durée de 45 secondes!");
      }
    } else {
      toast.warning(
        currentStock === 0
          ? "Stock épuisé. Impossible d'emprunter le livre!"
          : "Stock insuffisant pour emprunter le livre!"
      );
    }
  };

  // Fonction pour rendre un livre emprunté
  const handleReturnBook = async (title) => {
    const borrowedBook = books.find(
      (book) => book.title === title && book.isBorrowed
    );
    if (borrowedBook) {
      const updatedStock = Math.min(borrowedBook.stock + 1, 5);
      await updateDoc(doc(db, "books", borrowedBook.id), {
        isBorrowed: false,
        dueDate: null,
        stock: updatedStock,
      });

      // Mettre à jour l'état local du stock
      setStocks((prevStocks) => ({ ...prevStocks, [title]: updatedStock }));

      // Mettre à jour l'état local des livres
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === borrowedBook.id
            ? {
                ...book,
                isBorrowed: false,
                dueDate: null,
                stock: updatedStock,
              }
            : book
        )
      );

      toast.success(`Le livre "${title}" a été rendu avec succès!`);
    } else {
      setLastReturnedTitle(title);
      setIsReturning(true);
      toast.warning(`Le livre "${title}" n'est pas emprunté actuellement.`);
    }
  };

  useEffect(() => {
    if (isReturning) {
      handleReturnBook(lastReturnedTitle);
      setIsReturning(false);
    }
  }, [stocks, isReturning, books, handleReturnBook, lastReturnedTitle]);

  return (
    <>
      <ToastContainer />
      <Card data-aos="fade-up" className="col-md-3 mx- py-3 mb-3">
        <div id="cardImgContent">
          <Card.Img
            variant="top"
            src={img}
            onClick={handleShow}
            id="cardImg"
            alt={title}
          />
        </div>
        <Card.Body className="d-flex justify-content-between">
          <div>
            <Card.Title id="title">{title} </Card.Title>
            {borrowedBook && borrowedBook.isBorrowed ? (
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => handleReturnBook(borrowedBook.title)}
              >
                <Icon.BoxArrowDown />
              </Button>
            ) : (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => handleBorrowBook(title)}
              >
                <Icon.BoxArrowUp />
              </Button>
            )}
            <Modal show={show} onHide={handleClose} keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title data-aos="fade-left" className="fw-bold">
                  Détails du livre
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="content-modal">
                <ul className="list-unstyled" data-aos="fade-left">
                  <li className="mb-3">
                    <span className="h6 fw-bold">Titre :</span> {title}
                  </li>
                  <li className="mb-3">
                    <span className="h6 fw-bold">Auteur :</span> {auth}
                  </li>
                  <li className="mb-3">
                    <span className="h6 fw-bold">Genre :</span> {genre}
                  </li>
                  <li>
                    <span className="h6 fw-bold">Description :</span>{" "}
                    {description}
                  </li>
                </ul>
              </Modal.Body>
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
    </>
  );
}

export default HomeCard;
