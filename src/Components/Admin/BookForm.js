/* eslint-disable react-hooks/exhaustive-deps */
// Importation des bibliothèques et outils
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { db } from "../../firebase-config";
import TableBook from "./BookTable";

// Composant principal pour les méthodes d'ajout, de modification et de suppression
function FormBook() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    url: "",
    description: "",
    archived: false,
  });
  const [selectedBook, setSelectedBook] = useState(null);
  // const [bookArchives, setBookArchives] = useState(
  //   JSON.parse(localStorage.getItem("bookArchives")) || {}
  // );
  const [isAdding, setIsAdding] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [numberOfBooks, setNumberOfBooks] = useState(0);

  // Surveiller le chargement des données au montage de l'aooli
  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        archived: doc.archived || false,
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

  // Ajouter un livre
  const handleAddBook = useCallback(async () => {
    const book = formData;
    await addDoc(collection(db, "books"), book);
    await loadBooks();
    setFormData({
      title: "",
      author: "",
      genre: "",
      url: "",
      description: "",
    });
    toast.success("Livre ajouté avec success!");
    // Mettre à jour le nombre de livres ajoutés
    setNumberOfBooks((prevNumberOfBooks) => prevNumberOfBooks + 5);

    // Stocker le nombre de livres ajoutés dans le local storage
    localStorage.setItem("numberOfBooks", numberOfBooks + 5);
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
      toast.success("Livre modifié avec success!");
      setIsAdding(true);
      setSelectedBook(null);
    }
  };

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
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
    [books, selectedBook, setBooks, loadBooks]
  );

  // Supprimer un livre
  const handleDeleteBook = useCallback(
    async (bookId) => {
      await deleteDoc(doc(db, "books", bookId));
      setBooks(books.filter((book) => book.id !== bookId));
      toast.success("Livre supprimé avec success!");
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
    <div className="mt-2">
      <Form onSubmit={handleSubmit}>
        <Row className="w-100 m-0 p-0">
          <div className="d-flex justify-content-end">
            <Button
              className="soumission mt-2 mx-5"
              style={{ width: "max-content" }}
              onClick={handleShow}
            >
              Ajouter
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Informations livres</Modal.Title>
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
        />
      </div>
    </div>
  );
}

export default FormBook;
