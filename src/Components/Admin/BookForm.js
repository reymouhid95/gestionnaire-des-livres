/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// Importation des bibliothèques et outils
// import { addSeconds, differenceInDays } from "date-fns";
import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";
import TableBook from "./BookTable";

// Composant principal
function FormBook() {
  const [books, setBooks] = useState([]);
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const urlInputRef = useRef();
  const [stocks, setStocks] = useState({});

  // Surveiller le chargement des données au montage de l'appli
  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        archived: doc.data().archived || false,
      }));
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Loading error. Please check your internet connection!");
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Méthode d'ajout d'un livre
  const handleAddBook = useCallback(async () => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(formData.url)) {
      toast.error("Please enter a valid link in the URL field!");
      urlInputRef.current.focus();
      return;
    }

    // Vérifier si tous les champs requis sont remplis
    const requiredFields = ["title", "author", "genre", "url", "description"];
    if (requiredFields.some((field) => formData[field].trim() === "")) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Vérifier si le livre existe déjà
    const existingBook = books.find(
      (book) => JSON.stringify(book) === JSON.stringify(formData)
    );
    if (existingBook) {
      toast.warning("This book already exists!");
      return;
    }

    // Ajouter le livre avec un stock initial de 5
    const newBook = { ...formData, stock: 5 };
    await addDoc(collection(db, "books"), newBook);
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setStocks((prevStocks) => ({
      ...prevStocks,
      [formData.title]: (prevStocks[formData.title] || 0) + 5,
    }));

    // Ajouter le livre seulement si tous les champs sont remplis
    await loadBooks();
    setFormData({
      title: "",
      author: "",
      genre: "",
      url: "",
      description: "",
    });
    toast.success("Book added!");
  }, [formData, loadBooks]);

  // Mettre à jour un livre
  const handleEditBook = (book) => {
    setShow(true);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      url: book.url,
      description: book.description,
      archived: book.archived,
    });
    setIsAdding(false);
    setSelectedBook(book);
  };

  // Faire la mise à jour sans ajouter un nouveau champ dans le tableau
  const handleUpdateBook = async () => {
    setShow(false);
    if (selectedBook) {
      await updateDoc(doc(db, "books", selectedBook.id), formData);
      await loadBooks();
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });
      toast.success("Data updated!");
      setIsAdding(true);
      setSelectedBook(null);
    }
  };

  // Archiver un livre
  const archive = useCallback(
    async (bookId) => {
      try {
        const selectedBook = books.find((book) => book.id === bookId);
        if (!selectedBook) {
          console.error("No book selected for archiving!");
          return;
        }
        const updatedBookData = {
          ...selectedBook,
          archived: !selectedBook.archived,
        };
        await updateDoc(doc(db, "books", bookId), updatedBookData);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId ? { ...book, archived: !book.archived } : book
          )
        );

        if (updatedBookData.archived) {
          toast.success("Book archived!");
        } else {
          toast.success("Book unarchived!");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Update error!");
      }
    },
    [books, selectedBook, setBooks, loadBooks]
  );

  // Supprimer un livre
  const handleDeleteBook = useCallback(
    async (bookId) => {
      const bookToDelete = books.find((book) => book.id === bookId);
      if (bookToDelete) {
        const { title } = bookToDelete;
        await deleteDoc(doc(db, "books", bookId));
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        setStocks((prevStocks) => {
          const { [title]: removed, ...rest } = prevStocks;
          return rest;
        });
        toast.success(`Book "${title}" deleted!`);
      } else {
        toast.error(`Book not found with ID : ${bookId}`);
      }
    },
    [books]
  );

  // Soummission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      await handleAddBook();
      setShow(false);
    } else {
      await handleUpdateBook();
      setShow(false);
    }
  };

  // Surveiller l'état du bouton
  const buttonText = isAdding ? "Add" : "Update";

  // L'affichage
  return (
    <div className="m-0">
      <Form onSubmit={handleSubmit}>
        <Row>
          <div className="d-flex justify-content-end">
            <Button
              className="soumission mt-5 mx-5"
              style={{ width: "max-content" }}
              onClick={handleShow}
            >
              New Book
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Inventory information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row d-flex g-2">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <TextField
                    id="standard-basic"
                    label="Title"
                    variant="filled"
                    fullWidth
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <TextField
                    id="standard-basic"
                    label="Author"
                    variant="filled"
                    fullWidth
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="row g-2 d-flex flex-wrap">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <TextField
                    id="standard-basic"
                    label="Gender"
                    variant="filled"
                    fullWidth
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <TextField
                    id="standard-basic"
                    label="Link"
                    variant="filled"
                    fullWidth
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    ref={urlInputRef}
                    required
                  />
                </Col>
                <Col md={12} sm={12} xs={12} className="mb-2">
                  <TextField
                    id="filled-multiline-flexible"
                    label="Description"
                    multiline
                    maxRows={5}
                    variant="filled"
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  endIcon={<SendIcon />}
                  className="soumission mt-2 mb-3"
                  onClick={handleSubmit}
                  style={{ width: "max-content" }}
                >
                  {buttonText}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Row>
      </Form>
      <div>
        <TableBook
          books={books}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onArchivedBook={archive}
        />
      </div>
    </div>
  );
}

export default FormBook;
