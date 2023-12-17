/* eslint-disable no-unused-vars */
import Aos from "aos";
import "aos/dist/aos.css";
import { addSeconds, differenceInSeconds, isPast } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";

function HomeCard({ img, title, description, auth, genre, Id, archived }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [notificationsCollection, setNotificationsCollection] = useState(
    collection(db, "notifications")
  );

  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(bookCollection);
      const usersSnapshot = await getDocs(usersCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Error loading. Please check your internet connection!");
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUser(user);
          } else {
            setAuthUser(null);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading. Please check your internet connection!");
      }
    };

    fetchData();
  }, []);

  //Fonction pour l'emprunt de livre
  const borrowBook = async (borrowedBookTitle) => {
    const displayName = authUser ? authUser.displayName : null;
    const borrowedBook = books.find((book) => book.title === borrowedBookTitle);
    const userBookBorrowed = users.find((user) => user.name === displayName);
    console.log(userBookBorrowed);
    if (borrowedBook && borrowedBook.isBorrowed) {
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock + 1,
        isBorrowed: false,
        returnDate: null,
      });

      const notificationMessage = `${displayName} returned the book ${borrowedBookTitle}!`;
      await addDoc(notificationsCollection, { message: notificationMessage });

      toast.info(notificationMessage);
      loadBooks();
    } else if (borrowedBook && borrowedBook.stock > 0) {
      const returnDate = addSeconds(new Date(), 10);
      await updateDoc(doc(db, "books", borrowedBook.id), {
        stock: borrowedBook.stock - 1,
        isBorrowed: true,
        returnDate: returnDate.toISOString(),
      });

      await updateDoc(doc(db, "users", userBookBorrowed.id), {
        livre: arrayUnion(borrowedBookTitle),
      });

      const notificationMessage = `You borrowed the book ${borrowedBookTitle}`;
      const notificationMessageAdmin = `${displayName} borrowed book ${borrowedBookTitle}`;
      await addDoc(notificationsCollection, {
        message: notificationMessage,
        messageForAdmin: notificationMessageAdmin,
        name: displayName,
      });

      toast.success(notificationMessage);
      loadBooks();
    } else if (borrowedBook) {
      const notificationMessage = `Sold out for the book : ${borrowedBookTitle}!`;
      await addDoc(notificationsCollection, {
        message: notificationMessage,
      });

      toast.warning(notificationMessage);
    } else {
      const notificationMessage = `Book ${borrowedBookTitle} not found!`;
      await addDoc(notificationsCollection, { message: notificationMessage });

      toast.warning(notificationMessage);
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
            `Deadline exceeded. The book ${borrowedBook.title} has been recovered!`
          );
          loadBooks();
        } else {
          toast.warning(
            `Deadline for borrowing book ${borrowedBook.title} imminent.`
          );
        }
      }
    };

    // Déclaration de l'intervalle pour récupérer le livre
    const interval = setInterval(checkReturnStatus, 3000);
    return () => clearInterval(interval);
  }, [books, loadBooks]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const bookBorrowed = books.find(
    (book) => book.title === title && book.isBorrowed
  );

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
              {bookBorrowed ? "Return" : "Borrow"}
            </Button>
          </div>

          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title data-aos="fade-left">Book information</Modal.Title>
            </Modal.Header>
            <Modal.Body className="content-modal">
              <ul className="list-unstyled" data-aos="fade-left">
                <li className="mb-3">
                  <span className="h6 fw-bold">Title:</span> {title}
                </li>
                <li className="mb-3">
                  <span className="h6 fw-bold">Author:</span> {auth}
                </li>
                <li className="mb-3">
                  <span className="h6 fw-bold">Gender:</span> {genre}
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
