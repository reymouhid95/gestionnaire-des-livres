/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// Importation des bibliothèques et outils
import { addSeconds, differenceInDays } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
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
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const urlInputRef = useRef();
  const [toastMessage, setToastMessage] = useState("");
  const [stocks, setStocks] = useState({});
  const [isReturning, setIsReturning] = useState(false);
  const [lastReturnedTitle, setLastReturnedTitle] = useState("");

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
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    // Vérifier si l'état de rendu est activé
    if (isReturning) {
      // Exécuter la fonction handleReturnBook avec le dernier titre rendu
      handleReturnBook(lastReturnedTitle);
      // Désactiver l'état de rendu
      setIsReturning(false);
    }
  }, [stocks, isReturning]);

  // Méthode d'ajout d'un livre
  const handleAddBook = useCallback(async () => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(formData.url)) {
      toast.warning("Veuillez entrer un lien valide dans le champ URL!");
      urlInputRef.current.focus();
      return;
    }

    // Vérifier si tous les champs requis sont remplis
    const requiredFields = ["title", "author", "genre", "url", "description"];
    if (requiredFields.some((field) => formData[field].trim() === "")) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier si le livre existe déjà
    const existingBook = books.find(
      (book) => JSON.stringify(book) === JSON.stringify(formData)
    );

    if (existingBook) {
      toast.warning("Ce livre existe déjà!");
      return;
    }

    // Ajouter le livre avec un stock initial de 1
    const newBook = { ...formData, stock: 5 };
    await addDoc(collection(db, "books"), newBook);

    // Mettre à jour le state avec le nouveau livre
    setBooks((prevBooks) => [...prevBooks, newBook]);

    // Mettre à jour l'état local des stocks
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
    toast.success("Livre ajouté avec succès!");
  }, [formData, loadBooks]);

  // La fonction handleBorrowBook qui permet d'emprunter un livre
  const handleBorrowBook = async (title) => {
    const currentStock = stocks[title];
    if (currentStock && currentStock > 0) {
      const updatedStock = currentStock - 1;
      const dueDate = addSeconds(new Date(), 45);

      // Mettre à jour la base de données avec le nouveau stock
      const bookToUpdate = books.find((book) => book.title === title);
      if (bookToUpdate) {
        await updateDoc(doc(db, "books", bookToUpdate.id), {
          stock: updatedStock,
          isBorrowed: true,
          dueDate: null,
        });
        setStocks((prevStocks) => ({
          ...prevStocks,
          [title]: updatedStock,
        }));
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
    // Vérifier si le livre est emprunté
    const borrowedBook = books.find(
      (book) => book.title === title && book.isBorrowed
    );

    if (borrowedBook) {
      // Vérifier si le stock est égal à 5
      if (borrowedBook.stock === 5) {
        toast.warning(`Le stock du livre "${title}" est déjà plein (5).`);
      } else {
        // Mettre à jour le stock dans la base de données et l'état local
        const updatedStock = Math.min(borrowedBook.stock + 1, 5);
        await updateDoc(doc(db, "books", borrowedBook.id), {
          isBorrowed: false,
          dueDate: null,
          stock: updatedStock,
        });
        setStocks((prevStocks) => ({
          ...prevStocks,
          [title]: updatedStock,
        }));

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
      }
    } else {
      // Si le livre n'est pas emprunté, activer l'état de rendu
      setLastReturnedTitle(title);
      setIsReturning(true);
      toast.warning(`Le livre "${title}" n'est pas emprunté actuellement.`);
    }
  };

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

      toast.success("Données modifiées avec success!");
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
          console.error("No selected book to archive.");
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
          setToastMessage("Livre archivé!");
        } else {
          setToastMessage("Livre désarchivé!");
        }
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
    [books, setBooks]
  );

  // Supprimer un livre
  const handleDeleteBook = useCallback(
    async (bookId) => {
      await deleteDoc(doc(db, "books", bookId));
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setStocks((prevStocks) => {
        const {
          [books.find((book) => book.id === bookId)?.title]: removed,
          ...rest
        } = prevStocks;
        return rest;
      });
      toast.success("Stock supprimé avec succès!");
    },
    [books]
  );

  // Soummission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      setShow(false);
      await handleAddBook();
    } else {
      await handleUpdateBook();
    }
  };

  // Surveiller l'état du bouton
  const buttonText = isAdding ? "Ajouter" : "Mise à jour";

  // L'affichage
  return (
    <div className="m-0" id="tableContent">
      <ToastContainer />
      {toastMessage && toast.success(toastMessage)}
      <Form onSubmit={handleSubmit}>
        <Row className="w-100 m-0 p-0">
          <div className="d-flex justify-content-end">
            <Button
              className="soumission mt-2 mb-3 ms-5"
              style={{ width: "max-content" }}
              onClick={handleShow}
            >
              Ajouter
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Infos du stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row d-flex g-2">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Titre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    placeholder="Nom de l'auteur"
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="row g-2 d-flex flex-wrap">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    placeholder="Genre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="url"
                    value={formData.url}
                    placeholder="Lien du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    ref={urlInputRef}
                    required
                  />
                </Col>
                <Col md={12} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    placeholder="Description du livre"
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
          onBorrowBook={handleBorrowBook}
          onReturnBook={handleReturnBook}
        />
      </div>
    </div>
  );
}

export default FormBook;
